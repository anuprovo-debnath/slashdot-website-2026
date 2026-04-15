"use client";

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const textData = {
  welcome: "Welcome to",
  brand: "Slashdot",
  tagline: "The Coding & Designing\nClub of IISER Kolkata"
};

export function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const brandOutRef = useRef<HTMLDivElement>(null);
  const brandGhostRef = useRef<HTMLDivElement>(null);
  const tagGhostRef = useRef<HTMLDivElement>(null);
  const tagScalerRef = useRef<HTMLDivElement>(null);
  const termPosRef = useRef<HTMLDivElement>(null);
  const cmdOutRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const welcomeOutRef = useRef<HTMLSpanElement>(null);
  const welcomeRowRef = useRef<HTMLDivElement>(null);
  const tagLine1Ref = useRef<HTMLSpanElement>(null);
  const tagLine2Ref = useRef<HTMLSpanElement>(null);
  const loaderStageRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Only run the loading animation on the home page.
    // On all other pages, immediately reveal the site.
    if (pathname !== '/') {
      document.body.classList.add('stage-active-site');
      document.body.classList.remove('overflow-hidden');
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('slashdot:loading-ready', { detail: { skipped: true } }));
      window.dispatchEvent(new CustomEvent('slashdot:loader-fade-complete'));
      setIsVisible(false);
      return;
    }

    // Check for "Returning Visitor" to skip animation
    const SKIP_STORAGE_KEY = 'slashdot_last_visit';
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    const now = Date.now();
    const lastVisit = localStorage.getItem(SKIP_STORAGE_KEY);

    if (lastVisit && (now - parseInt(lastVisit)) < TWENTY_FOUR_HOURS) {
      // Immediate reveal for returning users
      document.body.classList.add('stage-active-site');
      document.body.classList.remove('overflow-hidden');
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('slashdot:loading-ready', { detail: { skipped: true } }));
      window.dispatchEvent(new CustomEvent('slashdot:loader-fade-complete'));
      setIsVisible(false);
      return;
    }

    // Set visit timestamp for next time
    localStorage.setItem(SKIP_STORAGE_KEY, now.toString());

    if (!isVisible) return;


    const getMs = (varName: string) => {
      if (typeof window === 'undefined') return 0;
      const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      return val.endsWith('ms') ? parseFloat(val) : parseFloat(val) * 1000;
    };

    const measureText = (text: string, fontSize: string, fontFamily: string) => {
      const span = document.createElement('span');
      span.style.visibility = "hidden";
      span.style.position = "absolute";
      span.style.whiteSpace = "pre";
      span.style.fontSize = fontSize;
      span.style.fontFamily = fontFamily;
      span.innerText = text;
      document.body.appendChild(span);
      const w = span.offsetWidth;
      document.body.removeChild(span);
      return w;
    };

    const type = async (ref: React.RefObject<HTMLElement | null>, text: string, speed: number) => {
      if (!ref.current) return;
      const el = ref.current;
      let currentText = "";
      let i = 0;
      while (i < text.length) {
        currentText += text[i];
        el.innerHTML = currentText + (i < text.length - 1 ? '<span class="loading-cursor"></span>' : '');
        i++;
        await new Promise(r => setTimeout(r, speed));
      }
      el.innerHTML = currentText;
    };

    const init = async () => {
      const brandGhost = brandGhostRef.current;
      const tagGhost = tagGhostRef.current;
      const tagScaler = tagScalerRef.current;
      const termPos = termPosRef.current;
      const container = containerRef.current;
      const brandOut = brandOutRef.current;
      const finalLogoText = document.getElementById('final-logo-text');

      if (!brandGhost || !tagGhost || !tagScaler || !termPos || !container || !finalLogoText || !brandOut) return;

      const customScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--custom-scale')) || 0.5;
      const brandW = brandGhost.offsetWidth;
      const tagW = tagGhost.offsetWidth;
      tagScaler.style.transform = `scaleX(${(customScale * brandW) / tagW})`;

      const promptFontSize = getComputedStyle(document.documentElement).getPropertyValue('--sz-terminal').trim() || "1.4rem";
      const promptFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--f-prompt').trim() || "monospace";
      const welcomeFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--f-welcome').trim() || "sans-serif";

      const promptW = measureText("> ", promptFontSize, promptFontFamily);
      const welcomeOnlyW = measureText(textData.welcome, promptFontSize, welcomeFontFamily);
      termPos.style.left = window.innerWidth > 768 ? `-${promptW + welcomeOnlyW}px` : `-${promptW}px`;

      container.style.visibility = "visible";

      // 1. Type '/'
      await type(cmdOutRef, '/', getMs('--t-type-cmd') || 150);
      if (dotRef.current) {
        dotRef.current.style.display = 'inline';
        dotRef.current.classList.add('loading-blink');
      }
      await new Promise(r => setTimeout(r, getMs('--t-pause-loading') || 1200));
      if (dotRef.current) dotRef.current.classList.remove('loading-blink');

      // 2. Type "Welcome to" and "Slashdot"
      if (welcomeRowRef.current) welcomeRowRef.current.style.visibility = "visible";
      await type(welcomeOutRef, textData.welcome, getMs('--t-type-welcome') || 60);
      await type(brandOutRef, textData.brand, getMs('--t-type-brand') || 150);

      // 3. Type Tagline Line 1
      await type(tagLine1Ref, "The Coding & Designing", getMs('--t-type-tagline') || 30);

      // 4. Type Tagline Line 2
      await type(tagLine2Ref, "Club of IISER Kolkata", getMs('--t-type-tagline') || 30);

      setTimeout(startMorph, getMs('--t-pause-morph') || 1000);
    };

    const startMorph = () => {
      const loader = containerRef.current;
      const brandOut = brandOutRef.current;
      const finalLogoPos = document.getElementById('final-logo-pos');
      const finalLogoText = document.getElementById('final-logo-text');

      if (!loader || !brandOut || !finalLogoPos || !finalLogoText) {
        document.body.classList.add('stage-active-site');
        const logo = document.getElementById('final-logo-pos');
        if (logo) logo.style.opacity = "1";
        setTimeout(() => setIsVisible(false), 1000);
        return;
      }

      const flightTime = getMs('--t-flight') || 1200;
      const handoffTime = getMs('--t-handoff') || 800;

      // ======================================================================
      // HOME PAGE BRANCH
      // ======================================================================
      if (pathname === '/') {
        document.body.classList.add('stage-exit');

        setTimeout(() => {
          document.body.classList.add('stage-active-site');
          window.dispatchEvent(new CustomEvent('slashdot:loading-ready'));
          if (loaderStageRef.current) {
            loaderStageRef.current.style.backgroundColor = 'transparent';
            loaderStageRef.current.style.transition = `background-color ${flightTime}ms ease`;
          }
        }, 200);

        setTimeout(() => {
          finalLogoPos.style.opacity = "1"; // Let Nav logo reveal as normal up top

          setTimeout(() => {
            loader.style.opacity = "0"; // Fade the entire ghost text wrapper identically into the Hero
            loader.style.transition = `opacity ${handoffTime}ms ease`;
            if (loaderStageRef.current) {
              loaderStageRef.current.style.opacity = "0";
              loaderStageRef.current.style.transition = `opacity ${handoffTime}ms ease`;
            }
          }, 1500);

          setTimeout(() => {
            setIsVisible(false);
            window.dispatchEvent(new CustomEvent('slashdot:loader-fade-complete'));
          }, 1500 + handoffTime);
        }, flightTime);

        return; // Halt here. Do not execute flight translations below.
      }

      // ======================================================================
      // ORIGINAL FLIGHT BRANCH (For /blog, /team, etc)
      // ======================================================================

      const startRect = brandOut.getBoundingClientRect();
      const finalRect = finalLogoText.getBoundingClientRect();
      const scale = finalRect.width / startRect.width;
      const xMove = finalRect.left - startRect.left;
      const yMove = finalRect.top - startRect.top + (finalRect.height - startRect.height * scale) / 2;

      // Split characters for staggered exit synced with Navbar reveal
      const text = brandOut.innerText;
      brandOut.innerHTML = text.split('').map((char, i) =>
        `<span class="loader-char-exit" style="--i: ${i}">${char}</span>`
      ).join('');

      document.body.classList.add('stage-exit');
      loader.style.transformOrigin = "top left";
      loader.style.transform = `translate(${xMove}px, ${yMove}px) scale(${scale})`;

      setTimeout(() => {
        document.body.classList.add('stage-active-site');
        window.dispatchEvent(new CustomEvent('slashdot:loading-ready'));
        if (loaderStageRef.current) {
          loaderStageRef.current.style.backgroundColor = 'transparent';
          loaderStageRef.current.style.transition = `background-color ${flightTime}ms ease`;
        }
      }, 200);

      setTimeout(() => {
        // We let the staggered character animations handle the disappearance 
        // by keeping the main container visible until the sequence finishes (~flight + 1.5s)
        finalLogoPos.style.opacity = "1";

        setTimeout(() => {
          loader.style.opacity = "0";
          if (loaderStageRef.current) {
            loaderStageRef.current.style.opacity = "0";
            loaderStageRef.current.style.transition = `opacity ${handoffTime}ms ease`;
          }
        }, 1500);

        setTimeout(() => {
          setIsVisible(false);
          document.body.classList.remove('overflow-hidden');
          document.body.style.overflow = '';
          window.dispatchEvent(new CustomEvent('slashdot:loader-fade-complete'));
        }, 1500 + handoffTime);
      }, flightTime);
    };

    const timeoutId = setTimeout(init, 100);
    return () => clearTimeout(timeoutId);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div id="loader-stage" ref={loaderStageRef} className="fixed top-0 left-0 right-0 flex justify-center items-center z-[100]" style={{ backgroundColor: '#0f0f0f', height: '100svh' }}>
      <style jsx global>{`
        :root {
          --c-prompt: #ffffff;
          --c-welcome: #ffffff;
          --c-tagline: #888888;
          --c-bg: #0f0f0f;
          --sz-terminal: 1.4rem;
          --sz-brand-base: 6rem;
          --sz-nav-logo: 1.8rem;
          --t-type-cmd: 150ms;
          --t-type-welcome: 60ms;
          --t-type-brand: 150ms;
          --t-type-tagline: 30ms;
          --t-pause-loading: 1.2s;
          --t-pause-morph: 1s;
          --t-flight: 1.2s;
          --t-handoff: 0.8s;
          --t-bg-reveal: 2s;
          --t-clutter-exit: 0.5s;
        }

        @media (max-width: 768px) {
          :root {
            --sz-brand-base: 3.5rem;
            --sz-terminal: 1.1rem;
          }
        }

        .loading-cursor {
          display: inline-block;
          width: 0.5em;
          height: 1em;
          background-color: currentColor;
          margin-left: 2px;
          vertical-align: middle;
        }

        .loading-blink { 
          animation: loading-blink-anim 0.8s step-start infinite; 
        }
        @keyframes loading-blink-anim { 50% { opacity: 0; } }

        .stage-exit .terminal-block-loading, 
        .stage-exit .tagline-block-loading { 
          opacity: 0; 
          transition: opacity var(--t-clutter-exit) ease;
        }

        .terminal-block-loading {
          position: absolute;
          bottom: 100%;
          margin-bottom: 5px;
          font-size: var(--sz-terminal);
          white-space: nowrap;
          font-family: var(--font-geist-mono);
        }

        .tagline-block-loading {
          position: absolute;
          top: 100%;
          margin-top: -5px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          transform-origin: right center;
          transition: opacity var(--t-clutter-exit) ease;
        }

        .console-line {
            display: flex;
            justify-content: flex-end;
            width: 100%;
            white-space: nowrap;
        }

        .tag-text {
            color: var(--c-tagline);
            font-family: var(--font-geist-sans);
            font-size: 1.2rem;
            line-height: 1.3;
        }

        @media (max-width: 768px) {
          .tag-text {
            font-size: 0.85rem;
          }
        }

        .brand-text-loading {
          font-size: var(--sz-brand-base);
          font-weight: 900;
          line-height: 0.85;
          letter-spacing: 4px;
          white-space: nowrap;
          font-family: var(--font-brand);
        }

        .loader-char-exit {
          display: inline-block;
          --rev-char-stagger: 0.16s;
          --rev-char-duration: 0.1s;
          animation: char-exit var(--rev-char-duration) step-end forwards;
          animation-delay: calc(var(--i) * var(--rev-char-stagger) + var(--t-flight) + 0.2s);
        }

        @keyframes char-exit {
          0% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }
      `}</style>

      <div className="relative inline-block invisible" style={{ transition: 'transform var(--t-flight) linear, opacity var(--t-handoff) ease' }} ref={containerRef}>
        <div className="terminal-block-loading" ref={termPosRef}>
          <div className="flex whitespace-pre">
            <span className="text-white font-[family-name:var(--font-geist-mono)]">{"> "}</span>
            <span className="text-[var(--color-primary)] font-[family-name:var(--font-geist-mono)]" ref={cmdOutRef}></span>
            <span className="text-[var(--color-primary)] font-[family-name:var(--font-geist-mono)] hidden" ref={dotRef}>.</span>
          </div>
          <div className="flex invisible whitespace-pre" ref={welcomeRowRef}>
            <span className="text-white font-[family-name:var(--font-geist-mono)]">{"> "}</span>
            <span className="text-white font-[family-name:var(--font-geist-sans)]" ref={welcomeOutRef}></span>
          </div>
        </div>

        <div className="brand-text-loading opacity-0 pointer-events-none whitespace-nowrap" ref={brandGhostRef}>Slashdot</div>
        <div className="absolute top-0 left-0 w-full brand-text-loading text-[var(--color-primary)] whitespace-nowrap" ref={brandOutRef}></div>

        <div className="tagline-block-loading" ref={tagScalerRef}>
          <div className="console-line">
            <span ref={tagLine1Ref} className="tag-text"></span>
          </div>
          <div className="console-line">
            <span ref={tagLine2Ref} className="tag-text"></span>
          </div>

          <div id="tagline-ghost" className="opacity-0 pointer-events-none text-[1.2rem] leading-[1.3] font-[family-name:var(--font-geist-sans)]" ref={tagGhostRef}>
            The Coding & Designing<br />Club of IISER Kolkata
          </div>
        </div>
      </div>
    </div>
  );
}
