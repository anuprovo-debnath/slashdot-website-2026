"use client";

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { format, parseISO, differenceInDays } from 'date-fns';
import { MarkdownData } from '@/lib/markdown';
import SlashdotFallbackCover from './ui/SlashdotFallbackCover';
import { TagSystem } from './ui/TagSystem';
import { AuthorPill } from './ui/AuthorPill';
import { getImgPath } from '@/lib/imgUtils';

/**
 * Centered Floating Dialogue (90% width) with Red Bottom-Right X
 */


export function BlogGrid({ posts }: { posts: MarkdownData[] }) {
  const [visitedSlugs, setVisitedSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('slashdot_visited_blogs');
      if (stored) setVisitedSlugs(JSON.parse(stored));
    } catch (e) { }
  }, []);

  const handlePostClick = (slug: string) => {
    if (!visitedSlugs.includes(slug)) {
      const updated = [...visitedSlugs, slug];
      setVisitedSlugs(updated);
      try {
        localStorage.setItem('slashdot_visited_blogs', JSON.stringify(updated));
      } catch (e) { }
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
        const showNew = isNew && (!isLatest || wasVisited) && mounted;
        const hasImage = !!post.frontmatter.coverImage;

        const formattedDate = post.frontmatter.date ? format(postDate, 'MMM do, yyyy') : '';

        return (
          <div
            key={post.slug}
            ref={cardRef}
            className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all 
                       hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] 
                       hover:-translate-y-2 overflow-hidden h-[450px] w-full"
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

            {/* Content Zone (406px - 90%) */}
            <div className="flex flex-col h-[406px] overflow-hidden">
              <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10">
                {hasImage ? (
                  <img src={getImgPath(post.frontmatter.coverImage)} alt={post.frontmatter.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                ) : (
                  <SlashdotFallbackCover className="h-full" />
                )}
              </div>

              <div className="px-5 pt-4 pb-1 flex flex-col flex-1 overflow-hidden">
                <div className="relative flex items-center justify-between w-full mb-1 text-[14px] sm:text-[15px] font-bold tracking-tight">
                  <div className="z-[20] relative text-xl sm:text-[15px]">
                    <AuthorPill author={post.frontmatter.author} />
                  </div>
                  <div className="text-black/50 dark:text-white/50 uppercase tracking-widest text-[11px] sm:text-[12px]">{formattedDate}</div>
                </div>

                <div className="flex flex-col flex-1 min-h-0">
                  <h3 className="text-2xl sm:text-l font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[#0291B2] transition-colors line-clamp-2 shrink-0 mb-1">{post.frontmatter.title}</h3>
                  <p className="text-base sm:text-sm leading-relaxed text-[var(--foreground)] opacity-80 line-clamp-4 sm:line-clamp-5 overflow-hidden text-ellipsis">
                    {post.frontmatter.excerpt}
                  </p>
                </div>
              </div>
            </div>

            <TagSystem tags={post.frontmatter.tags} cardRef={cardRef} />
          </div>
        );
      })}
    </div>
  );
}
