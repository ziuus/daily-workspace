import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer.jsx';
import { 
  Flame, 
  Sparkles, 
  ExternalLink, 
  Check, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Star, 
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
      <main className="flex-1 bg-white dark:bg-[#0B0F19] flex flex-col items-center justify-center text-center p-8 select-none">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-xs">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 font-mono">Daily Workspace Intelligence</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm leading-relaxed">
          Select an entry from the feed timeline to read full analysis, open-source metrics, or AI tool updates.
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
    <main className="flex-1 bg-white dark:bg-[#0B0F19] flex flex-col overflow-hidden">
      {/* Header Bar */}
      <header className="px-8 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-md flex items-start justify-between gap-4 shrink-0">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              {update.category.toUpperCase().replace('_', ' ')}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {new Date(update.created_at).toLocaleString()}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
              <Bot className="w-3 h-3 text-emerald-500" />
              <span>{update.source_agent}</span>
            </span>
          </div>

          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight">
            {update.title}
          </h1>

          {update.tags && update.tags.length > 0 && (
            <div className="flex items-center space-x-1 pt-0.5">
              {update.tags.map(tag => (
                <span key={tag} className="text-xs font-mono text-slate-600 dark:text-emerald-400/90 bg-slate-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-slate-200 dark:border-emerald-500/20">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onToggleRead(update.id, isRead ? 0 : 1)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isRead 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
                : 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            {isRead ? <Circle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
            <span>{isRead ? 'Mark Unread' : 'Mark Read'}</span>
          </button>

          <button
            onClick={handleCopy}
            title="Copy Raw Markdown"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onDeleteUpdate(update.id)}
            title="Delete Entry"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {update.category === 'os_project' && update.metadata && update.metadata.repo_url && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase">
                <Flame className="w-4 h-4 fill-current" />
                <span>Exploding Open-Source Repo</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white font-mono">
                {update.metadata.repo_url}
              </p>
              <div className="flex items-center space-x-4 text-xs font-mono text-slate-500 dark:text-slate-400 pt-0.5">
                {update.metadata.star_growth && (
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {update.metadata.star_growth}
                  </span>
                )}
                {update.metadata.language && (
                  <span className="flex items-center gap-1">
                    <Code2 className="w-3 h-3 text-sky-500" />
                    {update.metadata.language}
                  </span>
                )}
              </div>
            </div>

            <a
              href={update.metadata.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-xs transition-all shrink-0"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        <article className="markdown-body max-w-3xl">
          <MarkdownRenderer content={update.markdown_content} />
        </article>
      </div>
    </main>
  );
}
