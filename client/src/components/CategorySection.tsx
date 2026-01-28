import { GlassCard } from "./GlassCard";
import { 
  Code, Palette, Zap, PenTool, Video, Music, Briefcase, 
  Search, Brain, MessageSquare, Globe, Database, Shield,
  Smartphone, GraduationCap, Heart, TrendingUp, Gamepad2,
  FileText, Folder, ChevronDown
} from "lucide-react";

interface Tool {
  name: string;
  url: string | null;
  description: string;
  category: string;
  pricing: string;
  is_hidden_gem: boolean;
}

interface CategorySectionProps {
  category: string;
  tools: Tool[];
  isExpanded: boolean;
  onToggle: () => void;
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

const categoryColors: Record<string, string> = {
  "Coding & Development": "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  "Design & Creative": "from-pink-500/20 to-rose-500/20 border-pink-500/30",
  "Productivity & Automation": "from-cyan-500/20 to-teal-500/20 border-cyan-500/30",
  "Writing & Content": "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  "Video Generation & Editing": "from-rose-500/20 to-pink-500/20 border-rose-500/30",
  "Audio & Music": "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
  "Business & Sales": "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  "Search & Discovery": "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
  "Research & Analysis": "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
  "AI Assistants & Chatbots": "from-purple-500/20 to-violet-500/20 border-purple-500/30",
  "Communication & Translation": "from-teal-500/20 to-cyan-500/20 border-teal-500/30",
  "Data & Analytics": "from-blue-500/20 to-sky-500/20 border-blue-500/30",
  "Security & Privacy": "from-red-500/20 to-rose-500/20 border-red-500/30",
  "No-Code & App Builders": "from-orange-500/20 to-amber-500/20 border-orange-500/30",
  "Education & Learning": "from-green-500/20 to-emerald-500/20 border-green-500/30",
  "Healthcare & Wellness": "from-pink-500/20 to-red-500/20 border-pink-500/30",
  "Finance & Trading": "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
  "3D & Game Development": "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  "Knowledge Management": "from-slate-500/20 to-gray-500/20 border-slate-500/30",
  "Image Generation & Art": "from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/30",
};

export function CategorySection({ category, tools, isExpanded, onToggle }: CategorySectionProps) {
  const Icon = categoryIcons[category] || Folder;
  const colorClass = categoryColors[category] || "from-gray-500/20 to-slate-500/20 border-gray-500/30";
  const gemCount = tools.filter(t => t.is_hidden_gem).length;

  return (
    <section
      id={category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
      className="scroll-mt-24"
    >
      {/* Category Header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-3 sm:p-4 mb-3 sm:mb-4 rounded-xl bg-gradient-to-r ${colorClass} border backdrop-blur-sm transition-all duration-300 active:scale-[0.99] group`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-background/50">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </div>
          <div className="text-left">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">{category}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {tools.length} tools {gemCount > 0 && `· ${gemCount} hidden gems`}
            </p>
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-muted-foreground group-hover:text-foreground transition-all duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Tools Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-6 sm:pb-8">
          {tools.map((tool, index) => (
            <GlassCard key={tool.name} tool={tool} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
