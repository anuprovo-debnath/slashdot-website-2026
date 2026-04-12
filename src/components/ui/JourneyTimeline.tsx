import React from 'react';

const milestones = [
  { commit: '0x1A2B', date: '2023.01', message: 'Club Foundation. INIT() invoked.' },
  { commit: '0x3F4D', date: '2024.08', message: 'Design system merged. Tan=3 slant normalized.' },
  { commit: '0x7E9A', date: '2025.10', message: 'Hackathon scaled to 500+ participants.' },
  { commit: '0xB2C1', date: '2026.04', message: 'Universal tag architecture deployed to production.' }
];

export function JourneyTimeline() {
  return (
    <div className="relative w-full max-w-3xl mx-auto py-20 px-4">
      <div className="text-center mb-16 relative">
        <h2 className="text-4xl font-extrabold tracking-tight text-[var(--color-primary)] mb-2">Our Journey</h2>
        <p className="font-mono text-xs opacity-50 uppercase tracking-widest">&gt; git log --oneline</p>
      </div>

      <div className="relative">
        {/* The Central Spine (Vertical Line) */}
        <div className="absolute left-[40px] md:left-1/2 top-0 bottom-0 w-px bg-[var(--color-primary)] opacity-20 transform md:-translate-x-1/2"></div>
        
        {/* Connectors with Tan=3 Slant (71 deg) using SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" aria-hidden="true">
          <defs>
            <pattern id="tan3-pattern" width="20" height="60" patternUnits="userSpaceOnUse">
              <path d="M-10,60 l30,-90" stroke="var(--color-primary)" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tan3-pattern)" />
        </svg>

        <div className="space-y-12">
          {milestones.map((item, index) => (
            <div key={item.commit} className="relative flex flex-col md:flex-row items-start md:items-center group">
              {/* Node Indicator */}
              <div className="absolute left-[40px] md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                <div className="w-3 h-3 bg-[var(--background)] border-2 border-[var(--color-primary)] rotate-[-19deg] z-10 group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute w-8 h-[2px] bg-[var(--color-primary)] opacity-30 group-hover:w-16 transition-all duration-300 rotate-[-19deg]"></div>
              </div>

              {/* Content Panel */}
              <div className={`ml-20 md:ml-0 md:w-1/2 flex ${index % 2 === 0 ? 'md:justify-end md:pr-16' : 'md:justify-start md:pl-16 md:ml-auto'}`}>
                <div className="bg-[#0291B2]/5 border border-black/5 dark:border-white/5 p-4 rounded-lg relative overflow-hidden group-hover:border-[var(--color-primary)]/50 transition-colors duration-300 backdrop-blur-sm">
                  {/* Subtle Slant Background */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[var(--color-primary)]/5 to-transparent skew-x-[-19deg] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <div className="flex items-center gap-3 mb-2 opacity-70">
                    <span className="font-mono text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded">
                      {item.commit}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest">{item.date}</span>
                  </div>
                  <p className="font-mono text-sm leading-relaxed">
                    <span className="text-[var(--color-primary)] opacity-50 mr-2">&gt;</span>
                    {item.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
