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
      <main 
        className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none transition-colors duration-200"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-2xs"
          style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)' }}
        >
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold mb-1 font-mono" style={{ color: 'var(--text-primary)' }}>Daily Workspace Intelligence</h3>
        <p className="text-xs max-w-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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
    <main 
      className="flex-1 flex flex-col overflow-hidden transition-colors duration-200"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* Article Header Controls */}
      <header 
        className="px-10 py-5 border-b flex items-start justify-between gap-6 shrink-0 transition-colors duration-200"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span 
              className="px-2 py-0.5 rounded font-bold"
              style={{
                backgroundColor: 'var(--accent-bg)',
                color: 'var(--accent-text)'
              }}
            >
              {update.category.toUpperCase().replace('_', ' ')}
            </span>
            <span style={{ color: 'var(--border)' }}>•</span>
            <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              {new Date(update.created_at).toLocaleString()}
            </span>
            <span style={{ color: 'var(--border)' }}>•</span>
            <span className="flex items-center gap-1 font-mono" style={{ color: 'var(--text-secondary)' }}>
              <Bot className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              <span>{update.source_agent}</span>
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold leading-tight tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {update.title}
          </h1>

          {update.tags && update.tags.length > 0 && (
            <div className="flex items-center space-x-1.5 pt-0.5">
              {update.tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-xs font-mono px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)'
                  }}
                >
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
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors"
            style={{
              backgroundColor: isRead ? 'var(--bg-subtle)' : 'var(--accent-bg)',
              borderColor: isRead ? 'var(--border)' : 'var(--accent)',
              color: isRead ? 'var(--text-secondary)' : 'var(--accent-text)'
            }}
          >
            {isRead ? <Circle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />}
            <span>{isRead ? 'Mark Unread' : 'Mark Read'}</span>
          </button>

          <button
            onClick={handleCopy}
            title="Copy Raw Markdown"
            className="p-1.5 rounded-md border transition-colors"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)'
            }}
          >
            {copied ? <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onDeleteUpdate(update.id)}
            title="Delete Entry"
            className="p-1.5 rounded-md border transition-colors text-rose-600 hover:bg-rose-500/10"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border)'
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Reading View */}
      <div className="flex-1 overflow-y-auto px-12 py-8 space-y-6">
        {/* Simple, Borderless Inline Repository Header (GitHub / Vercel style) */}
        {update.category === 'os_project' && update.metadata && update.metadata.repo_url && (
          <div 
            className="pb-4 border-b flex items-center justify-between gap-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center gap-1 font-bold" style={{ color: 'var(--accent)' }}>
                <Flame className="w-4 h-4 fill-current" />
                <span>GITHUB REPO</span>
              </span>
              <span style={{ color: 'var(--border)' }}>•</span>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {update.metadata.repo_url}
              </span>
              {update.metadata.star_growth && (
                <>
                  <span style={{ color: 'var(--border)' }}>•</span>
                  <span className="font-bold flex items-center gap-1" style={{ color: 'var(--accent)' }}>
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
              className="flex items-center space-x-1.5 text-xs font-mono font-medium hover:underline transition-colors"
              style={{ color: 'var(--text-primary)' }}
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
