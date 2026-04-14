"use client";

import React, { useEffect, useRef, useState } from 'react';

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
  const taglineOutRef = useRef<HTMLDivElement>(null);
  const loaderStageRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
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
        if (text[i] === "\n") {
          currentText += "<br>";
        } else {
          currentText += text[i];
        }
        el.innerHTML = currentText + (i < text.length - 1 ? '<span class="loading-cursor"></span>' : '');
        i++;
        await new Promise(r => setTimeout(r, speed));
      }
      el.innerHTML = currentText.replace(/\n/g, '<br>');
    };

    const init = async () => {
      const brandGhost = brandGhostRef.current;
      const tagGhost = tagGhostRef.current;
      const tagScaler = tagScalerRef.current;
      const termPos = termPosRef.current;
      const container = containerRef.current;

      if (!brandGhost || !tagGhost || !tagScaler || !termPos || !container) return;

      const customScale = 0.5; // From --custom-scale in user's file
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

      // Run Intro
      await type(cmdOutRef, '/', getMs('--t-type-cmd') || 150);
      if (dotRef.current) dotRef.current.style.display = 'inline';
      await new Promise(r => setTimeout(r, getMs('--t-pause-loading') || 1200));
      if (dotRef.current) dotRef.current.classList.remove('loading-blink');

      if (welcomeRowRef.current) welcomeRowRef.current.style.visibility = "visible";
      await type(welcomeOutRef, textData.welcome, getMs('--t-type-welcome') || 60);
      await type(brandOutRef, textData.brand, getMs('--t-type-brand') || 150);
      await type(taglineOutRef, textData.tagline, getMs('--t-type-tagline') || 30);

      setTimeout(startMorph, getMs('--t-pause-morph') || 1000);
    };

    const startMorph = () => {
      const loader = containerRef.current;
      const brandOut = brandOutRef.current;
      const finalLogo = document.getElementById('final-logo-pos');

      if (!loader || !brandOut || !finalLogo) {
        // Fallback if logo not found
        document.body.classList.add('stage-active-site');
        setTimeout(() => setIsVisible(false), 1000);
        return;
      }

      const startRect = brandOut.getBoundingClientRect();
      const finalRect = finalLogo.getBoundingClientRect();

      const scale = finalRect.width / startRect.width;
      const xMove = finalRect.left - startRect.left;
      const yMove = finalRect.top - startRect.top;

      const flightTime = getMs('--t-flight') || 1200;
      const handoffTime = getMs('--t-handoff') || 800;

      document.body.classList.add('stage-exit');
      loader.style.transformOrigin = "top left";
      loader.style.transform = `translate(${xMove}px, ${yMove}px) scale(${scale})`;

      setTimeout(() => {
        document.body.classList.add('stage-active-site');
        // Custom event to tell layout we are ready
        window.dispatchEvent(new CustomEvent('slashdot:loading-ready'));
      }, 200);

      setTimeout(() => {
        finalLogo.style.opacity = "1";
        loader.style.opacity = "0";

        setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = 'auto';
        }, handoffTime);

      }, flightTime);
    };

    // Small delay to ensure measurements are correct after layout
    const timeoutId = setTimeout(init, 100);
    return () => clearTimeout(timeoutId);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div id="loader-stage" ref={loaderStageRef} className="fixed inset-0 flex justify-center items-center z-[100] bg-[#0f0f0f]">
      <style jsx global>{`
        :root {
          --c-brand: #0099bc;
          --c-prompt: #ffffff;
          --c-welcome: #ffffff;
          --c-tagline: #888888;
          --c-bg: #0f0f0f;
          
          --f-prompt: var(--font-geist-mono), ui-monospace, monospace;
          --f-cmd: var(--font-geist-mono), ui-monospace, monospace;
          --f-welcome: var(--font-geist-sans), ui-sans-serif, system-ui;
          --f-brand: 'Arista Pro', var(--font-geist-sans), ui-sans-serif, system-ui;
          --f-tagline: var(--font-geist-sans), ui-sans-serif, system-ui;

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
          font-family: var(--f-prompt);
        }

        .tagline-block-loading {
          position: absolute;
          top: 100%;
          margin-top: 5px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          transform-origin: right center;
          transition: opacity var(--t-clutter-exit) ease;
        }

        .brand-text-loading {
          font-size: var(--sz-brand-base);
          font-weight: 900;
          line-height: 0.85;
          letter-spacing: -1px;
          white-space: nowrap;
          font-family: var(--f-brand);
        }

        #site-wrapper-loading {
          opacity: 0;
          transition: opacity var(--t-flight) ease;
        }

        .stage-active-site #site-wrapper-loading {
          opacity: 1;
        }
      `}</style>

      <div className="relative inline-block invisible transition-all duration-[var(--t-flight)] ease-[cubic-bezier(0.7,0,0.3,1)]" ref={containerRef}>
        <div className="terminal-block-loading" ref={termPosRef}>
          <div className="flex whitespace-pre">
            <span className="text-white font-[family-name:var(--f-prompt)]"> </span>
            <span className="text-[#0099bc] font-[family-name:var(--f-prompt)]" ref={cmdOutRef}></span>
            <span className="text-[#0099bc] font-[family-name:var(--f-prompt)] loading-blink hidden" ref={dotRef}>.</span>
          </div>
          <div className="flex invisible whitespace-pre" ref={welcomeRowRef}>
            <span className="text-white font-[family-name:var(--f-prompt)]"> </span>
            <span className="text-white font-[family-name:var(--f-welcome)]" ref={welcomeOutRef}></span>
          </div>
        </div>

        <div className="brand-text-loading opacity-0 pointer-events-none whitespace-nowrap" ref={brandGhostRef}>Slashdot</div>
        <div className="absolute top-0 left-0 w-full brand-text-loading text-[#0099bc] whitespace-nowrap" ref={brandOutRef}></div>

        <div className="tagline-block-loading" ref={tagScalerRef}>
          <div className="opacity-0 pointer-events-none text-[1.2rem] leading-[1.3] font-[family-name:var(--f-tagline)]" ref={tagGhostRef}>
            The Coding & Designing<br />Club of IISER Kolkata
          </div>
          <div className="absolute top-0 left-0 w-full text-[1.2rem] leading-[1.3] text-[#888888] font-[family-name:var(--f-tagline)]" ref={taglineOutRef}></div>
        </div>
      </div>
    </div>
  );
}
