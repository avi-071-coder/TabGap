import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AllTabsView from './views/AllTabsView';
import PinnedView from './views/PinnedView';
import RecentView from './views/RecentView';
import { SearchProvider } from './SearchContext';

export default function DashboardApp() {
  useEffect(() => {
    // When the dashboard loads, tell the background script to gather tabs
    chrome.runtime.sendMessage({ action: 'gather_tabs' });
  }, []);

  return (
    <SearchProvider>
      <div className="flex h-screen bg-zinc-950 text-white overflow-hidden font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Ambient background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6 z-10">
            <Routes>
              <Route path="/" element={<AllTabsView />} />
              <Route path="/pinned" element={<PinnedView />} />
              <Route path="/recent" element={<RecentView />} />
            </Routes>
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
