import React, { useState, useEffect } from 'react';
import { Search, Flame, Cpu, Newspaper, Sparkles, Terminal, X, ArrowRight } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, updates, tasks, onSelectUpdate, onSelectTaskTab }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredUpdates = updates.filter(u => 
    u.title.toLowerCase().includes(query.toLowerCase()) ||
    u.category.toLowerCase().includes(query.toLowerCase()) ||
    (u.tags && u.tags.some(t => t.toLowerCase().includes(query.toLowerCase())))
  ).slice(0, 5);

  const filteredTasks = tasks.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.id.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-xl bg-[#0F1623] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center space-x-3 bg-slate-900/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search updates, OS repos, tasks..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4 divide-y divide-white/5">
          {/* Feed Updates */}
          <div>
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase px-2 mb-2 block">
              Intelligence Feed ({filteredUpdates.length})
            </span>
            <div className="space-y-1">
              {filteredUpdates.length === 0 ? (
                <div className="px-2 py-2 text-xs text-slate-500 italic">No matching feed entries</div>
              ) : (
                filteredUpdates.map(u => (
                  <div
                    key={u.id}
                    onClick={() => {
                      onSelectUpdate(u);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {u.category.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-200 font-medium truncate">{u.title}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Autonomous Tasks */}
          <div className="pt-3">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase px-2 mb-2 block">
              Autonomous Tasks ({filteredTasks.length})
            </span>
            <div className="space-y-1">
              {filteredTasks.length === 0 ? (
                <div className="px-2 py-2 text-xs text-slate-500 italic">No matching tasks</div>
              ) : (
                filteredTasks.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelectTaskTab();
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-mono text-sky-300 font-bold">{t.id}</span>
                      <span className="text-xs text-slate-300">{t.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{t.schedule}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-white/10 bg-slate-950/80 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>Press ESC to close</span>
          <span>Daily Workspace Search</span>
        </div>
      </div>
    </div>
  );
}
