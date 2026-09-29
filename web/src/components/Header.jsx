import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Search, 
  Plus, 
  Activity, 
  Bot, 
  RefreshCw, 
  Flame, 
  Cpu, 
  Newspaper, 
  ListTodo,
  Menu,
  X
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenSearch, 
  onOpenAddUpdate, 
  onOpenAddTask, 
  onRunWatchdog,
  onRefresh,
  unreadCount,
  isRefreshing,
  onOpenMobileMenu,
  isMobileMenuOpen
}) {
  const tabs = [
    { id: 'all', label: 'All Feed', icon: Sparkles, badge: unreadCount > 0 ? unreadCount : null },
    { id: 'os_project', label: 'OS Projects', icon: Flame },
    { id: 'ai_tool', label: 'AI Tools', icon: Cpu },
    { id: 'tech_news', label: 'News', icon: Newspaper },
    { id: 'tasks', label: 'Tasks', icon: ListTodo }
  ];

  return (
    <header className="h-14 sm:h-16 border-b border-white/10 bg-[#0C121E]/95 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left Brand & Tabs */}
      <div className="flex items-center space-x-3 sm:space-x-6 min-w-0">
        {/* Mobile Menu Button */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open feed sidebar'}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div 
          className="flex items-center space-x-2 cursor-pointer shrink-0" 
          onClick={() => setActiveTab('all')}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm sm:text-base shadow-sm shadow-emerald-500/20">
            D
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-white text-xs sm:text-base leading-none font-mono flex items-center gap-1">
              DAILY <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-status-pulse inline-block"></span>
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-tight leading-none mt-0.5 hidden xs:inline">
              WORKSPACE
            </span>
          </div>
        </div>

        {/* Tab Navigation - Scrollable on mobile */}
        <nav className="flex items-center space-x-1 bg-slate-900/60 p-1 rounded-lg border border-white/5 overflow-x-auto no-scrollbar max-w-[180px] xs:max-w-[260px] sm:max-w-none shrink">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold font-mono rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls & Live Status */}
      <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
        {/* Global Search Cmd+K button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-1.5 px-2 py-1.5 sm:px-3 rounded-lg bg-slate-900/80 border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20 text-xs font-mono transition-colors"
          title="Search feed & tasks (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] bg-slate-800 rounded border border-slate-700 text-slate-300">
            ⌘K
          </kbd>
        </button>

        {/* Live System Status Badges - Desktop Only */}
        <div className="hidden xl:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-white/5 text-[11px] font-mono text-slate-400">
          <span className="flex items-center space-x-1 text-emerald-400">
            <Bot className="w-3 h-3" />
            <span>MCP: Online</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center space-x-1 text-sky-400">
            <Activity className="w-3 h-3" />
            <span>Workers 3/3</span>
          </span>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Data"
          className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50 min-w-[32px] min-h-[32px] flex items-center justify-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
        </button>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenAddUpdate}
            className="flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/20 transition-all border border-emerald-400/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Update</span>
          </button>
          <button
            onClick={onOpenAddTask}
            className="flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-white/10 transition-all"
          >
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden xs:inline">Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}