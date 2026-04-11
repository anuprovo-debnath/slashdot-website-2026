"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { TagPill } from "@/components/ui/TagPill";

// --- CONSTANTS ---
const REPO_NAME = "/slashdot-website-2026";

const STRIP_CONFIG = {
  headerPx: "px-10",
  gridPx: "px-10",
  snapPl: "scroll-pl-10",
  gapSection: "gap-12",
  gridLayout: "grid grid-flow-col auto-cols-[100%] sm:auto-cols-[calc(50%-16px)] lg:auto-cols-[calc(33.333%-21.333px)] gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pt-4 pb-4",
};

// --- SHARED COMPONENTS ---

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

const MemeCard = ({ title, category, img, slug, onClick, className = "" }: { title: string; category: string; img: string; slug: string; onClick: () => void; className?: string }) => (
  <div className={`group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2 overflow-hidden h-[450px] w-full ${className}`}>
    <Link
      href={`/fun-zone/${slug}`}
      onClick={onClick}
      className="absolute inset-0 z-[10]"
      aria-label={`View ${title}`}
    />
    <div className="flex flex-col h-[406px] overflow-hidden">
      <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10">
        <Image
          src={img.startsWith('http') ? img : `${REPO_NAME}${img}`}
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
        <TagPill tag={category} />
      </div>
    </div>
  </div>
);

const GameCard = ({ title, description, url, imgUrl, imgClassName = "object-cover transition-transform duration-700 ease-out group-hover:scale-110", tags, slug, onClick, className = "" }: { title: string; description: string; url: string; imgUrl: string; imgClassName?: string; tags: string[]; slug: string; onClick: () => void; className?: string }) => {
  return (
    <div className={`group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2 overflow-hidden h-[450px] w-full ${className}`}>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="absolute inset-0 z-[10]"
      aria-label={`Play ${title}`}
    />
      <div className="flex flex-col h-[406px] overflow-hidden">
        <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10 flex items-center justify-center bg-[var(--background)]">
          <Image
            src={imgUrl.startsWith('http') ? imgUrl : `${REPO_NAME}${imgUrl}`}
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
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ArtCard = ({ title, blurColor, slug, onClick, className = "" }: { title: string; blurColor: string; slug: string; onClick: () => void; className?: string }) => (
  <div className={`group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2 overflow-hidden h-[450px] w-full ${className}`}>
    <Link
      href={`/fun-zone/${slug}`}
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
        <TagPill tag="Generative" />
      </div>
    </div>
  </div>
);

interface SidelongStripProps {
  title: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (direction: 'left' | 'right') => void;
  children: React.ReactNode;
}

const SidelongStrip = ({ title, scrollRef, onScroll, children }: SidelongStripProps) => (
  <section>
    <div className={`text-left mb-0 group flex items-center justify-between ${STRIP_CONFIG.headerPx}`}>
      <div className="flex-1">
        <h2 className="text-3xl md:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">{title}</h2>
        <div className="h-[2px] w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/50 to-transparent mt-1 mb-4" />
      </div>
      <div className="flex gap-3 mb-4 pl-8">
        <button
          onClick={() => onScroll('left')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all active:scale-95"
          aria-label={`Scroll ${title} Left`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <button
          onClick={() => onScroll('right')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all active:scale-95"
          aria-label={`Scroll ${title} Right`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
    </div>
    <div className="py-0">
      <div
        ref={scrollRef}
        className={`${STRIP_CONFIG.gridLayout} ${STRIP_CONFIG.gridPx} ${STRIP_CONFIG.snapPl}`}
      >
        {children}
      </div>
    </div>
  </section>
);

// --- MAIN PAGE COMPONENT ---

export default function FunZonePage() {
  const [mounted, setMounted] = useState(false);
  const [visitedSlugs, setVisitedSlugs] = useState<string[]>([]);

  // Scroller refs
  const memeScrollRef = useRef<HTMLDivElement>(null);
  const gameScrollRef = useRef<HTMLDivElement>(null);
  const artScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('slashdot_visited_funzone');
      if (stored) setVisitedSlugs(JSON.parse(stored));
    } catch (e) { }
  }, []);

  const handleCardClick = (slug: string) => {
    console.log(`Fun Zone Interaction: ${slug}`);
    if (!visitedSlugs.includes(slug)) {
      const updated = [...visitedSlugs, slug];
      setVisitedSlugs(updated);
      try {
        localStorage.setItem('slashdot_visited_funzone', JSON.stringify(updated));
      } catch (e) { }
    }
  };

  const scrollAction = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { clientWidth } = ref.current;
      const amount = direction === 'left' ? -clientWidth : clientWidth;
      ref.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center py-20">
          <div className="h-16 w-64 bg-foreground/5 rounded-xl mb-12 animate-pulse mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[450px] rounded-2xl bg-foreground/5 animate-pulse border border-foreground/10"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <header className="mb-20 relative text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--foreground)] relative z-10">
            Fun <span className="text-[var(--color-primary)]">Zone</span>
          </h1>
          <p className="text-xl text-[var(--foreground)] opacity-80 max-w-2xl mx-auto relative z-10">
            The interactive playground. A curated collection of tech culture, playable client-side experiments, and mathematically generated art exploring the Slashdot grid constraints.
          </p>
        </header>

        <div className={`flex flex-col ${STRIP_CONFIG.gapSection}`}>

          {/* MEMES SECTION */}
          <SidelongStrip
            title="Memes"
            scrollRef={memeScrollRef}
            onScroll={(dir) => scrollAction(memeScrollRef, dir)}
          >
            <MemeCard
              title="When the code compiles cleanly on the first try and you don't know why."
              category="compilation-panic"
              img="https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80"
              slug="compilation-panic-meme"
              onClick={() => handleCardClick('compilation-panic-meme')}
              className="snap-start"
            />
            <MemeCard
              title="Centering a div with CSS in 2026: Still googling it."
              category="css-centering"
              img="https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&auto=format&fit=crop&q=80"
              slug="css-centering-meme"
              onClick={() => handleCardClick('css-centering-meme')}
              className="snap-start"
            />
            <MemeCard
              title="The Junior Dev pushing directly to production on Friday afternoon."
              category="friday-deploy"
              img="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
              slug="friday-deploy-meme"
              onClick={() => handleCardClick('friday-deploy-meme')}
              className="snap-start"
            />
            <MemeCard
              title="Senior dev looking at the new intern's pull request."
              category="senior-dev"
              img="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
              slug="senior-dev-meme"
              onClick={() => handleCardClick('senior-dev-meme')}
              className="snap-start"
            />
            <MemeCard
              title="Reacting to the new hydration mismatch in production."
              category="next-tears"
              img="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=80"
              slug="hydration-mismatch-meme"
              onClick={() => handleCardClick('hydration-mismatch-meme')}
              className="snap-start"
            />
            <MemeCard
              title="Convincing the team to rewrite the entire backend in Rust."
              category="blazingly-fast"
              img="https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&auto=format&fit=crop&q=80"
              slug="rust-rewrite-meme"
              onClick={() => handleCardClick('rust-rewrite-meme')}
              className="snap-start"
            />
          </SidelongStrip>

          {/* GAMES SECTION */}
          <SidelongStrip
            title="Games"
            scrollRef={gameScrollRef}
            onScroll={(dir) => scrollAction(gameScrollRef, dir)}
          >
            <GameCard
              title="2048"
              description="Join the numbers and get to the 2048 tile!"
              url="https://play2048.co/"
              imgUrl="/images/games/2048.jpg"
              tags={["Puzzles"]}
              slug="game-2048"
              onClick={() => handleCardClick('game-2048')}
              className="snap-start"
            />
            <GameCard
              title="Tetris"
              description="The world favorite puzzle game. Clear lines, score high!"
              url="https://play.tetris.com/"
              imgUrl="/images/games/tetris.webp"
              tags={["Classic"]}
              slug="game-tetris"
              onClick={() => handleCardClick('game-tetris')}
              className="snap-start"
            />
            <GameCard
              title="Clumsy Bird"
              description="A retro-style arcade challenge. Don't hit the pipes!"
              url="https://ellisonleao.github.io/clumsy-bird/"
              imgUrl="/images/games/clumsy-bird.png"
              tags={["Retro"]}
              slug="game-clumsy-bird"
              onClick={() => handleCardClick('game-clumsy-bird')}
              className="snap-start"
            />
          </SidelongStrip>

          {/* ART GALLERY SECTION */}
          <SidelongStrip
            title="Art Gallery"
            scrollRef={artScrollRef}
            onScroll={(dir) => scrollAction(artScrollRef, dir)}
          >
            <ArtCard title="Morphing Anomalies" blurColor="var(--color-primary)" slug="art-morphing-anomalies" onClick={() => handleCardClick('art-morphing-anomalies')} className="snap-start" />
            <ArtCard title="Fluid Chaos Engine" blurColor="#ff4500" slug="art-fluid-chaos" onClick={() => handleCardClick('art-fluid-chaos')} className="snap-start" />
            <ArtCard title="Geometric Recursion" blurColor="#8a2be2" slug="art-geometric-recursion" onClick={() => handleCardClick('art-geometric-recursion')} className="snap-start" />
          </SidelongStrip>
        </div>
      </div>
    </div>
  );
}
