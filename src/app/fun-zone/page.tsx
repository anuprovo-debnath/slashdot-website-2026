"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TagPill } from "@/components/ui/TagPill";
import { HeroCanvas } from "@/components/home/HeroCanvas";
import { getImgPath } from "@/lib/imgUtils";

// --- CONSTANTS ---
const REPO_NAME = "/slashdot-website-2026";

const STRIP_CONFIG = {
  headerPx: "px-8",
  gridPx: "px-8",
  snapPl: "scroll-pl-8",
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

const MemeCard = ({ title, category, img, description, slug, onClick, className = "" }: { title: string; category: string; img: string; description: string; slug: string; onClick: () => void; className?: string }) => (
  <div className={`group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2 overflow-hidden h-[450px] w-full ${className}`}>
    <Link
      href={`/fun-zone/${slug}`}
      onClick={onClick}
      className="absolute inset-0 z-[10]"
      aria-label={`View ${title}`}
    />
    <div className="flex flex-col h-[406px] overflow-hidden">
      <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10">
        <img
          src={getImgPath(img)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
      </div>
      <div className="px-5 pt-4 pb-1 flex flex-col flex-1 overflow-hidden font-sans">
        <div className="flex flex-col flex-1 min-h-0 text-center items-center justify-start">
          <h3 className="text-2xl sm:text-l font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 shrink-0 mb-1">
            {title}
          </h3>
          <p className="text-base sm:text-sm leading-relaxed text-[var(--foreground)] opacity-80 line-clamp-4 sm:line-clamp-5 overflow-hidden text-ellipsis">
            {description}
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
          <img
            src={getImgPath(imgUrl)}
            alt={title}
            className={imgClassName}
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
            Mathematical explorations of the Slashdot brand matrix. Constructed on a strict Tan=3 slope for maximum visual fidelity and geometric precision.
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

const SidelongStrip = ({ title, scrollRef, onScroll, children }: SidelongStripProps) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!isHovered && scrollRef.current) {
      intervalId = setInterval(() => {
        if (scrollRef.current && scrollRef.current.firstElementChild) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          // Calculate card width + gap (gap-8 = 32px)
          const cardWidth = scrollRef.current.firstElementChild.clientWidth + 32;

          // If reached the end, reset to start. Otherwise scroll right by one card.
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
    <div className="min-h-screen pb-16">
      {/* HERO HEADER with Canvas */}
      <div className="relative overflow-hidden pt-44 pb-24 px-4 sm:px-6 lg:px-12">
        {/* Viewport-sized canvas wrapper — cropped rather than squeezed */}
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
            <SidelongStrip
              title="Memes"
              scrollRef={memeScrollRef}
              onScroll={(dir) => scrollAction(memeScrollRef, dir)}
            >
              <MemeCard
                title={'The Developer\'s Classic: "It Works on My Machine"'}
                category="#ProgrammerHumor"
                img="/images/memes/works-on-my-machine.webp"
                description="A humorous take on the environment-specific bugs that plague developers. When a bug is reported, the first reaction is often to check if it works locally, leading to the infamous phrase."
                slug="works-on-my-machine"
                onClick={() => handleCardClick('works-on-my-machine')}
                className="snap-start"
              />
              <MemeCard
                title="UI vs. UX: The Desire Path"
                category="#UXDesign"
                img="/images/memes/ui-vs-ux-desire-path.jpg"
                description="This meme perfectly illustrates the difference between User Interface (the paved path) and User Experience (the shortcut people actually take). It reminds designers that users will always find the most efficient route, regardless of the design."
                slug="ui-vs-ux-desire-path"
                onClick={() => handleCardClick('ui-vs-ux-desire-path')}
                className="snap-start"
              />
              <MemeCard
                title="99 Little Bugs in the Code"
                category="#DebuggingLife"
                img="/images/memes/99-bugs-in-the-code.jpg"
                description={'Based on the "99 Bottles of Beer" song, this meme describes the never-ending cycle of debugging where fixing one bug inevitably leads to discovering many more.'}
                slug="99-bugs-in-the-code"
                onClick={() => handleCardClick('99-bugs-in-the-code')}
                className="snap-start"
              />
              <MemeCard
                title="Graphic Design is My Passion"
                category="#GraphicDesign"
                img="/images/memes/graphic-design-passion.jpg"
                description={'A sarcastic meme featuring a poorly edited rainbow background and a frog. It is used by designers to mock low-quality design work or "client-ready" requests that ignore all design principles.'}
                slug="graphic-design-passion"
                onClick={() => handleCardClick('graphic-design-passion')}
                className="snap-start"
              />
              <MemeCard
                title="Frontend vs. Backend (The Horse)"
                category="#WebDev"
                img="/images/memes/frontend-vs-backend-horse.webp"
                description="This meme shows a drawing of a horse where the front is a majestic, detailed masterpiece (Frontend) and the back is a crude stick-figure sketch (Backend), or vice versa, representing the disparity in polish between different parts of a project."
                slug="frontend-vs-backend-horse"
                onClick={() => handleCardClick('frontend-vs-backend-horse')}
                className="snap-start"
              />
              <MemeCard
                title="CSS Overflow: The Struggle is Real"
                category="#CSS"
                img="/images/memes/css-overflow-struggle.webp"
                description={'A simple but effective visual of a container where the word "OVERFLOW" spills out of its borders. It’s a meta-commentary on the difficulty of mastering the CSS box model and layout properties.'}
                slug="css-overflow-struggle"
                onClick={() => handleCardClick('css-overflow-struggle')}
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
              <ArtCard
                title="The Primary Slant"
                blurColor="var(--color-primary)"
                slug="primary-slant"
                onClick={() => handleCardClick('primary-slant')}
                className="snap-start"
              />
              <ArtCard
                title="Temporal Matrix"
                blurColor="#06b6d4"
                slug="temporal-matrix"
                onClick={() => handleCardClick('temporal-matrix')}
                className="snap-start"
              />
              <ArtCard
                title="Hero Engine V2"
                blurColor="#8a2be2"
                slug="hero-engine"
                onClick={() => handleCardClick('hero-engine')}
                className="snap-start"
              />
            </SidelongStrip>
          </div>
        </div>
      </div>
    </div>
  );
}
