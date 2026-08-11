import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';

export default function AddUpdateModal({ isOpen, onClose, onAddUpdate }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('os_project');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [starGrowth, setStarGrowth] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const tagsArr = tags ? tags.split(',').map(s => s.trim()) : [];
    const metadata = {};
    if (category === 'os_project' && repoUrl) {
      metadata.repo_url = repoUrl;
      if (starGrowth) metadata.star_growth = starGrowth;
    }

    onAddUpdate({
      title,
      category,
      markdown_content: content,
      tags: tagsArr,
      source_agent: 'user',
      metadata
    });

    setTitle('');
    setContent('');
    setTags('');
    setRepoUrl('');
    setStarGrowth('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0F1623] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold font-mono text-white">Create New Feed Entry</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. browser-use: Web Automation LLM Engine"
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="os_project">Viral OS Project</option>
                <option value="ai_tool">AI Tool & Framework</option>
                <option value="tech_news">Tech News</option>
                <option value="custom">Custom Digest</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="rust, llm, agent"
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>
          </div>

          {category === 'os_project' && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <div className="space-y-1">
                <label className="text-xs font-mono text-emerald-400">GitHub Repo URL</label>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={e => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-emerald-400">Star Growth Velocity</label>
                <input
                  type="text"
                  value={starGrowth}
                  onChange={e => setStarGrowth(e.target.value)}
                  placeholder="+450 stars/day"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 font-mono"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Markdown Content</label>
            <textarea
              required
              rows={8}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="### Overview&#10;Write markdown details here..."
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono"
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
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md shadow-emerald-600/20 transition-all border border-emerald-400/30"
            >
              Save Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
