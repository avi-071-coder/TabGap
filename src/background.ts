import db from './db';

// Time tracking state
let activeTabId: number | null = null;
let activeStartTime: number | null = null;

// Track tab activation
chrome.tabs.onActivated.addListener(async (activeInfo: any) => {
  await handleTabDeactivation();
  activeTabId = activeInfo.tabId;
  activeStartTime = Date.now();
});

// Track window focus (to stop tracking when Chrome is minimized)
chrome.windows.onFocusChanged.addListener(async (windowId: number) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Chrome lost focus completely
    await handleTabDeactivation();
  } else {
    // Chrome gained focus or switched window
    await handleTabDeactivation();
    const [activeTab] = await chrome.tabs.query({ active: true, windowId });
    if (activeTab && activeTab.id) {
      activeTabId = activeTab.id;
      activeStartTime = Date.now();
    }
  }
});

// Sync tracking before updating/closing
chrome.tabs.onUpdated.addListener(async (tabId: number, changeInfo: any, tab: chrome.tabs.Tab) => {
  if (changeInfo.status === 'complete' && tabId === activeTabId) {
    // URL changed or reloaded, maybe sync time or update DB title/URL
    if (tab.url && !tab.url.startsWith('chrome-extension://')) {
      const existingTab = await db.tabs.where('tabId').equals(tabId).first();
      if (existingTab) {
        await db.tabs.update(existingTab.id!, {
          url: tab.url,
          title: tab.title || existingTab.title,
          favicon: tab.favIconUrl || existingTab.favicon,
          lastAccessed: Date.now()
        });
      } else {
        // Automatically add newly opened tabs as 'open' status
        await db.tabs.add({
          url: tab.url,
          title: tab.title || 'New Tab',
          favicon: tab.favIconUrl,
          isFavorite: false,
          lastAccessed: Date.now(),
          totalActiveTime: 0,
          status: 'open',
          tabId: tabId,
          windowId: tab.windowId
        });
      }
    }
  }
});

chrome.tabs.onRemoved.addListener(async (tabId: number) => {
  if (tabId === activeTabId) {
    await handleTabDeactivation();
    activeTabId = null;
  }
  // When a tab is closed naturally, update its status or remove from open status?
  // Let's just mark it as saved so it stays in dashboard history.
  const existingTab = await db.tabs.where('tabId').equals(tabId).first();
  if (existingTab) {
    await db.tabs.update(existingTab.id!, {
      status: 'saved',
      tabId: undefined,
      windowId: undefined
    });
  }
});

async function handleTabDeactivation() {
  if (activeTabId !== null && activeStartTime !== null) {
    const elapsed = Date.now() - activeStartTime;
    if (elapsed > 1000) { // Only track if more than 1 second
      const existingTab = await db.tabs.where('tabId').equals(activeTabId).first();
      if (existingTab) {
        await db.tabs.update(existingTab.id!, {
          totalActiveTime: existingTab.totalActiveTime + elapsed,
          lastAccessed: Date.now()
        });
      }
    }
    activeStartTime = null;
  }
}

// Listen for messages from Dashboard/Popup
chrome.runtime.onMessage.addListener((message: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  if (message.action === 'gather_tabs') {
    gatherTabs().then(() => sendResponse({ success: true }));
    return true; // async response
  }
  if (message.action === 'open_dashboard') {
    openDashboard().then(() => sendResponse({ success: true }));
    return true;
  }
});

async function openDashboard() {
  const dashboardUrl = chrome.runtime.getURL('index.html');
  const [existingDashboard] = await chrome.tabs.query({ url: dashboardUrl });
  
  if (existingDashboard && existingDashboard.id) {
    await chrome.tabs.update(existingDashboard.id, { active: true });
    if (existingDashboard.windowId) {
      await chrome.windows.update(existingDashboard.windowId, { focused: true });
    }
  } else {
    await chrome.tabs.create({ url: dashboardUrl, active: true });
  }
}

async function gatherTabs() {
  const dashboardUrl = chrome.runtime.getURL('index.html');
  
  // 1. Ensure the Dashboard is open before we close anything!
  let dashboardTabId: number | undefined;
  const existingDashboards = await chrome.tabs.query({ url: dashboardUrl });
  
  if (existingDashboards.length > 0) {
    dashboardTabId = existingDashboards[0].id;
    await chrome.tabs.update(dashboardTabId!, { active: true });
  } else {
    const newDashboard = await chrome.tabs.create({ url: dashboardUrl, active: true });
    dashboardTabId = newDashboard.id;
  }

  // 2. Now gather all tabs
  const allTabs = await chrome.tabs.query({});
  const tabsToClose: number[] = [];
  
  for (const tab of allTabs) {
    // Skip the dashboard itself by ID and URL
    if (tab.id === dashboardTabId || tab.url === dashboardUrl) continue;
    
    // Skip empty new tabs that just opened
    if (tab.url === 'chrome://newtab/' || tab.url === 'about:blank') {
      if (tab.id) tabsToClose.push(tab.id);
      continue;
    }
    
    // Save or update in DB
    if (tab.url) {
      const existingTab = await db.tabs.where('url').equals(tab.url).first();
      if (existingTab) {
        await db.tabs.update(existingTab.id!, {
          title: tab.title || existingTab.title,
          favicon: tab.favIconUrl || existingTab.favicon,
          status: 'saved',
          lastAccessed: Date.now(),
          tabId: undefined,
          windowId: undefined
        });
      } else {
        await db.tabs.add({
          url: tab.url,
          title: tab.title || 'Unknown',
          favicon: tab.favIconUrl,
          isFavorite: false,
          lastAccessed: Date.now(),
          totalActiveTime: 0,
          status: 'saved'
        });
      }
    }
    
    if (tab.id) {
      tabsToClose.push(tab.id);
    }
  }
  
  // Close all gathered tabs
  if (tabsToClose.length > 0) {
    await chrome.tabs.remove(tabsToClose);
  }
}
