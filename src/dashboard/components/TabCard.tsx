import React from 'react';
import { motion } from 'framer-motion';
import { Pin, Globe, MonitorPlay, Save, Trash2, Edit2 } from 'lucide-react';
import db, { type TabData } from '../../db';

interface TabCardProps {
  tab: TabData;
  onOpen: (tab: TabData) => void;
}

export default function TabCard({ tab, onOpen }: TabCardProps) {
  const isSaved = tab.status === 'saved';



  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await db.tabs.update(tab.id!, { isFavorite: !tab.isFavorite });
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await db.tabs.update(tab.id!, { status: 'removed' });
  };

  const handleRename = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = prompt("Enter a custom name for this tab:", tab.customName || tab.title);
    if (newName !== null && newName.trim() !== '') {
      await db.tabs.update(tab.id!, { customName: newName.trim() });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={`glass rounded-2xl p-4 flex flex-col relative group cursor-pointer overflow-hidden ${
        isSaved ? 'opacity-80' : 'border-blue-500/30'
      }`}
      onClick={() => onOpen(tab)}
    >
      {!isSaved && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-2xl rounded-bl-full pointer-events-none" />
      )}
      
      <div className="flex items-start justify-between mb-3 z-10">
        <div className="p-2 bg-white/5 rounded-xl border border-white/5 shadow-inner">
          {tab.favicon ? (
            <img src={tab.favicon} alt="" className="w-5 h-5 rounded-sm object-contain" />
          ) : (
            <Globe className="w-5 h-5 text-zinc-400" />
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" 
            title="Rename"
            onClick={handleRename}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button 
            className={`p-1.5 rounded-lg transition-colors ${tab.isFavorite ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`} 
            title={tab.isFavorite ? "Unpin" : "Pin"}
            onClick={handleTogglePin}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
          <button 
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" 
            title="Delete / Remove"
            onClick={handleRemove}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 z-10">
        <h3 className="font-medium text-sm text-zinc-100 line-clamp-2 mb-1 leading-snug">
          {tab.customName || tab.title}
        </h3>
        <p className="text-xs text-zinc-500 truncate w-full flex items-center gap-1.5">
          {tab.url}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs font-medium z-10">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${isSaved ? 'bg-zinc-800/50 text-zinc-400' : 'bg-blue-500/10 text-blue-400'}`}>
          {isSaved ? <Save className="w-3.5 h-3.5" /> : <MonitorPlay className="w-3.5 h-3.5" />}
          <span>{isSaved ? 'Saved' : 'Active'}</span>
        </div>
        

      </div>
    </motion.div>
  );
}
