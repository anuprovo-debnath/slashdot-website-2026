"use client";

import { useEffect } from "react";
import { HeroCanvas } from "@/components/home/HeroCanvas";

export default function Home() {
  useEffect(() => {
    // 1. Force absolute scroll lock natively for cross-platform support during animation
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const unlockScroll = () => {
      // User specifically requested to extend lock by exactly 0.1s past mathematical animation boundary
      setTimeout(() => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }, 100);
    };

    // 2. Safely capture the event dispatched by LoadingScreen precisely when the opacity transition finalizes
    window.addEventListener('slashdot:loader-fade-complete', unlockScroll);

    // Guard fallback: Unlock if returning visitor skipping loader
    if (document.body.classList.contains('stage-active-site') && !document.getElementById('loader-stage')) {
      unlockScroll();
    }

    return () => {
      window.removeEventListener('slashdot:loader-fade-complete', unlockScroll);
    };
  }, []);

  return (
    <div className="relative flex flex-col flex-1 items-center justify-center py-20 px-4 sm:px-6 lg:px-8 min-h-screen overflow-hidden">
      <HeroCanvas />
      <div className="max-w-4xl w-full flex justify-center items-center relative z-10 select-none">
        
        {/* Exact DOM replication of LoadingScreen brand text to enable seamless crossfade illusion */}
        <div className="relative inline-block border border-transparent">
          
          <div className="opacity-0 pointer-events-none whitespace-nowrap font-heading font-black tracking-[4px] leading-[0.85] text-[3.5rem] md:text-[6rem]">
            Slashdot
          </div>
          
          <div className="absolute top-0 left-0 w-full whitespace-nowrap font-heading font-black tracking-[4px] leading-[0.85] text-[3.5rem] md:text-[6rem] text-[var(--color-primary)]">
            Slashdot
          </div>

          <div className="absolute top-[100%] mt-[-5px] right-0 flex flex-col items-end text-right w-full">
            <div className="flex justify-end w-full whitespace-nowrap">
              <span className="text-[#888888] font-sans text-[0.85rem] md:text-[1.2rem] leading-[1.3]">The Coding & Designing</span>
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
