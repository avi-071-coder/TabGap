import { useLiveQuery } from 'dexie-react-hooks';
import db, { type TabData } from '../../db';
import TabCard from '../components/TabCard';
import { Layers } from 'lucide-react';
import { useSearch } from '../SearchContext';

export default function AllTabsView() {
  const tabs = useLiveQuery(() => db.tabs.orderBy('lastAccessed').reverse().toArray());

  const handleOpenTab = async (tabData: TabData) => {
    if (tabData.status === 'open' && tabData.tabId) {
      // It's already open, just focus it
      try {
        await chrome.tabs.update(tabData.tabId, { active: true });
        if (tabData.windowId) {
          await chrome.windows.update(tabData.windowId, { focused: true });
        }
      } catch (e) {
        // Tab might have been closed without background script catching it, recreate
        createTab(tabData);
      }
    } else {
      // It's a saved tab, create a new one
      createTab(tabData);
    }
  };

  const createTab = async (tabData: TabData) => {
    const newTab = await chrome.tabs.create({ url: tabData.url, active: true });
    if (newTab && newTab.id && newTab.windowId) {
      await db.tabs.update(tabData.id!, {
        status: 'open',
        tabId: newTab.id,
        windowId: newTab.windowId,
        lastAccessed: Date.now()
      });
    }
  };

  if (!tabs) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500">
        Loading tabs...
      </div>
    );
  }

  const { searchQuery } = useSearch();

  const visibleTabs = tabs.filter(t => {
    if (t.status === 'removed') return false;
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const titleMatch = t.title?.toLowerCase().includes(query) || false;
    const customMatch = t.customName?.toLowerCase().includes(query) || false;
    const urlMatch = t.url?.toLowerCase().includes(query) || false;
    
    return titleMatch || customMatch || urlMatch;
  });

  const openTabs = visibleTabs.filter(t => t.status === 'open');
  const savedTabs = visibleTabs.filter(t => t.status === 'saved');

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h1>
      </div>

      {openTabs.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-blue-400 tracking-wide uppercase">Currently Active</h2>
            <div className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium">
              {openTabs.length}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {openTabs.map(tab => (
              <TabCard key={tab.id} tab={tab} onOpen={handleOpenTab} />
            ))}
          </div>
        </section>
      )}

      {savedTabs.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-zinc-400 tracking-wide uppercase">Saved Tabs</h2>
            <div className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium">
              {savedTabs.length}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {savedTabs.map(tab => (
              <TabCard key={tab.id} tab={tab} onOpen={handleOpenTab} />
            ))}
          </div>
        </section>
      )}

      {tabs.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <Layers className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-xl font-medium text-zinc-300 mb-2">No tabs yet</h3>
          <p className="text-zinc-500 max-w-sm">
            When you open tabs, they will appear here. The background script tracks your browsing time.
          </p>
        </div>
      )}
    </div>
  );
}
