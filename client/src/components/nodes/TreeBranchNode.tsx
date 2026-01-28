/**
 * TreeBranchNode - Branch node for categories/subcategories
 * Design: Organic branch shape, clickable to navigate deeper
 */

import { Handle, Position } from '@xyflow/react';
import { memo, useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface TreeBranchNodeData {
  label: string;
  icon?: string;
  toolCount: number;
  isDark?: boolean;
  isMain?: boolean;
  isSubcategory?: boolean;
  onClick?: () => void;
}

function TreeBranchNode({ data }: { data: TreeBranchNodeData }) {
  const isDark = data.isDark !== false;
  const [isHovered, setIsHovered] = useState(false);
  const isClickable = !!data.onClick;
  
  return (
    <div 
      className={`tree-branch-node ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={data.onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Bottom} className="opacity-0" />
      
      <div 
        className={`relative rounded-2xl transition-all duration-500 ease-out ${
          isHovered && isClickable ? 'scale-105' : ''
        } ${data.isMain ? 'p-8' : 'p-5'}`}
        style={{ 
          background: isDark 
            ? data.isMain
              ? 'linear-gradient(135deg, rgba(70, 55, 35, 0.5), rgba(50, 40, 25, 0.6))'
              : `rgba(60, 48, 30, ${isHovered ? 0.4 : 0.25})`
            : data.isMain
              ? 'linear-gradient(135deg, rgba(140, 110, 70, 0.2), rgba(120, 95, 60, 0.3))'
              : `rgba(120, 95, 60, ${isHovered ? 0.15 : 0.08})`,
          border: isDark 
            ? `1.5px solid rgba(140, 110, 60, ${isHovered ? 0.4 : 0.2})`
            : `1.5px solid rgba(100, 80, 50, ${isHovered ? 0.25 : 0.12})`,
          boxShadow: isHovered && isClickable
            ? isDark 
              ? '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(140, 110, 60, 0.15)'
              : '0 10px 30px rgba(100, 80, 50, 0.12)'
            : 'none',
          minWidth: data.isMain ? '200px' : data.isSubcategory ? '150px' : '180px',
        }}
      >
        {/* Subtle wood grain texture */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              ${90 + Math.random() * 20}deg,
              transparent 0px,
              transparent 3px,
              ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'} 4px,
              transparent 5px
            )`,
          }}
        />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          {data.icon && (
            <div className={`mb-3 ${data.isMain ? 'text-4xl' : 'text-3xl'}`}>
              {data.icon}
            </div>
          )}
          
          <h3 className={`font-normal tracking-wide ${
            data.isMain ? 'text-lg' : data.isSubcategory ? 'text-sm' : 'text-base'
          } ${isDark ? 'text-amber-100/90' : 'text-amber-900/85'}`}>
            {data.label}
          </h3>
          
          <div className={`flex items-center gap-1 mt-2 ${
            isDark ? 'text-amber-100/40' : 'text-amber-900/40'
          }`}>
            <span className={`text-xs font-light`}>
              {data.toolCount} {data.isSubcategory ? 'tools' : 'items'}
            </span>
            {isClickable && (
              <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${
                isHovered ? 'translate-x-0.5' : ''
              }`} strokeWidth={1.5} />
            )}
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Top} className="opacity-0" />
    </div>
  );
}

export default memo(TreeBranchNode);
