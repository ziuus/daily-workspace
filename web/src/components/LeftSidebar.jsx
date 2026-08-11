import React, { useState } from 'react';
import { 
  Flame, 
  Cpu, 
  Newspaper, 
  Sparkles, 
  Star, 
  Search
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

  const getCategoryTag = (cat) => {
    switch (cat) {
      case 'os_project':
        return { label: 'OS REPO', text: 'text-emerald-700 dark:text-emerald-400' };
      case 'ai_tool':
        return { label: 'AI TOOL', text: 'text-purple-700 dark:text-purple-400' };
      case 'tech_news':
        return { label: 'NEWS', text: 'text-sky-700 dark:text-sky-400' };
      default:
        return { label: 'UPDATE', text: 'text-amber-700 dark:text-amber-400' };
    }
  };

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
    <aside className="w-80 border-r border-[#E7E5E4] dark:border-[#242936] bg-[#FAF9F5] dark:bg-[#0A0C10] flex flex-col shrink-0 overflow-hidden select-none">
      {/* Search & Filter Header */}
      <div className="p-3 border-b border-[#E7E5E4] dark:border-[#242936] space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search feed items..."
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#12151E] border border-[#E7E5E4] dark:border-[#242936] rounded-md text-xs text-stone-900 dark:text-slate-100 placeholder-stone-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600 transition-colors"
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-0.5">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setFilterRead('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterRead === 'all' 
                  ? 'bg-stone-200 dark:bg-[#1E2330] text-stone-900 dark:text-white font-semibold' 
                  : 'text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
              }`}
            >
              All ({updates.length})
            </button>

            <button
              onClick={() => setFilterRead('unread')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                filterRead === 'unread' 
                  ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold' 
                  : 'text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
              Unread ({updates.filter(u => u.read_status === 0).length})
            </button>
          </div>

          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-[10px] text-amber-700 dark:text-amber-400 hover:underline font-mono"
            >
              Clear #{selectedTag}
            </button>
          )}
        </div>
      </div>

      {/* Borderless List Items */}
      <div className="flex-1 overflow-y-auto py-2 space-y-4">
        {Object.keys(grouped).length === 0 ? (
          <div className="p-8 text-center text-stone-400 dark:text-slate-500 text-xs font-mono">
            No updates match criteria.
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
                  const tagInfo = getCategoryTag(item.category);
                  const isSelected = selectedUpdate && selectedUpdate.id === item.id;
                  const isUnread = item.read_status === 0;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectUpdate(item)}
                      className={`px-4 py-2.5 transition-all cursor-pointer relative border-l-2 ${
                        isSelected
                          ? 'border-emerald-600 dark:border-emerald-400 bg-white dark:bg-[#12151E] shadow-2xs'
                          : 'border-transparent hover:bg-stone-200/50 dark:hover:bg-[#161A22]'
                      }`}
                    >
                      {isUnread && (
                        <div className="absolute top-3.5 right-3 w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                      )}

                      <div className="flex items-center space-x-2 mb-0.5">
                        <span className={`text-[9px] font-bold font-mono ${tagInfo.text}`}>
                          {tagInfo.label}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400 dark:text-slate-500">
                          {formatTimeAgo(item.created_at)}
                        </span>
                      </div>

                      <h4 className={`text-xs font-medium leading-snug line-clamp-2 ${
                        isSelected 
                          ? 'text-stone-900 dark:text-white font-semibold' 
                          : isUnread 
                          ? 'text-stone-800 dark:text-slate-100 font-semibold' 
                          : 'text-stone-600 dark:text-slate-400'
                      }`}>
                        {item.title}
                      </h4>

                      {item.metadata && item.metadata.star_growth && (
                        <div className="mt-1 flex items-center space-x-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
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
