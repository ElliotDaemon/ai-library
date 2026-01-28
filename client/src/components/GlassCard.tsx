import { ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tool {
  name: string;
  url: string | null;
  description: string;
  category: string;
  pricing: string;
  is_hidden_gem: boolean;
}

interface GlassCardProps {
  tool: Tool;
  index: number;
}

export function GlassCard({ tool }: GlassCardProps) {
  return (
    <a
      href={tool.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block glass-card p-4 sm:p-5 transition-all duration-300",
        tool.is_hidden_gem && "gem-shimmer"
      )}
    >
      {/* Hidden gem badge */}
      {tool.is_hidden_gem && (
        <div className="absolute -top-1 -right-1 z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white shadow-lg shadow-amber-500/25">
            <Sparkles className="w-3 h-3" />
            <span>Gem</span>
          </div>
        </div>
      )}

      {/* Card content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-2 sm:mb-3">
          <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {tool.name}
          </h3>
          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
          {tool.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs px-2 sm:px-2.5 py-1 rounded-full bg-secondary/50 text-secondary-foreground">
            {tool.pricing}
          </span>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      </div>
    </a>
  );
}
