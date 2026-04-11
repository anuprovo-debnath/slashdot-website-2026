"use client";

import React from 'react';
import { flushSync } from 'react-dom';

interface TagPillProps {
  tag: string;
  className?: string;
  active?: boolean;
}

export function TagPill({ tag, className = "", active = false }: TagPillProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const dispatchSearch = () => {
      // Logic: If query starts with #, search hub should handle weighting
      window.dispatchEvent(new CustomEvent('slashdot:open-search', {
        detail: { query: `all/ #${tag.replace(/^#/, '')}` }
      }));
    };

    if (!document.startViewTransition) {
      dispatchSearch();
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        dispatchSearch();
      });
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1 bg-[#0291B2]/5 text-[#0291B2] border border-[#0291B2]/20 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap hover:bg-[#0291B2]/10 hover:border-[#0291B2]/40 transition-all active:scale-95 z-[30] relative group/pill ${active ? 'bg-[#0291B2] text-white border-[#0291B2]' : ''} ${className}`}
    >
      <span className="opacity-70 group-hover/pill:opacity-100 transition-opacity mr-0.5">#</span>
      {tag.replace(/^#/, '')}
    </button>
  );
}
