"use client";

import React from 'react';
import { flushSync } from 'react-dom';

interface TypePillProps {
  category: string;
  className?: string;
}

// Folder icon for project type
const FolderIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export function TypePill({ category, className = "" }: TypePillProps) {
  if (!category) return null;

  const displayLabel = category.replace(/_/g, ' ');

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const dispatch = () => {
      window.dispatchEvent(new CustomEvent('slashdot:open-search', {
        detail: { query: `projects/ type:${category}` }
      }));
    };

    if (!document.startViewTransition) {
      dispatch();
      return;
    }
    document.startViewTransition(() => {
      flushSync(dispatch);
    });
  };

  return (
    <button
      onClick={handleClick}
      title={`Browse ${displayLabel} projects`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hover:bg-violet-500/20 hover:border-violet-500/40 transition-all active:scale-95 z-[30] relative ${className}`}
    >
      <FolderIcon />
      {displayLabel}
    </button>
  );
}
