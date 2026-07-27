import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function MarkdownViewer({ text, activeRecall }) {
  if (!text) return null;

  const blocks = [];
  const lines = text.split('\n');
  let inCodeBlock = false;
  let codeBlockLines = [];
  let codeBlockLang = '';
  let inTable = false;
  let tableLines = [];

  const flushTable = () => {
    if (tableLines.length > 0) {
      blocks.push({ type: 'table', lines: [...tableLines] });
      tableLines = [];
      inTable = false;
    }
  };

  const flushCodeBlock = () => {
    if (codeBlockLines.length > 0) {
      blocks.push({ type: 'code', lang: codeBlockLang, code: codeBlockLines.join('\n') });
      codeBlockLines = [];
      inCodeBlock = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        flushTable();
        inCodeBlock = true;
        codeBlockLang = line.trim().substring(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    if (line.trim().startsWith('|')) {
      flushCodeBlock();
      inTable = true;
      tableLines.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (line.trim().startsWith('#')) {
      blocks.push({ type: 'header', text: line });
      continue;
    }

    if (line.trim().startsWith('>')) {
      blocks.push({ type: 'blockquote', text: line });
      continue;
    }

    if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
      blocks.push({ type: 'divider' });
      continue;
    }

    if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || /^\d+\.\s/.test(line.trim())) {
      blocks.push({ type: 'list-item', text: line });
      continue;
    }

    if (line.trim() === '') {
      blocks.push({ type: 'empty' });
    } else {
      blocks.push({ type: 'paragraph', text: line });
    }
  }

  flushTable();
  flushCodeBlock();

  const parseInlineMarkdown = (str) => {
    let html = str;
    // Replace html tags just to prevent raw render issues
    html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code: `code`
    html = html.replace(/`(.*?)`/g, '<code class="bg-[#1E293B] px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs">$1</code>');
    // Links: [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#6366F1] hover:underline">$1</a>');
    
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="space-y-4">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'header': {
            const level = block.text.match(/^#+/)[0].length;
            const textContent = block.text.replace(/^#+\s*/, '');
            const styles = 
              level === 1 ? 'text-2xl font-bold font-heading text-white mt-6 mb-3 border-b border-[#1E293B] pb-2' :
              level === 2 ? 'text-xl font-semibold font-heading text-[#6366F1] mt-5 mb-2' :
              'text-lg font-medium font-heading text-indigo-300 mt-4 mb-2';
            return React.createElement(`h${Math.min(level + 1, 6)}`, { key: idx, className: styles }, parseInlineMarkdown(textContent));
          }

          case 'blockquote': {
            const textContent = block.text.replace(/^>\s*/, '');
            return (
              <blockquote key={idx} className="border-l-4 border-[#6366F1] bg-[#131927] px-4 py-3 rounded-r-xl my-2 text-gray-400 italic text-sm">
                {parseInlineMarkdown(textContent)}
              </blockquote>
            );
          }

          case 'divider':
            return <hr key={idx} className="border-[#1E293B] my-6" />;

          case 'list-item': {
            const bulletMatch = block.text.match(/^[\-\*]\s+/);
            const numMatch = block.text.match(/^\d+\.\s+/);
            const prefix = bulletMatch ? '• ' : (numMatch ? numMatch[0] : '');
            const textContent = block.text.substring(prefix.length);

            const isAnswer = textContent.toLowerCase().startsWith('a:') || textContent.toLowerCase().startsWith('answer:') || textContent.includes(' - ');
            
            if (activeRecall && isAnswer) {
              const splitIdx = textContent.indexOf(' - ');
              const splitColonIdx = textContent.indexOf(': ');
              const divideIdx = splitIdx !== -1 ? splitIdx : (splitColonIdx !== -1 ? splitColonIdx : -1);
              const separator = splitIdx !== -1 ? ' - ' : ': ';
              
              if (divideIdx !== -1) {
                const questionPart = textContent.substring(0, divideIdx);
                const answerPart = textContent.substring(divideIdx + separator.length);
                return (
                  <div key={idx} className="pl-4 flex items-start gap-2 py-0.5 text-sm leading-relaxed">
                    <span className="text-[#6366F1] select-none">{prefix || '•'}</span>
                    <span className="text-gray-300">
                      {parseInlineMarkdown(questionPart)}{separator}
                      <span className="inline bg-[#1E293B] text-gray-300 px-1.5 rounded blur-sm hover:blur-none active:blur-none transition-all duration-300 cursor-pointer select-none" title="Hover or click to reveal">
                        {parseInlineMarkdown(answerPart)}
                      </span>
                    </span>
                  </div>
                );
              }
            }

            return (
              <div key={idx} className="pl-4 flex items-start gap-2 py-0.5 text-sm leading-relaxed">
                <span className="text-[#6366F1] select-none">{prefix || '•'}</span>
                <span className="text-gray-300">{parseInlineMarkdown(textContent)}</span>
              </div>
            );
          }

          case 'code': {
            return <CodeBlockBlock key={idx} code={block.code} lang={block.lang} activeRecall={activeRecall} />;
          }

          case 'table': {
            return <TableBlock key={idx} lines={block.lines} activeRecall={activeRecall} parseInline={parseInlineMarkdown} />;
          }

          case 'paragraph': {
            const textContent = block.text;
            const isQuestion = textContent.trim().toLowerCase().startsWith('**q:') || textContent.trim().toLowerCase().startsWith('q:');
            const isAnswer = textContent.trim().toLowerCase().startsWith('**a:') || textContent.trim().toLowerCase().startsWith('a:') || textContent.trim().toLowerCase().startsWith('answer:');

            if (activeRecall && isAnswer) {
              return (
                <p key={idx} className="text-sm text-gray-300 leading-relaxed my-2">
                  <span className="inline-block bg-[#1E293B]/40 text-gray-300 px-2 py-1 rounded-lg border border-[#1E293B] blur-sm hover:blur-none active:blur-none transition-all duration-300 cursor-pointer select-none" title="Hover or click to reveal">
                    {parseInlineMarkdown(textContent)}
                  </span>
                </p>
              );
            }

            return (
              <p key={idx} className={`text-sm leading-relaxed my-2 ${isQuestion ? 'text-white font-semibold mt-4' : 'text-gray-300'}`}>
                {parseInlineMarkdown(textContent)}
              </p>
            );
          }

          case 'empty':
            return <div key={idx} className="h-2" />;

          default:
            return null;
        }
      })}
    </div>
  );
}

function CodeBlockBlock({ code, lang, activeRecall }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#0B0F17] border border-[#1E293B] rounded-xl overflow-hidden my-4 group">
      <div className="flex items-center justify-between px-4 py-2 bg-[#131927] border-b border-[#1E293B] text-xs text-gray-400 font-mono">
        <span>{lang || 'code'}</span>
        <button onClick={copyCode} className="text-gray-500 hover:text-white transition-colors flex items-center gap-1">
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className={`p-4 overflow-x-auto text-xs font-mono text-green-400 leading-relaxed transition-all duration-300 ${activeRecall ? 'blur-sm hover:blur-none active:blur-none cursor-pointer select-none' : ''}`}>
        <pre>{code}</pre>
      </div>
    </div>
  );
}

function TableBlock({ lines, activeRecall, parseInline }) {
  const rows = lines
    .map(line => line.trim())
    .filter(line => line.startsWith('|') && line.endsWith('|'))
    .map(line => {
      const cells = line.split('|').map(c => c.trim());
      cells.shift();
      cells.pop();
      return cells;
    });

  if (rows.length === 0) return null;

  const header = rows[0];
  const bodyRows = rows.slice(1).filter(row => !row.every(cell => /^[-:|]+$/.test(cell)));
  const answerColIdx = header.findIndex(h => h.toLowerCase().includes('answer') || h.toLowerCase() === 'a');

  return (
    <div className="overflow-x-auto bg-[#131927] border border-[#1E293B] rounded-xl my-4">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-[#1E293B] bg-[#0B0F17]/40 text-gray-400 text-xs uppercase tracking-wider font-semibold">
            {header.map((h, i) => (
              <th key={i} className="p-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-b border-[#1E293B]/40 last:border-b-0 hover:bg-[#0B0F17]/20 transition-colors">
              {row.map((cell, colIdx) => {
                const isAnswerCell = colIdx === answerColIdx;
                if (activeRecall && isAnswerCell) {
                  return (
                    <td key={colIdx} className="p-3">
                      <span className="inline-block bg-[#0B0F17] border border-[#1E293B] text-gray-300 px-2.5 py-1 rounded-lg blur-sm hover:blur-none active:blur-none transition-all duration-300 cursor-pointer select-none" title="Hover or click to reveal">
                        {parseInline(cell)}
                      </span>
                    </td>
                  );
                }
                return (
                  <td key={colIdx} className="p-3 text-gray-300">
                    {parseInline(cell)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
