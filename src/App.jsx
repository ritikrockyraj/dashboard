import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomeHero from './components/HomeHero';
import LeetCodeHub from './components/LeetCodeHub';
import OpportunityTracker from './components/OpportunityTracker';
import ResumeVault from './components/ResumeVault';
import ProjectVault from './components/vault/ProjectVault';

function App() {
  const [activeView, setActiveView] = useState('home');

  return (
    <div className="min-h-screen bg-[#0B0F17]/30 backdrop-blur-[2px] text-white flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 p-8">
          <div className="max-w-[1200px] mx-auto h-full">
            {activeView === 'home' && <HomeHero setActiveView={setActiveView} />}
            {activeView === 'leetcode' && <LeetCodeHub />}
            {activeView === 'jobs' && <OpportunityTracker />}
            {activeView === 'resume' && <ResumeVault />}
            {activeView === 'vault' && <ProjectVault />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
