import React from 'react';
import SlashdotBackground from './SlashdotBackground';

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
        <div className="absolute left-[40px] md:left-1/2 top-0 bottom-0 w-px bg-[var(--color-primary)] opacity-20 transform md:-translate-x-1/2 z-[5]"></div>

        {/* Official Slashdot Brand Background */}
        <div className="absolute top-5 bottom-5 inset-x-0 opacity-40 pointer-events-none z-0 scale-125 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent),linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in]">
          <SlashdotBackground className="!h-full !bg-transparent !border-0" />
        </div>

        <div className="relative z-10 space-y-12">
          {milestones.map((item, index) => {
            const isLeftNode = index % 2 === 0;

            return (
              <div key={item.commit} className="relative flex flex-col md:flex-row items-start md:items-center group">

                {/* DYNAMIC NODE INDICATOR (Merged Logic) */}
                <div className="absolute left-[40px] md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-16 h-16">

                  {/* The Pivot Dot */}
                  <div className="absolute w-2 h-2 bg-[var(--color-primary)] rounded-full z-10 transition-transform duration-500 translate-x-2 group-hover:scale-125 group-hover:translate-x-0"></div>

                  {/* The Slash (Tan=3 Initial Slant) */}
                  <div
                    className={`absolute h-1 bg-[var(--color-primary)] rounded-full transition-all duration-700 ease-in-out
                      
                      /* POSITIONING & INITIAL STATE */
                      right-1/2 w-10 origin-right
                      rotate-[108.43deg] opacity-80
                      -translate-x-2 translate-y-1

                      /* DYNAMIC ANIMATION SWEEP */
                      ${isLeftNode
                        ? 'group-hover:-translate-x-14 group-hover:-translate-y-0 group-hover:rotate-[180deg] group-hover:w-11 group-hover:opacity-100'
                        : 'group-hover:translate-x-3 group-hover:-translate-y-0 group-hover:rotate-[180deg] group-hover:w-11 group-hover:opacity-100'
                      }
                    `}
                  ></div>
                </div>

                {/* Content Panel (Original Styling) */}
                <div className={`ml-20 md:ml-0 md:w-1/2 flex ${isLeftNode ? 'md:justify-end md:pr-16' : 'md:justify-start md:pl-16 md:ml-auto'}`}>
                  <div className="bg-[#0291B2]/5 border border-black/5 dark:border-white/5 p-5 rounded-lg relative overflow-hidden group-hover:border-[var(--color-primary)]/50 transition-all duration-300 backdrop-blur-sm group-hover:shadow-[0_0_30px_-10px_rgba(0,163,204,0.3)]">

                    {/* Subtle Slant Background */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[var(--color-primary)]/5 to-transparent skew-x-[-19deg] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                    <div className="flex items-center gap-3 mb-2 opacity-70">
                      <span className="font-mono text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded border border-[var(--color-primary)]/20">
                        {item.commit}
                      </span>
                      <span className="font-mono text-[10px] tracking-widest">{item.date}</span>
                    </div>

                    <div className="flex items-start gap-2 font-mono text-sm leading-relaxed">
                      <span className="text-[var(--color-primary)] opacity-50 shrink-0">&gt;</span>
                      <p>{item.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}