/**
 * ToolNode - Minimal, elegant tool card
 * Design: Clean, futuristic, Apple-inspired
 */

import { Handle, Position } from '@xyflow/react';
import { memo, useState } from 'react';
import { ExternalLink, Sparkles, Star, Heart, ArrowUpRight } from 'lucide-react';

interface Tool {
  id?: string;
  name: string;
  url: string;
  description: string;
  pricing: string;
  featured?: boolean;
  gem?: boolean;
  recentlyAdded?: boolean;
  addedDate?: string;
  category?: string;
}

interface ToolNodeData {
  tool: Tool;
  color: string;
  isHighlighted?: boolean;
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

function ToolNode({ data }: { data: ToolNodeData }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { tool, color, isHighlighted, isDark = true, isFavorited = false, onFavoriteToggle } = data;
  const faviconUrl = getFaviconUrl(tool.url);
  const isNew = tool.recentlyAdded || false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle && tool.id) {
      onFavoriteToggle(tool.id, tool.name, tool.url, tool.category);
    }
  };
  
  return (
    <div 
      className={`tool-node ${isHighlighted ? 'search-highlight' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div className="relative">
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div 
            className={`relative rounded-xl transition-all duration-500 ease-out overflow-hidden ${
              isHovered ? 'scale-[1.02]' : ''
            }`}
            style={{ 
              background: isDark
                ? `rgba(255, 255, 255, ${isHovered ? 0.05 : 0.025})`
                : `rgba(0, 0, 0, ${isHovered ? 0.03 : 0.015})`,
              border: `1px solid ${isDark 
                ? `rgba(255, 255, 255, ${isHovered ? 0.1 : 0.05})` 
                : `rgba(0, 0, 0, ${isHovered ? 0.06 : 0.03})`}`,
              minWidth: isHovered ? '260px' : '160px',
              padding: isHovered ? '16px' : '12px',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Subtle badges */}
            <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
              {isNew && (
                <span className={`text-[9px] font-medium tracking-wider uppercase ${
                  isDark ? 'text-emerald-400/70' : 'text-emerald-600/70'
                }`}>
                  New
                </span>
              )}
              {tool.featured && (
                <Star className={`w-3 h-3 ${isDark ? 'text-amber-400/60' : 'text-amber-500/60'}`} strokeWidth={1.5} />
              )}
              {tool.gem && !tool.featured && (
                <Sparkles className={`w-3 h-3 ${isDark ? 'text-violet-400/60' : 'text-violet-500/60'}`} strokeWidth={1.5} />
              )}
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-1.5">
                {/* Favicon */}
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  }}
                >
                  {faviconUrl && !imgError ? (
                    <img 
                      src={faviconUrl} 
                      alt={tool.name}
                      className="w-4 h-4 object-contain opacity-70"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-white/30' : 'bg-black/20'}`} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h5 
                    className={`font-normal text-[13px] truncate ${
                      isDark ? 'text-white/85' : 'text-black/80'
                    }`}
                  >
                    {tool.name}
                  </h5>
                </div>

                {isHovered && (
                  <ArrowUpRight className={`w-3.5 h-3.5 flex-shrink-0 ${
                    isDark ? 'text-white/40' : 'text-black/30'
                  }`} strokeWidth={1.5} />
                )}
              </div>
              
              {!isHovered && (
                <span className={`text-[10px] font-light block ${
                  isDark ? 'text-white/30' : 'text-black/25'
                }`}>
                  {tool.pricing}
                </span>
              )}
              
              {isHovered && (
                <div className="animate-in fade-in duration-300 mt-2">
                  <p className={`text-[11px] font-light mb-2.5 line-clamp-2 leading-relaxed ${
                    isDark ? 'text-white/50' : 'text-black/45'
                  }`}>
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span 
                      className={`text-[10px] font-light ${
                        isDark ? 'text-white/35' : 'text-black/30'
                      }`}
                    >
                      {tool.pricing}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </a>

        {/* Favorite Button - Minimal */}
        {isHovered && onFavoriteToggle && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute -top-1.5 -left-1.5 z-30 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
              isFavorited
                ? isDark 
                  ? 'bg-white/15 text-rose-400' 
                  : 'bg-black/08 text-rose-500'
                : isDark
                  ? 'bg-white/08 text-white/30 hover:text-rose-400'
                  : 'bg-black/04 text-black/25 hover:text-rose-500'
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
      
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

export default memo(ToolNode);
