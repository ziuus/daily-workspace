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
  tasks, 
  onTriggerTask, 
  onToggleTaskPause, 
  onViewLogs,
  onOpenAddTask
}) {
  return (
    <aside className="w-80 border-l border-slate-200/80 dark:border-[#222732] bg-slate-50/60 dark:bg-[#0C0E12] flex flex-col shrink-0 overflow-hidden select-none">
      {/* Workspace Metrics */}
      <div className="p-4 border-b border-slate-200/80 dark:border-[#222732] space-y-3 bg-white/40 dark:bg-slate-900/30">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Workspace Metrics</span>
          </h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold">
            NOMINAL
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#161A22] border border-slate-200/80 dark:border-white/5 space-y-0.5 shadow-xs">
            <span className="text-[10px] font-mono text-slate-400 block">OS Repos Tracked</span>
            <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {stats?.updates?.categories?.os_project || 0}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-[#161A22] border border-slate-200/80 dark:border-white/5 space-y-0.5 shadow-xs">
            <span className="text-[10px] font-mono text-slate-400 block">Active Cron Jobs</span>
            <span className="text-base font-bold font-mono text-sky-600 dark:text-sky-400">
              {stats?.tasks?.active || 0} / {stats?.tasks?.total || 0}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-[#161A22] border border-slate-200/80 dark:border-white/5 space-y-0.5 shadow-xs">
            <span className="text-[10px] font-mono text-slate-400 block">Unread Feed</span>
            <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
              {stats?.updates?.unread || 0}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-[#161A22] border border-slate-200/80 dark:border-white/5 space-y-0.5 shadow-xs">
            <span className="text-[10px] font-mono text-slate-400 block">MCP Server</span>
            <span className="text-xs font-bold font-mono text-purple-600 dark:text-purple-400 flex items-center gap-1 pt-1">
              <Server className="w-3 h-3" />
              <span>Stdio</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tasks Header */}
      <div className="p-3 border-b border-slate-200/80 dark:border-[#222732] flex items-center justify-between bg-white/20 dark:bg-slate-950/20">
        <div className="flex items-center space-x-1.5">
          <Terminal className="w-3.5 h-3.5 text-sky-500" />
          <h3 className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Autonomous Tasks
          </h3>
        </div>

        <button
          onClick={onOpenAddTask}
          className="p-1 rounded bg-slate-100 dark:bg-[#1A1E26] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/5 transition-colors text-xs flex items-center gap-1 font-mono"
        >
          <Plus className="w-3 h-3" />
          <span>New</span>
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs font-mono">
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
                className="p-3 rounded-xl border border-slate-200/80 dark:border-white/5 bg-white dark:bg-[#141822] shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-sky-700 dark:text-sky-400 font-bold block">
                      {task.id}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-1">
                      {task.name}
                    </h4>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 flex items-center gap-1 ${
                    isRunning 
                      ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300'
                      : isActive 
                      ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                      : isError
                      ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isRunning ? 'bg-sky-500 animate-spin' : isActive ? 'bg-emerald-500' : isError ? 'bg-rose-500' : 'bg-slate-400'
                    }`} />
                    {task.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Schedule:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{task.schedule}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => onTriggerTask(task.id)}
                    disabled={isRunning}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-medium shadow-xs transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Now</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onToggleTaskPause(task.id, isActive ? 'paused' : 'active')}
                      className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                      title={isActive ? 'Pause Task' : 'Resume Task'}
                    >
                      {isActive ? <Pause className="w-3 h-3 text-amber-500" /> : <Play className="w-3 h-3 text-emerald-500" />}
                    </button>
                    
                    <button
                      onClick={() => onViewLogs(task)}
                      className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
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
