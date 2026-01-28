/**
 * CategoryNode - Ultra-minimal, luxurious category node
 * Design: Clean, futuristic, Apple-inspired
 */

import { Handle, Position } from '@xyflow/react';
import { memo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CategoryNodeData {
  label: string;
  icon: string;
  color: string;
  toolCount: number;
  expanded?: boolean;
  isDark?: boolean;
  onClick?: () => void;
}

function CategoryNode({ data }: { data: CategoryNodeData }) {
  const isDark = data.isDark !== false;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="category-node cursor-pointer"
      onClick={data.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div 
        className={`relative rounded-2xl p-6 transition-all duration-700 ease-out ${
          isHovered ? 'scale-[1.03]' : ''
        }`}
        style={{ 
          background: isDark 
            ? `rgba(255, 255, 255, ${data.expanded ? 0.06 : 0.03})`
            : `rgba(0, 0, 0, ${data.expanded ? 0.04 : 0.02})`,
          border: `1px solid ${isDark 
            ? `rgba(255, 255, 255, ${data.expanded ? 0.12 : 0.06})` 
            : `rgba(0, 0, 0, ${data.expanded ? 0.08 : 0.04})`}`,
          minWidth: '180px',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Subtle glow on hover/expand */}
        {(isHovered || data.expanded) && isDark && (
          <div 
            className="absolute inset-0 rounded-2xl transition-opacity duration-700 opacity-50"
            style={{ 
              background: `radial-gradient(ellipse at center, ${data.color}15, transparent 70%)`,
            }}
          />
        )}
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div 
            className={`text-4xl mb-3 transition-all duration-500 ${
              isHovered ? 'scale-110' : ''
            }`}
            style={{
              opacity: isDark ? 0.9 : 0.85,
            }}
          >
            {data.icon}
          </div>
          <h3 
            className={`font-medium text-base mb-2 tracking-tight ${
              isDark ? 'text-white/90' : 'text-black/85'
            }`}
          >
            {data.label}
          </h3>
          <span 
            className={`text-[11px] font-light tracking-wide ${
              isDark ? 'text-white/35' : 'text-black/35'
            }`}
          >
            {data.toolCount} tools
          </span>
        </div>
        
        {/* Minimal expand indicator */}
        <div 
          className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
            data.expanded ? 'rotate-180' : ''
          }`}
          style={{ 
            background: isDark 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.06)',
          }}
        >
          <ChevronDown 
            className={`w-3 h-3 ${isDark ? 'text-white/50' : 'text-black/40'}`} 
            strokeWidth={1.5} 
          />
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

export default memo(CategoryNode);
