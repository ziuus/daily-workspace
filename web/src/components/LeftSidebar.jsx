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
        return { label: 'OS REPO', text: 'var(--accent)' };
      case 'ai_tool':
        return { label: 'AI TOOL', text: '#9333EA' };
      case 'tech_news':
        return { label: 'NEWS', text: '#0284C7' };
      default:
        return { label: 'UPDATE', text: '#D97706' };
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
    <aside 
      className="w-80 border-r flex flex-col shrink-0 overflow-hidden select-none transition-colors duration-200"
      style={{
        backgroundColor: 'var(--bg-base)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Search & Filter Header */}
      <div 
        className="p-3 border-b space-y-2"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search feed items..."
            className="w-full pl-9 pr-3 py-1.5 rounded-md text-xs transition-colors focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-0.5">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setFilterRead('all')}
              className="px-2 py-0.5 rounded text-[11px] font-medium transition-colors"
              style={{
                backgroundColor: filterRead === 'all' ? 'var(--bg-subtle)' : 'transparent',
                color: filterRead === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: filterRead === 'all' ? 600 : 500
              }}
            >
              All ({updates.length})
            </button>

            <button
              onClick={() => setFilterRead('unread')}
              className="px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1.5"
              style={{
                backgroundColor: filterRead === 'unread' ? 'var(--accent-bg)' : 'transparent',
                color: filterRead === 'unread' ? 'var(--accent-text)' : 'var(--text-secondary)',
                fontWeight: filterRead === 'unread' ? 600 : 500
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></span>
              Unread ({updates.filter(u => u.read_status === 0).length})
            </button>
          </div>

          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-[10px] hover:underline font-mono"
              style={{ color: 'var(--accent)' }}
            >
              Clear #{selectedTag}
            </button>
          )}
        </div>
      </div>

      {/* Borderless List Items */}
      <div className="flex-1 overflow-y-auto py-2 space-y-4">
        {Object.keys(grouped).length === 0 ? (
          <div className="p-8 text-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            No updates match criteria.
          </div>
        ) : (
          Object.entries(grouped).map(([groupTitle, items]) => (
            <div key={groupTitle} className="space-y-0.5">
              <div 
                className="px-4 py-1 text-[10px] font-bold font-mono uppercase tracking-wider flex items-center justify-between"
                style={{ color: 'var(--text-muted)' }}
              >
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
                      className="px-4 py-2.5 transition-all cursor-pointer relative border-l-2"
                      style={{
                        borderColor: isSelected ? 'var(--accent)' : 'transparent',
                        backgroundColor: isSelected ? 'var(--bg-surface)' : 'transparent'
                      }}
                    >
                      {isUnread && (
                        <div className="absolute top-3.5 right-3 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                      )}

                      <div className="flex items-center space-x-2 mb-0.5">
                        <span className="text-[9px] font-bold font-mono" style={{ color: tagInfo.text }}>
                          {tagInfo.label}
                        </span>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                          {formatTimeAgo(item.created_at)}
                        </span>
                      </div>

                      <h4 
                        className="text-xs font-medium leading-snug line-clamp-2"
                        style={{
                          color: isSelected ? 'var(--text-primary)' : isUnread ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontWeight: isSelected || isUnread ? 600 : 400
                        }}
                      >
                        {item.title}
                      </h4>

                      {item.metadata && item.metadata.star_growth && (
                        <div className="mt-1 flex items-center space-x-1 text-[10px] font-mono" style={{ color: 'var(--accent)' }}>
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
