import { useLiveQuery } from 'dexie-react-hooks';
import db, { type TabData } from '../../db';
import TabCard from '../components/TabCard';
import { Pin } from 'lucide-react';
import { useSearch } from '../SearchContext';

export default function PinnedView() {
  const { searchQuery } = useSearch();
  const rawTabs = useLiveQuery(() => db.tabs.filter(t => t.isFavorite && t.status !== 'removed').reverse().toArray());

  const tabs = rawTabs?.filter(t => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return t.title?.toLowerCase().includes(query) || 
           t.customName?.toLowerCase().includes(query) || 
           t.url?.toLowerCase().includes(query);
  });

  const handleOpenTab = async (tabData: TabData) => {
    if (tabData.status === 'open' && tabData.tabId) {
      try {
        await chrome.tabs.update(tabData.tabId, { active: true });
        if (tabData.windowId) {
          await chrome.windows.update(tabData.windowId, { focused: true });
        }
      } catch (e) {
        createTab(tabData);
      }
    } else {
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
    return <div className="flex-1 flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <h1 className="text-2xl font-semibold tracking-tight">Pinned Tabs</h1>
      
      {tabs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {tabs.map(tab => (
            <TabCard key={tab.id} tab={tab} onOpen={handleOpenTab} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <Pin className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-xl font-medium text-zinc-300 mb-2">No pinned tabs</h3>
          <p className="text-zinc-500 max-w-sm">
            Pin your most important tabs to keep them here.
          </p>
        </div>
      )}
    </div>
  );
}
