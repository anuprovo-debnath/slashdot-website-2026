"use client";

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { format, parseISO, differenceInDays } from 'date-fns';
import { MarkdownData } from '@/lib/markdown';

/**
 * The Floating Dialogue that renders outside the card via Portal
 */
function TagDialogue({ 
  tags, 
  onClose, 
  anchorRect 
}: { 
  tags: string[], 
  onClose: () => void, 
  anchorRect: DOMRect 
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-close on scroll or resize as coordinates will shift
    window.addEventListener('scroll', onClose, { passive: true });
    window.addEventListener('resize', onClose);
    return () => {
      window.removeEventListener('scroll', onClose);
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  if (!mounted) return null;

  // Calculate position: The "X" should be at the same spot as "..."
  // The popup will be positioned absolute.
  // We'll calculate the top/left based on the anchorRect (the ... button)
  const popupWidth = 280;
  const padding = 16;
  
  // Pivot point: The right-edge of the trigger tag
  const left = anchorRect.left - popupWidth + anchorRect.width;
  const top = anchorRect.top - 120; // Default expansion upwards

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] pointer-events-auto"
      onClick={onClose}
    >
      <div 
        className="absolute bg-[var(--background)]/90 backdrop-blur-xl border border-[#0291B2]/40 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] w-[280px] animate-in fade-in zoom-in duration-200"
        style={{ 
          left: `${Math.max(padding, left)}px`, 
          top: `${Math.max(padding, top)}px` 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0291B2] opacity-60">All Tags</h4>
          {/* The "X" Button positioned roughly where "..." was relative to the screen */}
          <button 
            onClick={onClose}
            className="px-3 py-1 bg-[#0291B2]/10 text-[#0291B2] border border-[#0291B2]/30 rounded-full text-[10px] font-black hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/40 transition-all"
          >
            ×
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="px-3 py-1 bg-[#0291B2]/5 text-[#0291B2] border border-[#0291B2]/20 rounded-full text-[10px] font-bold uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

function TagArea({ tags }: { tags: string[] }) {
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        setHasOverflow(containerRef.current.scrollHeight > 28);
      }
    };
    
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tags]);

  const toggleDialogue = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (triggerRef.current) {
      setAnchorRect(triggerRef.current.getBoundingClientRect());
    }
    setIsDialogueOpen(!isDialogueOpen);
  };

  if (!tags || tags.length === 0) return null;

  return (
    <div className="mt-auto pt-4 border-t border-black/10 dark:border-white/10 relative z-[20]">
      <div 
        ref={containerRef}
        className="flex flex-wrap gap-2 max-h-[26px] overflow-hidden pr-10 relative"
      >
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="px-3 py-1 bg-[#0291B2]/5 text-[#0291B2] border border-[#0291B2]/20 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>

      {hasOverflow && (
        <button
          ref={triggerRef}
          onClick={toggleDialogue}
          className="absolute right-0 bottom-0 px-3 py-1 bg-[#0291B2]/10 text-[#0291B2] border border-[#0291B2]/30 rounded-full text-[10px] font-black hover:bg-[#0291B2]/20 transition-all z-[25]"
        >
          ...
        </button>
      )}

      {isDialogueOpen && anchorRect && (
        <TagDialogue 
          tags={tags} 
          onClose={() => setIsDialogueOpen(false)} 
          anchorRect={anchorRect}
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
      if (stored) {
        setVisitedSlugs(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Could not read localstorage", e);
    }
  }, []);

  const handlePostClick = (slug: string) => {
    if (!visitedSlugs.includes(slug)) {
      const updated = [...visitedSlugs, slug];
      setVisitedSlugs(updated);
      try {
        localStorage.setItem('slashdot_visited_blogs', JSON.stringify(updated));
      } catch (e) {
        console.error("Could not write localstorage", e);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full px-2">
      {posts.map((post, index) => {
        const isLatest = index === 0;
        const postDate = post.frontmatter.date ? parseISO(post.frontmatter.date) : new Date();
        const daysOld = Math.abs(differenceInDays(new Date(), postDate));
        const isNew = daysOld < 7;
        const wasVisited = visitedSlugs.includes(post.slug);
        const showLatest = isLatest && !wasVisited && mounted;
        const showNew = isNew && !isLatest && mounted;

        const formattedDate = post.frontmatter.date 
          ? format(postDate, 'MMM do, yyyy')
          : '';

        return (
          <div 
            key={post.slug} 
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

            {post.frontmatter.coverImage && (
              <div className="relative w-full h-[220px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10">
                <img 
                  src={post.frontmatter.coverImage} 
                  alt={post.frontmatter.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
            )}

            <div className={`p-6 sm:p-7 flex flex-col flex-1 relative ${!post.frontmatter.coverImage ? 'h-full' : ''}`}>
              <div className="relative flex items-center justify-between w-full mb-5 text-[14px] sm:text-[15px] font-bold tracking-tight">
                <div className="z-[20] relative text-xl sm:text-[15px]">
                  {post.frontmatter.authorEmail ? (
                    <a 
                      href={post.frontmatter.authorEmail}
                      className="text-[#0291B2] hover:underline transition-all active:scale-95 inline-block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {post.frontmatter.author}
                    </a>
                  ) : (
                    <span className="text-[#0291B2]">{post.frontmatter.author}</span>
                  )}
                </div>

                <div className="text-black/50 dark:text-white/50 uppercase tracking-widest text-[11px] sm:text-[12px]">
                  {formattedDate}
                </div>
              </div>
              
              <div className="flex flex-col flex-1 gap-4 overflow-hidden">
                <h3 className="text-2xl sm:text-xl font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[#0291B2] transition-colors line-clamp-2 shrink-0">
                  {post.frontmatter.title}
                </h3>
                
                <p className="text-xl sm:text-sm leading-relaxed text-[var(--foreground)] opacity-80 overflow-hidden">
                  <span className="line-clamp-3 sm:line-clamp-4">
                    {post.frontmatter.excerpt}
                  </span>
                </p>
              </div>

              <TagArea tags={post.frontmatter.tags} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
