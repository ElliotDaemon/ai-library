/**
 * SearchOverlay - Enhanced floating search bar with filters and sorting
 * Design: Premium glass morphism with smooth animations
 */

import { Search, X, Sparkles, Clock, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

type SortOption = 'default' | 'alphabetical' | 'free-first' | 'featured';

interface SearchOverlayProps {
  onSearch: (query: string) => void;
  onFilterGems: (showGems: boolean) => void;
  onFilterNew: (showNew: boolean) => void;
  onSort: (sort: SortOption) => void;
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

export default function SearchOverlay({ 
  onSearch, 
  onFilterGems,
  onFilterNew,
  onSort,
  showGemsOnly,
  showNewOnly,
  sortOption,
  resultCount,
  totalCount,
  newCount,
  isDark,
}: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setQuery('');
        onSearch('');
        setShowSortMenu(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearch]);

  // Close sort menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const activeFilters = (showGemsOnly ? 1 : 0) + (showNewOnly ? 1 : 0) + (sortOption !== 'default' ? 1 : 0);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
      {/* Search Input */}
      <div 
        className={`rounded-2xl transition-all duration-500 ease-out backdrop-blur-xl ${
          isDark 
            ? 'bg-black/50 border border-white/10' 
            : 'bg-white/80 border border-slate-200/80 shadow-xl shadow-slate-200/50'
        } ${
          isFocused 
            ? isDark 
              ? 'ring-2 ring-violet-500/50 shadow-xl shadow-violet-500/20 border-violet-500/30' 
              : 'ring-2 ring-violet-500/30 shadow-xl shadow-violet-500/10 border-violet-400'
            : ''
        }`}
        style={{ minWidth: isFocused ? '420px' : '340px' }}
      >
        <div className="flex items-center px-4 py-3.5">
          <Search className={`w-5 h-5 mr-3 transition-colors ${
            isFocused 
              ? 'text-violet-400' 
              : isDark ? 'text-white/40' : 'text-slate-400'
          }`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search AI tools... (⌘K)"
            className={`flex-1 bg-transparent outline-none text-sm font-medium ${
              isDark 
                ? 'text-white placeholder-white/40' 
                : 'text-slate-800 placeholder-slate-400'
            }`}
          />
          {query && (
            <button
              onClick={() => handleChange('')}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                isDark ? 'hover:bg-white/10 active:bg-white/20' : 'hover:bg-slate-100 active:bg-slate-200'
              }`}
            >
              <X className={`w-4 h-4 ${isDark ? 'text-white/50' : 'text-slate-400'}`} />
            </button>
          )}
        </div>
        
        {/* Results count */}
        {(query || showGemsOnly || showNewOnly) && (
          <div className={`px-4 pb-3 text-xs font-medium ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
            Found {resultCount} of {totalCount} tools
            {activeFilters > 0 && (
              <span className="ml-2 text-violet-400">
                ({activeFilters} filter{activeFilters > 1 ? 's' : ''} active)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Recently Added Filter */}
      <button
        onClick={() => onFilterNew(!showNewOnly)}
        className={`rounded-2xl px-4 py-3.5 flex items-center gap-2 transition-all duration-300 backdrop-blur-xl group ${
          isDark 
            ? 'bg-black/50 border border-white/10' 
            : 'bg-white/80 border border-slate-200/80 shadow-lg'
        } ${
          showNewOnly 
            ? isDark
              ? 'ring-2 ring-emerald-500/50 shadow-xl shadow-emerald-500/20 border-emerald-500/30' 
              : 'ring-2 ring-emerald-500/30 shadow-xl shadow-emerald-500/10 border-emerald-400'
            : isDark ? 'hover:bg-white/5 hover:border-white/20' : 'hover:bg-slate-50 hover:border-slate-300'
        }`}
      >
        <Clock 
          className={`w-5 h-5 transition-all duration-300 ${
            showNewOnly 
              ? 'text-emerald-400' 
              : isDark 
                ? 'text-white/40 group-hover:text-white/60' 
                : 'text-slate-400 group-hover:text-slate-600'
          }`} 
        />
        <span className={`text-sm font-medium transition-colors ${
          showNewOnly 
            ? 'text-emerald-400' 
            : isDark ? 'text-white/60 group-hover:text-white/80' : 'text-slate-600 group-hover:text-slate-800'
        }`}>
          New
        </span>
        {newCount > 0 && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
            showNewOnly 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : isDark ? 'bg-white/10 text-white/50' : 'bg-slate-100 text-slate-500'
          }`}>
            {newCount}
          </span>
        )}
      </button>

      {/* Hidden Gems Filter */}
      <button
        onClick={() => onFilterGems(!showGemsOnly)}
        className={`rounded-2xl px-4 py-3.5 flex items-center gap-2 transition-all duration-300 backdrop-blur-xl group ${
          isDark 
            ? 'bg-black/50 border border-white/10' 
            : 'bg-white/80 border border-slate-200/80 shadow-lg'
        } ${
          showGemsOnly 
            ? isDark
              ? 'ring-2 ring-amber-500/50 shadow-xl shadow-amber-500/20 border-amber-500/30' 
              : 'ring-2 ring-amber-500/30 shadow-xl shadow-amber-500/10 border-amber-400'
            : isDark ? 'hover:bg-white/5 hover:border-white/20' : 'hover:bg-slate-50 hover:border-slate-300'
        }`}
      >
        <Sparkles 
          className={`w-5 h-5 transition-all duration-300 ${
            showGemsOnly 
              ? 'text-amber-400' 
              : isDark 
                ? 'text-white/40 group-hover:text-white/60' 
                : 'text-slate-400 group-hover:text-slate-600'
          }`} 
        />
        <span className={`text-sm font-medium transition-colors ${
          showGemsOnly 
            ? 'text-amber-400' 
            : isDark ? 'text-white/60 group-hover:text-white/80' : 'text-slate-600 group-hover:text-slate-800'
        }`}>
          Hidden Gems
        </span>
      </button>

      {/* Sort Dropdown */}
      <div className="relative" ref={sortMenuRef}>
        <button
          onClick={() => setShowSortMenu(!showSortMenu)}
          className={`rounded-2xl px-4 py-3.5 flex items-center gap-2 transition-all duration-300 backdrop-blur-xl group ${
            isDark 
              ? 'bg-black/50 border border-white/10' 
              : 'bg-white/80 border border-slate-200/80 shadow-lg'
          } ${
            sortOption !== 'default' 
              ? isDark
                ? 'ring-2 ring-blue-500/50 shadow-xl shadow-blue-500/20 border-blue-500/30' 
                : 'ring-2 ring-blue-500/30 shadow-xl shadow-blue-500/10 border-blue-400'
              : isDark ? 'hover:bg-white/5 hover:border-white/20' : 'hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          <ArrowUpDown 
            className={`w-5 h-5 transition-all duration-300 ${
              sortOption !== 'default' 
                ? 'text-blue-400' 
                : isDark 
                  ? 'text-white/40 group-hover:text-white/60' 
                  : 'text-slate-400 group-hover:text-slate-600'
            }`} 
          />
          <span className={`text-sm font-medium transition-colors ${
            sortOption !== 'default' 
              ? 'text-blue-400' 
              : isDark ? 'text-white/60 group-hover:text-white/80' : 'text-slate-600 group-hover:text-slate-800'
          }`}>
            {sortOptions.find(o => o.value === sortOption)?.label || 'Sort'}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
            showSortMenu ? 'rotate-180' : ''
          } ${
            sortOption !== 'default' 
              ? 'text-blue-400' 
              : isDark ? 'text-white/40' : 'text-slate-400'
          }`} />
        </button>

        {/* Sort Menu */}
        {showSortMenu && (
          <div className={`absolute top-full mt-2 right-0 rounded-xl overflow-hidden backdrop-blur-xl ${
            isDark 
              ? 'bg-black/80 border border-white/10' 
              : 'bg-white/95 border border-slate-200 shadow-xl'
          }`}>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSort(option.value);
                  setShowSortMenu(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  sortOption === option.value
                    ? isDark 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-blue-50 text-blue-600'
                    : isDark 
                      ? 'text-white/70 hover:bg-white/10' 
                      : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
