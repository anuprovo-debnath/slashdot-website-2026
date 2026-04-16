"use client";

import { useState, useEffect, useRef } from "react";
import { HeroCanvas } from "@/components/home/HeroCanvas";
import { MemeCard, GameCard, ArtCard } from "@/components/fun-zone/FunZoneCards";

// --- CONSTANTS ---
const STRIP_CONFIG = {
  headerPx: "px-8",
  gridPx: "px-8",
  snapPl: "scroll-pl-8",
  gapSection: "gap-12",
  gridLayout: "grid grid-flow-col auto-cols-[100%] sm:auto-cols-[calc(50%-16px)] lg:auto-cols-[calc(33.333%-21.333px)] gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pt-4 pb-4",
};

// --- SHARED COMPONENTS ---

interface SidelongStripProps {
  title: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (direction: 'left' | 'right') => void;
  children: React.ReactNode;
}

const SidelongStrip = ({ title, scrollRef, onScroll, children }: SidelongStripProps) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!isHovered && scrollRef.current) {
      intervalId = setInterval(() => {
        if (scrollRef.current && scrollRef.current.firstElementChild) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          const cardWidth = scrollRef.current.firstElementChild.clientWidth + 32;

          if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
          }
        }
      }, 4000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isHovered, scrollRef]);

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={() => setIsHovered(true)}
      onPointerUp={() => setIsHovered(false)}
    >
      <div className={`text-left mb-0 group flex items-center justify-between ${STRIP_CONFIG.headerPx}`}>
        <div className="flex-1">
          <h2 className="text-3xl md:text-3xl font-extrabold tracking-tight text-[var(--foreground)] font-heading">{title}</h2>
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
      <div
        className="py-0 relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)'
        }}
      >
        <div
          ref={scrollRef}
          className={`${STRIP_CONFIG.gridLayout} ${STRIP_CONFIG.gridPx} ${STRIP_CONFIG.snapPl}`}
        >
          {children}
        </div>
      </div>
    </section>
  );
};

interface FunZoneClientPageProps {
  memes: any[];
  games: any[];
  art: any[];
}

export default function FunZoneClientPage({ memes, games, art }: FunZoneClientPageProps) {
  const [mounted, setMounted] = useState(false);
  const [visitedSlugs, setVisitedSlugs] = useState<string[]>([]);

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
    <div className="min-h-screen pb-16">
      <div className="relative overflow-hidden pt-44 pb-24 px-4 sm:px-6 lg:px-12">
        <div className="absolute top-0 left-0 pointer-events-none" style={{ width: '100vw', height: '100vh' }}>
          <HeroCanvas opacity={100} />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <header className="mb-0 relative text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--foreground)] relative z-10 font-heading">
              Fun <span className="text-[var(--color-primary)] font-heading">Zone</span>
            </h1>
            <p className="text-xl text-[var(--foreground)] opacity-80 max-w-2xl mx-auto relative z-10">
              The interactive playground. A curated collection of tech culture, playable client-side experiments, and mathematically generated art exploring the Slashdot grid constraints.
            </p>
          </header>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-12 pt-12">
        <div className="max-w-5xl mx-auto">
          <div className={`flex flex-col ${STRIP_CONFIG.gapSection}`}>

            {/* MEMES SECTION */}
            {memes.length > 0 && (
              <SidelongStrip
                title="Memes"
                scrollRef={memeScrollRef}
                onScroll={(dir) => scrollAction(memeScrollRef, dir)}
              >
                {memes.map((meme) => (
                  <MemeCard
                    key={meme.slug}
                    title={meme.frontmatter.title}
                    category={meme.frontmatter.category_label || "#" + (meme.frontmatter.tags?.[0] || "Meme")}
                    img={meme.frontmatter.image || meme.frontmatter.coverImage}
                    description={meme.frontmatter.description}
                    slug={meme.slug}
                    onClick={() => handleCardClick(meme.slug)}
                    className="snap-start"
                  />
                ))}
              </SidelongStrip>
            )}

            {/* GAMES SECTION */}
            {games.length > 0 && (
              <SidelongStrip
                title="Games"
                scrollRef={gameScrollRef}
                onScroll={(dir) => scrollAction(gameScrollRef, dir)}
              >
                {games.map((game) => (
                  <GameCard
                    key={game.slug}
                    title={game.frontmatter.title}
                    description={game.frontmatter.description}
                    url={game.frontmatter.url}
                    imgUrl={game.frontmatter.image || game.frontmatter.coverImage}
                    tags={game.frontmatter.tags || []}
                    slug={game.slug}
                    onClick={() => handleCardClick(game.slug)}
                    className="snap-start"
                  />
                ))}
              </SidelongStrip>
            )}

            {/* ART GALLERY SECTION */}
            {art.length > 0 && (
              <SidelongStrip
                title="Art Gallery"
                scrollRef={artScrollRef}
                onScroll={(dir) => scrollAction(artScrollRef, dir)}
              >
                {art.map((item) => (
                  <ArtCard
                    key={item.slug}
                    title={item.frontmatter.title}
                    blurColor={item.frontmatter.blurColor || "var(--color-primary)"}
                    slug={item.slug}
                    onClick={() => handleCardClick(item.slug)}
                    className="snap-start"
                  />
                ))}
              </SidelongStrip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
