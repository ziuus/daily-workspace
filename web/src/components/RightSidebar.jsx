import React from 'react';
import { 
  Activity, 
  Terminal, 
  Play, 
  Pause, 
  FileText, 
  Plus,
  Server
} from 'lucide-react';

export default function RightSidebar({ 
  stats, 
  tasks = [], 
  updates = [],
  onTriggerTask, 
  onToggleTaskPause, 
  onViewLogs,
  onOpenAddTask
}) {
  const osProjectsCount = stats?.updates?.categories?.os_project ?? updates.filter(u => u.category === 'os_project').length;
  const activeCronCount = stats?.tasks?.active ?? tasks.filter(t => t.status === 'active').length;
  const totalCronCount = stats?.tasks?.total ?? tasks.length;
  const unreadCount = stats?.updates?.unread ?? updates.filter(u => u.read_status === 0).length;

  return (
    <aside 
      className="w-80 border-l flex flex-col shrink-0 overflow-hidden select-none transition-colors duration-200"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Workspace Metrics */}
      <div 
        className="p-4 border-b space-y-3"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center justify-between">
          <h3 
            className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5"
            style={{ color: 'var(--text-primary)' }}
          >
            <Activity className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span>Workspace Metrics</span>
          </h3>
          <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--accent)' }}>
            NOMINAL
          </span>
        </div>

        <div className="space-y-1.5 text-xs font-mono">
          <div 
            className="flex items-center justify-between py-1 border-b"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>OS Repos Tracked</span>
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
              {osProjectsCount}
            </span>
          </div>

          <div 
            className="flex items-center justify-between py-1 border-b"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>Active Cron Jobs</span>
            <span className="font-bold" style={{ color: 'var(--accent)' }}>
              {activeCronCount} / {totalCronCount}
            </span>
          </div>

          <div 
            className="flex items-center justify-between py-1 border-b"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>Unread Feed</span>
            <span className="font-bold" style={{ color: 'var(--accent)' }}>
              {unreadCount}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span style={{ color: 'var(--text-secondary)' }}>MCP Server</span>
            <span className="font-bold flex items-center gap-1" style={{ color: 'var(--accent)' }}>
              <Server className="w-3 h-3" />
              <span>Stdio</span>
            </span>
          </div>
        </div>
      </div>

      {/* Autonomous Tasks Header */}
      <div 
        className="p-3 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center space-x-1.5">
          <Terminal className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
          <h3 
            className="text-xs font-bold font-mono uppercase tracking-wider"
            style={{ color: 'var(--text-primary)' }}
          >
            Autonomous Tasks
          </h3>
        </div>

        <button
          onClick={onOpenAddTask}
          className="px-2 py-0.5 rounded transition-colors text-xs flex items-center gap-1 font-mono border"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)'
          }}
        >
          <Plus className="w-3 h-3" />
          <span>New</span>
        </button>
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
                  </div>

                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
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
                    className="flex items-center space-x-1 px-2.5 py-1 rounded text-[10px] font-mono font-medium transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: '#FFFFFF'
                    }}
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Run Now</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onToggleTaskPause(task.id, isActive ? 'paused' : 'active')}
                      className="p-1 rounded transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      title={isActive ? 'Pause Task' : 'Resume Task'}
                    >
                      {isActive ? <Pause className="w-3 h-3" style={{ color: 'var(--accent)' }} /> : <Play className="w-3 h-3" style={{ color: 'var(--accent)' }} />}
                    </button>
                    
                    <button
                      onClick={() => onViewLogs(task)}
                      className="p-1 rounded transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      title="View Logs"
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
    </aside>
  );
}
