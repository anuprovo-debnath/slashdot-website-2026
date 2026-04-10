"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProjectData } from '@/lib/projects';
import SlashdotFallbackCover from './ui/SlashdotFallbackCover';

// Custom inline SVGs — stable across lucide versions
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const StatusBadge = ({ status }: { status: ProjectData['frontmatter']['status'] }) => {
  const styles = {
    Active:     "bg-[#0291B2]/10 text-[#0291B2] border-[#0291B2]/20",
    Maintained: "bg-foreground/5 text-foreground/70 border-foreground/10",
    Archived:   "bg-gray-500/10 text-gray-500/50 border-gray-500/20 grayscale opacity-60",
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function ProjectGrid({ projects }: { projects: ProjectData[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full px-2">
      {projects.map((project) => {
        const { frontmatter, slug, content } = project;
        const hasImage = !!frontmatter.coverImage;
        const excerpt = frontmatter.excerpt
          || content.split('\n').filter(l => l.trim()).slice(0, 3).join(' ');

        return (
          <div
            key={slug}
            className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all 
                       hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] 
                       hover:-translate-y-2 overflow-hidden h-[450px] w-full"
          >
            {/* Full-card clickable link — sits behind the action icons */}
            <Link
              href={`/projects/${slug}`}
              className="absolute inset-0 z-[10]"
              aria-label={`View ${frontmatter.title}`}
            />

            {/* ── HEADER VISUAL ──────────────────────────────────────── */}
            <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10">
              {hasImage ? (
                <img
                  src={frontmatter.coverImage}
                  alt={frontmatter.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              ) : (
                <SlashdotFallbackCover className="h-full" />
              )}

              {/* Status badge — bottom-left */}
              <div className="absolute top-4 left-4 z-[30] pointer-events-none">
                <StatusBadge status={frontmatter.status} />
              </div>

              {/* Action icons — top-right, z-[40] to float above the card link */}
              <div className="absolute top-3 right-3 z-[40] flex gap-2">
                {frontmatter.links.github && (
                  <a
                    href={frontmatter.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 flex items-center justify-center rounded-full 
                               bg-[var(--background)]/20 border border-white/10 backdrop-blur-md 
                               text-white hover:bg-[#0291B2]/60 hover:border-[#0291B2] transition-all"
                    title="GitHub"
                  >
                    <GithubIcon />
                  </a>
                )}
                {frontmatter.links.demo && (
                  <a
                    href={frontmatter.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 flex items-center justify-center rounded-full 
                               bg-[var(--background)]/20 border border-white/10 backdrop-blur-md 
                               text-white hover:bg-[#0291B2]/60 hover:border-[#0291B2] transition-all"
                    title="Live Demo"
                  >
                    <ExternalLinkIcon />
                  </a>
                )}
              </div>
            </div>

            {/* ── TEXT AREA ───────────────────────────────────────────── */}
            <div className="px-5 pt-4 pb-1 flex flex-col flex-1 overflow-hidden">
              {/* Meta row: category + date */}
              <div className="flex items-center justify-between w-full mb-1 text-black/50 dark:text-white/50 uppercase tracking-widest text-[11px] sm:text-[12px] font-bold">
                <span>{frontmatter.category.replace('_', ' ')}</span>
                {frontmatter.date && (
                  <span>{new Date(frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                )}
              </div>

              <div className="flex flex-col flex-1 min-h-0">
                {/* Title */}
                <h3 className="text-2xl sm:text-l font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[#0291B2] transition-colors line-clamp-2 shrink-0 mb-1 font-heading">
                  {frontmatter.title}
                </h3>
                {/* Excerpt */}
                <p className="text-base sm:text-sm leading-relaxed text-[var(--foreground)] opacity-80 line-clamp-3 sm:line-clamp-4 overflow-hidden text-ellipsis mb-2">
                  {excerpt}
                </p>
                {/* Tags (flex-wrap, no scrollbar) */}
                <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                  {frontmatter.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-[#0291B2]/5 text-[#0291B2] border border-[#0291B2]/20 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
