import { Search } from 'lucide-react';
import { useSearch } from '../SearchContext';

export default function Topbar() {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header className="h-16 border-b border-white/5 flex items-center px-6 z-20">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search tabs by title, URL, or custom name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors"
          />
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-4 text-sm">
        <button 
          onClick={() => chrome.runtime.sendMessage({ action: 'restore_all_tabs' })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-lg transition-colors font-medium text-xs"
        >
          Restore All Tabs
        </button>
      </div>
    </header>
  );
}
