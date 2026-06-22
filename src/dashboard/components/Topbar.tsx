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
        <div className="flex flex-col text-right">
          <span className="text-zinc-400 text-xs">Total Active Time</span>
          <span className="font-medium text-zinc-100 tracking-tight">0h 0m</span>
        </div>
      </div>
    </header>
  );
}
