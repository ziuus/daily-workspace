import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Cpu, 
  Newspaper, 
  ListTodo, 
  Search, 
  Sun, 
  Moon, 
  Plus, 
  RefreshCw,
  Star
} from 'lucide-react';

export default function LeftSidebar({ 
  updates, 
  selectedUpdate, 
  onSelectUpdate, 
  activeTab,
  setActiveTab,
  filterRead, 
  setFilterRead, 
  searchTerm, 
  setSearchTerm,
  onOpenSearch,
  onOpenAddUpdate,
  onRefresh,
  isRefreshing,
  theme,
  onToggleTheme
}) {
  const unreadCount = updates.filter(u => u.read_status === 0).length;

  const categories = [
    { id: 'all', label: 'Feed', icon: Sparkles, badge: unreadCount > 0 ? unreadCount : null },
    { id: 'os_project', label: 'OS Repos', icon: Flame },
    { id: 'ai_tool', label: 'AI Tools', icon: Cpu },
    { id: 'tech_news', label: 'News', icon: Newspaper },
    { id: 'tasks', label: 'Tasks & Crons', icon: ListTodo }
  ];

  const filtered = updates.filter(u => {
    if (activeTab !== 'all' && activeTab !== 'tasks' && u.category !== activeTab) return false;
    if (filterRead === 'unread' && u.read_status === 1) return false;
    if (filterRead === 'read' && u.read_status === 0) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return u.title.toLowerCase().includes(q) || 
             u.markdown_content.toLowerCase().includes(q) ||
             (u.tags && u.tags.some(t => t.toLowerCase().includes(q)));
    }
    return true;
  });

  const grouped = groupUpdatesByDate(filtered);

  return (
    <aside className="w-80 border-r border-[#E7E5E4] dark:border-[#232938] bg-[#FAF9F5] dark:bg-[#0B0D12] flex flex-col shrink-0 overflow-hidden select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#E7E5E4] dark:border-[#232938] flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold font-mono text-xs shadow-2xs">
            D
          </div>
          <span className="font-extrabold tracking-tight text-stone-900 dark:text-white text-base font-mono flex items-center gap-2">
            DAILY
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-status-pulse inline-block"></span>
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Warm Light Theme' : 'Switch to Minimal Dark Theme'}
            className="p-1.5 rounded-lg text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-[#191E2B] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Feed"
            className="p-1.5 rounded-lg text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-[#191E2B] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="p-3 border-b border-[#E7E5E4] dark:border-[#232938] space-y-2">
        <div className="flex items-center space-x-1 bg-stone-200/50 dark:bg-[#151822] p-1 rounded-lg">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex-1 flex items-center justify-center space-x-1 py-1 rounded-md text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-white dark:bg-[#202636] text-stone-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400'}`} />
                <span className="hidden sm:inline">{cat.label}</span>
                {cat.badge && (
                  <span className="ml-0.5 px-1 py-0.2 text-[9px] font-bold font-mono rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Search & New Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenSearch}
            className="flex-1 flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#121620] border border-[#E7E5E4] dark:border-[#232938] text-stone-400 dark:text-slate-500 text-xs font-mono transition-all hover:border-stone-300 dark:hover:border-slate-700"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="truncate">Search feed...</span>
            <kbd className="px-1.5 py-0.5 text-[9px] bg-stone-100 dark:bg-slate-800 rounded text-stone-500 font-mono">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenAddUpdate}
            title="Add New Entry"
            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feed List Items */}
      {activeTab !== 'tasks' && (
        <div className="flex-1 overflow-y-auto py-2 space-y-4">
          {Object.keys(grouped).length === 0 ? (
            <div className="p-8 text-center text-stone-400 dark:text-slate-500 text-xs font-mono">
              No entries found.
            </div>
          ) : (
            Object.entries(grouped).map(([groupTitle, items]) => (
              <div key={groupTitle} className="space-y-0.5">
                <div className="px-4 py-1 text-[10px] font-bold font-mono text-stone-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>{groupTitle}</span>
                  <span>{items.length}</span>
                </div>

                <div className="space-y-0.5">
                  {items.map(item => {
                    const isSelected = selectedUpdate && selectedUpdate.id === item.id;
                    const isUnread = item.read_status === 0;

                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectUpdate(item)}
                        className={`px-4 py-3 transition-all cursor-pointer relative border-l-2 ${
                          isSelected
                            ? 'border-emerald-600 dark:border-emerald-400 bg-white dark:bg-[#121620] shadow-2xs'
                            : 'border-transparent hover:bg-stone-200/40 dark:hover:bg-[#161A24]'
                        }`}
                      >
                        {isUnread && (
                          <div className="absolute top-3.5 right-3 w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                        )}

                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-[9px] font-bold font-mono text-emerald-700 dark:text-emerald-400 uppercase">
                            {item.category.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400 dark:text-slate-500">
                            {formatTimeAgo(item.created_at)}
                          </span>
                        </div>

                        <h4 className={`text-xs font-semibold leading-snug line-clamp-2 ${
                          isSelected 
                            ? 'text-stone-900 dark:text-white' 
                            : isUnread 
                            ? 'text-stone-800 dark:text-slate-100' 
                            : 'text-stone-600 dark:text-slate-400'
                        }`}>
                          {item.title}
                        </h4>

                        {item.metadata && item.metadata.star_growth && (
                          <div className="mt-1.5 flex items-center space-x-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span>{item.metadata.star_growth}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </aside>
  );
}

function groupUpdatesByDate(updates) {
  const groups = {};
  const now = new Date();

  updates.forEach(u => {
    const d = new Date(u.created_at);
    const diffHours = (now - d) / (1000 * 60 * 60);

    let key = 'Earlier';
    if (diffHours < 24) key = 'Today';
    else if (diffHours < 48) key = 'Yesterday';
    else if (diffHours < 168) key = 'This Week';

    if (!groups[key]) groups[key] = [];
    groups[key].push(u);
  });

  return groups;
}

function formatTimeAgo(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
