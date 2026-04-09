'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function SlashdotFallbackCover({ className = "h-48" }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className={`w-full bg-gray-50 dark:bg-background ${className}`} />;

  const isDark = resolvedTheme === 'dark';
  const basePath = '/slashdot-website-2026';

  return (
    <div className={`w-full relative overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-background border-b border-gray-200 dark:border-white/5 transition-colors duration-300 ${className}`}>
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Main Pattern Container - Height is 120 to accommodate two distinct 'tracks' */}
          <pattern id="train-pattern" x="0" y="0" width="40" height="120" patternUnits="userSpaceOnUse">

            {/* TRACK 1: Moving Up-Right */}
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="40 -60"
                dur="8s"
                repeatCount="indefinite"
              />
              {/* Slash in the first track (top 60px) */}
              <line x1="10" y1="50" x2="30" y2="10" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.15" />
            </g>

            {/* TRACK 2: Moving Down-Left (Offset by 60px vertically) */}
            <g transform="translate(0, 60)">
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="-40 60"
                dur="8s"
                repeatCount="indefinite"
              />
              {/* Slash in the second track (bottom 60px) */}
              <line x1="10" y1="50" x2="30" y2="10" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.15" />
            </g>

            {/* Pulsing Dots - Static in the middle of each track */}
            <circle cx="30" cy="30" r="2" fill="var(--color-primary)" fillOpacity="0.2">
              <animate attributeName="r" values="1.5;3;1.5" dur="3s" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="30" cy="90" r="2" fill="var(--color-primary)" fillOpacity="0.2">
              <animate attributeName="r" values="1.5;3;1.5" dur="3s" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite" />
            </circle>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#train-pattern)" />
      </svg>

      {/* Theme-Specific Circular Logo Badge */}
      <div className="z-10 p-3 rounded-full bg-white dark:bg-[#1a1a1a] border border-primary/30 shadow-2xl transition-all duration-300">
        <div className="relative h-10 w-10 rounded-full overflow-hidden">
          <Image
            src={`${basePath}${isDark ? '/logos/Logo_Black_BG.png' : '/logos/Logo_White_BG.png'}`}
            alt="Slashdot Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}