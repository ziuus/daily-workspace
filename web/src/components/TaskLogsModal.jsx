import React, { useState, useEffect } from 'react';
import { X, Terminal, RefreshCw, Copy, Check } from 'lucide-react';

export default function TaskLogsModal({ isOpen, onClose, task }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && task) {
      fetchLogs();
    }
  }, [isOpen, task]);

  const fetchLogs = async () => {
    if (!task) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/logs`);
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !task) return null;

  const handleCopyLogs = () => {
    const fullLogText = logs.map(l => `[${l.run_at}] [${l.status.toUpperCase()}]\n${l.output}`).join('\n\n') || task.last_output || 'No logs recorded.';
    navigator.clipboard.writeText(fullLogText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#090D16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Terminal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold font-mono text-white">
              Terminal Output Logs — {task.id}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchLogs}
              className="p-1.5 rounded bg-slate-900 border border-white/10 text-slate-400 hover:text-slate-200"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            <button
              onClick={handleCopyLogs}
              className="p-1.5 rounded bg-slate-900 border border-white/10 text-slate-400 hover:text-slate-200"
              title="Copy Output Logs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button onClick={onClose} className="p-1.5 rounded text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task Details Bar */}
        <div className="px-4 py-2 bg-slate-900/60 border-b border-white/5 font-mono text-xs text-slate-400 flex items-center justify-between">
          <span>Command: <code className="text-sky-300">{task.command_or_prompt}</code></span>
          <span>Schedule: <span className="text-emerald-400">{task.schedule}</span></span>
        </div>

        {/* Terminal Log Console */}
        <div className="flex-1 p-4 bg-[#05080E] font-mono text-xs overflow-y-auto space-y-4">
          {/* Latest Output Banner */}
          {task.last_output && (
            <div className="p-3 rounded-lg bg-slate-900/90 border border-sky-500/30 text-sky-200 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Most Recent Execution Output:</div>
              <pre className="whitespace-pre-wrap text-slate-200 leading-relaxed font-mono text-[11px]">
                {task.last_output}
              </pre>
            </div>
          )}

          {/* Log History */}
          <div className="space-y-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Historical Execution Logs:</div>
            {logs.length === 0 ? (
              <div className="text-slate-600 italic">No historical log records found.</div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="p-3 rounded-lg bg-slate-950 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">{new Date(log.run_at).toLocaleString()}</span>
                    <span className={`font-bold px-1.5 py-0.2 rounded ${
                      log.status === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                  <pre className="text-slate-300 whitespace-pre-wrap text-[11px] leading-relaxed pt-1">
                    {log.output}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
