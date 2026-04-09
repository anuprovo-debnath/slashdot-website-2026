"use client";

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { format, parseISO, differenceInDays } from 'date-fns';
import { MarkdownData } from '@/lib/markdown';

/**
 * Centered Floating Dialogue (90% width) with Bottom-X sync
 */
function TagDialogue({ 
  tags, 
  onClose, 
  anchorRect, // "..." button position
  cardRect   // Parent card position
}: { 
  tags: string[], 
  onClose: () => void, 
  anchorRect: DOMRect,
  cardRect: DOMRect
}) {
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

  // Rule: Breadth = 90% of card breadth
  const popupWidth = cardRect.width * 0.9;
  
  // Rule: Horizontally centered with respect to parent card
  const left = cardRect.left + (cardRect.width * 0.05);
  
  // Rule: Appear above the tag row. Bottom of popup aligns with top of trigger row.
  const popupHeight = 240; // Max height for the popup
  const top = anchorRect.top - popupHeight - 8;

  // Rule: Precise "X" Alignment (under the cursor)
  // Since X is at the BOTTOM of the popup, we calculate relative left
  const xLeftOffset = anchorRect.left - left;

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-auto bg-black/5" onClick={onClose}>
      <div 
        className="absolute bg-[var(--background)]/95 backdrop-blur-2xl border border-[#0291B2]/40 rounded-2xl p-6 shadow-[0_-20px_60px_rgba(0,0,0,0.4)] flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{ 
          width: `${popupWidth}px`,
          left: `${left}px`, 
          top: `${top}px`,
          height: `${popupHeight}px`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: "TAGS" Centered */}
        <div className="w-full text-center border-b border-black/5 dark:border-white/5 pb-3">
          <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#0291B2]">Tags</h4>
        </div>

        {/* Content: Right Aligned Tags */}
        <div className="flex-1 py-4 overflow-y-auto thin-scrollbar flex flex-wrap gap-2.5 justify-end content-start">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="px-3.5 py-1.5 bg-[#0291B2]/5 text-[#0291B2] border border-[#0291B2]/20 rounded-full text-[11px] font-bold uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer: Close Button (X) synced to trigger position */}
        <div className="relative w-full h-8 pt-2">
           <button 
            onClick={onClose}
            className="absolute h-8 px-4 bg-[#0291B2]/10 text-[#0291B2] border border-[#0291B2]/40 rounded-full text-[14px] font-black hover:bg-green-500/20 hover:text-green-500 hover:border-green-500/40 transition-all flex items-center justify-center shadow-lg"
            style={{ 
              left: `${xLeftOffset}px`,
              transform: 'translateX(-2px)' // Minor nudge for visual center sync
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function TagArea({ tags, cardRef }: { tags: string[], cardRef: React.RefObject<HTMLDivElement | null> }) {
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        setHasOverflow(containerRef.current.scrollHeight > 24);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tags]);

  const openDialogue = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (triggerRef.current) {
      setAnchorRect(triggerRef.current.getBoundingClientRect());
    }
    setIsDialogueOpen(true);
  };

  if (!tags || tags.length === 0) return <div className="h-[48px]" />;

  return (
    <div className="h-[48px] flex items-center shrink-0 border-t border-black/5 dark:border-white/5 px-4 relative z-[20]">
      {/* Tags Container on the Left */}
      <div 
        ref={containerRef}
        className="flex flex-wrap gap-2 max-h-[22px] overflow-hidden flex-1 justify-start pr-12"
      >
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="px-3 py-1 bg-[#0291B2]/5 text-[#0291B2] border border-[#0291B2]/20 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Right-Aligned Trigger - only appears if overflow is detected */}
      {hasOverflow && (
        <button
          ref={triggerRef}
          onClick={openDialogue}
          className="absolute right-4 px-3 py-1 bg-[#0291B2]/10 text-[#0291B2] border border-[#0291B2]/30 rounded-full text-[10px] font-black hover:bg-[#0291B2]/20 transition-all z-[25] shadow-sm uppercase shrink-0"
        >
          ...
        </button>
      )}

      {isDialogueOpen && anchorRect && cardRef.current && (
        <TagDialogue 
          tags={tags} 
          onClose={() => setIsDialogueOpen(false)} 
          anchorRect={anchorRect}
          cardRect={cardRef.current.getBoundingClientRect()}
        />
      )}
    </div>
  );
}

export function BlogGrid({ posts }: { posts: MarkdownData[] }) {
  const [visitedSlugs, setVisitedSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('slashdot_visited_blogs');
      if (stored) setVisitedSlugs(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const handlePostClick = (slug: string) => {
    if (!visitedSlugs.includes(slug)) {
      const updated = [...visitedSlugs, slug];
      setVisitedSlugs(updated);
      try {
        localStorage.setItem('slashdot_visited_blogs', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full px-2">
      {posts.map((post, index) => {
        const cardRef = useRef<HTMLDivElement>(null);
        const isLatest = index === 0;
        const postDate = post.frontmatter.date ? parseISO(post.frontmatter.date) : new Date();
        const daysOld = Math.abs(differenceInDays(new Date(), postDate));
        const isNew = daysOld < 7;
        const wasVisited = visitedSlugs.includes(post.slug);
        const showLatest = isLatest && !wasVisited && mounted;
        const showNew = isNew && !isLatest && mounted;
        const hasImage = !!post.frontmatter.coverImage;

        const formattedDate = post.frontmatter.date ? format(postDate, 'MMM do, yyyy') : '';

        return (
          <div 
            key={post.slug} 
            ref={cardRef}
            className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all 
                       hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] 
                       hover:-translate-y-2 overflow-hidden h-[480px] w-full"
          >
            <Link 
              href={`/blog/${post.slug}`} 
              onClick={() => handlePostClick(post.slug)}
              className="absolute inset-0 z-[10]"
              aria-label={`Read ${post.frontmatter.title}`}
            />

            <div className="absolute top-4 left-4 z-[30] flex flex-wrap gap-2 pointer-events-none">
              {showLatest && (
                <span className="px-5 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[12px] font-black rounded-full shadow-2xl uppercase tracking-widest border border-white/20">
                  Latest
                </span>
              )}
              {showNew && (
                <span className="px-5 py-2 bg-[#22C55E] text-white text-[12px] font-black rounded-full shadow-2xl uppercase tracking-widest border border-white/20">
                  New
                </span>
              )}
            </div>

            {/* Content Zone (432px - 90%) */}
            <div className={`flex flex-col h-[432px] overflow-hidden ${!hasImage ? 'pt-16' : ''}`}>
              {hasImage && (
                <div className="relative w-full h-[220px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10">
                  <img src={post.frontmatter.coverImage} alt={post.frontmatter.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                </div>
              )}

              <div className="p-6 sm:p-7 flex flex-col flex-1 overflow-hidden">
                <div className="relative flex items-center justify-between w-full mb-5 text-[14px] sm:text-[15px] font-bold tracking-tight">
                  <div className="z-[20] relative text-xl sm:text-[15px]">
                    {post.frontmatter.authorEmail ? (
                      <a href={post.frontmatter.authorEmail} className="text-[#0291B2] hover:underline transition-all active:scale-95 inline-block" onClick={(e) => e.stopPropagation()}>{post.frontmatter.author}</a>
                    ) : (
                      <span className="text-[#0291B2]">{post.frontmatter.author}</span>
                    )}
                  </div>
                  <div className="text-black/50 dark:text-white/50 uppercase tracking-widest text-[11px] sm:text-[12px]">{formattedDate}</div>
                </div>
                
                <div className="flex flex-col flex-1 overflow-hidden">
                  <h3 className="text-2xl sm:text-xl font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[#0291B2] transition-colors line-clamp-2 shrink-0 mb-3">{post.frontmatter.title}</h3>
                  <p className="text-xl sm:text-sm leading-relaxed text-[var(--foreground)] opacity-80 overflow-hidden">
                    <span className="line-clamp-4 lg:line-clamp-6">{post.frontmatter.excerpt}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Tag Zone (48px - 10%) */}
            <TagArea tags={post.frontmatter.tags} cardRef={cardRef} />
          </div>
        );
      })}
    </div>
  );
}
