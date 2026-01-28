import { Sparkles, ArrowDown } from "lucide-react";

interface HeroProps {
  totalTools: number;
  hiddenGems: number;
  categories: number;
}

export function Hero({ totalTools, hiddenGems, categories }: HeroProps) {
  const scrollToTools = () => {
    document.getElementById("tools-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient fallback */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-violet-950/50 to-slate-900">
        <img
          src="/images/hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover opacity-50"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center px-4 py-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 sm:mb-8">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">{hiddenGems}+ Hidden Gems Discovered</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
          <span className="text-foreground">The Ultimate</span>
          <br />
          <span className="gradient-text">AI Tools Directory</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
          Discover {totalTools}+ curated AI tools across {categories} categories.
          From industry leaders to rare hidden gems, find the perfect AI solution for any task.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="text-center">
            <div className="text-2xl sm:text-4xl font-bold text-foreground">{totalTools}+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">AI Tools</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-4xl font-bold text-foreground">{categories}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-4xl font-bold text-amber-500">{hiddenGems}+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Hidden Gems</div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={scrollToTools}
          className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 active:scale-95 transition-transform"
        >
          <span>Explore Tools</span>
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
