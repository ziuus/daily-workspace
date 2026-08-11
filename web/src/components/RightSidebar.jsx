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
    <aside className="w-80 border-l border-[#E7E5E4] dark:border-[#242936] bg-[#FAF9F5] dark:bg-[#0A0C10] flex flex-col shrink-0 overflow-hidden select-none">
      {/* Workspace Metrics */}
      <div className="p-4 border-b border-[#E7E5E4] dark:border-[#242936] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold font-mono text-stone-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Workspace Metrics</span>
          </h3>
          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
            NOMINAL
          </span>
        </div>

        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between py-1 border-b border-stone-200/60 dark:border-[#1E2330]">
            <span className="text-stone-500 dark:text-slate-400">OS Repos Tracked</span>
            <span className="font-bold text-stone-900 dark:text-white">
              {stats?.updates?.categories?.os_project || 0}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-stone-200/60 dark:border-[#1E2330]">
            <span className="text-stone-500 dark:text-slate-400">Active Cron Jobs</span>
            <span className="font-bold text-sky-700 dark:text-sky-400">
              {stats?.tasks?.active || 0} / {stats?.tasks?.total || 0}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-stone-200/60 dark:border-[#1E2330]">
            <span className="text-stone-500 dark:text-slate-400">Unread Feed</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {stats?.updates?.unread || 0}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-stone-500 dark:text-slate-400">MCP Server</span>
            <span className="font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1">
              <Server className="w-3 h-3" />
              <span>Stdio</span>
            </span>
          </div>
        </div>
      </div>

      {/* Autonomous Tasks Header */}
      <div className="p-3 border-b border-[#E7E5E4] dark:border-[#242936] flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Terminal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <h3 className="text-xs font-bold font-mono text-stone-700 dark:text-slate-300 uppercase tracking-wider">
            Autonomous Tasks
          </h3>
        </div>

        <button
          onClick={onOpenAddTask}
          className="px-2 py-0.5 rounded bg-stone-200/70 dark:bg-[#191D28] hover:bg-stone-300 dark:hover:bg-[#242936] text-stone-700 dark:text-slate-300 transition-colors text-xs flex items-center gap-1 font-mono"
        >
          <Plus className="w-3 h-3" />
          <span>New</span>
        </button>
      </div>

      {/* Minimal Borderless Task Rows */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-stone-400 dark:text-slate-500 text-xs font-mono">
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
                className="p-3 rounded-lg hover:bg-stone-200/50 dark:hover:bg-[#161A22] transition-colors space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      isRunning ? 'bg-sky-500 animate-pulse' : isActive ? 'bg-emerald-600 dark:bg-emerald-400' : isError ? 'bg-rose-500' : 'bg-stone-400'
                    }`} />
                    <span className="text-xs font-mono font-semibold text-stone-900 dark:text-slate-100 truncate">
                      {task.id}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-stone-400 dark:text-slate-500">
                    {task.schedule}
                  </span>
                </div>

                <p className="text-[11px] text-stone-600 dark:text-slate-400 line-clamp-1">
                  {task.name}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onTriggerTask(task.id)}
                    disabled={isRunning}
                    className="flex items-center space-x-1 px-2 py-0.5 rounded bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-slate-200 text-white dark:text-stone-900 text-[10px] font-mono font-medium transition-colors disabled:opacity-50"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Run Now</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onToggleTaskPause(task.id, isActive ? 'paused' : 'active')}
                      className="p-1 rounded text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                      title={isActive ? 'Pause Task' : 'Resume Task'}
                    >
                      {isActive ? <Pause className="w-3 h-3 text-amber-600" /> : <Play className="w-3 h-3 text-emerald-600" />}
                    </button>
                    
                    <button
                      onClick={() => onViewLogs(task)}
                      className="p-1 rounded text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white transition-colors"
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
