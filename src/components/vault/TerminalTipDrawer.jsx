import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

export default function TerminalTipDrawer({ gitCommands = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const defaultCommands = [
    { label: 'Check Git Status', cmd: 'git status' },
    { label: 'Push Handbook Updates', cmd: 'git add . && git commit -m "feat: updated handbook notes" && git push origin main' }
  ];

  const commandsToUse = gitCommands && gitCommands.length > 0 ? gitCommands : defaultCommands;

  const handleCopy = (e, cmd, idx) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmd);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="mt-4 border-t border-[#1E293B] pt-3" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#6366F1] transition-colors w-full"
      >
        <Terminal size={14} />
        <span>Quick Terminal Workflow</span>
        <span className="ml-auto text-[10px] bg-[#1E293B] px-1.5 py-0.5 rounded text-gray-400">
          {isOpen ? 'Close' : 'Open'}
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2 animate-in slide-in-from-top-2">
          {commandsToUse.map((gc, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-[#0B0F17]/60 backdrop-blur-sm border border-[#1E293B] rounded-lg p-2 text-left">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 font-medium mb-0.5">{gc.label}</p>
                <code className="text-xs text-green-400 font-mono block truncate">{gc.cmd}</code>
              </div>
              <button
                onClick={(e) => handleCopy(e, gc.cmd, idx)}
                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#1E293B] transition-colors text-gray-400 hover:text-white"
                title="Copy command"
              >
                {copiedIdx === idx ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
