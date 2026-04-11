"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Active: 'bg-gradient-to-r from-[#0291B2] to-[#06b6d4] text-white border-white/20',
    Trending: 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-white/20',
    New: 'bg-[#22C55E] text-white border-white/20',
  };
  return (
    <span className={`px-5 py-2 text-[12px] font-black rounded-full shadow-2xl uppercase tracking-widest border ${styles[status] ?? 'bg-white/20 text-white border-white/20'}`}>
      {status}
    </span>
  );
};

const MemeCard = ({ title, category, img, slug, onClick }: { title: string; category: string; img: string; slug: string; onClick: () => void }) => (
  <div className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2 overflow-hidden h-[450px] w-[350px] shrink-0 snap-center">
    <Link
      href={`/slashdot-website-2026/fun-zone/${slug}`}
      onClick={onClick}
      className="absolute inset-0 z-[10]"
      aria-label={`View ${title}`}
    />
    <div className="flex flex-col h-[406px] overflow-hidden">
      <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10">
        <Image
          src={img.startsWith('http') ? img : `/slashdot-website-2026${img}`}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
      </div>
      <div className="px-5 pt-4 pb-1 flex flex-col flex-1 overflow-hidden font-sans">
        <div className="flex flex-col flex-1 min-h-0 text-center items-center justify-start">
          <h3 className="text-2xl sm:text-l font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 shrink-0 mb-1">
            {title}
          </h3>
          <p className="text-base sm:text-sm leading-relaxed text-[var(--foreground)] opacity-80 line-clamp-4 sm:line-clamp-5 overflow-hidden text-ellipsis">
            Curated dev humor collected from the corners of the network. High visual fidelity, low productivity.
          </p>
        </div>
      </div>
    </div>
    <div className="h-[48px] flex items-center shrink-0 border-t border-black/5 dark:border-white/5 px-4 relative z-[20]">
      <div className="flex flex-wrap gap-2 max-h-[26px] overflow-hidden flex-1 justify-center">
        <span className="px-3 py-1 bg-[#0291B2]/5 text-[#0291B2] border border-[#0291B2]/20 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
          {category}
        </span>
      </div>
    </div>
  </div>
);

const GameCard = ({ title, description, url, imgUrl, imgClassName = "object-cover transition-transform duration-700 ease-out group-hover:scale-110", tags, slug, onClick }: { title: string; description: string; url: string; imgUrl: string; imgClassName?: string; tags: string[]; slug: string; onClick: () => void }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2 overflow-hidden h-[450px] w-full">
      <Link
        href={`/slashdot-website-2026/fun-zone/${slug}`}
        onClick={onClick}
        className="absolute inset-0 z-[10]"
        aria-label={`View ${title}`}
      />
      <div className="flex flex-col h-[406px] overflow-hidden">
        <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10 flex items-center justify-center bg-[var(--background)]">
          <Image
            src={imgUrl.startsWith('http') ? imgUrl : `/slashdot-website-2026${imgUrl}`}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={imgClassName}
            unoptimized
          />
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
        </div>
        <div className="px-5 pt-4 pb-3 flex flex-col flex-1 overflow-hidden pointer-events-none font-sans">
          <div className="flex flex-col flex-1 min-h-0 w-full text-center items-center justify-start">
            <h3 className="text-2xl sm:text-l font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1 shrink-0 mb-1 pointer-events-auto">
              {title}
            </h3>
            <p className="text-[14px] leading-relaxed text-[var(--foreground)] opacity-80 line-clamp-2 overflow-hidden text-ellipsis mb-1 pointer-events-auto">
              {description}
            </p>
            <div className="w-full mt-1 border-t border-black/5 dark:border-white/5 pt-1.5 flex-1 pointer-events-auto">
              <table className="w-full text-center text-[12px] opacity-70 mt-1 mx-auto">
                <tbody>
                   <tr><td className="py-0.5 text-left pl-4">👑 Neo</td><td className="text-right pr-4 font-bold">24,400</td></tr>
                   <tr><td className="py-0.5 text-left pl-4">Trinity</td><td className="text-right pr-4 font-bold">18,200</td></tr>
                   <tr><td className="py-0.5 text-left pl-4">Morpheus</td><td className="text-right pr-4 font-bold">12,100</td></tr>
                </tbody>
              </table>
            </div>

            <div className="w-full flex justify-center mt-2 pointer-events-auto">
              <a 
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-[200px] py-1.5 bg-[var(--color-primary)] hover:bg-[#06b6d4] text-white rounded-full font-black text-[12px] uppercase tracking-widest shadow-md hover:shadow-[0_0_15px_rgba(2,145,178,0.5)] transition-all shrink-0 z-[20] flex items-center justify-center gap-1.5"
              >
                Play Game
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[48px] flex items-center shrink-0 border-t border-black/5 dark:border-white/5 px-4 relative z-[20]">
        <div className="flex flex-wrap gap-2 max-h-[26px] overflow-hidden flex-1 justify-center w-full">
          {tags.map(tag => (
             <span key={tag} className="px-3 py-1 bg-[#0291B2]/5 text-[#0291B2] border border-[#0291B2]/20 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
               #{tag.toUpperCase()}
             </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArtCard = ({ title, blurColor, slug, onClick }: { title: string; blurColor: string; slug: string; onClick: () => void }) => {
  return (
    <div className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2 overflow-hidden h-[450px] w-full">
      <Link
        href={`/slashdot-website-2026/fun-zone/${slug}`}
        onClick={onClick}
        className="absolute inset-0 z-[10]"
        aria-label={`View ${title}`}
      />
      <div className="flex flex-col h-[406px] overflow-hidden">
        <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10 flex items-center justify-center bg-black/5 dark:bg-white/5 pointer-events-auto">
          <div className="relative w-32 h-32 transition-transform duration-700 ease-out group-hover:scale-110" style={{ animation: 'spin 20s linear infinite' }}>
            <div className="absolute inset-0 rounded-full blur-[30px] opacity-40 group-hover:opacity-70 transition-opacity duration-1000" style={{ backgroundColor: blurColor }}></div>
            <div className="absolute top-0 left-0 w-full h-full border-[6px] border-[#0291B2]/60 mix-blend-multiply dark:mix-blend-screen transition-all duration-700 group-hover:border-[10px]" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}></div>
            <div className="absolute top-[-10px] left-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] border-[2px] border-foreground/40 transition-all duration-1000 group-hover:rotate-45" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>
            <div className="absolute top-[10px] left-[10px] w-[calc(100%-20px)] h-[calc(100%-20px)] border-[1px] border-[#0291B2]/40 transition-all duration-1000 group-hover:-rotate-45" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}></div>
          </div>
        </div>
        <div className="px-5 pt-4 pb-1 flex flex-col flex-1 overflow-hidden font-sans">
          <div className="relative flex items-center justify-center w-full mb-1 text-[13px] font-bold tracking-tight">
            <div className="z-[20] relative text-center">
              <span className="text-[var(--color-primary)] opacity-80 uppercase">By Slashdot Labs</span>
            </div>
          </div>
          <div className="flex flex-col flex-1 min-h-0 text-center items-center">
            <h3 className="text-2xl sm:text-l font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 shrink-0 mb-1">
              {title}
            </h3>
            <p className="text-base sm:text-sm leading-relaxed text-[var(--foreground)] opacity-80 line-clamp-4 sm:line-clamp-5 overflow-hidden text-ellipsis">
              Procedurally generated geometric patterns running raw via CSS variables without external dependencies.
            </p>
          </div>
        </div>
      </div>
      <div className="h-[48px] flex items-center shrink-0 border-t border-black/5 dark:border-white/5 px-4 relative z-[20]">
        <div className="flex flex-wrap gap-2 max-h-[26px] overflow-hidden flex-1 justify-center w-full">
          <span className="px-3 py-1 bg-[#0291B2]/5 text-[#0291B2] border border-[#0291B2]/20 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
            #GENERATIVE
          </span>
        </div>
      </div>
    </div>
  );
};

export default function FunZonePage() {
  const [mounted, setMounted] = useState(false);
  const [visitedSlugs, setVisitedSlugs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('slashdot_visited_funzone');
      if (stored) setVisitedSlugs(JSON.parse(stored));
    } catch (e) { }
  }, []);

  // Auto-scroll logic for Memes
  useEffect(() => {
    if (!mounted || isHovered) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Card width (350) + Gap (32) = 382
          scrollRef.current.scrollBy({ left: 382, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [mounted, isHovered]);

  const scrollManual = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -382 : 382;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleCardClick = (slug: string) => {
    if (!visitedSlugs.includes(slug)) {
      const updated = [...visitedSlugs, slug];
      setVisitedSlugs(updated);
      try {
        localStorage.setItem('slashdot_visited_funzone', JSON.stringify(updated));
      } catch (e) { }
    }
  };

  // Hydration skeleton maintaining layout geometry and transform-gpu hardware acceleration
  if (!mounted) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24 min-h-screen transform-gpu">
        <div className="h-16 w-64 bg-foreground/5 rounded-xl mb-12 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="h-[450px] rounded-xl bg-foreground/5 animate-pulse border border-foreground/10"></div>
           ))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16 lg:py-24 min-h-screen transform-gpu transition-all">
      
      {/* HEADER */}
      <header className="mb-20 relative text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--foreground)] relative z-10">
          Fun <span className="text-[var(--color-primary)]">Zone</span>
        </h1>
        <p className="text-xl text-[var(--foreground)] opacity-80 max-w-2xl mx-auto relative z-10">
          The interactive playground. A curated collection of tech culture, playable client-side experiments, and mathematically generated art exploring the Slashdot grid constraints.
        </p>
      </header>

      <div className="flex flex-col gap-24">
        
        {/* MEMES SECTION */}
        <section>
          <div className="text-left mb-2 group flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Memes</h2>
              <div className="h-[3px] w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/50 to-transparent mt-2 mb-10" />
            </div>
            {/* Manual Navigation Buttons */}
            <div className="flex gap-3 mb-8 pl-8">
              <button 
                onClick={() => scrollManual('left')}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all active:scale-95"
                aria-label="Scroll Left"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button 
                onClick={() => scrollManual('right')}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all active:scale-95"
                aria-label="Scroll Right"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex overflow-x-auto snap-x snap-mandatory pb-6 hide-scrollbar transform-gpu gap-8 w-full px-2 mt-12"
          >
            <MemeCard 
              title="When the code compiles cleanly on the first try and you don't know why." 
              category="compilation-panic"
              img="https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80" 
              slug="compilation-panic-meme"
              onClick={() => handleCardClick('compilation-panic-meme')}
            />
            <MemeCard 
              title="Centering a div with CSS in 2026: Still googling it." 
              category="css-centering"
              img="https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&auto=format&fit=crop&q=80" 
              slug="css-centering-meme"
              onClick={() => handleCardClick('css-centering-meme')}
            />
            <MemeCard 
              title="The Junior Dev pushing directly to production on Friday afternoon." 
              category="friday-deploy"
              img="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80" 
              slug="friday-deploy-meme"
              onClick={() => handleCardClick('friday-deploy-meme')}
            />
            <MemeCard 
              title="Senior dev looking at the new intern's pull request." 
              category="senior-dev"
              img="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80" 
              slug="senior-dev-meme"
              onClick={() => handleCardClick('senior-dev-meme')}
            />
            <MemeCard 
              title="Reacting to the new hydration mismatch in production." 
              category="next-tears"
              img="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=80" 
              slug="hydration-mismatch-meme"
              onClick={() => handleCardClick('hydration-mismatch-meme')}
            />
            <MemeCard 
              title="Convincing the team to rewrite the entire backend in Rust." 
              category="blazingly-fast"
              img="https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&auto=format&fit=crop&q=80" 
              slug="rust-rewrite-meme"
              onClick={() => handleCardClick('rust-rewrite-meme')}
            />
          </div>
        </section>

        {/* GAMES SECTION */}
        <section>
          <div className="text-left mb-2 group">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Games</h2>
            <div className="h-[3px] w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/50 to-transparent mt-2 mb-10" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-2">
            <GameCard 
              title="2048" 
              description="Join the numbers and get to the 2048 tile!" 
              url="https://play2048.co/"
              imgUrl="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndnZpZnNqNmZ4ZWZ4ZWZ4ZWZ4ZWZ4ZWZ4ZWZ4ZWZ4ZWZ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxV4P72p6nu/giphy.gif"
              tags={["Puzzles"]}
              slug="game-2048"
              onClick={() => handleCardClick('game-2048')}
            />
            <GameCard 
              title="Hextris" 
              description="Fast-paced hexagonal puzzle inspired by Tetris." 
              url="https://hextris.io/"
              imgUrl="https://raw.githubusercontent.com/Hextris/hextris/gh-pages/images/facebook-og.png"
              imgClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-110 animate-pulse-scale"
              tags={["Arcade"]}
              slug="game-hextris"
              onClick={() => handleCardClick('game-hextris')}
            />
            <GameCard 
              title="Clumsy Bird" 
              description="A retro-style arcade challenge. Don't hit the pipes!" 
              url="https://ellisonleao.github.io/clumsy-bird/"
              imgUrl="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWZ4ZWZ4ZWZ4ZWZ4ZWZ4ZWZ4ZWZ4ZWZ4ZWZ4ZWZ4ZWZ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/10YxX8YpWv6LpS/giphy.gif"
              tags={["Retro"]}
              slug="game-clumsy-bird"
              onClick={() => handleCardClick('game-clumsy-bird')}
            />
          </div>
        </section>

        {/* ART GALLERY SECTION */}
        <section>
          <div className="text-left mb-2 group">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Art Gallery</h2>
            <div className="h-[3px] w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/50 to-transparent mt-2 mb-10" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-2">
            <ArtCard title="Morphing Anomalies" blurColor="var(--color-primary)" slug="art-morphing-anomalies" onClick={() => handleCardClick('art-morphing-anomalies')} />
            <ArtCard title="Fluid Chaos Engine" blurColor="#ff4500" slug="art-fluid-chaos" onClick={() => handleCardClick('art-fluid-chaos')} />
            <ArtCard title="Geometric Recursion" blurColor="#8a2be2" slug="art-geometric-recursion" onClick={() => handleCardClick('art-geometric-recursion')} />
          </div>
        </section>
        
      </div>
    </main>
  );
}
