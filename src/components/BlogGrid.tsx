"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, parseISO, differenceInDays } from 'date-fns';
import { MarkdownData } from '@/lib/markdown';

export function BlogGrid({ posts }: { posts: MarkdownData[] }) {
  const [visitedSlugs, setVisitedSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Flag client mount to safely render dynamic states
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
    // Add to visited if not present
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-7xl mx-auto">
      {posts.map((post, index) => {
        // Tag Logic & Metrics
        const isLatest = index === 0;
        const postDate = post.frontmatter.date ? parseISO(post.frontmatter.date) : new Date();
        const daysOld = Math.abs(differenceInDays(new Date(), postDate));
        const isNew = daysOld < 7;
        const isUnread = mounted && !visitedSlugs.includes(post.slug);
        const formattedDate = post.frontmatter.date 
          ? format(postDate, 'MMM do, yyyy')
          : '';

        return (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`} 
            onClick={() => handlePostClick(post.slug)}
            className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-1 ring-[#0291B2]/20 shadow-md transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:ring-[#0291B2]/50 hover:-translate-y-1.5 overflow-hidden aspect-[4/5] min-h-[440px]"
          >
            {/* Top Badges overlay area */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
              {isLatest && mounted && (
                <span className="px-3 py-1 bg-[#0291B2]/95 backdrop-blur-sm text-white text-[10px] font-black rounded-full shadow-lg uppercase tracking-widest border border-white/10">
                  Latest
                </span>
              )}
              {isNew && !isLatest && mounted && (
                <span className="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-black rounded-full shadow-lg uppercase tracking-widest border border-green-400">
                  New
                </span>
              )}
              {isUnread && (
                <span className="relative flex items-center h-[26px] px-3 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-black rounded-full shadow-lg uppercase tracking-widest border border-red-400">
                  <span className="animate-ping absolute right-0 top-0 inline-flex h-2.5 w-2.5 rounded-full bg-red-400 opacity-75 transform translate-x-1 -translate-y-1"></span>
                  Unread
                </span>
              )}
            </div>

            {/* Cover Image Area */}
            <div className={`relative w-full shrink-0 ${post.frontmatter.coverImage ? 'h-1/2' : 'h-1/3 bg-gradient-to-br from-[#0291B2]/20 to-[#0291B2]/5'} overflow-hidden border-b border-black/5 dark:border-white/5`}>
              {post.frontmatter.coverImage ? (
                <img 
                  src={post.frontmatter.coverImage} 
                  alt={post.frontmatter.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-30">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#0291B2] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0012.586 3H12" />
                  </svg>
                </div>
              )}
            </div>

            {/* Text Content Area */}
            <div className="flex flex-col flex-1 p-6 z-10 w-full relative bg-[var(--background)]">
              <time dateTime={post.frontmatter.date} className="text-[11px] font-bold tracking-widest text-[#0291B2] uppercase mb-3 block">
                {formattedDate}
              </time>
              
              <h3 className="text-xl md:text-2xl font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[#0291B2] transition-colors line-clamp-2 md:line-clamp-3 mb-3">
                {post.frontmatter.title}
              </h3>
              
              <p className="line-clamp-2 md:line-clamp-3 text-sm leading-relaxed text-[var(--foreground)] opacity-75 mb-6 flex-1">
                {post.frontmatter.excerpt}
              </p>

              {/* Tags Area pinned to bottom */}
              <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/10 pointer-events-none">
                <div className="flex flex-wrap gap-2 truncate">
                  {post.frontmatter.tags && post.frontmatter.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2.5 py-1 bg-[#0291B2]/5 text-[#0291B2] border border-[#0291B2]/20 rounded-full text-[11px] font-bold whitespace-nowrap">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
