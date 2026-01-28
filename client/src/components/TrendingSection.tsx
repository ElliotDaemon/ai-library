/**
 * TrendingSection - Displays trending AI tools in the real world
 * Shows curated hot picks and newly released tools that are making waves
 */

import { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  ExternalLink, 
  Heart,
  Flame,
  Zap,
  Star,
  X,
  Rocket,
  Award
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  url: string;
  description?: string;
  pricing?: string;
  isGem?: boolean;
  isNew?: boolean;
  category?: string;
  subcategory?: string;
}

interface TrendingSectionProps {
  isDark: boolean;
  isOpen: boolean;
  onClose: () => void;
  allTools: Tool[];
  favoriteIds: Set<string>;
  onToggleFavorite: (tool: Tool) => void;
  onToolClick: (tool: Tool) => void;
}

// Curated list of tools that are currently trending in the AI world
// Updated regularly based on Product Hunt, X.com, and industry news
const TRENDING_TOOL_NAMES = [
  // Hot right now - January 2026
  'Claude',
  'ChatGPT',
  'Cursor',
  'v0',
  'Lovable',
  'Bolt.new',
  'Manus',
  'Midjourney',
  'Grok',
  'Sora',
  // Rising stars
  'Lovart.ai',
  'Flames.blue',
  'Krea.ai',
  'Kling',
  'Pika Labs',
  'Runway',
  'ElevenLabs',
  'Suno',
  'Udio',
  'NotebookLM',
];

// Newly released tools making waves
const NEW_RELEASES = [
  'Manus',
  'Lovart.ai',
  'Flames.blue',
  'Dreamina',
  'MGX',
  'Sider',
  'Tanka',
  'VidAU',
  'Pippit AI',
  'Caffeine.AI',
  'Napkin AI',
  'Remotion AI',
  'Remotion',
  'Moltbot',
  'Framer AI',
];

export default function TrendingSection({
  isDark,
  isOpen,
  onClose,
  allTools,
  favoriteIds,
  onToggleFavorite,
  onToolClick,
}: TrendingSectionProps) {
  const [activeTab, setActiveTab] = useState<'hot' | 'rising' | 'new'>('hot');
  
  // Get trending tools from our curated list
  const hotTools = TRENDING_TOOL_NAMES.slice(0, 10)
    .map(name => allTools.find(t => t.name.toLowerCase() === name.toLowerCase()))
    .filter((t): t is Tool => t !== undefined);
    
  const risingTools = TRENDING_TOOL_NAMES.slice(10, 20)
    .map(name => allTools.find(t => t.name.toLowerCase() === name.toLowerCase()))
    .filter((t): t is Tool => t !== undefined);
  
  // Get new releases
  const newTools = NEW_RELEASES
    .map(name => allTools.find(t => t.name.toLowerCase() === name.toLowerCase()))
    .filter((t): t is Tool => t !== undefined);

  if (!isOpen) return null;

  const renderToolCard = (tool: Tool, index: number, type: 'hot' | 'rising' | 'new') => {
    const isFavorite = favoriteIds.has(tool.id);
    
    return (
      <div
        key={tool.id}
        className={`group p-4 rounded-xl transition-all cursor-pointer ${
          isDark 
            ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20' 
            : 'bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg'
        }`}
        onClick={() => {
          onToolClick(tool);
          window.open(tool.url, '_blank');
        }}
      >
        <div className="flex items-center gap-4">
          {/* Rank/Badge */}
          {type === 'hot' && (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              index === 0 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-500/30'
                : index === 1
                ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white'
                : index === 2
                ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white'
                : isDark
                ? 'bg-white/10 text-white/60'
                : 'bg-slate-200 text-slate-600'
            }`}>
              {index + 1}
            </div>
          )}
          {type === 'rising' && (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600'
            }`}>
              <Rocket className="w-4 h-4" />
            </div>
          )}
          {type === 'new' && (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
            }`}>
              <Sparkles className="w-4 h-4" />
            </div>
          )}

          {/* Favicon */}
          <img
            src={`https://www.google.com/s2/favicons?domain=${new URL(tool.url).hostname}&sz=32`}
            alt=""
            className="w-8 h-8 rounded-lg bg-white/10"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {tool.name}
              </h3>
              {tool.isGem && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                }`}>
                  GEM
                </span>
              )}
            </div>
            <p className={`text-sm truncate ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              {tool.description || tool.category || 'AI Tool'}
            </p>
          </div>

          {/* Pricing */}
          {tool.pricing && (
            <div className={`hidden sm:block px-2 py-1 rounded-lg text-xs ${
              tool.pricing.toLowerCase().includes('free')
                ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                : isDark ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-600'
            }`}>
              {tool.pricing}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(tool);
              }}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite
                  ? 'text-red-400 bg-red-500/20'
                  : isDark
                  ? 'text-white/40 hover:text-red-400 hover:bg-white/10'
                  : 'text-slate-400 hover:text-red-400 hover:bg-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <div className={`p-2 rounded-lg ${
              isDark
                ? 'text-white/40 group-hover:text-white'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}>
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden ${
        isDark 
          ? 'bg-slate-900/95 border border-white/10' 
          : 'bg-white/95 border border-slate-200'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 py-4 border-b ${
          isDark ? 'border-white/10 bg-slate-900/95' : 'border-slate-200 bg-white/95'
        } backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-gradient-to-br from-orange-400 to-red-400'
              }`}>
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Trending Now
                </h2>
                <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                  The hottest AI tools making waves right now
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-white/10 text-white/60 hover:text-white' 
                  : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('hot')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'hot'
                  ? isDark 
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-orange-100 text-orange-600 border border-orange-200'
                  : isDark
                    ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Flame className="w-4 h-4" />
              Hot Right Now
              <span className={`px-1.5 py-0.5 rounded text-xs ${
                activeTab === 'hot'
                  ? isDark ? 'bg-orange-500/30' : 'bg-orange-200'
                  : isDark ? 'bg-white/10' : 'bg-slate-200'
              }`}>
                {hotTools.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('rising')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'rising'
                  ? isDark 
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'bg-violet-100 text-violet-600 border border-violet-200'
                  : isDark
                    ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Rocket className="w-4 h-4" />
              Rising Stars
              <span className={`px-1.5 py-0.5 rounded text-xs ${
                activeTab === 'rising'
                  ? isDark ? 'bg-violet-500/30' : 'bg-violet-200'
                  : isDark ? 'bg-white/10' : 'bg-slate-200'
              }`}>
                {risingTools.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'new'
                  ? isDark 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                  : isDark
                    ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              New Releases
              <span className={`px-1.5 py-0.5 rounded text-xs ${
                activeTab === 'new'
                  ? isDark ? 'bg-emerald-500/30' : 'bg-emerald-200'
                  : isDark ? 'bg-white/10' : 'bg-slate-200'
              }`}>
                {newTools.length}
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-160px)] p-4">
          {activeTab === 'hot' && (
            <div className="space-y-3">
              <div className={`flex items-center gap-2 mb-4 px-2 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                <Award className="w-4 h-4" />
                <span className="text-sm">Top AI tools everyone is talking about</span>
              </div>
              {hotTools.length === 0 ? (
                <div className="text-center py-12">
                  <Flame className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
                  <p className={isDark ? 'text-white/50' : 'text-slate-500'}>
                    Loading trending tools...
                  </p>
                </div>
              ) : (
                hotTools.map((tool, index) => renderToolCard(tool, index, 'hot'))
              )}
            </div>
          )}

          {activeTab === 'rising' && (
            <div className="space-y-3">
              <div className={`flex items-center gap-2 mb-4 px-2 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                <Zap className="w-4 h-4" />
                <span className="text-sm">Up-and-coming tools gaining momentum</span>
              </div>
              {risingTools.length === 0 ? (
                <div className="text-center py-12">
                  <Rocket className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
                  <p className={isDark ? 'text-white/50' : 'text-slate-500'}>
                    Loading rising stars...
                  </p>
                </div>
              ) : (
                risingTools.map((tool, index) => renderToolCard(tool, index, 'rising'))
              )}
            </div>
          )}

          {activeTab === 'new' && (
            <div className="space-y-3">
              <div className={`flex items-center gap-2 mb-4 px-2 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                <Star className="w-4 h-4" />
                <span className="text-sm">Recently launched tools you shouldn't miss</span>
              </div>
              {newTools.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
                  <p className={isDark ? 'text-white/50' : 'text-slate-500'}>
                    No new releases to show
                  </p>
                </div>
              ) : (
                newTools.map((tool, index) => renderToolCard(tool, index, 'new'))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 px-6 py-3 border-t ${
          isDark ? 'border-white/10 bg-slate-900/95' : 'border-slate-200 bg-white/95'
        } backdrop-blur-xl`}>
          <p className={`text-xs text-center ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            Curated based on Product Hunt, X.com, and industry buzz • Updated regularly
          </p>
        </div>
      </div>
    </div>
  );
}
