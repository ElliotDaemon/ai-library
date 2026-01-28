import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-background/50 lg:pl-64">
      <div className="container py-8 sm:py-12">
        <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
          {/* Logo & Description */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="font-bold text-base sm:text-lg text-foreground">AI Tools Directory</span>
          </div>
          
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md px-4">
            Curated collection of 285+ AI tools across 20+ categories. 
            Discover hidden gems and find the perfect AI solution for any task.
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <a
              href="#tools-section"
              className="text-muted-foreground active:text-foreground transition-colors"
            >
              Browse Tools
            </a>
            <a
              href="https://www.synthesia.io/post/ai-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground active:text-foreground transition-colors"
            >
              Source
            </a>
          </div>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} AI Tools Directory</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> using AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
