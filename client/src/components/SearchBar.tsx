import { Search, Sparkles, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showGemsOnly: boolean;
  onGemsToggle: () => void;
  totalTools: number;
  filteredCount: number;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  showGemsOnly,
  onGemsToggle,
  totalTools,
  filteredCount,
}: SearchBarProps) {
  return (
    <div className="sticky top-14 sm:top-16 z-40 py-3 sm:py-4 bg-background/95 backdrop-blur-xl border-b border-border/50">
      <div className="container">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${totalTools}+ AI tools...`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 rounded-xl bg-secondary/30 border border-border/50 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground active:text-foreground transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Gems Filter */}
          <button
            data-gems-filter
            onClick={onGemsToggle}
            className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium text-sm transition-all active:scale-95 ${
              showGemsOnly
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
                : "bg-secondary/30 text-muted-foreground active:text-foreground border border-border/50"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hidden Gems</span>
          </button>
        </div>

        {/* Results count */}
        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
          {searchQuery || showGemsOnly ? (
            <span>
              Showing <span className="text-foreground font-medium">{filteredCount}</span> of{" "}
              <span className="text-foreground font-medium">{totalTools}</span> tools
            </span>
          ) : (
            <span>
              Explore <span className="text-foreground font-medium">{totalTools}</span> AI tools across{" "}
              <span className="text-foreground font-medium">20+</span> categories
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
