"use client";

import React, { useState, useEffect } from 'react';
import { MemberFlipCard, TeamMember } from './ui/MemberFlipCard';

export function TeamDashboard({ initialMembers }: { initialMembers: TeamMember[] }) {
  const [isLegacy, setIsLegacy] = useState(false);

  // Auto-scroll logic for #Hash anchor links (Relational Search)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Remove the # character for querySelector if it's safe, but css ID selectors can be tricky if they have spaces. 
      // The name should not have special characters.
      try {
        // Small delay to ensure components are mounted and layout shift is complete
        setTimeout(() => {
          // Decode URL component because hash might be encoded (e.g., #Josh)
          const targetId = decodeURIComponent(hash.substring(1));
          const target = document.getElementById(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight effect using Tailwind's rich ring utilities
            target.classList.add('ring-4', 'ring-[var(--color-primary)]', 'ring-offset-4', 'ring-offset-[var(--background)]', 'rounded-xl');
            setTimeout(() => {
              target.classList.remove('ring-4', 'ring-[var(--color-primary)]', 'ring-offset-4', 'ring-offset-[var(--background)]', 'rounded-xl');
            }, 2500);
          }
        }, 500);
      } catch (e) {
        console.warn("Invalid hash selector:", hash);
      }
    }
  }, []);

  const activeMembers = initialMembers.filter(m => !m.frontmatter.isAlumni);
  const legacyMembers = initialMembers.filter(m => m.frontmatter.isAlumni === true);
  const currentView = isLegacy ? legacyMembers : activeMembers;

  return (
    <div className="w-full">
      <div className="flex justify-center mb-16">
        <div className="bg-[#0291B2]/10 border border-[#0291B2]/20 p-1.5 rounded-full inline-flex relative shadow-inner">
          <div 
            className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-[var(--color-primary)] rounded-full transition-transform duration-400 ease-[cubic-bezier(0.87,0,0.13,1)] shadow-md`}
            style={{ transform: isLegacy ? 'translateX(100%)' : 'translateX(0)' }}
          />
          <button 
            className={`relative px-10 py-3 text-xs md:text-sm font-black uppercase tracking-widest transition-colors duration-300 z-10 w-32 md:w-40 ${!isLegacy ? 'text-[var(--background)]' : 'text-[var(--color-primary)] hover:opacity-80'}`}
            onClick={() => setIsLegacy(false)}
          >
            Current
          </button>
          <button 
            className={`relative px-10 py-3 text-xs md:text-sm font-black uppercase tracking-widest transition-colors duration-300 z-10 w-32 md:w-40 ${isLegacy ? 'text-[var(--background)]' : 'text-[var(--color-primary)] hover:opacity-80'}`}
            onClick={() => setIsLegacy(true)}
          >
            Legacy
          </button>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto px-6 overflow-hidden min-h-[50vh] content-start">
        {currentView.length > 0 ? (
          currentView.map(member => (
            <MemberFlipCard key={member.slug} member={member} />
          ))
        ) : (
          <div className="col-span-full flex justify-center py-24 opacity-50 font-mono text-sm uppercase tracking-widest">
            No {isLegacy ? 'legacy' : 'active'} members found.
          </div>
        )}
      </div>
    </div>
  );
}
