import React from 'react';
import { 
  Activity, 
  Terminal, 
  Play, 
  Pause, 
  RefreshCw, 
  FileText, 
  Flame, 
  Cpu, 
  CheckCircle2, 
  Clock, 
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
    <aside className="w-80 border-l border-white/10 bg-[#0A0E1A] flex flex-col shrink-0 overflow-hidden select-none">
      {/* Quick Stats Header */}
      <div className="p-4 border-b border-white/10 space-y-3 bg-slate-950/50">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold font-mono tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Workspace Metrics</span>
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            SYSTEM OK
          </span>
        </div>

        {/* 2x2 Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-500 block">OS Repos Tracked</span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              {stats?.updates?.categories?.os_project || 0}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-500 block">Active Cron Jobs</span>
            <span className="text-lg font-bold font-mono text-sky-400">
              {stats?.tasks?.active || 0} / {stats?.tasks?.total || 0}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-500 block">Unread Feed</span>
            <span className="text-lg font-bold font-mono text-amber-400">
              {stats?.updates?.unread || 0}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-white/5 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-500 block">MCP Server</span>
            <span className="text-xs font-bold font-mono text-purple-400 flex items-center gap-1 pt-1">
              <Server className="w-3 h-3 text-purple-400" />
              <span>Stdio</span>
            </span>
          </div>
        </div>
      </div>

      {/* Autonomous Tasks Section */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between bg-slate-950/30">
        <div className="flex items-center space-x-1.5">
          <Terminal className="w-3.5 h-3.5 text-sky-400" />
          <h3 className="text-xs font-bold font-mono tracking-wider text-slate-300 uppercase">
            Autonomous Tasks
          </h3>
        </div>
        <button
          onClick={onOpenAddTask}
          className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/10 transition-colors text-xs flex items-center gap-1 font-mono"
        >
          <Plus className="w-3 h-3" />
          <span>New</span>
        </button>
      </div>

      {/* Task Cards Scroll List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs font-mono">
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
                className={`p-3 rounded-xl border transition-all space-y-2 bg-slate-900/80 ${
                  isRunning 
                    ? 'border-sky-500/50 shadow-md shadow-sky-500/10' 
                    : isError
                    ? 'border-rose-500/50'
                    : isActive
                    ? 'border-white/10 hover:border-white/20'
                    : 'border-white/5 opacity-70'
                }`}
              >
                {/* Task ID & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20 block truncate font-bold">
                      {task.id}
                    </span>
                    <h4 className="text-xs font-medium text-slate-200 mt-1 line-clamp-1">
                      {task.name}
                    </h4>
                  </div>

                  {/* Status Pill */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 flex items-center gap-1 ${
                    isRunning 
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : isActive 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : isError
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isRunning ? 'bg-sky-400 animate-spin' : isActive ? 'bg-emerald-400' : isError ? 'bg-rose-400' : 'bg-slate-500'
                    }`} />
                    {task.status.toUpperCase()}
                  </span>
                </div>

                {/* Schedule & Last Run info */}
                <div className="text-[11px] font-mono text-slate-400 space-y-0.5 bg-slate-950/60 p-2 rounded-lg border border-white/5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-slate-500">Schedule:</span>
                    <span className="text-slate-200">{task.schedule}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-slate-500">Last Run:</span>
                    <span>{task.last_run_at ? formatTimeAgo(task.last_run_at) : 'Never'}</span>
                  </div>
                </div>

                {/* Task Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <button
                    onClick={() => onTriggerTask(task.id)}
                    disabled={isRunning}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-[11px] font-mono font-medium border border-emerald-500/30 transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 fill-emerald-300 text-emerald-300" />
                    <span>Run Now</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onToggleTaskPause(task.id, isActive ? 'paused' : 'active')}
                      title={isActive ? 'Pause Task' : 'Resume Task'}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-white/10 transition-colors"
                    >
                      {isActive ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                    </button>
                    
                    <button
                      onClick={() => onViewLogs(task)}
                      title="View Output Logs"
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-white/10 transition-colors"
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
