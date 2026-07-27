import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { rawHandbooksMap } from './vaultData';
import MarkdownViewer from './MarkdownViewer';
import ReadinessDashboard from './ReadinessDashboard';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const parseHandbookParts = (content) => {
  if (!content) return {};
  const sections = {};
  
  const regex = /^## PART (\d+):?\s*(.*)$/gm;
  let match;
  const indices = [];
  
  while ((match = regex.exec(content)) !== null) {
    indices.push({
      part: parseInt(match[1], 10),
      title: match[2].trim(),
      index: match.index,
      length: match[0].length
    });
  }
  
  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].index + indices[i].length;
    const end = (i + 1 < indices.length) ? indices[i + 1].index : content.length;
    const partContent = content.substring(start, end).trim();
    sections[indices[i].part] = {
      title: indices[i].title,
      content: partContent
    };
  }
  
  return sections;
};

export default function ProjectDetailModal({ project, onClose, onUpdateProject }) {
  const [activeTab, setActiveTab] = useState('arch');
  const [activeRecall, setActiveRecall] = useLocalStorage('vault_active_recall_active', false);

  const rawText = rawHandbooksMap[project.id] || '';
  const parsedParts = parseHandbookParts(rawText);

  const tabGroupings = {
    arch: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    qa: [11, 12, 13, 14, 17, 24],
    bugs: [15, 16, 23],
    revision: [18, 19, 20, 21, 22, 25]
  };

  const renderTabContent = (partNumbers) => {
    const validParts = partNumbers.filter(num => parsedParts[num]);

    if (validParts.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500 italic">
          No handbook chapters for this section are available for this project.
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {validParts.map(num => (
          <div key={num} className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] p-6 rounded-2xl text-left">
            <h3 className="text-lg font-heading font-semibold text-[#6366F1] border-b border-[#1E293B] pb-2 mb-4">
              PART {num}: {parsedParts[num].title}
            </h3>
            <MarkdownViewer text={parsedParts[num].content} activeRecall={activeRecall} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-[#0B0F17]/95 backdrop-blur-xl border border-[#1E293B] rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl shadow-black/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E293B] bg-[#131927]/70 backdrop-blur-md">
          <div className="text-left">
            <h2 className="text-xl font-heading font-bold text-white">{project.title}</h2>
            <p className="text-xs text-gray-400 mt-1">Project Handbook & Readiness Center</p>
          </div>
          
          <div className="flex items-center gap-3">
            {(activeTab === 'qa' || activeTab === 'revision') && (
              <button
                onClick={() => setActiveRecall(!activeRecall)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  activeRecall
                    ? 'bg-[#6366F1]/20 border-[#6366F1] text-[#6366F1]'
                    : 'bg-[#131927] border-[#1E293B] text-gray-400 hover:text-white'
                }`}
              >
                {activeRecall ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{activeRecall ? 'Active Recall: ON' : 'Active Recall: OFF'}</span>
              </button>
            )}
            
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-[#1E293B] px-6 gap-1 bg-[#131927]/50 backdrop-blur-sm overflow-x-auto select-none">
          <button
            onClick={() => setActiveTab('arch')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === 'arch' ? 'border-[#6366F1] text-[#6366F1]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            🏗️ Architecture & Workflow
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === 'qa' ? 'border-[#6366F1] text-[#6366F1]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            🎯 Interview Scripts & Q&A
          </button>
          <button
            onClick={() => setActiveTab('bugs')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === 'bugs' ? 'border-[#6366F1] text-[#6366F1]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            🐞 System Design & Bugs
          </button>
          <button
            onClick={() => setActiveTab('revision')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === 'revision' ? 'border-[#6366F1] text-[#6366F1]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            ⚡ Rapid Revision
          </button>
          <button
            onClick={() => setActiveTab('readiness')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === 'readiness' ? 'border-[#6366F1] text-[#6366F1]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            📊 Readiness Dashboard
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0B0F17]">
          {rawText === '' && activeTab !== 'readiness' ? (
            <div className="text-center py-16 text-gray-500 italic max-w-md mx-auto">
              No local handbook file found for this project. Setup a handbook under <code>/handbooks/</code> to dynamically view chapter material here.
            </div>
          ) : (
            <>
              {activeTab === 'arch' && renderTabContent(tabGroupings.arch)}
              {activeTab === 'qa' && renderTabContent(tabGroupings.qa)}
              {activeTab === 'bugs' && renderTabContent(tabGroupings.bugs)}
              {activeTab === 'revision' && renderTabContent(tabGroupings.revision)}
              {activeTab === 'readiness' && (
                <ReadinessDashboard project={project} onUpdateProject={onUpdateProject} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
