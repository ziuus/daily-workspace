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
    { id: 'os_project', label: 'OS Projects', icon: Flame },
    { id: 'ai_tool', label: 'AI Tools', icon: Cpu },
    { id: 'tech_news', label: 'Tech News', icon: Newspaper },
    { id: 'tasks', label: 'Autonomous Tasks', icon: ListTodo }
  ];

  return (
    <header className="h-14 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0F172A]/90 backdrop-blur-md px-5 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand & Clean Tabs */}
      <div className="flex items-center space-x-6">
        <div 
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => setActiveTab('all')}
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm shadow-xs">
            D
          </div>
          <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base font-mono flex items-center gap-1.5">
            DAILY
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-status-pulse inline-block"></span>
          </span>
        </div>

        {/* Clean Segmented Tab Switcher */}
        <nav className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-lg border border-slate-200/80 dark:border-white/5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold font-mono rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Global Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-white/20 text-xs font-mono transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Search ⌘K</span>
        </button>

        {/* Live MCP Badge */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <Bot className="w-3.5 h-3.5 text-emerald-500" />
          <span>MCP Stdio</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Data"
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
        </button>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenAddUpdate}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Update</span>
          </button>

          <button
            onClick={onOpenAddTask}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 dark:border-white/10 transition-all"
          >
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
