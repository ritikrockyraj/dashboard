import React from 'react';
import { Code2, Briefcase, FileText, List, FolderGit2 } from 'lucide-react';

export default function HomeHero({ setActiveView }) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mt-8">
        <h1 className="text-6xl md:text-[64px] font-bold font-heading text-white tracking-tight leading-tight mb-6">
          Day One to <span className="text-[#6366F1]">One Day</span>, Ritik !
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Welcome to your Personal Career & Prep Command Center. Track your progress, manage applications, and refine your resume in one unified dashboard.
        </p>
      </section>

      {/* Modules Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div onClick={() => setActiveView('leetcode')} className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-6 hover:border-[#6366F1] hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group cursor-pointer h-full flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Code2 size={24} />
          </div>
          <h3 className="text-2xl font-heading font-semibold text-white mb-2">OA Give</h3>
          <p className="text-gray-400 text-sm mb-6 flex-1">
            Track your contest rating, problem-solving streaks, and daily challenges in one place.
          </p>
        </div>

        <div onClick={() => setActiveView('jobs')} className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-6 hover:border-[#6366F1] hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group cursor-pointer h-full flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Briefcase size={24} />
          </div>
          <h3 className="text-2xl font-heading font-semibold text-white mb-2">Job CRM</h3>
          <p className="text-gray-400 text-sm mb-6 flex-1">
            Manage your job applications, interviews, and follow-ups with a centralized kanban tracker.
          </p>
        </div>

        <div onClick={() => setActiveView('resume')} className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-6 hover:border-[#6366F1] hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group cursor-pointer h-full flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FileText size={24} />
          </div>
          <h3 className="text-2xl font-heading font-semibold text-white mb-2">Resume Vault</h3>
          <p className="text-gray-400 text-sm mb-6 flex-1">
            Manage your Overleaf LaTeX templates, generate targeted resumes, and store master copies.
          </p>
        </div>

        <div onClick={() => setActiveView('vault')} className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-6 hover:border-[#6366F1] hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group cursor-pointer h-full flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-[#6366F1] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FolderGit2 size={24} />
          </div>
          <h3 className="text-2xl font-heading font-semibold text-white mb-2">Projects & Vault</h3>
          <p className="text-gray-400 text-sm mb-6 flex-1">
            Prepare, document, and track readiness for every project in your portfolio.
          </p>
        </div>

        <a href="https://dsa-tracker-seven-pi.vercel.app/" target="_blank" rel="noopener noreferrer" className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-6 hover:border-[#6366F1] hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group cursor-pointer h-full flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <List size={24} />
          </div>
          <h3 className="text-2xl font-heading font-semibold text-white mb-2">250 LC</h3>
          <p className="text-gray-400 text-sm mb-6 flex-1">
            Access your dedicated 250 LeetCode problems tracker to master DSA patterns.
          </p>
        </a>
      </section>
    </div>
  );
}
