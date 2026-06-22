import { NavLink } from 'react-router-dom';
import { 
  Layers, 
  Pin, 
  Clock, 
  Settings 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const NAV_ITEMS = [
  { label: 'All Tabs', icon: Layers, path: '/' },
  { label: 'Pinned', icon: Pin, path: '/pinned' },
  { label: 'Recent', icon: Clock, path: '/recent' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl flex flex-col z-20">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-2 text-white">
          <Layers className="w-6 h-6 text-blue-400" />
          <span className="font-semibold text-lg tracking-tight">TabGap</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => twMerge(
              clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                isActive 
                  ? "bg-blue-500/10 text-blue-400" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
              )
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-3 border-t border-white/5">
        <NavLink
          to="/settings"
          className={({ isActive }) => twMerge(
            clsx(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
              isActive 
                ? "bg-blue-500/10 text-blue-400" 
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
            )
          )}
        >
          <Settings className="w-4 h-4" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
