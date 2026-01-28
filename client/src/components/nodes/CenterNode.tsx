/**
 * CenterNode - Minimal, elegant central hub
 * Design: Clean, futuristic typography-focused
 */

import { Handle, Position } from '@xyflow/react';
import { memo, useState } from 'react';

interface CenterNodeData {
  totalTools: number;
  totalCategories: number;
  hiddenGems: number;
  isDark?: boolean;
}

function CenterNode({ data }: { data: CenterNodeData }) {
  const isDark = data.isDark !== false;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="center-node"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="source" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="source" position={Position.Left} className="opacity-0" />
      
      <div 
        className={`relative rounded-3xl p-10 cursor-default transition-all duration-700 ease-out ${
          isHovered ? 'scale-[1.02]' : ''
        }`}
        style={{ 
          background: isDark 
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(0, 0, 0, 0.02)',
          border: isDark 
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Subtle animated ring */}
        {isDark && (
          <div 
            className="absolute inset-0 rounded-3xl transition-opacity duration-1000"
            style={{ 
              border: '1px solid rgba(255, 255, 255, 0.04)',
              transform: 'scale(1.08)',
              opacity: isHovered ? 0.8 : 0.4,
            }}
          />
        )}
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center min-w-[200px]">
          <h1 
            className={`font-light text-2xl tracking-[0.15em] uppercase mb-2 ${
              isDark ? 'text-white/90' : 'text-black/85'
            }`}
          >
            AI Library
          </h1>
          
          <p className={`text-[11px] font-light tracking-widest uppercase mb-8 ${
            isDark ? 'text-white/25' : 'text-black/25'
          }`}>
            Explore the universe
          </p>
          
          <div className="flex gap-8 text-center">
            <div>
              <div 
                className={`font-extralight text-3xl tabular-nums ${
                  isDark ? 'text-white/80' : 'text-black/70'
                }`}
              >
                {data.totalTools}
              </div>
              <div className={`text-[10px] font-light tracking-widest uppercase mt-1 ${
                isDark ? 'text-white/25' : 'text-black/25'
              }`}>
                Tools
              </div>
            </div>
            
            <div className={`w-px ${isDark ? 'bg-white/10' : 'bg-black/08'}`} />
            
            <div>
              <div 
                className={`font-extralight text-3xl tabular-nums ${
                  isDark ? 'text-white/80' : 'text-black/70'
                }`}
              >
                {data.totalCategories}
              </div>
              <div className={`text-[10px] font-light tracking-widest uppercase mt-1 ${
                isDark ? 'text-white/25' : 'text-black/25'
              }`}>
                Categories
              </div>
            </div>
            
            <div className={`w-px ${isDark ? 'bg-white/10' : 'bg-black/08'}`} />
            
            <div>
              <div 
                className={`font-extralight text-3xl tabular-nums ${
                  isDark ? 'text-white/80' : 'text-black/70'
                }`}
              >
                {data.hiddenGems}
              </div>
              <div className={`text-[10px] font-light tracking-widest uppercase mt-1 ${
                isDark ? 'text-white/25' : 'text-black/25'
              }`}>
                Gems
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CenterNode);
