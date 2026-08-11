import React, { useState } from 'react';
import { 
  Flame, 
  Cpu, 
  Newspaper, 
  Sparkles, 
  Star, 
  Search,
  CheckCircle2,
  Circle
} from 'lucide-react';

export default function LeftSidebar({ 
  updates, 
  selectedUpdate, 
  onSelectUpdate, 
  filterRead, 
  setFilterRead, 
  searchTerm, 
  setSearchTerm 
}) {
  const [selectedTag, setSelectedTag] = useState(null);

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'os_project':
        return { label: 'OS REPO', bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' };
      case 'ai_tool':
        return { label: 'AI TOOL', bg: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20' };
      case 'tech_news':
        return { label: 'NEWS', bg: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20' };
      default:
        return { label: 'UPDATE', bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' };
    }
  };

  const allTags = Array.from(new Set(updates.flatMap(u => u.tags || [])));

  const filtered = updates.filter(u => {
    if (filterRead === 'unread' && u.read_status === 1) return false;
    if (filterRead === 'read' && u.read_status === 0) return false;
    if (selectedTag && (!u.tags || !u.tags.includes(selectedTag))) return false;
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
    <aside className="w-80 border-r border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#0B0F19] flex flex-col shrink-0 overflow-hidden select-none">
      {/* Filter Bar */}
      <div className="p-3 border-b border-slate-200 dark:border-white/10 space-y-2 bg-white/50 dark:bg-slate-900/40">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search feed..."
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-0.5">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setFilterRead('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterRead === 'all' 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              All ({updates.length})
            </button>

            <button
              onClick={() => setFilterRead('unread')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                filterRead === 'unread' 
                  ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Unread ({updates.filter(u => u.read_status === 0).length})
            </button>
          </div>

          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline"
            >
              Clear #{selectedTag}
            </button>
          )}
        </div>
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3 divide-y divide-slate-200/60 dark:divide-white/5">
        {Object.keys(grouped).length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-mono">
            No updates match your filter.
          </div>
        ) : (
          Object.entries(grouped).map(([groupTitle, items]) => (
            <div key={groupTitle} className="pt-2">
              <div className="px-2 py-1 text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>{groupTitle}</span>
                <span>{items.length}</span>
              </div>

              <div className="space-y-1 mt-1">
                {items.map(item => {
                  const badge = getCategoryBadge(item.category);
                  const isSelected = selectedUpdate && selectedUpdate.id === item.id;
                  const isUnread = item.read_status === 0;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectUpdate(item)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                        isSelected
                          ? 'bg-white dark:bg-slate-800/90 border-emerald-500/50 shadow-xs'
                          : isUnread
                          ? 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                          : 'bg-transparent border-transparent hover:bg-slate-200/40 dark:hover:bg-slate-900/40 opacity-80'
                      }`}
                    >
                      {/* Unread indicator dot */}
                      {isUnread && (
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-500 animate-status-pulse" />
                      )}

                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {formatTimeAgo(item.created_at)}
                        </span>
                      </div>

                      <h4 className={`text-xs font-semibold leading-snug line-clamp-2 ${
                        isSelected ? 'text-slate-900 dark:text-white' : isUnread ? 'text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {item.title}
                      </h4>

                      {item.metadata && item.metadata.star_growth && (
                        <div className="mt-1.5 flex items-center space-x-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded w-max border border-emerald-500/20">
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
