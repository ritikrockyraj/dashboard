import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, Play, Timer, Flame, Trophy, Target, BarChart3 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import SectionHero from './SectionHero';

const BADGES = {
  0: { label: '0/4 🔴', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  1: { label: '1/4 🟡', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  2: { label: '2/4 🟢', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  3: { label: '3/4 🟢', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  4: { label: '4/4 🏆', color: 'text-yellow-300 bg-yellow-500/20 border-yellow-500/30 font-bold' }
};

// Generate exactly 100 contests: 50 Weekly + 50 Biweekly
function generateContests() {
  const list = [];
  // 50 Weekly Contests (401–450)
  for (let i = 450; i >= 401; i--) {
    list.push({ id: `weekly-${i}`, name: `Weekly Contest ${i}`, type: 'Weekly', number: i });
  }
  // 50 Biweekly Contests (101–150)
  for (let i = 150; i >= 101; i--) {
    list.push({ id: `biweekly-${i}`, name: `Biweekly Contest ${i}`, type: 'Biweekly', number: i });
  }
  return list;
}

export default function LeetCodeHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  const [contestStatus, setContestStatus] = useLocalStorage('leetcode_contest_status', {});

  const contests = useMemo(() => generateContests(), []);

  // ── Stats & Streak ──
  const stats = useMemo(() => {
    let attempted = 0;     // contests with score >= 1
    let perfect = 0;       // contests with score = 4
    let totalSolved = 0;   // sum of all solved questions
    let currentStreak = 0; // consecutive attempted contests from top
    let longestStreak = 0;
    let tempStreak = 0;

    // Count stats
    contests.forEach(c => {
      const score = Math.max(0, Math.min(4, Number(contestStatus[c.id]) || 0));
      if (score > 0) {
        attempted++;
        totalSolved += score;
      }
      if (score === 4) perfect++;
    });

    // Calculate streak (consecutive contests attempted from newest)
    for (const c of contests) {
      const score = Math.max(0, Math.min(4, Number(contestStatus[c.id]) || 0));
      if (score > 0) {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        tempStreak = 0;
      }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;

    // Current streak from the top
    for (const c of contests) {
      const score = Math.max(0, Math.min(4, Number(contestStatus[c.id]) || 0));
      if (score > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { attempted, perfect, totalSolved, currentStreak, longestStreak, total: 100 };
  }, [contests, contestStatus]);

  const filteredContests = useMemo(() => {
    return contests.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || c.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [contests, searchTerm, filterType]);

  const updateStatus = (id, count) => {
    setContestStatus(prev => ({ ...prev, [id]: count }));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 text-left">
          <SectionHero 
            title="OA Give / Practice" 
            description="Race against time, solve dynamic challenges, and track your performance metric profiles across Weekly and Biweekly contests."
            gradientClass="from-orange-600 to-amber-600"
            icon={<Timer size={40} className="text-orange-400" />}
          />
        </div>
        
        {/* Live Contest Button */}
        <a 
          href="https://leetcode.com/contest/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#6366F1] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-[#4f52c9] hover:scale-[1.02] active:scale-[0.98] transition-all ml-4 mb-8"
        >
          <Play size={16} fill="currentColor" />
          <span>Live Contests</span>
        </a>
      </div>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard icon={<Target size={18} />} label="Attempted" value={`${stats.attempted} / ${stats.total}`} color="text-blue-400" bg="bg-blue-500/10" />
        <StatCard icon={<BarChart3 size={18} />} label="Questions Solved" value={stats.totalSolved} color="text-green-400" bg="bg-green-500/10" />
        <StatCard icon={<Trophy size={18} />} label="Perfect (4/4)" value={stats.perfect} color="text-yellow-400" bg="bg-yellow-500/10" />
        <StatCard icon={<Flame size={18} />} label="Current Streak" value={`🔥 ${stats.currentStreak}`} color="text-orange-400" bg="bg-orange-500/10" />
        <StatCard icon={<Flame size={18} />} label="Longest Streak" value={`⚡ ${stats.longestStreak}`} color="text-purple-400" bg="bg-purple-500/10" />
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search contest..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-xl py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all duration-300"
          />
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#6366F1] cursor-pointer"
        >
          <option value="All">All Types</option>
          <option value="Weekly">Weekly</option>
          <option value="Biweekly">Biweekly</option>
        </select>
        <div className="flex items-center text-xs text-gray-500 font-mono bg-[#131927]/40 border border-[#1E293B] rounded-xl px-4">
          {filteredContests.length} contests
        </div>
      </div>

      <div className="flex-1 bg-[#131927]/40 backdrop-blur-md border border-[#1E293B] rounded-2xl overflow-hidden flex flex-col">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#1E293B] bg-[#0B0F17]/50 text-sm font-semibold text-gray-400 uppercase tracking-wider text-left">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Contest Name</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-4 text-right">Solved Status</div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {filteredContests.map((contest, idx) => {
            const rawCount = contestStatus[contest.id] ?? 0;
            const solvedCount = Math.max(0, Math.min(4, Number(rawCount) || 0));
            const badge = BADGES[solvedCount] || BADGES[0];
            const url = `https://leetcode.com/contest/${contest.type.toLowerCase()}-contest-${contest.number}`;
            
            return (
              <div key={contest.id} className="grid grid-cols-12 gap-4 p-3 hover:bg-[#1E293B]/40 rounded-xl items-center transition-all duration-200 border-b border-[#1E293B]/30 last:border-0 group text-left">
                <div className="col-span-1 text-xs text-gray-500 font-mono">{idx + 1}</div>
                <div className="col-span-5 flex items-center gap-3">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-[#6366F1] flex items-center gap-2 transition-colors">
                    {contest.name}
                    <ExternalLink size={14} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
                
                <div className="col-span-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                    contest.type === 'Weekly' 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  }`}>
                    {contest.type}
                  </span>
                </div>
                
                <div className="col-span-4 flex justify-end items-center gap-1.5">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map(num => (
                      <button 
                        key={num}
                        onClick={() => updateStatus(contest.id, num)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 ${
                          solvedCount === num 
                            ? BADGES[num].color + ' border scale-110 shadow-md shadow-indigo-500/5' 
                            : 'text-gray-500 hover:bg-[#1E293B] hover:text-gray-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className={`ml-3 px-3 py-1.5 rounded-lg text-xs border flex items-center justify-center w-24 font-bold ${badge.color}`}>
                    {badge.label}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredContests.length === 0 && (
            <div className="text-center p-12 text-gray-500 italic">
              No contests found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div className="bg-[#131927]/60 backdrop-blur-md border border-[#1E293B] rounded-2xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div className="text-left">
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
        <p className={`text-lg font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
