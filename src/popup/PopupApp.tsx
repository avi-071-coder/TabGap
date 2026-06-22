import { useEffect, useState } from 'react';
import { Layers, LayoutDashboard } from 'lucide-react';

export default function PopupApp() {
  const [openTabsCount, setOpenTabsCount] = useState(0);

  useEffect(() => {
    chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
      setOpenTabsCount(tabs.length);
    });
  }, []);

  const handleOpenDashboard = () => {
    chrome.runtime.sendMessage({ action: 'open_dashboard' });
    window.close();
  };

  const handleGatherTabs = () => {
    chrome.runtime.sendMessage({ action: 'gather_tabs' });
    window.close();
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white p-4">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-6 h-6 text-blue-400" />
        <h1 className="text-xl font-semibold tracking-tight">TabGap</h1>
      </div>

      <div className="flex-1">
        <div className="glass rounded-xl p-4 mb-4 flex flex-col items-center text-center">
          <span className="text-4xl font-bold text-white mb-1">{openTabsCount}</span>
          <span className="text-sm text-zinc-400">Open Tabs</span>
        </div>

        <button 
          onClick={handleOpenDashboard}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
        >
          <LayoutDashboard className="w-5 h-5" />
          Open Dashboard
        </button>

        <button 
          onClick={handleGatherTabs}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Layers className="w-5 h-5" />
          Gather Tabs Now
        </button>
      </div>

      <div className="mt-auto pt-4 border-t border-zinc-800/50 text-xs text-center text-zinc-500">
        Privacy-focused. All data stays local.
      </div>
    </div>
  );
}
