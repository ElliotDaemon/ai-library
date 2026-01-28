/**
 * TreeLeafNode - Leaf node for individual tools
 * Design: Organic leaf shape, opens tool on click
 */

import { Handle, Position } from '@xyflow/react';
import { memo, useState } from 'react';
import { ExternalLink, Heart, Sparkles, Star } from 'lucide-react';

interface Tool {
  id?: string;
  name: string;
  url: string;
  description: string;
  pricing: string;
  featured?: boolean;
  gem?: boolean;
  recentlyAdded?: boolean;
  category?: string;
}

interface TreeLeafNodeData {
  tool: Tool;
  isDark?: boolean;
  isFavorited?: boolean;
  onFavoriteToggle?: (toolId: string, toolName: string, toolUrl: string, category?: string) => void;
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return '';
  }
}

function TreeLeafNode({ data }: { data: TreeLeafNodeData }) {
  const isDark = data.isDark !== false;
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { tool, isFavorited = false, onFavoriteToggle } = data;
  const faviconUrl = getFaviconUrl(tool.url);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle && tool.id) {
      onFavoriteToggle(tool.id, tool.name, tool.url, tool.category);
    }
  };
  
  return (
    <div 
      className="tree-leaf-node cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Bottom} className="opacity-0" />
      
      <div className="relative">
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div 
            className={`relative rounded-xl transition-all duration-500 ease-out overflow-hidden ${
              isHovered ? 'scale-105' : ''
            }`}
            style={{ 
              background: isDark 
                ? `rgba(45, 65, 35, ${isHovered ? 0.5 : 0.3})`
                : `rgba(80, 120, 60, ${isHovered ? 0.15 : 0.08})`,
              border: isDark 
                ? `1px solid rgba(90, 130, 70, ${isHovered ? 0.4 : 0.2})`
                : `1px solid rgba(70, 100, 50, ${isHovered ? 0.25 : 0.12})`,
              boxShadow: isHovered
                ? isDark 
                  ? '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(90, 130, 70, 0.1)'
                  : '0 8px 24px rgba(70, 100, 50, 0.1)'
                : 'none',
              padding: isHovered ? '14px' : '12px',
              minWidth: isHovered ? '240px' : '160px',
            }}
          >
            {/* Badges */}
            <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
              {tool.recentlyAdded && (
                <span className={`text-[9px] font-medium tracking-wider uppercase ${
                  isDark ? 'text-emerald-300/70' : 'text-emerald-700/70'
                }`}>
                  New
                </span>
              )}
              {tool.featured && (
                <Star className={`w-3 h-3 ${isDark ? 'text-amber-300/60' : 'text-amber-600/60'}`} strokeWidth={1.5} />
              )}
              {tool.gem && !tool.featured && (
                <Sparkles className={`w-3 h-3 ${isDark ? 'text-violet-300/60' : 'text-violet-600/60'}`} strokeWidth={1.5} />
              )}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-1">
                {/* Favicon */}
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                  }}
                >
                  {faviconUrl && !imgError ? (
                    <img 
                      src={faviconUrl} 
                      alt={tool.name}
                      className="w-4 h-4 object-contain opacity-80"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-green-300/40' : 'bg-green-700/30'}`} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h5 className={`font-normal text-sm truncate ${
                    isDark ? 'text-green-100/90' : 'text-green-900/85'
                  }`}>
                    {tool.name}
                  </h5>
                </div>

                {isHovered && (
                  <ExternalLink className={`w-3.5 h-3.5 flex-shrink-0 ${
                    isDark ? 'text-green-100/40' : 'text-green-900/35'
                  }`} strokeWidth={1.5} />
                )}
              </div>
              
              {!isHovered && (
                <span className={`text-[10px] font-light block ${
                  isDark ? 'text-green-100/35' : 'text-green-900/30'
                }`}>
                  {tool.pricing}
                </span>
              )}
              
              {isHovered && (
                <div className="animate-in fade-in duration-200 mt-2">
                  <p className={`text-[11px] font-light mb-2 line-clamp-2 leading-relaxed ${
                    isDark ? 'text-green-100/55' : 'text-green-900/50'
                  }`}>
                    {tool.description}
                  </p>
                  <span className={`text-[10px] font-light ${
                    isDark ? 'text-green-100/40' : 'text-green-900/35'
                  }`}>
                    {tool.pricing}
                  </span>
                </div>
              )}
            </div>
          </div>
        </a>

        {/* Favorite Button */}
        {isHovered && onFavoriteToggle && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute -top-1.5 -left-1.5 z-20 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              isFavorited
                ? isDark 
                  ? 'bg-green-900/50 text-rose-300' 
                  : 'bg-green-100 text-rose-500'
                : isDark
                  ? 'bg-green-900/30 text-green-100/40 hover:text-rose-300'
                  : 'bg-green-100/80 text-green-900/30 hover:text-rose-500'
            }`}
          >
            <Heart 
              className="w-3 h-3" 
              strokeWidth={1.5}
              fill={isFavorited ? 'currentColor' : 'none'}
            />
          </button>
        )}
      </div>
      
      <Handle type="source" position={Position.Top} className="opacity-0" />
    </div>
  );
}

export default memo(TreeLeafNode);
