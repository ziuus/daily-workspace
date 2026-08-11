import React from 'react';
import { 
  Activity, 
  Terminal, 
  Play, 
  Pause, 
  FileText, 
  Plus,
  Server,
  Bot
} from 'lucide-react';

export default function RightSidebar({ 
  stats, 
  tasks = [], 
  updates = [],
  onTriggerTask, 
  onToggleTaskPause, 
  onOpenLogs, 
  onOpenAddTask,
  onOpenTaskView
}) {
  // Derived metrics fallback if stats is null or initializing
  const osRepoCount = stats?.updates?.categories?.os_project ?? updates.filter(u => u.category === 'os_project').length;
  const activeTaskCount = stats?.tasks?.active ?? tasks.filter(t => t.status === 'active').length;
  const totalTaskCount = stats?.tasks?.total ?? tasks.length;
  const unreadCount = stats?.updates?.unread ?? updates.filter(u => u.read_status === 0).length;

  return (
    <div 
      className="w-80 border-l flex flex-col h-full shrink-0 transition-colors"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Sidebar Header */}
      <div 
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            Workspace Metrics
          </h2>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onOpenTaskView}
            title="Open Task Hub View"
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Server className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenAddTask}
            title="Register New Task"
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* High Density Metric Cards */}
      <div 
        className="p-4 grid grid-cols-2 gap-2 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div 
          className="p-2.5 rounded-lg border transition-colors"
          style={{
            backgroundColor: 'var(--bg-base)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <span className="text-[10px] font-mono block uppercase" style={{ color: 'var(--text-muted)' }}>
            OS Repos Tracked
          </span>
          <span className="text-lg font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
            {osRepoCount}
          </span>
        </div>

        <div 
          className="p-2.5 rounded-lg border transition-colors"
          style={{
            backgroundColor: 'var(--bg-base)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <span className="text-[10px] font-mono block uppercase" style={{ color: 'var(--text-muted)' }}>
            Active Cron Jobs
          </span>
          <span className="text-lg font-bold font-mono" style={{ color: 'var(--accent)' }}>
            {activeTaskCount} <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ {totalTaskCount}</span>
          </span>
        </div>

        <div 
          className="p-2.5 rounded-lg border transition-colors"
          style={{
            backgroundColor: 'var(--bg-base)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <span className="text-[10px] font-mono block uppercase" style={{ color: 'var(--text-muted)' }}>
            Unread Feed
          </span>
          <span className="text-lg font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
            {unreadCount}
          </span>
        </div>

        <div 
          className="p-2.5 rounded-lg border transition-colors"
          style={{
            backgroundColor: 'var(--bg-base)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <span className="text-[10px] font-mono block uppercase" style={{ color: 'var(--text-muted)' }}>
            MCP Server
          </span>
          <span className="text-xs font-bold font-mono block mt-1" style={{ color: 'var(--accent)' }}>
            Stdio (Online)
          </span>
        </div>
      </div>

      {/* Section Header: Autonomous Tasks */}
      <div 
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-bold font-mono uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            Autonomous Tasks
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)' }}>
          {tasks.length} Configured
        </span>
      </div>

      {/* Minimal Borderless Task Rows */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            No autonomous tasks registered.
          </div>
        ) : (
          tasks.map(task => {
            const isActive = task.status === 'active';
            const isRunning = task.status === 'running';
            const isError = task.status === 'error';
            const agentName = (task.agent_type || 'system').toUpperCase();

            return (
              <div
                key={task.id}
                className="p-3 rounded-lg transition-colors space-y-2 border"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span 
                      className={`w-2 h-2 rounded-full shrink-0 ${isRunning ? 'animate-pulse' : ''}`}
                      style={{
                        backgroundColor: isRunning ? 'var(--accent)' : isActive ? 'var(--accent)' : isError ? '#F43F5E' : 'var(--text-muted)'
                      }}
                    />
                    <span className="text-xs font-mono font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {task.id}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded uppercase border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                      {agentName}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>
                    {task.schedule}
                  </span>
                </div>

                <p className="text-[11px] line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                  {task.name}
                </p>

                <div 
                  className="flex items-center justify-between pt-1 border-t"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <button
                    onClick={() => onTriggerTask(task.id)}
                    disabled={isRunning}
                    className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono transition-opacity"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: '#FFFFFF'
                    }}
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>{isRunning ? 'Running...' : 'Run Now'}</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onToggleTaskPause(task.id, task.status)}
                      title={isActive ? "Pause Task" : "Resume Task"}
                      className="p-1 rounded transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => onOpenLogs(task.id)}
                      title="View Execution Logs"
                      className="p-1 rounded transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <FileText className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
