import React from 'react';

export default function SectionHero({ title, description, gradientClass, icon }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#1E293B] p-6 md:p-8 bg-[#131927]/60 backdrop-blur-md mb-8 flex items-center justify-between group">
      {/* Background Glow */}
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${gradientClass} transition-opacity duration-500 group-hover:opacity-15`} />
      
      {/* Dynamic Dots Grid inside the Banner */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl text-left">
        <h2 className="text-3xl font-bold font-heading text-white tracking-tight mb-2">
          {title}
        </h2>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>

      <div className="relative z-10 hidden md:block bg-[#0B0F17]/40 border border-[#1E293B] p-4 rounded-xl shadow-inner text-[#6366F1] group-hover:scale-105 transition-transform duration-300">
        {icon}
      </div>
    </div>
  );
}
