/**
 * HeroLanding - Cinematic video hero landing page
 * Ultra-minimal, Apple-inspired design
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface HeroLandingProps {
  onEnter: () => void;
}

export default function HeroLanding({ onEnter }: HeroLandingProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Delay content reveal for cinematic effect
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Smooth easing for all animations
  const smoothEase = [0.25, 0.1, 0.25, 1];

  return (
    <div 
      className="fixed inset-0 z-[200] bg-[#030308] overflow-hidden cursor-pointer"
      onClick={onEnter}
    >
      {/* Video Background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
          opacity: isVideoLoaded ? 1 : 0, 
          scale: 1 
        }}
        transition={{ duration: 2, ease: smoothEase }}
        className="absolute inset-0"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className="w-full h-full object-cover"
        >
          <source src="/world-treevideo.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030308] via-transparent to-[#030308]/60" />
      <div className="absolute inset-0 bg-[#030308]/20" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-6">
        
        {/* Main Title Block */}
        <div className="text-center">
          {/* Subtle top label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: smoothEase }}
            className="mb-6"
          >
            <span className="text-[11px] text-white/40 tracking-[0.4em] uppercase font-light">
              The Complete AI Directory
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.5, ease: smoothEase }}
            className="text-[clamp(3rem,12vw,8rem)] font-extralight tracking-[0.02em] text-white leading-[0.9] mb-6"
          >
            AI Library
          </motion.h1>
          
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.8, ease: smoothEase }}
            className="text-base md:text-lg text-white/40 font-light tracking-wide max-w-sm mx-auto mb-12"
          >
            500+ curated tools across 18 categories
          </motion.p>

          {/* Enter Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.1, ease: smoothEase }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEnter();
              }}
              className="group relative inline-flex items-center justify-center"
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Button */}
              <div className="relative px-8 py-3.5 rounded-full border border-white/[0.15] bg-white/[0.03] backdrop-blur-sm group-hover:bg-white/[0.08] group-hover:border-white/25 transition-all duration-500">
                <span className="text-[13px] text-white/80 group-hover:text-white tracking-[0.15em] uppercase font-light transition-colors duration-500">
                  Explore
                </span>
              </div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Minimal corner markers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={showContent ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-8 left-8 w-8 h-8 border-l border-t border-white/[0.08]" />
        <div className="absolute top-8 right-8 w-8 h-8 border-r border-t border-white/[0.08]" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-l border-b border-white/[0.08]" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-r border-b border-white/[0.08]" />
      </motion.div>

      {/* Bottom hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={showContent ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <span className="text-[10px] text-white/20 tracking-[0.3em] uppercase">
          Click anywhere to enter
        </span>
      </motion.div>
    </div>
  );
}
