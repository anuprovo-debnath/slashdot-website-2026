"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, parseISO, differenceInDays } from 'date-fns';
import { MarkdownData } from '@/lib/markdown';

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
                       hover:-translate-y-2 overflow-hidden h-[500px] w-full"
          >
            {/* Transparent click overlay for the entire card - moved to top z-index except for interactive elements */}
            <Link 
              href={`/blog/${post.slug}`} 
              onClick={() => handlePostClick(post.slug)}
              className="absolute inset-0 z-[10]"
              aria-label={`Read ${post.frontmatter.title}`}
            />

            {/* Top Badges - increased z-index */}
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

            {/* Image Section (Fixed height if present) */}
            {post.frontmatter.coverImage && (
              <div className="relative w-full h-[220px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10">
                <img 
                  src={post.frontmatter.coverImage} 
                  alt={post.frontmatter.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
            )}

            {/* Content Section - removed blocking z-index */}
            <div className={`p-6 sm:p-7 flex flex-col flex-1 relative ${!post.frontmatter.coverImage ? 'h-full' : ''}`}>
              {/* Header: Author . Date */}
              <div className="relative flex items-center justify-between w-full mb-5 text-[14px] sm:text-[15px] font-bold tracking-tight">
                {/* Author (Clickable) - boosted z-index to stay above the card overlay */}
                <div className="z-[20] relative">
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

                {/* Date */}
                <div className="text-black/50 dark:text-white/50 uppercase tracking-widest text-[11px] sm:text-[12px]">
                  {formattedDate}
                </div>
              </div>
              
              {/* Title and Excerpt */}
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

              {/* Tags fixed at bottom */}
              <div className="mt-auto pt-6 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-3 pointer-events-none">
                {post.frontmatter.tags && post.frontmatter.tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="px-4 py-1.5 bg-[#0291B2]/10 text-[#0291B2] border border-[#0291B2]/30 rounded-full text-[12px] font-black uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
