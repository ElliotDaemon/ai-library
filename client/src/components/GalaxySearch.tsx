/**
 * GalaxySearch - Ultra-minimal, luxurious search interface
 * Design: Clean, futuristic, Apple-inspired
 */

import { Search, X, Sparkles, Clock, ChevronDown, ExternalLink, Heart, Star } from 'lucide-react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

type SortOption = 'default' | 'alphabetical' | 'free-first' | 'featured';

interface Tool {
  name: string;
  url: string;
  description: string;
  pricing: string;
  featured?: boolean;
  gem?: boolean;
  isNew?: boolean;
  category?: string;
  subcategory?: string;
}

interface GalaxySearchProps {
  tools: Tool[];
  onSearch: (query: string) => void;
  onFilterGems: (showGems: boolean) => void;
  onFilterNew: (showNew: boolean) => void;
  onSort: (sort: SortOption) => void;
  onToolSelect: (tool: Tool) => void;
  onFavoriteToggle: (toolName: string) => void;
  favorites: Set<string>;
  showGemsOnly: boolean;
  showNewOnly: boolean;
  sortOption: SortOption;
  resultCount: number;
  totalCount: number;
  newCount: number;
  isDark: boolean;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'alphabetical', label: 'A-Z' },
  { value: 'free-first', label: 'Free First' },
  { value: 'featured', label: 'Featured' },
];

export default function GalaxySearch({ 
  tools,
  onSearch, 
  onFilterGems,
  onFilterNew,
  onSort,
  onToolSelect,
  onFavoriteToggle,
  favorites,
  showGemsOnly,
  showNewOnly,
  sortOption,
  resultCount,
  totalCount,
  newCount,
  isDark,
}: GalaxySearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeFilters = (showGemsOnly ? 1 : 0) + (showNewOnly ? 1 : 0) + (sortOption !== 'default' ? 1 : 0);

  // Filter and sort suggestions
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchLower = query.toLowerCase();
    return tools
      .filter(tool => 
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.category?.toLowerCase().includes(searchLower) ||
        tool.subcategory?.toLowerCase().includes(searchLower)
      )
      .slice(0, 6);
  }, [query, tools]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
      if (showDropdown && suggestions.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
          e.preventDefault();
          onToolSelect(suggestions[selectedIndex]);
          setShowDropdown(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDropdown, suggestions, selectedIndex, onToolSelect]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = useCallback((value: string) => {
    setQuery(value);
    onSearch(value);
    setShowDropdown(value.length > 0);
    setSelectedIndex(-1);
  }, [onSearch]);

  const handleSuggestionClick = useCallback((tool: Tool) => {
    onToolSelect(tool);
    setShowDropdown(false);
  }, [onToolSelect]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 sm:px-0">
      <div className="flex flex-col items-center gap-3">
        
        {/* Search Input */}
        <div className="relative w-full" ref={dropdownRef}>
          <div 
            className={`relative rounded-full transition-all duration-700 ${
              isDark 
                ? 'bg-white/[0.04]' 
                : 'bg-black/[0.03]'
            } ${
              isFocused 
                ? isDark 
                  ? 'bg-white/[0.07] ring-1 ring-white/[0.1]' 
                  : 'bg-black/[0.05] ring-1 ring-black/[0.08]'
                : ''
            }`}
          >
            <div className="flex items-center px-5 py-3">
              <Search className={`w-4 h-4 mr-3 transition-all duration-500 ${
                isFocused 
                  ? isDark ? 'text-white/60' : 'text-black/60' 
                  : isDark ? 'text-white/20' : 'text-black/20'
              }`} strokeWidth={1.5} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => {
                  setIsFocused(true);
                  if (query) setShowDropdown(true);
                }}
                onBlur={() => setIsFocused(false)}
                placeholder="Search tools..."
                className={`flex-1 bg-transparent outline-none text-sm font-light tracking-wide ${
                  isDark 
                    ? 'text-white placeholder-white/20' 
                    : 'text-black placeholder-black/25'
                }`}
              />
              {query && (
                <button
                  onClick={() => handleChange('')}
                  className={`p-1 rounded-full transition-all duration-300 ${
                    isDark ? 'text-white/30 hover:text-white/60' : 'text-black/30 hover:text-black/60'
                  }`}
                >
                  <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className={`
              absolute top-full mt-2 left-0 right-0 rounded-2xl overflow-hidden
              ${isDark 
                ? 'bg-[#0c0c10]/95 border border-white/[0.06]' 
                : 'bg-white/95 border border-black/[0.04] shadow-2xl shadow-black/10'
              }
              animate-in fade-in slide-in-from-top-2 duration-300
            `}>
              {suggestions.map((tool, index) => (
                <button
                  key={tool.name}
                  onClick={() => handleSuggestionClick(tool)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`
                    w-full px-5 py-3.5 flex items-center gap-4 transition-all duration-300 text-left
                    ${selectedIndex === index 
                      ? isDark 
                        ? 'bg-white/[0.05]' 
                        : 'bg-black/[0.03]'
                      : ''
                    }
                  `}
                >
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${new URL(tool.url).hostname}&sz=32`}
                    alt=""
                    className="w-5 h-5 rounded-md opacity-60"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-normal text-sm ${isDark ? 'text-white/90' : 'text-black/90'}`}>
                        {tool.name}
                      </span>
                      {tool.featured && (
                        <Star className="w-3 h-3 text-amber-400/70" strokeWidth={1.5} />
                      )}
                      {tool.gem && (
                        <Sparkles className="w-3 h-3 text-violet-400/70" strokeWidth={1.5} />
                      )}
                    </div>
                    <div className={`text-xs font-light ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                      {tool.category}
                    </div>
                  </div>
                  
                  <div className={`text-[11px] font-light ${isDark ? 'text-white/25' : 'text-black/25'}`}>
                    {tool.pricing}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Minimal Filter Pills */}
        <div className="flex items-center gap-2">
          {/* New Filter */}
          <button
            onClick={() => onFilterNew(!showNewOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-light tracking-wide transition-all duration-500 ${
              showNewOnly 
                ? isDark
                  ? 'bg-white/[0.1] text-white/80' 
                  : 'bg-black/[0.08] text-black/80'
                : isDark 
                  ? 'text-white/25 hover:text-white/50' 
                  : 'text-black/25 hover:text-black/50'
            }`}
          >
            <Clock className="w-3 h-3" strokeWidth={1.5} />
            <span>New</span>
          </button>

          {/* Gems Filter */}
          <button
            onClick={() => onFilterGems(!showGemsOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-light tracking-wide transition-all duration-500 ${
              showGemsOnly 
                ? isDark
                  ? 'bg-white/[0.1] text-white/80' 
                  : 'bg-black/[0.08] text-black/80'
                : isDark 
                  ? 'text-white/25 hover:text-white/50' 
                  : 'text-black/25 hover:text-black/50'
            }`}
          >
            <Sparkles className="w-3 h-3" strokeWidth={1.5} />
            <span>Gems</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortMenuRef}>
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-light tracking-wide transition-all duration-500 ${
                sortOption !== 'default' 
                  ? isDark
                    ? 'bg-white/[0.1] text-white/80' 
                    : 'bg-black/[0.08] text-black/80'
                  : isDark 
                    ? 'text-white/25 hover:text-white/50' 
                    : 'text-black/25 hover:text-black/50'
              }`}
            >
              <span>{sortOptions.find(o => o.value === sortOption)?.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showSortMenu ? 'rotate-180' : ''}`} strokeWidth={1.5} />
            </button>

            {showSortMenu && (
              <div className={`absolute top-full mt-2 right-0 rounded-xl overflow-hidden min-w-[100px] ${
                isDark 
                  ? 'bg-[#0c0c10]/95 border border-white/[0.06]' 
                  : 'bg-white/95 border border-black/[0.04] shadow-xl'
              }`}>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSort(option.value);
                      setShowSortMenu(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-[12px] font-light transition-all duration-300 ${
                      sortOption === option.value
                        ? isDark ? 'bg-white/[0.06] text-white/90' : 'bg-black/[0.04] text-black/90'
                        : isDark ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results count - ultra subtle */}
        {(query || showGemsOnly || showNewOnly) && (
          <div className={`text-[10px] font-light tracking-widest uppercase ${
            isDark ? 'text-white/15' : 'text-black/15'
          }`}>
            {resultCount} of {totalCount}
          </div>
        )}
      </div>
    </div>
  );
}
