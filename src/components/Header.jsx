import React from 'react';
import { Bell, Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 border-b border-[#1E293B] bg-[#0B0F17]/40 backdrop-blur-md sticky top-0 z-10 flex items-center justify-end px-8">

      <div className="flex items-center gap-4">
        <div className="relative w-64 hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="w-full bg-[#131927]/60 border border-[#1E293B] rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all duration-300"
          />
        </div>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#131927]/60 border border-[#1E293B] text-gray-400 hover:text-white hover:border-[#6366F1]/50 hover:shadow-[0_0_10px_rgba(99,102,241,0.2)] transition-all duration-300 relative">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}

