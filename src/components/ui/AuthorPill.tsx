"use client";

import React from 'react';
import { flushSync } from 'react-dom';

interface AuthorPillProps {
  author: string;
  className?: string;
}

export function AuthorPill({ author, className = "" }: AuthorPillProps) {
  if (!author) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const dispatch = () => {
      window.dispatchEvent(new CustomEvent('slashdot:open-search', {
        detail: { query: `all/ @${author}` }
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
      title={`See all posts by ${author}`}
      className={`inline-flex items-center gap-1 text-[#0291B2] hover:underline transition-all active:scale-95 z-[30] relative group/author font-bold ${className}`}
    >
      <span className="opacity-60 group-hover/author:opacity-100 transition-opacity text-[11px]">@</span>
      <span>{author}</span>
    </button>
  );
}
