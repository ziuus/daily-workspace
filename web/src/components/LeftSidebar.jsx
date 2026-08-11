import React, { useState } from 'react';
import { 
  Flame, 
  Cpu, 
  Newspaper, 
  Sparkles, 
  Check, 
  Circle, 
  Star, 
  Filter, 
  Search,
  Tag
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
        return { label: 'OS REPO', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: Flame };
      case 'ai_tool':
        return { label: 'AI TOOL', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', icon: Cpu };
      case 'tech_news':
        return { label: 'NEWS', bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30', icon: Newspaper };
      default:
        return { label: 'UPDATE', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: Sparkles };
    }
  };

  // Extract all unique tags
  const allTags = Array.from(new Set(updates.flatMap(u => u.tags || [])));

  // Filter items
  const filtered = updates.filter(u => {
    if (filterRead === 'unread' && u.read_status === 1) return false;
    if (filterRead === 'read' && u.read_status === 0) return false;
    if (selectedTag && (!u.tags || !u.tags.includes(selectedTag))) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = u.title.toLowerCase().includes(q);
      const matchBody = u.markdown_content.toLowerCase().includes(q);
      const matchTags = u.tags && u.tags.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchBody || matchTags;
    }
    return true;
  });

  // Group timeline by date (Today, Yesterday, This Week, Older)
  const grouped = groupUpdatesByDate(filtered);

  return (
    <aside className="w-80 border-r border-white/10 bg-[#0A0E1A] flex flex-col shrink-0 overflow-hidden select-none">
      {/* Search & Filter Header */}
      <div className="p-3 border-b border-white/10 space-y-2.5 bg-slate-950/40">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter feed..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-white/10 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        {/* Read Status Filter Pills */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setFilterRead('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterRead === 'all' ? 'bg-slate-800 text-slate-200 font-semibold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              All ({updates.length})
            </button>
            <button
              onClick={() => setFilterRead('unread')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                filterRead === 'unread' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Unread ({updates.filter(u => u.read_status === 0).length})
            </button>
          </div>

          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Clear #{selectedTag}
            </button>
          )}
        </div>

        {/* Tag chips */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
            {allTags.slice(0, 6).map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2 py-0.5 rounded-full border transition-all shrink-0 font-mono ${
                  selectedTag === tag
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 border-white/5 hover:border-white/20'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Feed List Timeline */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5">
        {Object.keys(grouped).length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">
            No updates match criteria.
          </div>
        ) : (
          Object.entries(grouped).map(([groupTitle, items]) => (
            <div key={groupTitle} className="py-2">
              <div className="px-3 py-1 text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase flex items-center justify-between">
                <span>{groupTitle}</span>
                <span className="text-slate-600">({items.length})</span>
              </div>
              <div className="space-y-1 px-2 mt-1">
                {items.map(item => {
                  const badge = getCategoryBadge(item.category);
                  const isSelected = selectedUpdate && selectedUpdate.id === item.id;
                  const isUnread = item.read_status === 0;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectUpdate(item)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer relative group ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500/40 shadow-md shadow-emerald-500/5'
                          : isUnread
                          ? 'bg-slate-900/80 border-white/10 hover:border-white/20 hover:bg-slate-800/50'
                          : 'bg-slate-950/40 border-transparent hover:bg-slate-900/40 text-slate-400'
                      }`}
                    >
                      {/* Unread indicator dot */}
                      {isUnread && (
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400 animate-status-pulse shadow-sm shadow-emerald-400/50" />
                      )}

                      {/* Category Pill & Time */}
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {formatTimeAgo(item.created_at)}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className={`text-xs font-medium leading-snug line-clamp-2 mb-1.5 ${
                        isSelected ? 'text-white font-semibold' : isUnread ? 'text-slate-100 font-semibold' : 'text-slate-300'
                      }`}>
                        {item.title}
                      </h4>

                      {/* Star velocity preview if OS Repo */}
                      {item.metadata && item.metadata.star_growth && (
                        <div className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 mb-1.5 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20 w-max">
                          <Star className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />
                          <span>{item.metadata.star_growth}</span>
                        </div>
                      )}

                      {/* Footer tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[9px] font-mono text-slate-500 bg-slate-900/80 px-1.5 py-0.2 rounded border border-white/5">
                              #{tag}
                            </span>
                          ))}
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
    if (diffHours < 24) {
      key = 'Today';
    } else if (diffHours < 48) {
      key = 'Yesterday';
    } else if (diffHours < 168) {
      key = 'This Week';
    }

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
