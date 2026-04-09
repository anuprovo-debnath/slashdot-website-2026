"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, parseISO, differenceInDays } from 'date-fns';
import { MarkdownData } from '@/lib/markdown';

export function BlogGrid({ posts }: { posts: MarkdownData[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Flag client mount to safely render dynamic date states without Hydration errors
    setMounted(true);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12 w-full">
      {posts.map((post, index) => {
        // Tag Logic & Metrics
        const isLatest = index === 0;
        const postDate = post.frontmatter.date ? parseISO(post.frontmatter.date) : new Date();
        const daysOld = Math.abs(differenceInDays(new Date(), postDate));
        const isNew = daysOld < 7;
        const formattedDate = post.frontmatter.date 
          ? format(postDate, 'MMM do, yyyy')
          : '';

        return (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`} 
            className="group relative flex flex-col rounded-xl bg-[var(--background)] ring-1 ring-[#0291B2]/20 shadow-md transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:ring-[#0291B2]/50 hover:-translate-y-1.5 overflow-hidden aspect-[4/5] min-h-[400px]"
          >
            {/* Top Badges overlay area */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
              {isLatest && mounted && (
                <span className="px-4 py-1 bg-gradient-to-r from-red-500 to-orange-500 backdrop-blur-sm text-white text-[10px] font-black rounded-full shadow-lg uppercase tracking-widest border border-orange-400">
                  Latest
                </span>
              )}
              {isNew && !isLatest && mounted && (
                <span className="px-4 py-1 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-black rounded-full shadow-lg uppercase tracking-widest border border-green-400">
                  New
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
                <div className="w-full h-full flex items-center justify-center opacity-20">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#0291B2] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Text Content Area */}
            <div className="flex flex-col flex-1 p-5 z-10 w-full relative bg-[var(--background)]">
              <div className="text-[11px] font-bold tracking-widest text-[#0291B2] uppercase mb-3 flex items-center gap-2 truncate">
                <time dateTime={post.frontmatter.date}>{formattedDate}</time>
                {post.frontmatter.author && (
                  <>
                    <span className="text-black/30 dark:text-white/30">•</span>
                    <span className="truncate">{post.frontmatter.author}</span>
                  </>
                )}
              </div>
              
              <h3 className="text-lg md:text-xl font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[#0291B2] transition-colors line-clamp-2 mb-2">
                {post.frontmatter.title}
              </h3>
              
              <p className="line-clamp-2 text-xs md:text-sm leading-relaxed text-[var(--foreground)] opacity-75 mb-4 flex-1">
                {post.frontmatter.excerpt}
              </p>

              {/* Tags Area pinned to bottom */}
              <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/10 pointer-events-none">
                <div className="flex flex-wrap gap-2 truncate">
                  {post.frontmatter.tags && post.frontmatter.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2.5 py-1 bg-[#0291B2]/5 text-[#0291B2] border border-[#0291B2]/20 rounded-full text-[10px] font-bold whitespace-nowrap">
                      {tag}
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
