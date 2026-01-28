/**
 * WorldTreeView - Beautiful tree visualization with hotspot-based navigation
 * 
 * Design: Full-screen tree image with clickable category hotspots
 * Click a category → Smooth transition to tool grid
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ExternalLink, 
  Heart, 
  Sparkles,
  Plus,
  Shield,
  Search,
  Flame,
  Home
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import SubmitToolModal from './SubmitToolModal';
import FavoritesPanel from './FavoritesPanel';
import TrendingSection from './TrendingSection';

// ============================================================================
// Types
// ============================================================================

interface Tool {
  id: string;
  name: string;
  url: string;
  description?: string;
  pricing?: string;
  featured?: boolean;
  gem?: boolean;
  category?: string;
  subcategory?: string;
}

interface Subcategory {
  id: string;
  name: string;
  tools: Tool[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
}

interface MindmapData {
  name: string;
  categories: Category[];
  stats: {
    totalTools: number;
    totalCategories: number;
    hiddenGems: number;
  };
}

interface WorldTreeViewProps {
  isDark: boolean;
  onBackToLanding?: () => void;
}

// ============================================================================
// Hotspot positions for each category (percentage-based for responsiveness)
// Mapped to the Midjourney tree branches
// ============================================================================

const CATEGORY_HOTSPOTS: Record<string, { x: number; y: number }> = {
  // Upper left branches (outer to inner)
  'assistants':   { x: 8,  y: 28 },   // Far left upper branch
  'code':         { x: 18, y: 18 },   // Left upper-mid branch
  'image':        { x: 28, y: 11 },   // Left mid branch
  'video':        { x: 38, y: 6 },    // Left inner branch
  
  // Top center branches
  'audio':        { x: 46, y: 3 },    // Center-left top
  'writing':      { x: 54, y: 3 },    // Center-right top
  
  // Upper right branches (inner to outer)
  'research':     { x: 62, y: 6 },    // Right inner branch
  'productivity': { x: 72, y: 11 },   // Right mid branch
  'business':     { x: 82, y: 18 },   // Right upper-mid branch
  'nocode':       { x: 92, y: 28 },   // Far right upper branch
  
  // Middle branches
  'data':         { x: 12, y: 42 },   // Left mid branch
  'finance':      { x: 24, y: 35 },   // Left lower-mid
  'education':    { x: 76, y: 35 },   // Right lower-mid
  'health':       { x: 88, y: 42 },   // Right mid branch
  
  // Lower branches
  '3d-gaming':    { x: 18, y: 55 },   // Left lower
  'security':     { x: 35, y: 50 },   // Left base
  'blockchain':   { x: 65, y: 50 },   // Right base
  'creative':     { x: 82, y: 55 },   // Right lower
};

// Fallback for any unmapped categories
const getHotspotPosition = (categoryId: string, index: number, total: number) => {
  if (CATEGORY_HOTSPOTS[categoryId]) {
    return CATEGORY_HOTSPOTS[categoryId];
  }
  // Distribute along the tree canopy
  const angle = (Math.PI * 0.15) + (Math.PI * 0.7 * index) / (total - 1);
  return {
    x: 50 - Math.cos(angle) * 42,
    y: 35 - Math.sin(angle) * 30,
  };
};

// ============================================================================
// Category Hotspot Component
// ============================================================================

interface CategoryHotspotProps {
  category: Category;
  position: { x: number; y: number };
  onClick: () => void;
  isDark: boolean;
  toolCount: number;
}

function CategoryHotspot({ category, position, onClick, isDark, toolCount }: CategoryHotspotProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 + Math.random() * 0.8, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="absolute group"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Outer glow */}
      <div className="absolute -inset-4 rounded-full bg-cyan-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Inner glow ring */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400/30 to-blue-500/30 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Main button */}
      <div className="relative flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl backdrop-blur-lg border border-white/30 bg-slate-900/60 hover:bg-slate-800/70 hover:border-cyan-400/50 transition-all duration-300 shadow-lg shadow-black/20">
        {/* Icon */}
        <span className="text-2xl drop-shadow-lg">{category.icon}</span>
        
        {/* Name - truncated for long names */}
        <span className="text-sm font-medium text-white whitespace-nowrap max-w-[120px] truncate">
          {category.name.replace(' & ', ' & ')}
        </span>
        
        {/* Tool count badge */}
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-cyan-200/80 font-medium">
          {toolCount} tools
        </span>
      </div>
      
      {/* Subtle pulse ring */}
      <div className="absolute -inset-2 rounded-2xl border border-cyan-400/30 animate-ping opacity-0 group-hover:opacity-40" 
           style={{ animationDuration: '2s' }} />
    </motion.button>
  );
}

// ============================================================================
// Tool Card Component
// ============================================================================

interface ToolCardProps {
  tool: Tool;
  isDark: boolean;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
  index: number;
}

function ToolCard({ tool, isDark, isFavorited, onFavoriteToggle, index }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`group relative p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
        isDark 
          ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Favicon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${
          isDark ? 'bg-white/10' : 'bg-slate-100'
        }`}>
          <img
            src={`https://www.google.com/s2/favicons?domain=${new URL(tool.url).hostname}&sz=32`}
            alt=""
            className="w-6 h-6"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236b7280"><rect width="24" height="24" rx="4"/></svg>';
            }}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {tool.name}
            </h3>
            {tool.gem && (
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            )}
          </div>
          
          {tool.description && (
            <p className={`text-sm mt-1 line-clamp-2 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              {tool.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            {tool.pricing && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                tool.pricing.toLowerCase().includes('free')
                  ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                  : isDark ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-600'
              }`}>
                {tool.pricing}
              </span>
            )}
            {tool.subcategory && (
              <span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                {tool.subcategory}
              </span>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className={`p-2 rounded-lg transition-colors ${
              isFavorited
                ? 'text-red-400 bg-red-500/20'
                : isDark
                ? 'text-white/40 hover:text-red-400 hover:bg-white/10'
                : 'text-slate-400 hover:text-red-400 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'text-white/40 hover:text-white hover:bg-white/10'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Category Detail View
// ============================================================================

interface CategoryDetailViewProps {
  category: Category;
  isDark: boolean;
  onBack: () => void;
  favoriteIds: Set<string>;
  onFavoriteToggle: (tool: Tool) => void;
}

function CategoryDetailView({ category, isDark, onBack, favoriteIds, onFavoriteToggle }: CategoryDetailViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  
  // Flatten all tools from subcategories
  const allTools = useMemo(() => {
    const tools: Tool[] = [];
    category.subcategories.forEach(sub => {
      sub.tools.forEach(tool => {
        tools.push({
          ...tool,
          id: tool.id || `${category.id}-${sub.id}-${tool.name}`,
          subcategory: sub.name,
        });
      });
    });
    return tools;
  }, [category]);
  
  // Filter tools
  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      const matchesSearch = !searchQuery || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubcategory = !selectedSubcategory || tool.subcategory === selectedSubcategory;
      return matchesSearch && matchesSubcategory;
    });
  }, [allTools, searchQuery, selectedSubcategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Background */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-black' 
          : 'bg-gradient-to-b from-slate-50 via-white to-slate-100'
      }`} />
      
      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 py-4 backdrop-blur-xl border-b ${
          isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-slate-200'
        }`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onBack}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Tree</span>
              </button>
              
              <div className="flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                <div>
                  <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {category.name}
                  </h1>
                  <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    {allTools.length} tools across {category.subcategories.length} subcategories
                  </p>
                </div>
              </div>
              
              <div className="w-32" /> {/* Spacer for centering */}
            </div>
            
            {/* Search & Filters */}
            <div className="flex items-center gap-3">
              <div className={`flex-1 relative`}>
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? 'text-white/40' : 'text-slate-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/20' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-300'
                  }`}
                />
              </div>
              
              {/* Subcategory pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                    !selectedSubcategory
                      ? isDark 
                        ? 'bg-white text-black' 
                        : 'bg-slate-900 text-white'
                      : isDark
                        ? 'bg-white/10 text-white/70 hover:bg-white/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                {category.subcategories.slice(0, 5).map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.name)}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                      selectedSubcategory === sub.name
                        ? isDark 
                          ? 'bg-white text-black' 
                          : 'bg-slate-900 text-white'
                        : isDark
                          ? 'bg-white/10 text-white/70 hover:bg-white/20'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tools Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool, index) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isDark={isDark}
                  isFavorited={favoriteIds.has(tool.id)}
                  onFavoriteToggle={() => onFavoriteToggle(tool)}
                  index={index}
                />
              ))}
            </div>
            
            {filteredTools.length === 0 && (
              <div className="text-center py-20">
                <Search className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
                <p className={isDark ? 'text-white/50' : 'text-slate-500'}>
                  No tools found matching your search
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Main WorldTreeView Component
// ============================================================================

export default function WorldTreeView({ isDark, onBackToLanding }: WorldTreeViewProps) {
  const [data, setData] = useState<MindmapData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isFavoritesPanelOpen, setIsFavoritesPanelOpen] = useState(false);
  const [isTrendingOpen, setIsTrendingOpen] = useState(false);
  
  // Favorites
  const { data: favorites, refetch: refetchFavorites } = trpc.favorites.list.useQuery(undefined, {
    staleTime: 30000,
  });
  const addFavoriteMutation = trpc.favorites.add.useMutation({
    onSuccess: () => refetchFavorites(),
  });
  const removeFavoriteMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => refetchFavorites(),
  });
  
  const favoriteIds = useMemo(() => new Set(favorites?.map(f => f.toolId) || []), [favorites]);
  
  const handleFavoriteToggle = (tool: Tool) => {
    if (favoriteIds.has(tool.id)) {
      removeFavoriteMutation.mutate({ toolId: tool.id });
    } else {
      addFavoriteMutation.mutate({ 
        toolId: tool.id, 
        toolName: tool.name, 
        toolUrl: tool.url, 
        category: tool.category 
      });
    }
  };
  
  const categoryNames = useMemo(() => data?.categories.map(c => c.name) || [], [data]);
  
  // Flatten all tools for TrendingSection
  const allTools = useMemo(() => {
    if (!data) return [];
    const tools: Tool[] = [];
    data.categories.forEach(cat => {
      cat.subcategories.forEach(sub => {
        sub.tools.forEach(tool => {
          tools.push({
            ...tool,
            id: (tool as Tool).id || `${cat.id}-${sub.id}-${tool.name.replace(/\s+/g, '-').toLowerCase()}`,
            category: cat.name,
            subcategory: sub.name,
          });
        });
      });
    });
    return tools;
  }, [data]);

  // Load data
  useEffect(() => {
    fetch('/mindmap_data.json')
      .then(res => res.json())
      .then((rawData: MindmapData) => {
        // Ensure IDs
        rawData.categories.forEach(cat => {
          cat.subcategories.forEach(sub => {
            sub.tools.forEach(tool => {
              (tool as Tool).id = `${cat.id}-${sub.id}-${tool.name.replace(/\s+/g, '-').toLowerCase()}`;
              (tool as Tool).category = cat.name;
            });
          });
        });
        setData(rawData);
      })
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className={`animate-pulse ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
          Loading World Tree...
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      {/* Tree Background */}
      <div className="absolute inset-0">
        {/* World Tree Image */}
        <img 
          src="/world-tree.png" 
          alt="World Tree"
          className="w-full h-full object-cover"
        />
        
        {/* Subtle overlay for better text contrast */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-t from-black/60 via-transparent to-black/30' 
            : 'bg-gradient-to-t from-white/40 via-transparent to-white/20'
        }`} />
        
        {/* Ambient floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/40"
              initial={{ 
                left: `${Math.random() * 100}%`,
                top: '110%',
                opacity: 0,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{ 
                top: '-10%',
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 15 + Math.random() * 20,
                repeat: Infinity,
                delay: Math.random() * 15,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed top-6 left-6 z-40 flex items-center gap-2">
        {onBackToLanding && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onBackToLanding}
            className="p-2.5 rounded-full backdrop-blur-xl bg-slate-900/50 border border-white/10 hover:bg-slate-800/60 hover:border-cyan-400/30 text-white/60 hover:text-white transition-all duration-300"
            title="Back to Landing"
          >
            <Home className="w-4 h-4" />
          </motion.button>
        )}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="px-5 py-2.5 rounded-full backdrop-blur-xl bg-slate-900/50 border border-white/10"
        >
          <span className="font-light text-white/90 tracking-wide">AI Library</span>
          <span className="ml-2 text-cyan-300/60 text-sm">
            {data.stats.totalTools} tools
          </span>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed top-6 right-6 z-40 flex items-center gap-2"
      >
        <button
          onClick={() => setIsTrendingOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-xl bg-slate-900/50 border border-white/10 hover:bg-slate-800/60 hover:border-orange-400/30 text-white/80 hover:text-white transition-all duration-300"
        >
          <Flame className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Trending</span>
        </button>
        
        <button
          onClick={() => setIsFavoritesPanelOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-xl bg-slate-900/50 border border-white/10 hover:bg-slate-800/60 hover:border-cyan-400/30 text-white/80 hover:text-white transition-all duration-300"
        >
          <Heart className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Favorites</span>
        </button>
        
        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-xl bg-slate-900/50 border border-white/10 hover:bg-slate-800/60 hover:border-cyan-400/30 text-white/80 hover:text-white transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Submit</span>
        </button>
        
        <a 
          href="/admin" 
          className="p-2.5 rounded-full backdrop-blur-xl bg-slate-900/50 border border-white/10 hover:bg-slate-800/60 hover:border-cyan-400/30 text-white/40 hover:text-white transition-all duration-300"
        >
          <Shield className="w-4 h-4" />
        </a>
      </motion.div>

      {/* Category Hotspots */}
      <div className="absolute inset-0 z-30">
        {data.categories.map((category, index) => {
          const position = getHotspotPosition(category.id, index, data.categories.length);
          const toolCount = category.subcategories.reduce((acc, sub) => acc + sub.tools.length, 0);
          
          return (
            <CategoryHotspot
              key={category.id}
              category={category}
              position={position}
              onClick={() => setSelectedCategory(category)}
              isDark={isDark}
              toolCount={toolCount}
            />
          );
        })}
      </div>

      {/* Center title - positioned at bottom */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-8 pointer-events-none z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.2em] text-white/90 drop-shadow-lg">
            WORLD TREE
          </h1>
          <p className="mt-2 text-sm text-cyan-200/60 tracking-wide">
            Click a branch to discover AI tools
          </p>
        </motion.div>
      </div>

      {/* Category Detail View */}
      <AnimatePresence>
        {selectedCategory && (
          <CategoryDetailView
            category={selectedCategory}
            isDark={isDark}
            onBack={() => setSelectedCategory(null)}
            favoriteIds={favoriteIds}
            onFavoriteToggle={handleFavoriteToggle}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <SubmitToolModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        isDark={isDark}
        categories={categoryNames}
      />
      
      <FavoritesPanel
        isOpen={isFavoritesPanelOpen}
        onClose={() => setIsFavoritesPanelOpen(false)}
        isDark={isDark}
      />
      
      <TrendingSection
        isOpen={isTrendingOpen}
        onClose={() => setIsTrendingOpen(false)}
        isDark={isDark}
        allTools={allTools}
        favoriteIds={favoriteIds}
        onToggleFavorite={handleFavoriteToggle}
        onToolClick={() => {}}
      />
    </div>
  );
}
