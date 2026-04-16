"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MemeCard, GameCard, ArtCard } from '../fun-zone/FunZoneCards';

interface HomeFunPreviewProps {
  memes: any[];
  games: any[];
  art: any[];
}

export const HomeFunPreview = ({ memes, games, art }: HomeFunPreviewProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  const [selection, setSelection] = useState<{
    meme: any | null;
    game: any | null;
    art: any | null;
  }>({
    meme: null,
    game: null,
    art: null
  });

  useEffect(() => {
    if (memes.length > 0 && games.length > 0 && art.length > 0) {
      const randomMeme = memes[Math.floor(Math.random() * memes.length)];
      const randomGame = games[Math.floor(Math.random() * games.length)];
      const randomArt = art[Math.floor(Math.random() * art.length)];

      setSelection({
        meme: randomMeme,
        game: randomGame,
        art: randomArt
      });
    }
  }, [memes, games, art]);

  // Auto-scroll logic (Mobile Only)
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const handleAutoScroll = () => {
      if (scrollRef.current && !isHovered) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollWidth > clientWidth) {
          const firstChild = scrollRef.current.firstElementChild as HTMLElement;
          if (!firstChild) return;
          const cardWidth = firstChild.offsetWidth + 24;

          if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 5) {
            scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
          }
        }
      }
    };

    intervalId = setInterval(handleAutoScroll, 5000);
    return () => clearInterval(intervalId);
  }, [isHovered]);

  if (!selection.meme) return null;

  return (
    <section 
      className="w-full max-w-5xl mx-auto my-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-foreground/10 pb-4 px-10">
        <div className="flex flex-col flex-1">
          <h2 className="text-3xl md:text-4xl font-heading font-black tracking-widest uppercase text-foreground">
            Neural <span className="text-[var(--color-primary)]">Playground</span>
          </h2>
          <p className="text-foreground/60 mt-2 uppercase tracking-[0.2em] text-xs md:text-sm">
            Zero Productivity • Zero Regrets
          </p>
        </div>
        
        <Link 
          href="/fun-zone" 
          className="px-5 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors font-bold uppercase tracking-wider rounded-xl text-xs whitespace-nowrap"
        >
          View Funzone
        </Link>
      </div>

      <div className="relative mask-horizontal-faded lg:overflow-visible">
        <div 
          ref={scrollRef}
          className="grid grid-flow-col auto-cols-[100%] sm:auto-cols-[calc(50%-12px)] lg:grid-cols-3 lg:grid-flow-row gap-6 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory lg:snap-none hide-scrollbar px-10 scroll-pl-10 h-[500px]"
        >
          <div className="snap-start w-full">
            <MemeCard
              title={selection.meme.frontmatter.title}
              category={selection.meme.frontmatter.category_label || "#" + (selection.meme.frontmatter.tags?.[0] || "Meme")}
              img={selection.meme.frontmatter.image || selection.meme.frontmatter.coverImage}
              description={selection.meme.frontmatter.description}
              slug={selection.meme.slug}
            />
          </div>
          <div className="snap-start w-full">
            <GameCard
              title={selection.game.frontmatter.title}
              description={selection.game.frontmatter.description}
              url={selection.game.frontmatter.url}
              imgUrl={selection.game.frontmatter.image || selection.game.frontmatter.coverImage}
              tags={selection.game.frontmatter.tags || []}
              slug={selection.game.slug}
            />
          </div>
          <div className="snap-start w-full">
            <ArtCard
              title={selection.art.frontmatter.title}
              blurColor={selection.art.frontmatter.blurColor || "var(--color-primary)"}
              slug={selection.art.slug}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
