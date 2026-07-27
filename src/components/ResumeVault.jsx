import React, { useState } from 'react';
import { FileText, Plus, ExternalLink, Edit3, Tag as TagIcon, LayoutList, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import SectionHero from './SectionHero';

const DEFAULT_OVERLEAF = "https://www.overleaf.com/project/69426943aa07d3b6e72dde8e";

export default function ResumeVault() {
  const [resumes, setResumes] = useLocalStorage('resume_vault_items', [
    {
      id: 'master',
      title: 'Master Resume',
      tags: ['SDE Focus', 'Fullstack'],
      bullets: ['Highlight scalable architecture', 'React/Node.js stack'],
      link: DEFAULT_OVERLEAF
    }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', tags: '', bullets: '', link: DEFAULT_OVERLEAF });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItem.title) return;
    
    const entry = {
      id: Date.now().toString(),
      title: newItem.title,
      tags: newItem.tags.split(',').map(t => t.trim()).filter(Boolean),
      bullets: newItem.bullets.split('\n').map(b => b.trim()).filter(Boolean),
      link: newItem.link || DEFAULT_OVERLEAF
    };
    
    setResumes(prev => [...prev, entry]);
    setIsAdding(false);
    setNewItem({ title: '', tags: '', bullets: '', link: DEFAULT_OVERLEAF });
  };

  const deleteResume = (id) => {
    if (id === 'master') return; // protect master
    setResumes(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="h-full flex flex-col">
      <SectionHero
        title="Resume Vault"
        description="Manage your Overleaf LaTeX templates, generate targeted resume variants, and store master copies for every opportunity."
        gradientClass="from-purple-600 to-fuchsia-600"
        icon={<FileText size={40} className="text-purple-400" />}
      />

      <div className="flex items-center justify-end mb-6">
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#6366F1] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:bg-[#4f52c9] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <Plus size={16} />
          <span>New Variant</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create Resume Variant</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Variant Name</label>
              <input required type="text" placeholder="e.g. AI/ML ArcFace Focus" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2 text-sm text-white focus:border-[#6366F1] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Tags (comma separated)</label>
              <input type="text" placeholder="e.g. AI, Backend, Startup" value={newItem.tags} onChange={e => setNewItem({...newItem, tags: e.target.value})} className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2 text-sm text-white focus:border-[#6366F1] outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1">Overleaf Link</label>
              <input type="url" placeholder="https://www.overleaf.com/project/..." value={newItem.link} onChange={e => setNewItem({...newItem, link: e.target.value})} className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2 text-sm text-white focus:border-[#6366F1] outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1">Bullet Highlights (one per line)</label>
              <textarea rows={3} placeholder="Added ArcFace project&#10;Removed old internship" value={newItem.bullets} onChange={e => setNewItem({...newItem, bullets: e.target.value})} className="w-full bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2 text-sm text-white focus:border-[#6366F1] outline-none resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#6366F1] text-white hover:bg-[#4f52c9] transition-colors">Save Variant</button>
          </div>
        </form>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-4 content-start">
        {resumes.map(resume => (
          <div key={resume.id} className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-6 flex flex-col hover:border-[#6366F1]/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 group relative">
            {resume.id !== 'master' && (
              <button onClick={() => deleteResume(resume.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={16} />
              </button>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">{resume.title}</h3>
                {resume.id === 'master' && <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">Primary</span>}
              </div>
            </div>
            
            {resume.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {resume.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs font-medium bg-[#0B0F17] border border-[#1E293B] text-gray-300 px-2 py-1 rounded-lg">
                    <TagIcon size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}
            
            {resume.bullets.length > 0 && (
              <div className="mb-6 flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><LayoutList size={12}/> Highlights</p>
                <ul className="space-y-1.5">
                  {resume.bullets.map((bullet, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-[#6366F1] mt-1">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-auto pt-4 border-t border-[#1E293B]">
              <a 
                href={resume.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#6366F1]/10 text-[#6366F1] hover:bg-[#6366F1]/20 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Edit3 size={16} />
                Edit in Overleaf
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
