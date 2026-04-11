"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { TagPill } from './TagPill';

interface TagDialogueProps {
  tags: string[];
  onClose: () => void;
  cardRect: DOMRect;
  title?: string;
}

function TagDialogue({ tags, onClose, cardRect, title = "Tags" }: TagDialogueProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.addEventListener('scroll', onClose, { passive: true });
    window.addEventListener('resize', onClose);
    return () => {
      window.removeEventListener('scroll', onClose);
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  if (!mounted) return null;

  const popupWidth = cardRect.width * 0.9;
  const gap = cardRect.width * 0.05;
  const left = cardRect.left + gap;
  const popupBottom = cardRect.bottom - gap / 2;
  const maxPopupHeight = 350;

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-auto bg-white/40 dark:bg-black/60 backdrop-blur-[12px]" onClick={onClose}>
      <div
        className="absolute bg-[var(--background)] border border-[#0291B2]/40 rounded-lg p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)] flex flex-col animate-in fade-in zoom-in duration-200"
        style={{
          width: `${popupWidth}px`,
          left: `${left}px`,
          bottom: `${typeof window !== 'undefined' ? window.innerHeight - popupBottom : 0}px`,
          maxHeight: `${maxPopupHeight}px`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full text-center border-b border-black/5 dark:border-white/5 pb-3">
          <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#0291B2]">{title}</h4>
        </div>

        <div className="flex-1 py-4 overflow-y-auto thin-scrollbar flex flex-wrap gap-2.5 justify-start content-start">
          {tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>

        <div className="absolute bottom-0 right-0 overflow-hidden rounded-br-lg">
          <button
            onClick={onClose}
            className="h-7 w-10 flex items-center justify-center bg-red-500/10 text-red-500 border-t border-l border-red-500/20 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none text-[14px] font-black hover:bg-red-600 hover:text-white transition-all active:brightness-90"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

interface TagSystemProps {
  tags: string[];
  cardRef: React.RefObject<HTMLDivElement | null>;
  title?: string;
}

export function TagSystem({ tags, cardRef, title }: TagSystemProps) {
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        setHasOverflow(containerRef.current.scrollHeight > 30);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tags]);

  const openDialogue = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDialogueOpen(true);
  };

  if (!tags || tags.length === 0) return <div className="h-[48px]" />;

  return (
    <div className="h-[48px] flex items-center shrink-0 border-t border-black/5 dark:border-white/5 px-4 relative z-[20]">
      <div
        ref={containerRef}
        className="flex flex-wrap gap-2 max-h-[26px] overflow-hidden flex-1 justify-start pr-12"
      >
        {tags.map((tag) => (
          <TagPill key={tag} tag={tag} />
        ))}
      </div>

      {hasOverflow && (
        <button
          onClick={openDialogue}
          className="absolute right-4 px-3 py-1 bg-[#0291B2]/10 text-[#0291B2] border border-[#0291B2]/30 rounded-full text-[10px] font-black hover:bg-[#0291B2]/20 transition-all z-[25] shadow-sm uppercase shrink-0"
        >
          ...
        </button>
      )}

      {isDialogueOpen && cardRef.current && (
        <TagDialogue
          tags={tags}
          title={title}
          onClose={() => setIsDialogueOpen(false)}
          cardRect={cardRef.current.getBoundingClientRect()}
        />
      )}
    </div>
  );
}
