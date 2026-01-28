/**
 * SubcategoryNode - Minimal, elegant subcategory node
 * Design: Clean, futuristic
 */

import { Handle, Position } from '@xyflow/react';
import { memo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SubcategoryNodeData {
  label: string;
  color: string;
  toolCount: number;
  expanded?: boolean;
  isDark?: boolean;
  onClick?: () => void;
}

function SubcategoryNode({ data }: { data: SubcategoryNodeData }) {
  const isDark = data.isDark !== false;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="subcategory-node cursor-pointer"
      onClick={data.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div 
        className={`relative rounded-xl p-4 transition-all duration-500 ease-out ${
          isHovered ? 'scale-[1.02]' : ''
        }`}
        style={{ 
          background: isDark 
            ? `rgba(255, 255, 255, ${data.expanded ? 0.05 : 0.025})`
            : `rgba(0, 0, 0, ${data.expanded ? 0.03 : 0.015})`,
          border: `1px solid ${isDark 
            ? `rgba(255, 255, 255, ${data.expanded ? 0.1 : 0.05})` 
            : `rgba(0, 0, 0, ${data.expanded ? 0.06 : 0.03})`}`,
          minWidth: '140px',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <h4 
            className={`font-normal text-[13px] mb-1.5 ${
              isDark ? 'text-white/80' : 'text-black/75'
            }`}
          >
            {data.label}
          </h4>
          <span 
            className={`text-[10px] font-light tracking-wide ${
              isDark ? 'text-white/30' : 'text-black/30'
            }`}
          >
            {data.toolCount}
          </span>
        </div>
        
        {/* Minimal expand indicator */}
        {data.toolCount > 0 && (
          <div 
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-500 ${
              data.expanded ? 'rotate-180' : ''
            }`}
            style={{ 
              background: isDark 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.05)',
            }}
          >
            <ChevronDown 
              className={`w-2.5 h-2.5 ${isDark ? 'text-white/40' : 'text-black/35'}`} 
              strokeWidth={1.5} 
            />
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

export default memo(SubcategoryNode);
