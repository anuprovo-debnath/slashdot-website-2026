'use client';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function SlashdotBackground({ className = "h-48" }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className={`w-full bg-gray-50 dark:bg-background ${className}`} />;

  return (
    <div className={`w-full relative overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-background border-b border-gray-200 dark:border-white/5 transition-colors duration-300 ${className}`}>
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* UP GROUP: Moves entirely along the Tan=3 slope (80, -240) */}
          <pattern id="matrix-up" x="0" y="0" width="80" height="240" patternUnits="userSpaceOnUse">
            <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="80 -240" dur="15s" repeatCount="indefinite" />
            {/* R0C0 */} <line x1="5" y1="45" x2="15" y2="15" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
            {/* R1C3 */} <line x1="65" y1="105" x2="75" y2="75" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
            {/* R2C2 */} <line x1="45" y1="165" x2="55" y2="135" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
            {/* R3C1 */} <line x1="25" y1="225" x2="35" y2="195" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
          </pattern>

          {/* DOWN GROUP: Moves oppositely along the Tan=3 slope (-80, 240) */}
          <pattern id="matrix-down" x="0" y="0" width="80" height="240" patternUnits="userSpaceOnUse">
            <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="-80 240" dur="15s" repeatCount="indefinite" />
            {/* R0C2 */} <line x1="45" y1="45" x2="55" y2="15" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
            {/* R1C1 */} <line x1="25" y1="105" x2="35" y2="75" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
            {/* R2C0 */} <line x1="5" y1="165" x2="15" y2="135" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
            {/* R3C3 */} <line x1="65" y1="225" x2="75" y2="195" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
          </pattern>

          {/* STATIC DOTS: Repeats every 40x120 within the matrix */}
          <pattern id="matrix-dots" x="0" y="0" width="40" height="120" patternUnits="userSpaceOnUse">
            {/* R0C1 */}
            <circle cx="30" cy="30" r="1.5" fill="var(--color-primary)" fillOpacity="0.4">
              <animate attributeName="r" values="1;2.2;1" dur="3s" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.2;0.7;0.2" dur="3s" repeatCount="indefinite" />
            </circle>
            {/* R1C0 */}
            <circle cx="10" cy="90" r="1.5" fill="var(--color-primary)" fillOpacity="0.4">
              <animate attributeName="r" values="1;3;1" dur="3s" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.2;0.7;0.2" dur="3s" repeatCount="indefinite" />
            </circle>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#matrix-up)" />
        <rect width="100%" height="100%" fill="url(#matrix-down)" />
        <rect width="100%" height="100%" fill="url(#matrix-dots)" />
      </svg>
    </div>
  );
}