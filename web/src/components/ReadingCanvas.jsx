import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer.jsx';
import { 
  Flame, 
  Cpu, 
  Newspaper, 
  Sparkles, 
  ExternalLink, 
  Check, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Star, 
  GitFork, 
  Bot, 
  Calendar, 
  Code2
} from 'lucide-react';

export default function ReadingCanvas({ 
  update, 
  onToggleRead, 
  onDeleteUpdate 
}) {
  const [copied, setCopied] = useState(false);

  if (!update) {
    return (
      <main className="flex-1 bg-[#090D16] flex flex-col items-center justify-center text-center p-8 select-none">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2 font-mono">Daily Workspace Intelligence</h3>
        <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
          Select an entry from the timeline to view full markdown analysis, open-source metrics, or AI tool updates.
        </p>
      </main>
    );
  }

  const isRead = update.read_status === 1;

  const handleCopy = () => {
    navigator.clipboard.writeText(update.markdown_content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex-1 bg-[#090D16] flex flex-col overflow-hidden">
      {/* Article Header Controls */}
      <header className="px-8 py-5 border-b border-white/10 bg-[#0C121E]/60 backdrop-blur-md flex items-start justify-between gap-4 shrink-0">
        <div className="space-y-2 flex-1 min-w-0">
          {/* Category & Tags */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono border ${getCategoryStyle(update.category)}`}>
              {update.category.toUpperCase().replace('_', ' ')}
            </span>

            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {new Date(update.created_at).toLocaleString()}
            </span>

            <span className="text-xs text-slate-500 font-mono flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
              <Bot className="w-3 h-3 text-emerald-400" />
              <span>Agent: {update.source_agent}</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl lg:text-2xl font-bold text-white leading-snug tracking-tight">
            {update.title}
          </h1>

          {/* Tags */}
          {update.tags && update.tags.length > 0 && (
            <div className="flex items-center space-x-1.5 pt-1">
              {update.tags.map(tag => (
                <span key={tag} className="text-xs font-mono text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2 shrink-0 pt-1">
          <button
            onClick={() => onToggleRead(update.id, isRead ? 0 : 1)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isRead 
                ? 'bg-slate-900 text-slate-400 border-white/10 hover:text-slate-200'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isRead ? <Circle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isRead ? 'Mark Unread' : 'Mark Read'}</span>
          </button>

          <button
            onClick={handleCopy}
            title="Copy Raw Markdown"
            className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onDeleteUpdate(update.id)}
            title="Delete Entry"
            className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Content Scroll Container */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {/* Open Source Repo Highlight Card (if category is os_project) */}
        {update.category === 'os_project' && update.metadata && update.metadata.repo_url && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 shadow-lg shadow-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                <Flame className="w-4 h-4 fill-emerald-400" />
                <span className="font-bold uppercase tracking-wider">Exploding Open-Source Repository</span>
              </div>
              <p className="text-sm font-semibold text-white font-mono">
                {update.metadata.repo_url}
              </p>
              <div className="flex items-center space-x-4 text-xs font-mono text-slate-400 pt-1">
                {update.metadata.star_growth && (
                  <span className="text-emerald-300 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-emerald-300 text-emerald-300" />
                    {update.metadata.star_growth}
                  </span>
                )}
                {update.metadata.language && (
                  <span className="flex items-center gap-1 text-slate-300">
                    <Code2 className="w-3 h-3 text-sky-400" />
                    {update.metadata.language}
                  </span>
                )}
                {update.metadata.stars && (
                  <span>⭐ {update.metadata.stars.toLocaleString()} total stars</span>
                )}
              </div>
            </div>

            <a
              href={update.metadata.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/20 transition-all shrink-0 border border-emerald-400/30"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Markdown Render Body */}
        <article className="markdown-body max-w-4xl">
          <MarkdownRenderer content={update.markdown_content} />
        </article>
      </div>
    </main>
  );
}

function getCategoryStyle(cat) {
  switch (cat) {
    case 'os_project':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'ai_tool':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'tech_news':
      return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    default:
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }
}
