'use client';
import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function SlashdotFallbackCover({ className = "h-48" }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`w-full relative overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-background border-b border-gray-200 dark:border-white/5 transition-colors duration-300 ${className}`}>
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="slash-up" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="-40 -40" dur="5s" repeatCount="indefinite" />
            <text x="10" y="25" fill="var(--color-primary)" fillOpacity="0.12" fontSize="24" fontWeight="bold">/</text>
          </pattern>
          
          <pattern id="slash-down" x="20" y="20" width="40" height="40" patternUnits="userSpaceOnUse">
            <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="40 40" dur="5s" repeatCount="indefinite" />
            <text x="10" y="25" fill="var(--color-primary)" fillOpacity="0.12" fontSize="24" fontWeight="bold">/</text>
          </pattern>

          <pattern id="dots-static" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="15" r="2" fill="var(--color-primary)" fillOpacity="0.2">
              <animate attributeName="r" values="1.5;3;1.5" dur="3s" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite" />
            </circle>
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#slash-up)" />
        <rect width="100%" height="100%" fill="url(#slash-down)" />
        <rect width="100%" height="100%" fill="url(#dots-static)" />
      </svg>
      
      {/* Theme-Specific Logo Badge */}
      <div className="z-10 p-4 rounded-full bg-background dark:bg-background border border-primary/30 shadow-xl transition-all duration-300">
        <div className="relative h-8 w-24">
          <Image 
            src={isDark ? "/logos/Logo_Black_BG.png" : "/logos/Logo_White_BG.png"}
            alt="Slashdot Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
