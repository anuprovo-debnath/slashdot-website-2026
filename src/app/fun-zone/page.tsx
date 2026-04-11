"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Functional SVG background ensuring a strict Tan=3 (71-degree) mathematical weave
const SlashPattern = ({ className = "" }: { className?: string }) => (
  <svg
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="slashWeave"
        width="30"
        height="90"
        patternUnits="userSpaceOnUse"
        patternTransform="scale(1.5)"
      >
        {/* dx=30, dy=90 => 90/30 = 3. Tan=3 => 71.56 degrees. */}
        <line x1="30" y1="0" x2="0" y2="90" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
        <line x1="15" y1="0" x2="-15" y2="90" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
        <line x1="45" y1="0" x2="15" y2="90" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#slashWeave)" />
  </svg>
);

const MemeCard = ({ title, category, img }: { title: string; category: string; img: string }) => (
  <div className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all duration-500 hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2 hover:bg-foreground/[0.02] overflow-hidden h-[450px] w-full text-center">
    <div className="flex flex-col h-[406px] overflow-hidden relative z-10 w-full pointer-events-none">
      <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10 flex items-center justify-center">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.05] transition-transform duration-700 transform-gpu"
          unoptimized
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
      </div>
      <div className="px-5 pt-4 pb-1 flex flex-col flex-1 overflow-hidden pointer-events-auto items-center justify-center">
        <div className="flex flex-col flex-1 min-h-0 items-center">
          <h3 className="text-2xl sm:text-l font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[#0291B2] transition-colors line-clamp-2 shrink-0 mb-1">{title}</h3>
          <p className="text-base sm:text-sm leading-relaxed text-[var(--foreground)] opacity-80 line-clamp-4 sm:line-clamp-5 overflow-hidden text-ellipsis">
            Curated dev humor collected from the corners of the network. High visual fidelity, low productivity.
          </p>
        </div>
      </div>
    </div>
    <div className="h-[48px] flex items-center shrink-0 border-t border-black/5 dark:border-white/5 px-4 relative z-[20]">
      <div className="flex flex-wrap gap-2 max-h-[26px] overflow-hidden flex-1 justify-start pr-12">
        <span className="px-3 py-1 bg-[#0291B2]/5 text-[#0291B2] border border-[#0291B2]/20 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
          {category}
        </span>
      </div>
    </div>
    <SlashPattern className="opacity-[0.02] text-[var(--foreground)]" />
  </div>
);

const GameCard = ({ title, description }: { title: string; description: string }) => {
  const [score, setScore] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const leaderboardEntries = [
    { rank: 1, player: "Terminal God", score: 15400 },
    { rank: 2, player: "KernelPanic", score: 12200 },
    { rank: 3, player: "StackOvrflv", score: 9000 },
  ];
  
  return (
    <div className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all duration-500 hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2 hover:bg-foreground/[0.02] overflow-hidden h-[450px] w-full text-center">
      <div className="flex flex-col h-[406px] overflow-hidden relative z-10 w-full pointer-events-none">
        
        {/* Game Area mapped to Image area length of 180px */}
        <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10 flex items-center justify-center pointer-events-auto bg-[var(--background)] transition-transform duration-700 group-hover:scale-[1.03]">
          <SlashPattern className="opacity-5 text-[#0291B2] pointer-events-none" />
          <div className="text-primary font-heading text-6xl font-bold tabular-nums tracking-tighter drop-shadow-md z-10">
            {score}
          </div>
        </div>

        {/* Info Area mapped to Blog text block */}
        <div className="px-5 pt-4 pb-1 flex flex-col flex-1 overflow-hidden pointer-events-auto items-center">
          <div className="flex flex-col flex-1 min-h-0 w-full items-center">
            <h3 className="text-2xl sm:text-l font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[#0291B2] transition-colors line-clamp-1 shrink-0 mb-1">{title}</h3>
            
            {/* Embedded Mini Leaderboard replaces strict description block */}
            <div className="flex-1 w-full bg-black/5 dark:bg-white/5 rounded-lg mb-2 p-3 overflow-hidden border border-black/10 dark:border-white/10">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Live Leaderboard</h4>
              {!mounted ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-3 bg-foreground/10 rounded w-full"></div>
                  <div className="h-3 bg-foreground/10 rounded w-[80%] mx-auto"></div>
                </div>
              ) : (
                <ul className="text-xs space-y-1.5 w-full text-center text-foreground/80 font-medium">
                  {leaderboardEntries.map((l) => (
                     <li key={l.rank} className="flex justify-between items-center px-2">
                       <span className="opacity-50 w-4 text-left">{l.rank}.</span>
                       <span className="flex-1 text-left ml-2 truncate">{l.player}</span>
                       <span className="text-primary font-bold">{l.score}</span>
                     </li>
                  ))}
                </ul>
              )}
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                setScore(s => s + 10);
              }}
              className="px-6 py-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-full font-bold text-sm active:scale-95 transition-transform transform-gpu flex items-center justify-center gap-1 mx-auto mt-auto shrink-0 z-20"
            >
              <span>Play Now</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M13 10V3L4 14h7v8l9-11h-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="h-[48px] flex items-center shrink-0 border-t border-black/5 dark:border-white/5 px-4 relative z-[20]">
        <div className="flex flex-wrap gap-2 max-h-[26px] overflow-hidden flex-1 justify-center w-full">
          <span className="px-3 py-1 bg-[#0291B2]/5 text-[#0291B2] border border-[#0291B2]/20 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
            Interactive
          </span>
        </div>
      </div>
      <SlashPattern className="opacity-0 group-hover:opacity-[0.03] text-[var(--color-primary)] transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

const ArtCard = ({ title, blurColor }: { title: string; blurColor: string }) => {
  return (
    <div className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all duration-500 hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2 hover:bg-foreground/[0.02] overflow-hidden h-[450px] w-full text-center">
      <div className="flex flex-col h-[406px] overflow-hidden relative z-10 w-full pointer-events-none">
        
        {/* CSS Mathematical Generator Art */}
        <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10 flex items-center justify-center bg-black/5 dark:bg-white/5 pointer-events-auto">
          <div className="relative w-32 h-32 group-hover:scale-110 transition-transform duration-1000 transform-gpu" style={{ animation: 'spin 20s linear infinite' }}>
            <div className="absolute inset-0 rounded-full blur-[30px] opacity-40 group-hover:opacity-70 transition-opacity duration-1000" style={{ backgroundColor: blurColor }}></div>
            <div className="absolute top-0 left-0 w-full h-full border-[6px] border-[#0291B2]/60 mix-blend-multiply dark:mix-blend-screen transition-all duration-700 group-hover:border-[10px]" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}></div>
            <div className="absolute top-[-10px] left-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] border-[2px] border-foreground/40 transition-all duration-1000 group-hover:rotate-45" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>
            <div className="absolute top-[10px] left-[10px] w-[calc(100%-20px)] h-[calc(100%-20px)] border-[1px] border-[#0291B2]/40 transition-all duration-1000 group-hover:-rotate-45" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}></div>
          </div>
        </div>

        <div className="px-5 pt-4 pb-1 flex flex-col flex-1 overflow-hidden pointer-events-auto items-center justify-center">
          <div className="flex flex-col flex-1 min-h-0 items-center">
            <h3 className="text-2xl sm:text-l font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[#0291B2] transition-colors line-clamp-2 shrink-0 mb-1">{title}</h3>
            <p className="text-base sm:text-sm leading-relaxed text-[var(--foreground)] opacity-80 line-clamp-4 sm:line-clamp-5 overflow-hidden text-ellipsis">
              Procedurally generated geometric patterns running raw via CSS variables without external dependencies.
            </p>
          </div>
        </div>
      </div>
      <div className="h-[48px] flex items-center shrink-0 border-t border-black/5 dark:border-white/5 px-4 relative z-[20]">
        <div className="flex flex-wrap gap-2 max-h-[26px] overflow-hidden flex-1 justify-center w-full">
          <span className="px-3 py-1 bg-[#0291B2]/5 text-[#0291B2] border border-[#0291B2]/20 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
            Generative
          </span>
        </div>
      </div>
      <SlashPattern className="opacity-0 group-hover:opacity-[0.03] text-primary transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export default function FunZonePage() {
  // Strict Hydration boundary to prevent Client/Server mismatches on static export
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24 min-h-screen transform-gpu transition-all">
      
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
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Memes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full px-2">
            <MemeCard 
              title="When the code compiles cleanly on the first try and you don't know why." 
              category="compilation-panic"
              img="https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80" 
            />
            <MemeCard 
              title="Reacting to the new hydration mismatch in production." 
              category="next-tears"
              img="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=80" 
            />
            <MemeCard 
              title="Convincing the team to rewrite the entire backend in Rust." 
              category="blazingly-fast"
              img="https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&auto=format&fit=crop&q=80" 
            />
          </div>
        </section>

        {/* GAMES SECTION */}
        <section>
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Games</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full px-2">
            <GameCard 
              title="Incremental Stack" 
              description="A client-side only clicker using React state. Maximize your operations per second before the eventual browser tab crash." 
            />
            
            {/* Disabled Game Card Placeholder */}
            <div className="h-[450px] bg-background border-2 border-dashed border-foreground/20 rounded-xl overflow-hidden relative flex flex-col group justify-center items-center p-8 text-center transform-gpu">
              <SlashPattern className="opacity-[0.03] text-foreground" />
              <div className="z-10 bg-background/90 p-8 rounded-2xl backdrop-blur-xl border border-foreground/10 shadow-2xl">
                <svg className="w-10 h-10 mx-auto text-primary mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3 text-opacity-50">Terminal Pong</h3>
                <p className="text-foreground/50 text-sm font-medium uppercase tracking-wider">Awaiting Deployment v2.4</p>
              </div>
            </div>
            
            {/* Disabled Game Card Placeholder */}
            <div className="h-[450px] bg-background border-2 border-dashed border-foreground/20 rounded-xl overflow-hidden relative flex flex-col group justify-center items-center p-8 text-center transform-gpu">
              <SlashPattern className="opacity-[0.03] text-foreground" />
              <div className="z-10 bg-background/90 p-8 rounded-2xl backdrop-blur-xl border border-foreground/10 shadow-2xl">
                <svg className="w-10 h-10 mx-auto text-primary mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3 text-opacity-50">Regex Golf</h3>
                <p className="text-foreground/50 text-sm font-medium uppercase tracking-wider">Awaiting Deployment v3.0</p>
              </div>
            </div>
          </div>
        </section>

        {/* ART GALLERY SECTION */}
        <section>
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Art Gallery</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full px-2">
            <ArtCard title="Morphing Anomalies" blurColor="var(--color-primary)" />
            <ArtCard title="Fluid Chaos Engine" blurColor="#ff4500" />
            <ArtCard title="Geometric Recursion" blurColor="#8a2be2" />
          </div>
        </section>
        
      </div>
    </main>
  );
}
