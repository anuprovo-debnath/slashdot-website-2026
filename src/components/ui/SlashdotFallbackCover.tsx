'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function SlashdotFallbackCover({ className = "h-48" }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
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
          {/* Group 1: Moving Up-Right */}
          <pattern id="slash-slant-up" x="0" y="0" width="40" height="60" patternUnits="userSpaceOnUse">
            <animateTransform
              attributeName="patternTransform"
              type="translate"
              from="0 0"
              to="40 -60"
              dur="8s"
              repeatCount="indefinite"
            />
            <line x1="10" y1="50" x2="30" y2="10" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.15" />
          </pattern>

          {/* Group 2: Moving Down-Left */}
          <pattern id="slash-slant-down" x="20" y="30" width="40" height="60" patternUnits="userSpaceOnUse">
            <animateTransform
              attributeName="patternTransform"
              type="translate"
              from="0 0"
              to="-40 60"
              dur="8s"
              repeatCount="indefinite"
            />
            <line x1="10" y1="50" x2="30" y2="10" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.15" />
          </pattern>

          {/* Static Pulsing Dots */}
          <pattern id="dots-static" x="0" y="0" width="40" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="2" fill="var(--color-primary)" fillOpacity="0.2">
              <animate attributeName="r" values="1.5;3;1.5" dur="3s" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite" />
            </circle>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#slash-slant-up)" />
        <rect width="100%" height="100%" fill="url(#slash-slant-down)" />
        <rect width="100%" height="100%" fill="url(#dots-static)" />
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