import React from 'react';
import { Home, Code2, Briefcase, FileText, Settings, User, List, FolderGit2 } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="w-64 h-screen border-r border-[#1E293B] bg-[#0B0F17]/60 backdrop-blur-lg flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold font-heading text-white tracking-tight">
          Dashboard
        </h2>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem icon={<Home size={20} />} label="Dashboard" active={activeView === 'home'} onClick={() => setActiveView('home')} />
        <NavItem icon={<Code2 size={20} />} label="OA Give" active={activeView === 'leetcode'} onClick={() => setActiveView('leetcode')} />
        <NavItem icon={<Briefcase size={20} />} label="Job CRM" active={activeView === 'jobs'} onClick={() => setActiveView('jobs')} />
        <NavItem icon={<FolderGit2 size={20} />} label="Projects & Vault" active={activeView === 'vault'} onClick={() => setActiveView('vault')} />
        <NavItem icon={<FileText size={20} />} label="Resume Vault" active={activeView === 'resume'} onClick={() => setActiveView('resume')} />
        <a href="https://dsa-tracker-seven-pi.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-gray-400 hover:text-white hover:bg-[#131927]">
          <List size={20} />
          <span className="font-medium text-sm">250 LC</span>
        </a>
      </nav>

      <div className="p-4 border-t border-[#1E293B]">
        <NavItem icon={<Settings size={20} />} label="Settings" onClick={() => {}} />
        <div className="mt-4 flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white font-bold">
            R
          </div>
          <div>
            <p className="text-sm font-medium text-white">Ritik</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        active 
          ? 'bg-[#6366F1]/10 text-[#6366F1]' 
          : 'text-gray-400 hover:text-white hover:bg-[#131927]'
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}
