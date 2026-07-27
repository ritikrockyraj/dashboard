import React, { useState, useMemo } from 'react';
import { FolderGit2, Search, Star, ClipboardList, Cpu } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getSeedProjects } from './vaultData';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';
import SectionHero from '../SectionHero';

export default function ProjectVault() {
  const [projects, setProjects] = useLocalStorage('vault_projects_v1', getSeedProjects());
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedProject = projects.find(p => p.id === selectedId) || null;

  const handleUpdateProject = (updatedProject) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const titleMatches = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      const techMatches = p.techStack && p.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return titleMatches || techMatches;
    });
  }, [projects, searchTerm]);

  const activeProjects = filteredProjects.filter(p => p.category === 'active');
  const targetProjects = filteredProjects.filter(p => p.category === 'target');

  const stats = useMemo(() => {
    const active = projects.filter(p => p.category === 'active');
    
    let totalReadiness = 0;
    let activeWithReadiness = 0;
    active.forEach(p => {
      const r = p.readiness || { verbalPitch: 0, techDepth: 0, architectureTradeoffs: 0, aiMockScore: 0 };
      const avg = ((r.verbalPitch || 0) + (r.techDepth || 0) + (r.architectureTradeoffs || 0) + (r.aiMockScore || 0)) / 4;
      totalReadiness += avg;
      activeWithReadiness++;
    });
    
    const avgReadiness = activeWithReadiness > 0 ? Math.round(totalReadiness / activeWithReadiness) : 0;
    const totalReviews = projects.reduce((sum, p) => sum + (p.reviewLog ? p.reviewLog.length : 0), 0);

    return {
      totalInferred: active.length,
      avgReadiness,
      totalReviews
    };
  }, [projects]);

  return (
    <div className="h-full flex flex-col">
      <SectionHero
        title="Projects & Interview Vault"
        description="Prepare, document, and track readiness for every project in your portfolio. Access architecture notes, interview Q&A, and self-evaluation tools."
        gradientClass="from-indigo-600 to-violet-600"
        icon={<Cpu size={40} className="text-indigo-400" />}
      />

      {/* Header Row with Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-end mb-6 gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search by name or tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all duration-300"
          />
        </div>
      </div>

      {/* Dynamic Statistics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between text-left">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Projects Detected</p>
            <p className="text-2xl font-bold text-white">{stats.totalInferred}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <FolderGit2 size={20} />
          </div>
        </div>

        <div className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between text-left">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Overall Readiness</p>
            <p className="text-2xl font-bold text-white">{stats.avgReadiness}%</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center">
            <Star size={20} />
          </div>
        </div>

        <div className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between text-left">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Reviews Logged</p>
            <p className="text-2xl font-bold text-white">{stats.totalReviews}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center">
            <ClipboardList size={20} />
          </div>
        </div>
      </div>

      {/* Active Projects Grid */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 text-left">
          Active Projects ({activeProjects.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {activeProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedId(project.id)}
            />
          ))}
        </div>
        {activeProjects.length === 0 && (
          <div className="text-center py-8 text-gray-500 italic bg-[#131927]/30 border border-[#1E293B] rounded-2xl">
            No active projects match your search criteria.
          </div>
        )}
      </div>

      {/* Target Projects Grid */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 text-left">
          Target / Future Builds ({targetProjects.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {targetProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedId(project.id)}
            />
          ))}
        </div>
        {targetProjects.length === 0 && (
          <div className="text-center py-8 text-gray-500 italic bg-[#131927]/30 border border-[#1E293B] rounded-2xl">
            No target projects match your search criteria.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedId(null)}
          onUpdateProject={handleUpdateProject}
        />
      )}
    </div>
  );
}
