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
  <div className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2 overflow-hidden h-[450px] w-full">
    <div className="flex flex-col h-[406px] overflow-hidden relative z-10 w-full pointer-events-none">
      <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-700 transform-gpu"
          unoptimized
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
      </div>
      <div className="px-5 pt-4 pb-1 flex flex-col flex-1 overflow-hidden pointer-events-auto">
        <div className="flex flex-col flex-1 min-h-0">
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
  
  return (
    <div className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2 overflow-hidden h-[450px] w-full">
      <SlashPattern className="opacity-5 text-[#0291B2]" />
      <div className="px-5 pt-6 pb-1 flex-1 flex flex-col z-10 relative h-full">
        <h3 className="text-2xl font-extrabold leading-tight text-[var(--foreground)] mb-2 group-hover:text-[#0291B2] transition-colors line-clamp-2 shrink-0">{title}</h3>
        <p className="text-base sm:text-sm leading-relaxed text-[var(--foreground)] opacity-80 mb-6 line-clamp-2 sm:line-clamp-3">{description}</p>
        
        <div className="flex-1 flex flex-col items-center justify-center bg-foreground/5 rounded-xl border border-foreground/10 shadow-inner group-hover:bg-foreground/[0.03] transition-colors">
          <div className="text-primary font-heading text-6xl mb-6 font-bold tabular-nums tracking-tighter drop-shadow-md">
            {score}
          </div>
          <button 
            onClick={() => setScore(s => s + 10)}
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-bold active:scale-95 transition-transform transform-gpu shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <span>Execute Click</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M13 10V3L4 14h7v8l9-11h-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const ArtCard = ({ title, blurColor }: { title: string; blurColor: string }) => {
  return (
    <div className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2 overflow-hidden h-[450px] w-full">
      <div className="flex-1 relative overflow-hidden bg-black/5 dark:bg-white/5 flex items-center justify-center border-b border-foreground/10">
        {/* CSS Mathematical Generator Art */}
        <div className="relative w-40 h-40 group-hover:scale-110 transition-transform duration-1000 transform-gpu" style={{ animation: 'spin 20s linear infinite' }}>
          <div className="absolute inset-0 rounded-full blur-[30px] opacity-40 group-hover:opacity-70 transition-opacity duration-1000" style={{ backgroundColor: blurColor }}></div>
          <div className="absolute top-0 left-0 w-full h-full border-[6px] border-[#0291B2]/60 mix-blend-multiply dark:mix-blend-screen transition-all duration-700 group-hover:border-[10px]" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}></div>
          <div className="absolute top-[-15px] left-[-15px] w-[calc(100%+30px)] h-[calc(100%+30px)] border-[2px] border-foreground/40 transition-all duration-1000 group-hover:rotate-45" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>
          <div className="absolute top-[15px] left-[15px] w-[calc(100%-30px)] h-[calc(100%-30px)] border-[1px] border-[#0291B2]/40 transition-all duration-1000 group-hover:-rotate-45" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}></div>
        </div>
      </div>
      {/* 44px + text block => 140px reserved area roughly to match grid */}
      <div className="px-5 pt-4 pb-4 bg-[var(--background)] relative z-10 h-[100px] flex flex-col justify-end shrink-0">
        <h3 className="text-2xl sm:text-l font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[#0291B2] transition-colors line-clamp-2 shrink-0 mb-1">{title}</h3>
        <p className="text-[#0291B2] font-bold text-[11px] sm:text-[12px] tracking-widest uppercase mb-auto">Pure CSS Geometry</p>
      </div>
      <SlashPattern className="opacity-0 group-hover:opacity-[0.03] text-primary transition-opacity duration-500" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-2">
            <ArtCard title="Morphing Anomalies" blurColor="var(--color-primary)" />
            <ArtCard title="Fluid Chaos Engine" blurColor="#ff4500" />
            <ArtCard title="Geometric Recursion" blurColor="#8a2be2" />
          </div>
        </section>
        
      </div>
    </main>
  );
}
