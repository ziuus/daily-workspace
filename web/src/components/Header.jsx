import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Search, 
  Plus, 
  RefreshCw, 
  Flame, 
  Cpu, 
  Newspaper, 
  ListTodo,
  Sun,
  Moon,
  Bot
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenSearch, 
  onOpenAddUpdate, 
  onOpenAddTask, 
  onRefresh,
  unreadCount,
  isRefreshing,
  theme,
  onToggleTheme
}) {
  const tabs = [
    { id: 'all', label: 'Feed', icon: Sparkles, badge: unreadCount > 0 ? unreadCount : null },
    { id: 'os_project', label: 'OS Repos', icon: Flame },
    { id: 'ai_tool', label: 'AI Tools', icon: Cpu },
    { id: 'tech_news', label: 'News', icon: Newspaper },
    { id: 'tasks', label: 'Tasks', icon: ListTodo }
  ];

  return (
    <header className="h-14 border-b border-slate-200/80 dark:border-[#222732] bg-white/90 dark:bg-[#12151C]/90 backdrop-blur-md px-6 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand & Tabs */}
      <div className="flex items-center space-x-8">
        <div 
          className="flex items-center space-x-2.5 cursor-pointer group"
          onClick={() => setActiveTab('all')}
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold font-mono text-xs shadow-xs">
            D
          </div>
          <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base font-mono flex items-center gap-2">
            DAILY
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-status-pulse inline-block"></span>
          </span>
        </div>

        {/* Minimal Segmented Navigation */}
        <nav className="flex items-center space-x-1 bg-slate-100/80 dark:bg-[#1A1E26] p-1 rounded-lg border border-slate-200/60 dark:border-white/5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white dark:bg-[#252A36] text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold font-mono rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        {/* Search Bar Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-slate-100/80 dark:bg-[#1A1E26] border border-slate-200/80 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 text-xs font-mono transition-all"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Search feed & tasks...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Live MCP Indicator */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <Bot className="w-3.5 h-3.5 text-emerald-500" />
          <span>MCP Stdio</span>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Warm Light Theme' : 'Switch to Minimal Dark Theme'}
          className="p-1.5 rounded-lg bg-slate-100/80 dark:bg-[#1A1E26] border border-slate-200/80 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Refresh Data */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Feed"
          className="p-1.5 rounded-lg bg-slate-100/80 dark:bg-[#1A1E26] border border-slate-200/80 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
        </button>

        {/* Primary Action Buttons */}
        <div className="flex items-center space-x-2 pl-1">
          <button
            onClick={onOpenAddUpdate}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Entry</span>
          </button>
        </div>
      </div>
    </header>
  );
}
