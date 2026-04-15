"use client";

import { useEffect, useRef } from "react";
import { HeroCanvas } from "@/components/home/HeroCanvas";

export function HomeHero() {
  // Refs for the elements we will animate
  const heroTextRef = useRef<HTMLDivElement>(null); // The transforming flying element
  const midWrapRef = useRef<HTMLDivElement>(null);  // The centering wrapper — offset-corrected for mobile

  useEffect(() => {
    // ── Force manual scroll top on reload to protect animation context ─────
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ── Scroll Lock during loader ──────────────────────────────────────
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const unlockScroll = () => {
      setTimeout(() => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }, 100);
    };

    window.addEventListener('slashdot:loader-fade-complete', unlockScroll);

    if (document.body.classList.contains('stage-active-site') && !document.getElementById('loader-stage')) {
      unlockScroll();
    }


    // How far you need to scroll (as fraction of viewport height) to complete the fly
    const TRANSITION_VIEWPORT_RATIO = 0.45;
    // Dead zone: scroll must exceed this many px before the fly animation begins
    const SCROLL_START_OFFSET = 40;

    // ── Stable cached values (set once, never change) ────────────────────────
    let navLogoEl: HTMLElement | null = null;
    let taglineEl: HTMLElement | null = null;
    let transitionEnd = 0;

    // These are computed ONCE when we switch to fixed — fully viewport-relative
    let fixedDx = 0;  // translate X needed to reach navbar
    let fixedDy = 0;  // translate Y needed to reach navbar
    let fixedScale = 1; // scale factor to match navbar logo size

    // State flags
    let isFixed = false;
    let isAnimating = false;
    let animFrameId: number;

    // ── Lerp state ───────────────────────────────────────────────────────────
    const LERP = 0.12;
    let targetRatio = 0;
    let smoothRatio = 0;

    // Initialise stable references after first paint
    requestAnimationFrame(() => {
      navLogoEl = document.getElementById('final-logo-pos');
      const navTextEl = document.getElementById('final-logo-text');
      taglineEl = heroTextRef.current?.querySelector('.hero-tagline-block') as HTMLElement ?? null;
      transitionEnd = window.innerHeight * TRANSITION_VIEWPORT_RATIO;

      if (heroTextRef.current) heroTextRef.current.style.transformOrigin = 'center center';

      // Pre-cache navbar rect (position:fixed — never moves)
      if (navTextEl) {
        const navRect = navTextEl.getBoundingClientRect();
        // Store for use when we switch to fixed
        (window as any).__slashdotNavRect = navRect;
      }
    });

    // Called once, the moment ratio first exceeds 0
    const switchToFixed = () => {
      if (!heroTextRef.current || isFixed) return;

      // Capture hero's CURRENT viewport position (accounts for any scroll in dead zone)
      const heroRect = heroTextRef.current.getBoundingClientRect();
      const heroCentX = heroRect.left + heroRect.width / 2;
      const heroCentY = heroRect.top + heroRect.height / 2;

      // Compute the total static delta to the navbar — pure viewport coords, never changes
      const navRect: DOMRect = (window as any).__slashdotNavRect
        ?? document.getElementById('final-logo-text')?.getBoundingClientRect();
      if (!navRect) return;

      fixedDx = (navRect.left + navRect.width / 2) - heroCentX;
      fixedDy = (navRect.top + navRect.height / 2) - heroCentY;
      fixedScale = navRect.width / heroRect.width;

      // Detach from document flow at exact current viewport position
      heroTextRef.current.style.position = 'fixed';
      heroTextRef.current.style.left = `${heroRect.left}px`;
      heroTextRef.current.style.top = `${heroRect.top}px`;
      heroTextRef.current.style.width = `${heroRect.width}px`;
      heroTextRef.current.style.margin = '0';

      isFixed = true;
    };

    const restoreToFlow = () => {
      if (!heroTextRef.current || !isFixed) return;
      heroTextRef.current.style.position = '';
      heroTextRef.current.style.left = '';
      heroTextRef.current.style.top = '';
      heroTextRef.current.style.width = '';
      heroTextRef.current.style.margin = '';
      heroTextRef.current.style.transform = '';
      isFixed = false;
    };

    const tick = () => {
      // Lerp ratio toward target — pure ratio space, no scroll math in hot path
      smoothRatio += (targetRatio - smoothRatio) * LERP;
      if (Math.abs(targetRatio - smoothRatio) < 0.0005) smoothRatio = targetRatio;

      // Switch to fixed the moment animation begins
      if (smoothRatio > 0.001 && !isFixed) switchToFixed();
      // Restore to flow when fully scrolled back to top
      if (smoothRatio <= 0.001 && isFixed) restoreToFlow();

      if (heroTextRef.current && navLogoEl && isFixed) {
        const dx = fixedDx * smoothRatio;
        const dy = fixedDy * smoothRatio;
        const s = 1 + (fixedScale - 1) * smoothRatio;

        // Pure viewport-relative transform — zero scroll dependency
        heroTextRef.current.style.transform = `translate(${dx}px,${dy}px) scale(${s})`;

        if (taglineEl) {
          taglineEl.style.opacity = String(Math.max(0, 1 - smoothRatio / 0.3));
        }

        // Keep the flying element permanently visible instead of swapping it out
        heroTextRef.current.style.opacity = '1';
      }

      animFrameId = requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const adjustedScroll = Math.max(0, scrollY - SCROLL_START_OFFSET);
      targetRatio = Math.min(1, Math.max(0, adjustedScroll / transitionEnd));

      if (!isAnimating) {
        isAnimating = true;
        animFrameId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('slashdot:loader-fade-complete', unlockScroll);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div className="relative flex flex-col flex-1 items-center justify-center py-20 px-4 sm:px-6 lg:px-8 min-h-[100svh] overflow-hidden">
      <HeroCanvas />

      <div ref={midWrapRef} className="max-w-4xl w-full flex justify-center items-center relative z-[60] select-none">

        {/*
          This div is the flying element. It starts centered in the hero and
          physically translates + scales into the navbar logo position on scroll.
          It is an exact visual replica of the LoadingScreen brand text for a
          seamless optical handoff from the loader.
        */}
        <div
          ref={heroTextRef}
          className="relative inline-block z-[60]"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Ghost spacer: holds layout width so centering doesn't shift */}
          <div className="opacity-0 pointer-events-none whitespace-nowrap font-heading font-black tracking-[4px] leading-[0.85] text-[3.5rem] md:text-[6rem]">
            Slashdot
          </div>

          {/* Visible "Slashdot /." — matches the final Navbar logo exactly */}
          <div className="absolute top-0 left-0 w-full whitespace-nowrap font-heading font-black tracking-[4px] leading-[0.85] text-[3.5rem] md:text-[6rem] text-neutral-800 dark:text-white flex items-center">
            Slashdot<span className="text-[var(--color-primary)] ml-1">/.</span>
          </div>

          {/* Tagline — fades out in the first 30% of the scroll transition */}
          <div className="hero-tagline-block absolute top-[100%] mt-[-5px] right-0 flex flex-col items-end text-right w-full" style={{ willChange: 'opacity' }}>
            <div className="flex justify-end w-full whitespace-nowrap">
              <span className="text-[#888888] font-sans text-[0.85rem] md:text-[1.2rem] leading-[1.3]">The Coding &amp; Designing</span>
            </div>
            <div className="flex justify-end w-full whitespace-nowrap">
              <span className="text-[#888888] font-sans text-[0.85rem] md:text-[1.2rem] leading-[1.3]">Club of IISER Kolkata</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
