/**
 * ListView Component - Alternative list-based view for AI LIBRARY
 * Features collapsible categories, search, and liquid glass aesthetic
 */

import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronRight, Heart, ExternalLink, Search, Sparkles, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface Tool {
  id: number;
  name: string;
  url: string;
  description: string;
  pricing: string;
  isGem?: boolean;
  isNew?: boolean;
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
  categories: Category[];
}

interface ListViewProps {
  isDark: boolean;
  data: MindmapData | null;
}

export default function ListView({ isDark, data }: ListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
  const [showGemsOnly, setShowGemsOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  // Fetch favorites
  const { data: favoritesData } = trpc.favorites.list.useQuery();
  const addFavoriteMutation = trpc.favorites.add.useMutation();
  const removeFavoriteMutation = trpc.favorites.remove.useMutation();

  useEffect(() => {
    if (favoritesData) {
      setFavorites(new Set(favoritesData.map((f: { toolId: string }) => f.toolId)));
    }
  }, [favoritesData]);

  const handleFavoriteToggle = async (toolId: string, toolName: string) => {
    try {
      const isFavorite = favorites.has(toolId);
      if (isFavorite) {
        await removeFavoriteMutation.mutateAsync({ toolId });
      } else {
        await addFavoriteMutation.mutateAsync({ toolId, toolName });
      }
      setFavorites(prev => {
        const next = new Set(prev);
        if (next.has(toolId)) {
          next.delete(toolId);
        } else {
          next.add(toolId);
        }
        return next;
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  // Filter and count tools
  const { filteredData, totalTools, totalGems, totalNew } = useMemo(() => {
    if (!data) return { filteredData: null, totalTools: 0, totalGems: 0, totalNew: 0 };

    let toolCount = 0;
    let gemCount = 0;
    let newCount = 0;

    const filtered = {
      categories: data.categories.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub => ({
          ...sub,
          tools: sub.tools.filter(tool => {
            const matchesSearch = !searchQuery || 
              tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGem = !showGemsOnly || tool.isGem;
            const matchesNew = !showNewOnly || tool.isNew;
            
            if (matchesSearch && matchesGem && matchesNew) {
              toolCount++;
              if (tool.isGem) gemCount++;
              if (tool.isNew) newCount++;
              return true;
            }
            return false;
          })
        })).filter(sub => sub.tools.length > 0)
      })).filter(cat => cat.subcategories.length > 0)
    };

    return { filteredData: filtered, totalTools: toolCount, totalGems: gemCount, totalNew: newCount };
  }, [data, searchQuery, showGemsOnly, showNewOnly]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const toggleSubcategory = (subId: string) => {
    setExpandedSubcategories(prev => {
      const next = new Set(prev);
      if (next.has(subId)) {
        next.delete(subId);
      } else {
        next.add(subId);
      }
      return next;
    });
  };

  const expandAll = () => {
    if (!filteredData) return;
    const allCats = new Set(filteredData.categories.map(c => c.id));
    const allSubs = new Set(filteredData.categories.flatMap(c => c.subcategories.map(s => s.id)));
    setExpandedCategories(allCats);
    setExpandedSubcategories(allSubs);
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
    setExpandedSubcategories(new Set());
  };

  const getPricingColor = (pricing: string) => {
    if (pricing === 'Free') return isDark ? 'text-emerald-400' : 'text-emerald-600';
    if (pricing === 'Freemium') return isDark ? 'text-blue-400' : 'text-blue-600';
    if (pricing === 'Paid') return isDark ? 'text-amber-400' : 'text-amber-600';
    return isDark ? 'text-gray-400' : 'text-gray-600';
  };

  if (!data || !filteredData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050510]' : 'bg-slate-50'}`}>
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#050510] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header - with top padding for fixed controls */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl pt-14 sm:pt-16 ${isDark ? 'bg-[#050510]/80 border-b border-white/10' : 'bg-slate-50/80 border-b border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI tools..."
              className={`w-full pl-12 pr-12 py-3.5 rounded-2xl text-base transition-all duration-300 ${
                isDark 
                  ? 'bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-violet-500/50 focus:bg-white/10' 
                  : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:shadow-lg'
              } outline-none`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters and Stats - Mobile responsive */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setShowNewOnly(!showNewOnly)}
                className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                  showNewOnly
                    ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                    : isDark 
                      ? 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                New {totalNew > 0 && <span className="ml-1 opacity-70">({totalNew})</span>}
              </button>
              <button
                onClick={() => setShowGemsOnly(!showGemsOnly)}
                className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1 sm:gap-1.5 ${
                  showGemsOnly
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25'
                    : isDark 
                      ? 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Hidden </span>Gems
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`text-xs sm:text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {totalTools} tools
              </span>
              <div className="hidden sm:flex gap-1">
                <button
                  onClick={expandAll}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isDark ? 'bg-white/5 hover:bg-white/10 text-white/60' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isDark ? 'bg-white/5 hover:bg-white/10 text-white/60' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-3">
          {filteredData.categories.map(category => (
            <div 
              key={category.id}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                isDark 
                  ? 'bg-white/[0.03] border border-white/[0.08] hover:border-white/15' 
                  : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${
                  isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-semibold text-lg">{category.name}</span>
                  <span className={`text-sm px-2.5 py-0.5 rounded-full ${
                    isDark ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {category.subcategories.reduce((acc, sub) => acc + sub.tools.length, 0)} tools
                  </span>
                </div>
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className={`w-5 h-5 transition-transform ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
                ) : (
                  <ChevronRight className={`w-5 h-5 transition-transform ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
                )}
              </button>

              {/* Subcategories */}
              {expandedCategories.has(category.id) && (
                <div className={`border-t ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
                  {category.subcategories.map(subcategory => (
                    <div key={subcategory.id}>
                      {/* Subcategory Header */}
                      <button
                        onClick={() => toggleSubcategory(subcategory.id)}
                        className={`w-full px-5 py-3 pl-12 flex items-center justify-between transition-colors ${
                          isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                            {subcategory.name}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            isDark ? 'bg-white/5 text-white/50' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {subcategory.tools.length}
                          </span>
                        </div>
                        {expandedSubcategories.has(subcategory.id) ? (
                          <ChevronDown className={`w-4 h-4 ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
                        ) : (
                          <ChevronRight className={`w-4 h-4 ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
                        )}
                      </button>

                      {/* Tools Grid */}
                      {expandedSubcategories.has(subcategory.id) && (
                        <div className={`px-5 pb-4 pl-12 ${isDark ? 'bg-white/[0.01]' : 'bg-slate-50/50'}`}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                            {subcategory.tools.map(tool => {
                              const toolId = `tool-${tool.id}`;
                              const isFavorite = favorites.has(toolId);
                              const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(tool.url).hostname}&sz=32`;

                              return (
                                <div
                                  key={tool.id}
                                  className={`group relative p-4 rounded-xl transition-all duration-300 ${
                                    isDark 
                                      ? 'bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06]' 
                                      : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md'
                                  }`}
                                  style={{
                                    backdropFilter: 'blur(12px)',
                                  }}
                                >
                                  {/* Gem Badge */}
                                  {tool.isGem && (
                                    <div className="absolute -top-1.5 -right-1.5">
                                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                                        <Sparkles className="w-3 h-3 text-white" />
                                      </div>
                                    </div>
                                  )}

                                  {/* New Badge */}
                                  {tool.isNew && (
                                    <div className={`absolute -top-1.5 ${tool.isGem ? '-right-8' : '-right-1.5'}`}>
                                      <div className="px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-lg">
                                        NEW
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex items-start gap-3">
                                    {/* Favicon */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                      isDark ? 'bg-white/10' : 'bg-slate-100'
                                    }`}>
                                      <img
                                        src={faviconUrl}
                                        alt=""
                                        className="w-5 h-5"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                      />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <h4 className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {tool.name}
                                      </h4>
                                      <p className={`text-xs mt-0.5 line-clamp-2 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                                        {tool.description}
                                      </p>
                                      <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-xs font-medium ${getPricingColor(tool.pricing)}`}>
                                          {tool.pricing}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="absolute bottom-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFavoriteToggle(toolId, tool.name);
                                      }}
                                      className={`p-1.5 rounded-lg transition-colors ${
                                        isFavorite
                                          ? 'bg-rose-500/20 text-rose-400'
                                          : isDark 
                                            ? 'bg-white/10 text-white/60 hover:text-rose-400' 
                                            : 'bg-slate-100 text-slate-400 hover:text-rose-500'
                                      }`}
                                    >
                                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                    <a
                                      href={tool.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className={`p-1.5 rounded-lg transition-colors ${
                                        isDark 
                                          ? 'bg-white/10 text-white/60 hover:text-white' 
                                          : 'bg-slate-100 text-slate-400 hover:text-slate-700'
                                      }`}
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.categories.length === 0 && (
          <div className={`text-center py-16 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No tools found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
