import { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';

export default function PopupApp() {
  const [openTabsCount, setOpenTabsCount] = useState(0);

  useEffect(() => {
    chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
      setOpenTabsCount(tabs.length);
    });
  }, []);

  const handleGatherTabs = () => {
    chrome.runtime.sendMessage({ action: 'gather_tabs' });
    window.close();
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white p-4 justify-between">
      <div>
        <div className="flex items-center gap-2.5 mb-5">
          <img src="/logo.png" alt="TabGap Logo" className="w-7 h-7 object-contain" />
          <h1 className="text-xl font-semibold tracking-tight">TabGap</h1>
        </div>

        <div className="glass rounded-xl p-4 mb-4 flex flex-col items-center text-center">
          <span className="text-4xl font-bold text-white mb-1">{openTabsCount}</span>
          <span className="text-sm text-zinc-400">Open Tabs</span>
        </div>

        <button 
          onClick={handleGatherTabs}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Layers className="w-5 h-5" />
          Gather Tabs Now
        </button>
      </div>

      <div className="pt-4 border-t border-zinc-800/50 text-xs text-center text-zinc-500">
        Privacy-focused. All data stays local.
      </div>
    </div>
  );
}

