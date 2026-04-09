import React from 'react';

export default function SlashdotFallbackCover({ className = "h-48" }: { className?: string }) {
  return (
    <div className={`w-full relative overflow-hidden flex items-center justify-center transition-colors duration-300 bg-gray-100 dark:bg-[var(--color-bg)] border-b border-gray-200 dark:border-white/5 ${className}`}>
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="slashdot-pattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            {/* Diagonal Movement Animation */}
            <animateTransform 
              attributeName="patternTransform" 
              type="translate" 
              from="0 0" 
              to="32 32" 
              dur="3s" 
              repeatCount="indefinite" 
            />
            
            {/* The Slash */}
            <text x="4" y="22" fill="var(--color-primary)" fillOpacity="0.15" fontSize="20" fontFamily="sans-serif" fontWeight="bold">/</text>
            
            {/* The Pulsing Dot */}
            <circle cx="24" cy="20" r="2.5" fill="var(--color-primary)" fillOpacity="0.15">
              {/* Pulse the size */}
              <animate 
                attributeName="r" 
                values="1.5; 3.5; 1.5" 
                dur="2s" 
                repeatCount="indefinite" 
              />
              {/* Pulse the opacity for a glowing effect */}
              <animate 
                attributeName="fill-opacity" 
                values="0.1; 0.3; 0.1" 
                dur="2s" 
                repeatCount="indefinite" 
              />
            </circle>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#slashdot-pattern)" />
      </svg>
      
      {/* Centered Logo Badge - Adapts to Light/Dark Mode */}
      <div className="z-10 p-3 rounded-full border bg-white dark:bg-[var(--color-bg)] border-primary/30 shadow-[0_0_15px_rgba(2,145,178,0.2)] transition-colors duration-300">
        <span className="text-primary font-bold text-xl tracking-widest">/.</span>
      </div>
    </div>
  );
}
