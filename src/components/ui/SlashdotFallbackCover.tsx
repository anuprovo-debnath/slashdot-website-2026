import React from 'react';

export default function SlashdotFallbackCover({ className = "h-48" }: { className?: string }) {
  return (
    <div className={`w-full bg-[#1e1e1e] border-b border-[#262626] relative overflow-hidden flex items-center justify-center ${className}`}>
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="slashdot-pattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <text x="4" y="22" fill="#0291B2" fillOpacity="0.15" fontSize="20" fontFamily="sans-serif" fontWeight="bold">/</text>
            <circle cx="24" cy="20" r="2.5" fill="#0291B2" fillOpacity="0.15" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#slashdot-pattern)" />
      </svg>
      
      {/* Centered Logo Badge */}
      <div className="z-10 bg-[#262626] p-3 rounded-full border border-[#0291B2]/30 shadow-[0_0_15px_rgba(2,145,178,0.2)]">
        <span className="text-[#0291B2] font-bold text-xl tracking-widest">/.</span>
      </div>
    </div>
  );
}
