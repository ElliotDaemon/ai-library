import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2"
          >
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="font-bold text-base sm:text-lg text-foreground">AI Tools</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#tools-section"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse Tools
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const gemsBtn = document.querySelector('[data-gems-filter]');
                if (gemsBtn) {
                  (gemsBtn as HTMLButtonElement).click();
                }
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Hidden Gems
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground active:text-foreground active:bg-secondary/50 transition-all"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col gap-2">
              <a
                href="#tools-section"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 text-sm text-muted-foreground active:text-foreground active:bg-secondary/30 rounded-lg transition-all"
              >
                Browse Tools
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  const gemsBtn = document.querySelector('[data-gems-filter]');
                  if (gemsBtn) {
                    (gemsBtn as HTMLButtonElement).click();
                  }
                }}
                className="px-4 py-2 text-sm text-muted-foreground active:text-foreground active:bg-secondary/30 rounded-lg transition-all"
              >
                Hidden Gems
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
