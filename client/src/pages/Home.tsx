/**
 * Home Page - AI LIBRARY
 * Design: Hero landing → World Tree visualization with List view option
 */

import { AnimatePresence, motion } from 'framer-motion';
import WorldTreeView from '@/components/WorldTreeView';
import ListView from '@/components/ListView';
import HeroLanding from '@/components/HeroLanding';
import { useState, useEffect } from 'react';
import { Moon, Sun, TreePine, List } from 'lucide-react';

export default function Home() {
  const [showHero, setShowHero] = useState(() => {
    // Show hero only if user hasn't seen it this session
    const seen = sessionStorage.getItem('ai-library-hero-seen');
    return !seen;
  });
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('ai-library-theme');
    return saved ? saved === 'dark' : true;
  });
  const [viewMode, setViewMode] = useState<'tree' | 'list'>(() => {
    const saved = localStorage.getItem('ai-library-view');
    return (saved as 'tree' | 'list') || 'tree';
  });
  const [mindmapData, setMindmapData] = useState<any>(null);

  const handleEnterTree = () => {
    sessionStorage.setItem('ai-library-hero-seen', 'true');
    setShowHero(false);
  };

  const handleBackToLanding = () => {
    sessionStorage.removeItem('ai-library-hero-seen');
    setShowHero(true);
  };

  useEffect(() => {
    localStorage.setItem('ai-library-theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('ai-library-view', viewMode);
  }, [viewMode]);

  useEffect(() => {
    fetch('/mindmap_data.json')
      .then(res => res.json())
      .then(data => setMindmapData(data))
      .catch(err => console.error('Failed to load mindmap data:', err));
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-700 ${isDark ? 'bg-[#080a06]' : 'bg-[#f8f9f6]'}`}>
      
      {/* Hero Landing */}
      <AnimatePresence>
        {showHero && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <HeroLanding onEnter={handleEnterTree} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content (hidden while hero is showing) */}
      {!showHero && (
        <>
          {/* Top right controls */}
          <div className="fixed top-6 right-6 z-[100] flex items-center gap-3">
            {/* View Toggle */}
            <div className={`flex items-center gap-1 p-1 rounded-full transition-all duration-500 backdrop-blur-xl ${
              isDark 
                ? 'bg-slate-900/50 border border-white/10' 
                : 'bg-white/50 border border-black/10'
            }`}>
              <button
                onClick={() => setViewMode('tree')}
                className={`p-2.5 rounded-full transition-all duration-500 ${
                  viewMode === 'tree'
                    ? isDark 
                      ? 'bg-white/[0.15] text-white' 
                      : 'bg-black/[0.1] text-black'
                    : isDark 
                      ? 'text-white/30 hover:text-white/60' 
                      : 'text-black/30 hover:text-black/60'
                }`}
                title="Tree View"
              >
                <TreePine className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-full transition-all duration-500 ${
                  viewMode === 'list'
                    ? isDark 
                      ? 'bg-white/[0.15] text-white' 
                      : 'bg-black/[0.1] text-black'
                    : isDark 
                      ? 'text-white/30 hover:text-white/60' 
                      : 'text-black/30 hover:text-black/60'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Divider */}
            <div className={`w-px h-5 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-full transition-all duration-700 backdrop-blur-xl ${
                isDark 
                  ? 'text-white/30 hover:text-white/70 bg-slate-900/50 border border-white/10 hover:border-white/20' 
                  : 'text-black/30 hover:text-black/70 bg-white/50 border border-black/10 hover:border-black/20'
              }`}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <Moon className="w-4 h-4" strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* View Content */}
          {viewMode === 'tree' ? (
            <WorldTreeView isDark={isDark} onBackToLanding={handleBackToLanding} />
          ) : (
            <ListView isDark={isDark} data={mindmapData} />
          )}
        </>
      )}
    </div>
  );
}
