import React from 'react';
import DailyLogo from './DailyLogo.jsx';
import { 
  Sparkles, 
  Search, 
  Plus, 
  RefreshCw, 
  Flame, 
  Cpu, 
  Newspaper, 
  ListTodo,
  Sun,
  Moon,
  Bot,
  Palette
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenSearch, 
  onOpenAddUpdate, 
  onOpenAddTask, 
  onOpenThemeSelector,
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
    <header 
      className="h-14 border-b px-6 flex items-center justify-between z-30 shrink-0 select-none transition-colors duration-200"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Brand & Tabs */}
      <div className="flex items-center space-x-8">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setActiveTab('all')}
        >
          <DailyLogo className="w-7 h-7 transform group-hover:scale-105 transition-transform duration-200" />
          <span 
            className="font-extrabold tracking-tight text-base font-mono flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            DAILY
            <span className="w-2 h-2 rounded-full animate-status-pulse inline-block" style={{ backgroundColor: 'var(--accent)' }}></span>
          </span>
        </div>

        {/* Minimal Segmented Navigation */}
        <nav 
          className="flex items-center space-x-1 p-1 rounded-lg border"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all"
                style={{
                  backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500
                }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span 
                    className="ml-1 px-1.5 py-0.2 text-[10px] font-bold font-mono rounded-full"
                    style={{
                      backgroundColor: 'var(--accent-bg)',
                      color: 'var(--accent-text)'
                    }}
                  >
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
          className="flex items-center space-x-3 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)'
          }}
        >
          <Search className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          <span>Search feed & tasks...</span>
          <kbd 
            className="px-1.5 py-0.5 text-[10px] rounded font-mono"
            style={{
              backgroundColor: 'var(--bg-hover)',
              color: 'var(--text-secondary)'
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Live MCP Indicator */}
        <div 
          className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)'
          }}
        >
          <Bot className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
          <span>MCP Stdio</span>
        </div>

        {/* Theme Palette Modal Button */}
        <button
          onClick={onOpenThemeSelector}
          title="Open Workspace Theme Studio (22 Themes)"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)'
          }}
        >
          <Palette className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="hidden sm:inline font-bold">Themes</span>
        </button>

        {/* Theme Switcher Fast Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-1.5 rounded-lg border transition-colors"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)'
          }}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />}
        </button>

        {/* Refresh Data */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Feed"
          className="p-1.5 rounded-lg border transition-colors disabled:opacity-50"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)'
          }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} style={{ color: isRefreshing ? 'var(--accent)' : 'inherit' }} />
        </button>

        {/* Primary Action Buttons */}
        <div className="flex items-center space-x-2 pl-1">
          <button
            onClick={onOpenAddUpdate}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-white font-medium text-xs shadow-xs transition-all"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#FFFFFF'
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Entry</span>
          </button>
        </div>
      </div>
    </header>
  );
}
