import React, { useState } from 'react';
import { X, Terminal } from 'lucide-react';

export default function AddTaskModal({ isOpen, onClose, onAddTask }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [command, setCommand] = useState('');
  const [schedule, setSchedule] = useState('daily @ 14:00 IST');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id || !name || !command || !schedule) return;

    onAddTask({
      id: id.toLowerCase().replace(/\s+/g, '-'),
      name,
      command_or_prompt: command,
      schedule,
      status: 'active'
    });

    setId('');
    setName('');
    setCommand('');
    setSchedule('daily @ 14:00 IST');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0F1623] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold font-mono text-white">Register Autonomous Task</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Task String ID</label>
            <input
              type="text"
              required
              value={id}
              onChange={e => setId(e.target.value)}
              placeholder="e.g. reddit-warmup"
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-sky-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Display Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Reddit Warmup & Engagement Script"
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Command or Script Path</label>
            <input
              type="text"
              required
              value={command}
              onChange={e => setCommand(e.target.value)}
              placeholder="python3 ~/.daily/scripts/warmup.py"
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-sky-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Schedule / Frequency</label>
            <input
              type="text"
              required
              value={schedule}
              onChange={e => setSchedule(e.target.value)}
              placeholder="daily @ 14:00 IST or every 6h"
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-sky-500/50"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium shadow-md shadow-sky-600/20 transition-all border border-sky-400/30"
            >
              Register Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
