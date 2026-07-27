import React from 'react';
import { ExternalLink } from 'lucide-react';
import TerminalTipDrawer from './TerminalTipDrawer';

export default function ProjectCard({ project, onClick }) {
  const isTarget = project.category === 'target';
  
  const readiness = project.readiness || { verbalPitch: 0, techDepth: 0, architectureTradeoffs: 0, aiMockScore: 0 };
  const overallReadiness = Math.round(
    ((readiness.verbalPitch || 0) +
     (readiness.techDepth || 0) +
     (readiness.architectureTradeoffs || 0) +
     (readiness.aiMockScore || 0)) / 4
  );

  const getReadinessColor = (score) => {
    if (score >= 75) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (score >= 40) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div
      onClick={onClick}
      className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-6 hover:border-[#6366F1]/60 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] transition-all duration-300 cursor-pointer group flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Category Badge & Readiness Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
            isTarget
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20'
          }`}>
            {isTarget ? 'Target' : 'Active'}
          </span>
          
          {!isTarget && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${getReadinessColor(overallReadiness)}`}>
              Readiness: {overallReadiness}%
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-heading font-semibold text-white mb-3 group-hover:text-[#6366F1] transition-colors leading-snug">
          {project.title}
        </h3>

        {/* Tech Stack Pills */}
        {project.techStack && project.techStack.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map(tech => (
              <span key={tech} className="text-[10px] font-medium bg-[#6366F1]/10 text-[#a5b4fc] border border-[#6366F1]/20 px-2 py-0.5 rounded-md">
                {tech}
              </span>
            ))}
          </div>
        ) : (
          isTarget ? (
            <p className="text-xs text-gray-500 italic mb-4">Future roadmap item...</p>
          ) : (
            <p className="text-xs text-gray-500 italic mb-4">No technologies listed...</p>
          )
        )}

        <div className="flex-1" />

        {/* Launch Repo Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (project.repoUrl) window.open(project.repoUrl, '_blank');
          }}
          disabled={!project.repoUrl}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${
            project.repoUrl
              ? 'bg-[#6366F1]/10 text-[#6366F1] hover:bg-[#6366F1]/20'
              : 'bg-[#1E293B]/30 text-gray-600 cursor-not-allowed'
          }`}
        >
          <ExternalLink size={14} />
          <span>{project.repoUrl ? 'Launch Repository' : 'No Repo Yet'}</span>
        </button>

        {/* Terminal Drawer */}
        {!isTarget && (
          <TerminalTipDrawer gitCommands={project.gitCommands} />
        )}
      </div>
    </div>
  );
}
