"use client";

import React, { useState, useEffect, useRef } from "react";

interface HomeStripProps {
  title: string;
  subtitle?: string;
  viewAllLink: string;
  children: React.ReactNode;
  rows?: number;
  columnLayout?: string;
  autoScrollInterval?: number;
}

export function HomeStrip({
  title,
  subtitle,
  viewAllLink,
  children,
  rows = 1,
  columnLayout = "auto-cols-[100%] sm:auto-cols-[50%] lg:auto-cols-[33.333%]",
  autoScrollInterval = 5000,
}: HomeStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Intersection Observer for Visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Start when 10% is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // 2. Auto-Scroll Logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isVisible && !isHovered && scrollRef.current) {
      intervalId = setInterval(() => {
        if (scrollRef.current && scrollRef.current.firstElementChild) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          // Calculate card width from first element + gap
          const firstChild = scrollRef.current.firstElementChild as HTMLElement;
          if (!firstChild) return;
          const cardWidth = firstChild.offsetWidth + 24; // gap-6 is 24px

          if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 5) {
            scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
          }
        }
      }, autoScrollInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isVisible, isHovered, autoScrollInterval]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current && scrollRef.current.firstElementChild) {
      const firstChild = scrollRef.current.firstElementChild as HTMLElement;
      const cardWidth = firstChild.offsetWidth + 24; // gap-6 is 24px
      const amount = direction === "left" ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="w-full max-w-5xl mx-auto my-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={() => setIsHovered(true)}
      onPointerUp={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-foreground/10 pb-4 px-10">
        <div className="flex flex-col flex-1">
          <h2 className="text-3xl md:text-4xl font-heading font-black tracking-widest uppercase text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-foreground/60 mt-2 uppercase tracking-[0.2em] text-xs md:text-sm">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => handleScroll("left")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground/5 border border-foreground/10 text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
              aria-label={`Scroll ${title} Left`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground/5 border border-foreground/10 text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
              aria-label={`Scroll ${title} Right`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
          <a
            href={viewAllLink}
            className="px-5 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors font-bold uppercase tracking-wider rounded-xl text-xs whitespace-nowrap"
          >
            View All
          </a>
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)",
        }}
      >
        <div
          ref={scrollRef}
          className={`
            grid grid-flow-col gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar py-6
            px-10 scroll-pl-10
            ${rows === 2 
              ? "grid-rows-1 md:grid-rows-2 h-[500px] md:h-[520px]" 
              : "grid-rows-1 h-[500px]"}
            ${columnLayout}
          `}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
