import { 
  Code, Palette, Zap, PenTool, Video, Music, Briefcase, 
  Search, Brain, MessageSquare, Globe, Database, Shield,
  Smartphone, GraduationCap, Heart, TrendingUp, Gamepad2,
  FileText, Folder, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState } from "react";

interface CategoryNavProps {
  categories: string[];
  activeCategory: string | null;
  onCategoryClick: (category: string) => void;
  categoryCounts: Record<string, number>;
}

const categoryIcons: Record<string, React.ElementType> = {
  "Coding & Development": Code,
  "Design & Creative": Palette,
  "Productivity & Automation": Zap,
  "Writing & Content": PenTool,
  "Video Generation & Editing": Video,
  "Audio & Music": Music,
  "Business & Sales": Briefcase,
  "Search & Discovery": Search,
  "Research & Analysis": Brain,
  "AI Assistants & Chatbots": MessageSquare,
  "Communication & Translation": Globe,
  "Data & Analytics": Database,
  "Security & Privacy": Shield,
  "No-Code & App Builders": Smartphone,
  "Education & Learning": GraduationCap,
  "Healthcare & Wellness": Heart,
  "Finance & Trading": TrendingUp,
  "3D & Game Development": Gamepad2,
  "Knowledge Management": FileText,
  "Image Generation & Art": Palette,
};

export function CategoryNav({ categories, activeCategory, onCategoryClick, categoryCounts }: CategoryNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 h-screen z-30 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="h-full pt-20 pb-8 px-3 bg-background/80 backdrop-blur-xl border-r border-border/50 overflow-y-auto">
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-24 -right-3 p-1.5 rounded-full bg-secondary border border-border/50 text-muted-foreground hover:text-foreground transition-colors z-50"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {!isCollapsed && (
            <div className="mb-4 px-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Categories
              </h3>
            </div>
          )}

          <nav className="space-y-1">
            {categories.map((category) => {
              const Icon = categoryIcons[category] || Folder;
              const isActive = activeCategory === category;
              const count = categoryCounts[category] || 0;

              return (
                <button
                  key={category}
                  onClick={() => onCategoryClick(category)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                  title={isCollapsed ? category : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="text-sm font-medium truncate flex-1">{category}</span>
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Horizontal Scroll */}
      <div className="lg:hidden sticky top-[73px] z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 py-2 sm:py-3">
        <div className="overflow-x-auto scrollbar-hide -webkit-overflow-scrolling-touch">
          <div className="flex gap-2 px-3 sm:px-4 min-w-max">
            {categories.map((category) => {
              const Icon = categoryIcons[category] || Folder;
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => onCategoryClick(category)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground active:text-foreground bg-secondary/30"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{category}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
