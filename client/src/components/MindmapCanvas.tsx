/**
 * MindmapCanvas - Enhanced infinite canvas with galaxy search and hierarchical navigation
 * Design: Cosmic Neural Network with fluid interactions and premium feel
 * Features: Galaxy search, Favorites, Tool Submission, Hierarchical categories
 */

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  useReactFlow,
} from '@xyflow/react';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import CategoryNode from './nodes/CategoryNode';
import SubcategoryNode from './nodes/SubcategoryNode';
import ToolNode from './nodes/ToolNode';
import CenterNode from './nodes/CenterNode';
import GlowEdge from './edges/GlowEdge';
import GalaxySearch from './GalaxySearch';
import CosmicBackground from './CosmicBackground';
import SubmitToolModal from './SubmitToolModal';
import FavoritesPanel from './FavoritesPanel';
import { trpc } from '@/lib/trpc';
import { Plus, Heart, Flame } from 'lucide-react';
import TrendingSection from './TrendingSection';

// Node types registration
const nodeTypes = {
  category: CategoryNode,
  subcategory: SubcategoryNode,
  tool: ToolNode,
  center: CenterNode,
};

// Edge types registration
const edgeTypes = {
  glow: GlowEdge,
};

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

interface MindmapCanvasProps {
  isDark: boolean;
}

type SortOption = 'default' | 'alphabetical' | 'free-first' | 'featured';

// Mark some tools as recently added (for demo - in production this would come from the data)
const RECENTLY_ADDED_TOOLS = [
  'Napkin AI', 'Caffeine.AI', 'Dreamina', 'VidAU', 'Pippit AI', 'Chronicle',
  'PageOn.AI', 'Sider', 'Tanka', 'MGX', 'Workbeaver', 'Proactor.ai',
  'Sagehood', 'Aha', 'Tana', 'Thea', 'Gamma', 'Framer AI',
  // Music tools
  'iZotope Ozone', 'LANDR', 'Masterchannel', 'Lemonaide', 'Orb Producer Suite',
  'Atlas 2', 'Synthesizer V', 'LALAL.AI', 'Moises'
];

export default function MindmapCanvas({ isDark }: MindmapCanvasProps) {
  const [data, setData] = useState<MindmapData | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showGemsOnly, setShowGemsOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isFavoritesPanelOpen, setIsFavoritesPanelOpen] = useState(false);
  const [isTrendingOpen, setIsTrendingOpen] = useState(false);
  const { fitView, setCenter, getZoom } = useReactFlow();

  // Click tracking for trending
  const recordClickMutation = trpc.clicks.record.useMutation();

  // Favorites management - use refs to avoid infinite loops
  const { data: favorites, refetch: refetchFavorites } = trpc.favorites.list.useQuery(undefined, {
    staleTime: 30000,
  });
  const addFavoriteMutation = trpc.favorites.add.useMutation({
    onSuccess: () => refetchFavorites(),
  });
  const removeFavoriteMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => refetchFavorites(),
  });

  // Memoize favorited IDs as a string for stable comparison
  const favoritedToolIdsString = useMemo(() => {
    return JSON.stringify(favorites?.map(f => f.toolId).sort() || []);
  }, [favorites]);

  const favoritedToolIds = useMemo(() => {
    return new Set(JSON.parse(favoritedToolIdsString) as string[]);
  }, [favoritedToolIdsString]);

  // Store the handler in a ref to avoid re-creating it
  const handleFavoriteToggleRef = useRef<(toolId: string, toolName: string, toolUrl: string, category?: string) => void>(undefined);
  handleFavoriteToggleRef.current = (toolId: string, toolName: string, toolUrl: string, category?: string) => {
    if (favoritedToolIds.has(toolId)) {
      removeFavoriteMutation.mutate({ toolId });
    } else {
      addFavoriteMutation.mutate({ toolId, toolName, toolUrl, category });
    }
  };

  // Stable callback that uses the ref
  const handleFavoriteToggle = useCallback((toolId: string, toolName: string, toolUrl: string, category?: string) => {
    handleFavoriteToggleRef.current?.(toolId, toolName, toolUrl, category);
  }, []);

  // Get all category names for the submission form
  const categoryNames = useMemo(() => {
    if (!data) return [];
    return data.categories.map(c => c.name);
  }, [data]);

  // Flatten all tools for the galaxy search
  const allTools = useMemo(() => {
    if (!data) return [];
    const tools: Tool[] = [];
    data.categories.forEach(cat => {
      cat.subcategories.forEach(sub => {
        sub.tools.forEach(tool => {
          tools.push({
            ...tool,
            category: cat.name,
            subcategory: sub.name,
          });
        });
      });
    });
    return tools;
  }, [data]);

  // Load data and mark recently added tools
  useEffect(() => {
    fetch('/mindmap_data.json')
      .then(res => res.json())
      .then((rawData: MindmapData) => {
        // Mark recently added tools and add IDs
        rawData.categories.forEach(cat => {
          cat.subcategories.forEach(sub => {
            sub.tools.forEach(tool => {
              // Generate a unique ID for each tool
              tool.id = `${cat.id}-${sub.id}-${tool.name.replace(/\s+/g, '-').toLowerCase()}`;
              tool.category = cat.name;
              tool.subcategory = sub.name;
              if (RECENTLY_ADDED_TOOLS.includes(tool.name)) {
                tool.recentlyAdded = true;
              }
            });
          });
        });
        setData(rawData);
      })
      .catch(console.error);
  }, []);

  // Sort tools based on selected option
  const sortTools = useCallback((tools: Tool[]): Tool[] => {
    const sorted = [...tools];
    switch (sortOption) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'free-first':
        return sorted.sort((a, b) => {
          const aFree = a.pricing.toLowerCase().includes('free') ? 0 : 1;
          const bFree = b.pricing.toLowerCase().includes('free') ? 0 : 1;
          return aFree - bFree;
        });
      case 'featured':
        return sorted.sort((a, b) => {
          const aScore = (a.featured ? 2 : 0) + (a.gem ? 1 : 0);
          const bScore = (b.featured ? 2 : 0) + (b.gem ? 1 : 0);
          return bScore - aScore;
        });
      default:
        return sorted;
    }
  }, [sortOption]);

  // Calculate positions with MUCH wider spacing
  const calculateCategoryPositions = useCallback((categories: Category[]) => {
    const centerX = 0;
    const centerY = 0;
    const radius = 900;
    const positions: Record<string, { x: number; y: number }> = {};

    categories.forEach((cat, index) => {
      const angle = (index / categories.length) * 2 * Math.PI - Math.PI / 2;
      positions[cat.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    return positions;
  }, []);

  // Build nodes and edges with better spacing
  useEffect(() => {
    if (!data) return;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const categoryPositions = calculateCategoryPositions(data.categories);

    // Center node
    newNodes.push({
      id: 'center',
      type: 'center',
      position: { x: -120, y: -80 },
      data: {
        totalTools: data.stats.totalTools,
        totalCategories: data.stats.totalCategories,
        hiddenGems: data.stats.hiddenGems,
        isDark,
      },
      draggable: false,
    });

    // Category nodes
    data.categories.forEach((category) => {
      const pos = categoryPositions[category.id];
      const toolCount = category.subcategories.reduce(
        (acc, sub) => acc + sub.tools.length, 
        0
      );
      const isExpanded = expandedCategories.has(category.id);

      newNodes.push({
        id: category.id,
        type: 'category',
        position: pos,
        data: {
          label: category.name,
          icon: category.icon,
          color: category.color,
          toolCount,
          expanded: isExpanded,
          isDark,
          onClick: () => toggleCategory(category.id),
        },
      });

      // Edge from center to category
      newEdges.push({
        id: `center-${category.id}`,
        source: 'center',
        target: category.id,
        type: 'glow',
        data: { color: category.color },
      });

      // If expanded, show subcategories in a wider arc
      if (isExpanded) {
        const subCount = category.subcategories.length;
        const catAngle = Math.atan2(pos.y, pos.x);
        const arcSpread = Math.PI * 0.7;
        const subRadius = 400;

        category.subcategories.forEach((subcategory, subIndex) => {
          const subAngle = catAngle - arcSpread / 2 + (arcSpread * subIndex) / Math.max(subCount - 1, 1);
          const subX = pos.x + subRadius * Math.cos(subAngle);
          const subY = pos.y + subRadius * Math.sin(subAngle);
          const subId = `${category.id}-${subcategory.id}`;
          const isSubExpanded = expandedSubcategories.has(subId);

          // Filter and sort tools
          let filteredTools = [...subcategory.tools];
          
          // Apply search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredTools = filteredTools.filter(
              t => t.name.toLowerCase().includes(query) ||
                   t.description.toLowerCase().includes(query)
            );
          }
          
          // Apply gems filter
          if (showGemsOnly) {
            filteredTools = filteredTools.filter(t => t.gem);
          }
          
          // Apply new filter
          if (showNewOnly) {
            filteredTools = filteredTools.filter(t => t.recentlyAdded);
          }
          
          // Apply sorting
          filteredTools = sortTools(filteredTools);

          newNodes.push({
            id: subId,
            type: 'subcategory',
            position: { x: subX, y: subY },
            data: {
              label: subcategory.name,
              color: category.color,
              toolCount: filteredTools.length,
              expanded: isSubExpanded,
              isDark,
              onClick: () => toggleSubcategory(subId),
            },
          });

          newEdges.push({
            id: `${category.id}-${subId}`,
            source: category.id,
            target: subId,
            type: 'glow',
            data: { color: category.color },
          });

          // If subcategory expanded, show tools in a grid layout
          if (isSubExpanded && filteredTools.length > 0) {
            const toolsPerRow = 3;
            const toolSpacingX = 240;
            const toolSpacingY = 140;
            const toolDirection = Math.atan2(subY - pos.y, subX - pos.x);

            filteredTools.forEach((tool, toolIndex) => {
              const row = Math.floor(toolIndex / toolsPerRow);
              const col = toolIndex % toolsPerRow;
              const baseOffsetX = 180;
              
              const toolX = subX + baseOffsetX * Math.cos(toolDirection) + (col * toolSpacingX) * Math.cos(toolDirection + Math.PI / 2);
              const toolY = subY + baseOffsetX * Math.sin(toolDirection) + (col * toolSpacingX) * Math.sin(toolDirection + Math.PI / 2) + row * toolSpacingY;
              
              const toolId = tool.id || `${subId}-${tool.name.replace(/\s+/g, '-').toLowerCase()}`;
              const isHighlighted = searchQuery && 
                (tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 tool.description.toLowerCase().includes(searchQuery.toLowerCase()));

              newNodes.push({
                id: toolId,
                type: 'tool',
                position: { x: toolX, y: toolY },
                data: {
                  tool: { ...tool, id: toolId },
                  color: category.color,
                  isHighlighted,
                  isDark,
                  isFavorited: favoritedToolIds.has(toolId),
                  onFavoriteToggle: handleFavoriteToggle,
                },
              });

              newEdges.push({
                id: `${subId}-${toolId}`,
                source: subId,
                target: toolId,
                type: 'glow',
                data: { color: category.color },
              });
            });
          }
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, expandedCategories, expandedSubcategories, searchQuery, showGemsOnly, showNewOnly, sortOption, calculateCategoryPositions, setNodes, setEdges, isDark, sortTools, favoritedToolIdsString]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
        setExpandedSubcategories(subPrev => {
          const subNext = new Set(subPrev);
          Array.from(subNext).forEach(key => {
            if (key.startsWith(categoryId)) {
              subNext.delete(key);
            }
          });
          return subNext;
        });
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const toggleSubcategory = useCallback((subcategoryId: string) => {
    setExpandedSubcategories(prev => {
      const next = new Set(prev);
      if (next.has(subcategoryId)) {
        next.delete(subcategoryId);
      } else {
        next.add(subcategoryId);
      }
      return next;
    });
  }, []);

  // Calculate result counts
  const { resultCount, totalCount, newCount } = useMemo(() => {
    if (!data) return { resultCount: 0, totalCount: 0, newCount: 0 };
    
    let total = 0;
    let results = 0;
    let newTools = 0;
    
    data.categories.forEach(cat => {
      cat.subcategories.forEach(sub => {
        sub.tools.forEach(tool => {
          total++;
          if (tool.recentlyAdded) newTools++;
          const matchesSearch = !searchQuery || 
            tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesGems = !showGemsOnly || tool.gem;
          const matchesNew = !showNewOnly || tool.recentlyAdded;
          if (matchesSearch && matchesGems && matchesNew) {
            results++;
          }
        });
      });
    });
    
    return { resultCount: results, totalCount: total, newCount: newTools };
  }, [data, searchQuery, showGemsOnly, showNewOnly]);

  // Handle tool selection from galaxy search
  const handleToolSelect = useCallback((tool: Tool) => {
    // Find and expand the category and subcategory containing this tool
    if (!data) return;
    
    for (const cat of data.categories) {
      for (const sub of cat.subcategories) {
        const foundTool = sub.tools.find(t => t.name === tool.name);
        if (foundTool) {
          // Expand the category and subcategory
          setExpandedCategories(prev => new Set([...Array.from(prev), cat.id]));
          setTimeout(() => {
            setExpandedSubcategories(prev => new Set([...Array.from(prev), `${cat.id}-${sub.id}`]));
          }, 100);
          return;
        }
      }
    }
  }, [data]);

  // Handle favorite toggle from galaxy search
  const handleGalaxyFavoriteToggle = useCallback((toolName: string) => {
    if (!data) return;
    
    for (const cat of data.categories) {
      for (const sub of cat.subcategories) {
        const tool = sub.tools.find(t => t.name === toolName);
        if (tool && tool.id) {
          handleFavoriteToggle(tool.id, tool.name, tool.url, cat.name);
          return;
        }
      }
    }
  }, [data, handleFavoriteToggle]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search focus
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
      
      // Escape to collapse all
      if (e.key === 'Escape') {
        setExpandedCategories(new Set());
        setExpandedSubcategories(new Set());
        setSearchQuery('');
        setIsSubmitModalOpen(false);
        setIsFavoritesPanelOpen(false);
        fitView({ padding: 0.3 });
      }
      
      // Number keys 1-9 to expand categories
      if (e.key >= '1' && e.key <= '9' && !e.metaKey && !e.ctrlKey) {
        const index = parseInt(e.key) - 1;
        if (data && index < data.categories.length) {
          const categoryId = data.categories[index].id;
          toggleCategory(categoryId);
        }
      }
      
      // F to fit view
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey) {
        fitView({ padding: 0.3 });
      }
      
      // G to toggle gems
      if (e.key === 'g' && !e.metaKey && !e.ctrlKey) {
        setShowGemsOnly(prev => !prev);
      }
      
      // N to toggle new
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        setShowNewOnly(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data, fitView, toggleCategory]);

  // Initial fit view
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => fitView({ padding: 0.3 }), 100);
    }
  }, [nodes.length > 0, fitView]);

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CosmicBackground isDark={isDark} />
        <div className={`flex flex-col items-center gap-4 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
          <div className="relative">
            <div className={`w-16 h-16 border-4 ${isDark ? 'border-violet-500/30' : 'border-violet-600/30'} rounded-full`} />
            <div className={`absolute inset-0 w-16 h-16 border-4 ${isDark ? 'border-violet-500' : 'border-violet-600'} border-t-transparent rounded-full animate-spin`} />
          </div>
          <span className="text-lg font-medium">Loading AI Library...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <CosmicBackground isDark={isDark} />
      
      <GalaxySearch
        tools={allTools}
        onSearch={setSearchQuery}
        onFilterGems={setShowGemsOnly}
        onFilterNew={setShowNewOnly}
        onSort={setSortOption}
        onToolSelect={handleToolSelect}
        onFavoriteToggle={handleGalaxyFavoriteToggle}
        favorites={favoritedToolIds}
        showGemsOnly={showGemsOnly}
        showNewOnly={showNewOnly}
        sortOption={sortOption}
        resultCount={resultCount}
        totalCount={totalCount}
        newCount={newCount}
        isDark={isDark}
      />

      {/* Ultra-minimal floating action bar */}
      <div className="fixed top-6 left-6 z-50">
        <div className={`flex items-center gap-1 p-1.5 rounded-full transition-all duration-700 ${
          isDark 
            ? 'bg-white/[0.03]' 
            : 'bg-black/[0.02]'
        }`}>
          {/* Submit */}
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 text-[13px] font-light tracking-wide ${
              isDark
                ? 'text-white/40 hover:text-white hover:bg-white/[0.06]'
                : 'text-black/40 hover:text-black hover:bg-black/[0.04]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Submit</span>
          </button>

          {/* Divider */}
          <div className={`w-px h-4 ${isDark ? 'bg-white/[0.08]' : 'bg-black/[0.06]'}`} />

          {/* Trending */}
          <button
            onClick={() => setIsTrendingOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 text-[13px] font-light tracking-wide ${
              isDark
                ? 'text-white/40 hover:text-white hover:bg-white/[0.06]'
                : 'text-black/40 hover:text-black hover:bg-black/[0.04]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Trending</span>
          </button>

          {/* Divider */}
          <div className={`w-px h-4 ${isDark ? 'bg-white/[0.08]' : 'bg-black/[0.06]'}`} />

          {/* Saved */}
          <button
            onClick={() => setIsFavoritesPanelOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 text-[13px] font-light tracking-wide ${
              isDark
                ? 'text-white/40 hover:text-white hover:bg-white/[0.06]'
                : 'text-black/40 hover:text-black hover:bg-black/[0.04]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Saved</span>
            {favorites && favorites.length > 0 && (
              <span className={`text-[11px] tabular-nums ${
                isDark ? 'text-white/30' : 'text-black/30'
              }`}>
                {favorites.length}
              </span>
            )}
          </button>
        </div>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.05}
        maxZoom={2.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.35 }}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'transparent' }}
      >
        <Background color={isDark ? "rgba(255, 255, 255, 0.015)" : "rgba(0, 0, 0, 0.02)"} gap={100} />
        <Controls 
          showInteractive={false}
          className="!bottom-6 !left-6 !shadow-none"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            border: 'none',
            borderRadius: '12px',
          }}
        />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'center') return isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)';
            if (node.type === 'category') return isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)';
            if (node.type === 'subcategory') return isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
            return isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
          }}
          maskColor={isDark ? "rgba(8, 8, 12, 0.9)" : "rgba(250, 250, 250, 0.9)"}
          className="!bottom-6 !right-6 !shadow-none !rounded-xl !overflow-hidden"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)',
            border: 'none',
            borderRadius: '12px',
          }}
        />
      </ReactFlow>

      {/* Ultra-minimal hint - only visible briefly */}
      <div className={`hidden sm:block fixed bottom-6 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
        isDark ? 'text-white/15' : 'text-black/15'
      }`}>
        <div className="flex items-center gap-6 text-[11px] font-light tracking-widest uppercase">
          <span>Explore</span>
          <span>·</span>
          <span>Zoom</span>
          <span>·</span>
          <span>Navigate</span>
        </div>
      </div>

      {/* Submit Tool Modal */}
      <SubmitToolModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        isDark={isDark}
        categories={categoryNames}
      />

      {/* Favorites Panel */}
      <FavoritesPanel
        isOpen={isFavoritesPanelOpen}
        onClose={() => setIsFavoritesPanelOpen(false)}
        isDark={isDark}
      />

      {/* Trending Section */}
      <TrendingSection
        isDark={isDark}
        isOpen={isTrendingOpen}
        onClose={() => setIsTrendingOpen(false)}
        allTools={allTools.map(t => ({
          id: t.id || `${t.category}-${t.subcategory}-${t.name}`.replace(/\s+/g, '-').toLowerCase(),
          name: t.name,
          url: t.url,
          description: t.description,
          pricing: t.pricing,
          isGem: t.gem,
          isNew: t.recentlyAdded,
        }))}
        favoriteIds={favoritedToolIds}
        onToggleFavorite={(tool) => {
          handleFavoriteToggle(tool.id, tool.name, tool.url, tool.description);
        }}
        onToolClick={(tool) => {
          recordClickMutation.mutate({
            toolId: tool.id,
            toolName: tool.name,
            toolUrl: tool.url,
            category: tool.description,
          });
        }}
      />
    </div>
  );
}
