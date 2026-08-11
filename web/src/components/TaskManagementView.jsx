import React from 'react';
import { 
  Terminal, 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Code
} from 'lucide-react';

export default function TaskManagementView({ 
  tasks, 
  onTriggerTask, 
  onToggleTaskPause, 
  onDeleteTask, 
  onViewLogs,
  onOpenAddTask
}) {
  return (
    <main className="flex-1 bg-[#090D16] flex flex-col overflow-hidden p-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs mb-1">
            <Terminal className="w-4 h-4" />
            <span className="font-bold tracking-wider uppercase">Autonomous Cron & Task Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Background Scripts & Agent Workdogs
          </h1>
          <p className="text-slate-400 text-xs mt-1 max-w-xl leading-relaxed">
            Monitor and execute background automations (e.g. Reddit warmup, AI scrapers, system watchdogs). Agents can trigger or inspect tasks via the built-in MCP server.
          </p>
        </div>

        <button
          onClick={onOpenAddTask}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-lg shadow-sky-600/20 border border-sky-400/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Task</span>
        </button>
      </div>

      {/* Task Grid Table */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-[#0C121E]/80 backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[11px] border-b border-white/10">
            <tr>
              <th className="p-4">Task ID & Name</th>
              <th className="p-4">Command / Prompt</th>
              <th className="p-4">Schedule</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last Run</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {tasks.map(task => {
              const isActive = task.status === 'active';
              const isRunning = task.status === 'running';
              const isError = task.status === 'error';

              return (
                <tr key={task.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Name & ID */}
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <span className="text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 text-[11px] inline-block">
                        {task.id}
                      </span>
                      <div className="font-sans text-sm font-semibold text-white pt-1">
                        {task.name}
                      </div>
                    </div>
                  </td>

                  {/* Command */}
                  <td className="p-4 max-w-xs">
                    <code className="text-slate-300 bg-slate-950 px-2.5 py-1 rounded border border-white/10 block truncate text-[11px]">
                      {task.command_or_prompt}
                    </code>
                  </td>

                  {/* Schedule */}
                  <td className="p-4 text-slate-300">
                    <span className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded border border-white/5 text-[11px] w-max">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {task.schedule}
                    </span>
                  </td>

                  {/* Status Pill */}
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${
                      isRunning 
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : isActive 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isError
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        isRunning ? 'bg-sky-400 animate-spin' : isActive ? 'bg-emerald-400' : isError ? 'bg-rose-400' : 'bg-slate-500'
                      }`} />
                      {task.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Last Run */}
                  <td className="p-4 text-slate-400 text-[11px]">
                    {task.last_run_at ? new Date(task.last_run_at).toLocaleString() : 'Never'}
                  </td>

                  {/* Action controls */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onTriggerTask(task.id)}
                        disabled={isRunning}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-medium text-xs shadow border border-emerald-400/30 transition-all disabled:opacity-50"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Run Now</span>
                      </button>

                      <button
                        onClick={() => onToggleTaskPause(task.id, isActive ? 'paused' : 'active')}
                        className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors"
                        title={isActive ? 'Pause Task' : 'Resume Task'}
                      >
                        {isActive ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>

                      <button
                        onClick={() => onViewLogs(task)}
                        className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors"
                        title="View Logs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
