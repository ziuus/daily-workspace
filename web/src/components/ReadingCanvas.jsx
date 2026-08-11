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
      <main className="flex-1 bg-[#FAF9F5] dark:bg-[#0A0C10] flex flex-col items-center justify-center text-center p-8 select-none">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-2xs">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900 dark:text-white mb-1 font-mono">Daily Workspace Intelligence</h3>
        <p className="text-stone-500 dark:text-slate-400 text-xs max-w-sm leading-relaxed">
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
    <main className="flex-1 bg-[#FAF9F5] dark:bg-[#0A0C10] flex flex-col overflow-hidden">
      {/* Article Header Controls */}
      <header className="px-10 py-5 border-b border-[#E7E5E4] dark:border-[#242936] bg-white/40 dark:bg-slate-900/20 flex items-start justify-between gap-6 shrink-0">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
              {update.category.toUpperCase().replace('_', ' ')}
            </span>
            <span className="text-stone-300 dark:text-slate-700">•</span>
            <span className="text-stone-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400 dark:text-slate-500" />
              {new Date(update.created_at).toLocaleString()}
            </span>
            <span className="text-stone-300 dark:text-slate-700">•</span>
            <span className="text-stone-500 dark:text-slate-400 flex items-center gap-1 font-mono">
              <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{update.source_agent}</span>
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-stone-900 dark:text-white leading-tight tracking-tight">
            {update.title}
          </h1>

          {update.tags && update.tags.length > 0 && (
            <div className="flex items-center space-x-1.5 pt-0.5">
              {update.tags.map(tag => (
                <span key={tag} className="text-xs font-mono text-stone-600 dark:text-slate-400 bg-stone-200/60 dark:bg-[#191D28] px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center space-x-2 shrink-0 pt-1">
          <button
            onClick={() => onToggleRead(update.id, isRead ? 0 : 1)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              isRead 
                ? 'bg-stone-200/70 dark:bg-[#191D28] text-stone-600 dark:text-slate-400 border-stone-300 dark:border-[#242936]'
                : 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            {isRead ? <Circle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
            <span>{isRead ? 'Mark Unread' : 'Mark Read'}</span>
          </button>

          <button
            onClick={handleCopy}
            title="Copy Raw Markdown"
            className="p-1.5 rounded-md bg-stone-200/70 dark:bg-[#191D28] border border-stone-300 dark:border-[#242936] text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onDeleteUpdate(update.id)}
            title="Delete Entry"
            className="p-1.5 rounded-md bg-stone-200/70 dark:bg-[#191D28] border border-stone-300 dark:border-[#242936] text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Reading View */}
      <div className="flex-1 overflow-y-auto px-12 py-8 space-y-6">
        {/* Simple, Borderless Inline Repository Header (GitHub / Vercel style) */}
        {update.category === 'os_project' && update.metadata && update.metadata.repo_url && (
          <div className="pb-4 border-b border-[#E7E5E4] dark:border-[#242936] flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
                <Flame className="w-4 h-4 fill-current" />
                <span>GITHUB REPO</span>
              </span>
              <span className="text-stone-300 dark:text-slate-700">•</span>
              <span className="text-stone-900 dark:text-white font-semibold">
                {update.metadata.repo_url}
              </span>
              {update.metadata.star_growth && (
                <>
                  <span className="text-stone-300 dark:text-slate-700">•</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {update.metadata.star_growth}
                  </span>
                </>
              )}
            </div>

            <a
              href={update.metadata.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-xs font-mono font-medium text-stone-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <span>View Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        <article className="markdown-body max-w-2xl">
          <MarkdownRenderer content={update.markdown_content} />
        </article>
      </div>
    </main>
  );
}
