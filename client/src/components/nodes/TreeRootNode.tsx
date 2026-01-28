/**
 * TreeRootNode - The trunk/root of the World Tree
 * Design: Central hub, looks like the base of a massive tree
 */

import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

interface TreeRootNodeData {
  totalTools: number;
  totalCategories: number;
  isDark?: boolean;
}

function TreeRootNode({ data }: { data: TreeRootNodeData }) {
  const isDark = data.isDark !== false;
  
  return (
    <div className="tree-root-node">
      <Handle type="source" position={Position.Top} className="opacity-0" />
      
      <div 
        className="relative rounded-[2rem] p-10 cursor-default"
        style={{ 
          background: isDark 
            ? 'linear-gradient(180deg, rgba(60, 45, 30, 0.4), rgba(40, 30, 20, 0.6))'
            : 'linear-gradient(180deg, rgba(120, 90, 60, 0.15), rgba(90, 70, 50, 0.25))',
          border: isDark 
            ? '2px solid rgba(120, 90, 50, 0.3)'
            : '2px solid rgba(100, 80, 50, 0.2)',
          boxShadow: isDark 
            ? '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 -10px 30px rgba(60, 45, 30, 0.3)'
            : '0 15px 40px rgba(80, 60, 40, 0.15)',
          minWidth: '280px',
        }}
      >
        {/* Tree ring texture effect */}
        <div 
          className="absolute inset-4 rounded-[1.5rem] opacity-20"
          style={{
            background: isDark
              ? 'repeating-radial-gradient(circle at center, transparent 0px, transparent 8px, rgba(255,255,255,0.03) 9px, transparent 10px)'
              : 'repeating-radial-gradient(circle at center, transparent 0px, transparent 8px, rgba(0,0,0,0.02) 9px, transparent 10px)',
          }}
        />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Tree icon */}
          <div className="text-5xl mb-4">🌳</div>
          
          <h1 className={`text-2xl font-light tracking-[0.1em] uppercase mb-2 ${
            isDark ? 'text-amber-100/90' : 'text-amber-900/80'
          }`}>
            AI Library
          </h1>
          
          <p className={`text-xs font-light tracking-widest uppercase mb-6 ${
            isDark ? 'text-amber-100/40' : 'text-amber-900/40'
          }`}>
            The World Tree of AI
          </p>
          
          <div className="flex gap-8">
            <div className="text-center">
              <div className={`text-3xl font-extralight tabular-nums ${
                isDark ? 'text-amber-100/80' : 'text-amber-900/70'
              }`}>
                {data.totalTools}
              </div>
              <div className={`text-[10px] font-light tracking-widest uppercase mt-1 ${
                isDark ? 'text-amber-100/30' : 'text-amber-900/30'
              }`}>
                Tools
              </div>
            </div>
            
            <div className={`w-px ${isDark ? 'bg-amber-100/15' : 'bg-amber-900/15'}`} />
            
            <div className="text-center">
              <div className={`text-3xl font-extralight tabular-nums ${
                isDark ? 'text-amber-100/80' : 'text-amber-900/70'
              }`}>
                {data.totalCategories}
              </div>
              <div className={`text-[10px] font-light tracking-widest uppercase mt-1 ${
                isDark ? 'text-amber-100/30' : 'text-amber-900/30'
              }`}>
                Branches
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

export default memo(TreeRootNode);
