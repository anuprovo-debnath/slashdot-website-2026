"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ProjectData } from '@/lib/projects';
import SlashdotFallbackCover from './ui/SlashdotFallbackCover';
import { TagSystem } from './ui/TagSystem';
import { TypePill } from './ui/TypePill';

// ─── Inline SVGs (version-stable) ────────────────────────────────────────────
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active:     'bg-gradient-to-r from-[#0291B2] to-[#06b6d4] text-white border-white/20',
    Maintained: 'bg-white/20 text-white border-white/20',
    Archived:   'bg-black/30 text-white/60 border-white/10',
  };
  return (
    <span className={`px-5 py-2 text-[12px] font-black rounded-full shadow-2xl uppercase tracking-widest border ${styles[status] ?? 'bg-white/20 text-white border-white/20'}`}>
      {status}
    </span>
  );
}

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => { setMounted(true); }, []);

  const { frontmatter, slug, content } = project;
  const hasImage = !!frontmatter.coverImage;
  const excerpt = frontmatter.excerpt
    || content.split('\n').filter(l => l.trim()).slice(0, 3).join(' ');
  const formattedDate = frontmatter.date ? format(parseISO(frontmatter.date), 'MMM do, yyyy') : '';

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all 
                 hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] 
                 hover:-translate-y-2 overflow-hidden h-[420px] w-full"
    >
      <Link
        href={`/projects/${slug}`}
        className="absolute inset-0 z-[10]"
        aria-label={`View ${frontmatter.title}`}
      />

      <div className="absolute top-4 left-4 z-[30] flex flex-wrap gap-2 pointer-events-none">
        {mounted && <StatusBadge status={frontmatter.status} />}
      </div>

      <div className="absolute top-3 right-3 z-[40] flex gap-2">
        {frontmatter.links?.github && (
          <a
            href={frontmatter.links.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="GitHub"
            className="w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md bg-[var(--background)]/20 border border-white/10 text-white hover:bg-[var(--color-primary)]/70 hover:border-[var(--color-primary)] transition-all"
          >
            <GithubIcon />
          </a>
        )}
        {frontmatter.links?.demo && (
          <a
            href={frontmatter.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Live Demo"
            className="w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md bg-[var(--background)]/20 border border-white/10 text-white hover:bg-[var(--color-primary)]/70 hover:border-[var(--color-primary)] transition-all"
          >
            <ExternalLinkIcon />
          </a>
        )}
      </div>

      <div className="flex flex-col h-[376px] overflow-hidden">
        <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10">
          {hasImage ? (
            <img src={frontmatter.coverImage} alt={frontmatter.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
          ) : (
            <SlashdotFallbackCover className="h-full" />
          )}
        </div>

        <div className="px-5 pt-4 pb-1 flex flex-col flex-1 overflow-hidden">
          <div className="relative flex items-center justify-between w-full mb-1 text-[14px] sm:text-[15px] font-bold tracking-tight">
            <div className="z-[20] relative text-xl sm:text-[15px]">
              <TypePill category={frontmatter.category} />
            </div>
            <div className="text-black/50 dark:text-white/50 uppercase tracking-widest text-[11px] sm:text-[12px]">
              {formattedDate}
            </div>
          </div>

          <div className="flex flex-col flex-1 min-h-0">
            <h3 className="text-2xl sm:text-l font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 shrink-0 mb-1">
              {frontmatter.title}
            </h3>
            <p className="text-base sm:text-sm leading-relaxed text-[var(--foreground)] opacity-80 line-clamp-4 sm:line-clamp-5 overflow-hidden text-ellipsis">
              {excerpt}
            </p>
          </div>
        </div>
      </div>

      <TagSystem tags={frontmatter.tech_stack} cardRef={cardRef} title="Tech Stack" />
    </div>
  );
}
