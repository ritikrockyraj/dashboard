import React, { useState, useMemo } from 'react';
import { Plus, Building2, ExternalLink, MoreVertical, Bookmark, Send, Phone, CheckCircle2, XCircle, Briefcase } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import SectionHero from './SectionHero';

const STATUSES = ['Bookmarked', 'Applied', 'OA/Interview', 'Offer', 'Rejected'];

export default function OpportunityTracker() {
  const [jobs, setJobs] = useLocalStorage('opportunity_jobs', []);
  const [isAdding, setIsAdding] = useState(false);
  const [newJob, setNewJob] = useState({ company: '', role: '', link: '', status: 'Bookmarked', notes: '', resume: '' });

  // Compute counters
  const counters = useMemo(() => {
    return {
      applied: jobs.filter(j => j.status === 'Applied').length,
      bookmarked: jobs.filter(j => j.status === 'Bookmarked').length,
      active: jobs.filter(j => j.status === 'OA/Interview').length
    };
  }, [jobs]);

  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJob.company || !newJob.role) return;
    
    const jobEntry = {
      ...newJob,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString()
    };
    
    setJobs(prev => [jobEntry, ...prev]);
    setIsAdding(false);
    setNewJob({ company: '', role: '', link: '', status: 'Bookmarked', notes: '', resume: '' });
  };

  const updateJobStatus = (id, newStatus) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, status: newStatus } : job));
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  // Group jobs for Kanban
  const kanbanColumns = {
    'Bookmarked': jobs.filter(j => j.status === 'Bookmarked'),
    'Applied': jobs.filter(j => j.status === 'Applied'),
    'OA/Interview': jobs.filter(j => j.status === 'OA/Interview'),
    'Offer/Rejected': jobs.filter(j => j.status === 'Offer' || j.status === 'Rejected'),
  };

  return (
    <div className="h-full flex flex-col">
      <SectionHero
        title="Job CRM / Opportunities"
        description="Track your applications, interviews, and follow-ups with a centralized Kanban tracker. Launch directly to top job platforms."
        gradientClass="from-green-600 to-emerald-600"
        icon={<Briefcase size={40} className="text-green-400" />}
      />

      <div className="flex items-center justify-end mb-6">
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#6366F1] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:bg-[#4f52c9] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <Plus size={16} />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Platform Launchpad */}
      <div className="flex items-center gap-4 mb-6 bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-5 overflow-x-auto">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mr-3">Launchpad</span>
        <PlatformLink href="https://www.linkedin.com/in/ritik-raj-746121332/" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" label="LinkedIn" hoverColor="hover:border-[#0A66C2] hover:shadow-[0_0_15px_rgba(10,102,194,0.3)]" />
        <PlatformLink href="https://leetcode.com/u/riitikraj/" src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/leetcode.svg" label="LeetCode" filter="invert(1)" hoverColor="hover:border-[#FFA116] hover:shadow-[0_0_15px_rgba(255,161,22,0.3)]" />
        <PlatformLink href="https://www.glassdoor.co.in/member/profile" src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/glassdoor.svg" label="Glassdoor" filter="invert(1)" hoverColor="hover:border-[#0CAA41] hover:shadow-[0_0_15px_rgba(12,170,65,0.3)]" />
        <PlatformLink href="https://profile.indeed.com/" src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/indeed.svg" label="Indeed" color="#003A9B" hoverColor="hover:border-[#003A9B] hover:shadow-[0_0_15px_rgba(0,58,155,0.3)]" />
        <PlatformLink href="https://wellfound.com/profile/edit/overview" src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/wellfound.svg" label="Wellfound" filter="invert(1)" hoverColor="hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
        <PlatformLink href="https://unstop.com/u/ritikraj24158" label="Unstop" fallback="U" color="#0052CC" hoverColor="hover:border-[#0052CC] hover:shadow-[0_0_15px_rgba(0,82,204,0.3)]" />
        <PlatformLink href="https://internshala.com/student/dashboard" label="Internshala" fallback="I" color="#1295D8" hoverColor="hover:border-[#1295D8] hover:shadow-[0_0_15px_rgba(18,149,216,0.3)]" />
      </div>

      {/* Top Counter Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Bookmarked</p>
            <p className="text-2xl font-bold text-white">{counters.bookmarked}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center"><Bookmark size={20}/></div>
        </div>
        <div className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Applied</p>
            <p className="text-2xl font-bold text-white">{counters.applied}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center"><Send size={20}/></div>
        </div>
        <div className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">OA / Interview Stage</p>
            <p className="text-2xl font-bold text-white">{counters.active}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center"><Phone size={20}/></div>
        </div>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAddJob} className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Log New Application</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <input required type="text" placeholder="Company Name" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} className="bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2 text-sm text-white focus:border-[#6366F1] outline-none" />
            <input required type="text" placeholder="Role (e.g. SDE-1)" value={newJob.role} onChange={e => setNewJob({...newJob, role: e.target.value})} className="bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2 text-sm text-white focus:border-[#6366F1] outline-none" />
            <select value={newJob.status} onChange={e => setNewJob({...newJob, status: e.target.value})} className="bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2 text-sm text-white focus:border-[#6366F1] outline-none">
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="url" placeholder="Job Link (URL)" value={newJob.link} onChange={e => setNewJob({...newJob, link: e.target.value})} className="bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2 text-sm text-white focus:border-[#6366F1] outline-none" />
            <input type="text" placeholder="Resume Used (e.g. SDE Focus V2)" value={newJob.resume} onChange={e => setNewJob({...newJob, resume: e.target.value})} className="bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2 text-sm text-white focus:border-[#6366F1] outline-none" />
            <input type="text" placeholder="JD Notes / Highlights" value={newJob.notes} onChange={e => setNewJob({...newJob, notes: e.target.value})} className="bg-[#0B0F17] border border-[#1E293B] rounded-xl px-4 py-2 text-sm text-white focus:border-[#6366F1] outline-none" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#6366F1] text-white hover:bg-[#4f52c9] transition-colors">Save Application</button>
          </div>
        </form>
      )}

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-4 gap-4 overflow-hidden pb-4">
        {Object.entries(kanbanColumns).map(([colName, colJobs]) => (
          <div key={colName} className="flex flex-col h-full bg-[#131927]/40 backdrop-blur-md border border-[#1E293B]/50 rounded-2xl p-3 overflow-hidden">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2 flex items-center justify-between">
              {colName}
              <span className="bg-[#1E293B] text-gray-300 text-xs px-2 py-0.5 rounded-full">{colJobs.length}</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 px-1 custom-scrollbar">
              {colJobs.map(job => (
                <div key={job.id} className="bg-[#0B0F17]/60 backdrop-blur-sm border border-[#1E293B] rounded-xl p-4 hover:border-[#6366F1]/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.12)] transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{job.company}</h4>
                    <div className="relative group/menu">
                      <button className="text-gray-500 hover:text-white"><MoreVertical size={16} /></button>
                      <div className="absolute right-0 top-full mt-1 w-32 bg-[#131927] border border-[#1E293B] rounded-lg shadow-xl opacity-0 group-hover/menu:opacity-100 pointer-events-none group-hover/menu:pointer-events-auto transition-opacity z-10 flex flex-col p-1">
                        <select 
                          className="bg-transparent text-sm text-gray-300 p-1.5 hover:bg-[#1E293B] rounded-md outline-none cursor-pointer"
                          value={job.status}
                          onChange={(e) => updateJobStatus(job.id, e.target.value)}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={() => deleteJob(job.id)} className="text-left text-sm text-red-400 p-1.5 hover:bg-red-500/10 rounded-md">Delete</button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#6366F1] font-medium mb-3">{job.role}</p>
                  
                  {job.notes && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{job.notes}</p>}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Building2 size={12} />
                      {new Date(job.dateAdded).toLocaleDateString()}
                    </span>
                    {job.link && (
                      <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-[#6366F1] hover:underline flex items-center gap-1">
                        Link <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {colJobs.length === 0 && (
                <div className="h-24 border-2 border-dashed border-[#1E293B] rounded-xl flex items-center justify-center text-xs text-gray-500">
                  No applications
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlatformLink({ href, src, label, fallback, color, filter, hoverColor }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      title={label}
      className={`flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl bg-[#0B0F17]/60 backdrop-blur-sm border border-[#1E293B] transition-all duration-300 group ${hoverColor || 'hover:border-[#6366F1] hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]'}`}
    >
      {src ? (
        <img 
          src={src} 
          alt={label} 
          className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" 
          style={{ filter: filter ? filter : (color ? 'none' : 'invert(1)') }} 
        />
      ) : (
        <span className="font-bold text-xl group-hover:scale-110 transition-transform duration-200" style={{ color }}>{fallback}</span>
      )}
    </a>
  );
}
