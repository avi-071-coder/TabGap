import Dexie, { type EntityTable } from 'dexie';

export interface TabData {
  id?: number;
  url: string;
  title: string;
  favicon?: string;
  customName?: string;
  isFavorite: boolean;
  groupId?: number;
  lastAccessed: number;
  status: 'open' | 'saved' | 'removed'; // 'open' means it's currently active in browser, 'saved' means it's swallowed in the dashboard, 'removed' means hidden from all tabs but in history
  windowId?: number; // the browser window it belongs to (if open)
  tabId?: number; // the browser tab ID (if open)
}

export interface TabGroup {
  id?: number;
  name: string;
  color?: string;
  createdAt: number;
}

export interface Workspace {
  id?: number;
  name: string;
  tabs: { url: string; title: string; favicon?: string }[];
  createdAt: number;
}

const db = new Dexie('TabGapDatabase') as Dexie & {
  tabs: EntityTable<TabData, 'id'>;
  groups: EntityTable<TabGroup, 'id'>;
  workspaces: EntityTable<Workspace, 'id'>;
};

db.version(2).stores({
  tabs: '++id, url, title, customName, isFavorite, groupId, lastAccessed, status, tabId, windowId',
  groups: '++id, name',
  workspaces: '++id, name',
});

export default db;
