import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Terminal } from 'lucide-react';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  const elements = parseMarkdown(content);

  return (
    <div className="markdown-body space-y-4">
      {elements.map((el, index) => renderElement(el, index))}
    </div>
  );
}

function renderElement(el, index) {
  switch (el.type) {
    case 'h1':
      return <h1 key={index} className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2 mt-4">{formatInline(el.text)}</h1>;
    case 'h2':
      return <h2 key={index} className="text-xl font-semibold text-white mb-3 mt-6 border-b border-white/5 pb-1">{formatInline(el.text)}</h2>;
    case 'h3':
      return <h3 key={index} className="text-lg font-medium text-emerald-400 mb-2 mt-4">{formatInline(el.text)}</h3>;
    case 'h4':
      return <h4 key={index} className="text-base font-medium text-slate-200 mb-2 mt-3">{formatInline(el.text)}</h4>;
    case 'paragraph':
      return <p key={index} className="text-slate-300 leading-relaxed mb-4 text-[14.5px]">{formatInline(el.text)}</p>;
    case 'blockquote':
      return <BlockquoteBlock key={index} text={el.text} />;
    case 'code':
      return <CodeBlock key={index} language={el.language} code={el.code} />;
    case 'list':
      return (
        <ul key={index} className="list-disc list-inside text-slate-300 mb-4 space-y-1.5 text-[14px]">
          {el.items.map((item, i) => (
            <li key={i}>{formatInline(item)}</li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div key={index} className="overflow-x-auto my-4 rounded-lg border border-white/10">
          <table className="w-full text-left text-sm text-slate-300 border-collapse">
            <thead className="bg-slate-900/90 text-slate-100 font-semibold font-mono text-[12px] border-b border-white/10">
              <tr>
                {el.headers.map((h, i) => (
                  <th key={i} className="p-3 border-b border-white/10">{formatInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[13px]">
              {el.rows.map((row, rI) => (
                <tr key={rI} className="hover:bg-slate-900/40">
                  {row.map((cell, cI) => (
                    <td key={cI} className="p-3 bg-slate-950/30">{formatInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'hr':
      return <hr key={index} className="my-6 border-white/10" />;
    default:
      return null;
  }
}

function BlockquoteBlock({ text }) {
  let calloutClass = "border-l-4 border-emerald-500/80 bg-emerald-500/5 text-slate-300";
  let title = null;
  let cleanText = text;

  if (text.startsWith('[!NOTE]')) {
    calloutClass = "border-l-4 border-sky-500 bg-sky-500/10 text-sky-200";
    title = "NOTE";
    cleanText = text.replace('[!NOTE]', '').trim();
  } else if (text.startsWith('[!TIP]')) {
    calloutClass = "border-l-4 border-emerald-500 bg-emerald-500/10 text-emerald-200";
    title = "TIP";
    cleanText = text.replace('[!TIP]', '').trim();
  } else if (text.startsWith('[!WARNING]')) {
    calloutClass = "border-l-4 border-amber-500 bg-amber-500/10 text-amber-200";
    title = "WARNING";
    cleanText = text.replace('[!WARNING]', '').trim();
  }

  return (
    <blockquote className={`px-4 py-3 my-4 rounded-r-xl text-[14px] ${calloutClass}`}>
      {title && <span className="font-bold font-mono text-xs uppercase tracking-wider block mb-1">[{title}]</span>}
      {formatInline(cleanText)}
    </blockquote>
  );
}

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-xl border border-white/10 bg-[#080C14] overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-white/5 text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Terminal className="w-3.5 h-3.5" />
          {language || 'text'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] font-mono text-slate-200 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function formatInline(text) {
  if (typeof text !== 'string') return text;

  // Split by inline code `code`
  const parts = [];
  const regex = /`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[1]) {
      // `code`
      parts.push(
        <code key={match.index} className="bg-slate-800/80 text-emerald-300 px-1.5 py-0.5 rounded text-[13px] font-mono border border-emerald-500/20">
          {match[1]}
        </code>
      );
    } else if (match[2] && match[3]) {
      // [link](url)
      parts.push(
        <a
          key={match.index}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:underline font-medium inline-flex items-center gap-0.5"
        >
          <span>{match[2]}</span>
          <ExternalLink className="w-3 h-3 inline" />
        </a>
      );
    } else if (match[4]) {
      // **bold**
      parts.push(<strong key={match.index} className="font-bold text-white">{match[4]}</strong>);
    } else if (match[5]) {
      // *italic*
      parts.push(<em key={match.index} className="italic text-slate-200">{match[5]}</em>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length === 1 ? parts[0] : parts;
}

function parseMarkdown(md) {
  const lines = md.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block ```
    if (line.trim().startsWith('```')) {
      const language = line.trim().slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push({ type: 'code', language, code: codeLines.join('\n') });
      i++;
      continue;
    }

    // Headings
    if (line.startsWith('#### ')) {
      elements.push({ type: 'h4', text: line.slice(5).trim() });
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push({ type: 'h3', text: line.slice(4).trim() });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push({ type: 'h2', text: line.slice(3).trim() });
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      elements.push({ type: 'h1', text: line.slice(2).trim() });
      i++;
      continue;
    }

    // Blockquote / Callouts >
    if (line.startsWith('> ')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push({ type: 'blockquote', text: quoteLines.join('\n') });
      continue;
    }

    // Horizontal Rule ---
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push({ type: 'hr' });
      i++;
      continue;
    }

    // Table |
    if (line.trim().startsWith('|') && line.includes('|')) {
      const tableRows = [];
      let headers = [];
      
      const parseRow = (l) => l.split('|').map(s => s.trim()).filter((s, idx, arr) => idx > 0 && idx < arr.length);

      headers = parseRow(line);
      i++;

      // Skip delimiter row | :--- | :--- |
      if (i < lines.length && lines[i].includes('---')) {
        i++;
      }

      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableRows.push(parseRow(lines[i]));
        i++;
      }

      elements.push({ type: 'table', headers, rows: tableRows });
      continue;
    }

    // List - or * or 1.
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || /^\d+\.\s/.test(line.trim())) {
      const items = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* ') || /^\d+\.\s/.test(lines[i].trim()))
      ) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push({ type: 'list', items });
      continue;
    }

    // Paragraph
    if (line.trim() !== '') {
      elements.push({ type: 'paragraph', text: line.trim() });
    }

    i++;
  }

  return elements;
}
