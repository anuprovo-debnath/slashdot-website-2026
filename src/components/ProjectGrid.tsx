"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProjectData } from '@/lib/projects';
import SlashdotFallbackCover from './ui/SlashdotFallbackCover';

// Custom inline SVGs to avoid icon library version issues
const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const ExternalIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const PlayIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const StatusBadge = ({ status }: { status: ProjectData['frontmatter']['status'] }) => {
  const styles = {
    Active: "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20 shadow-[0_0_15px_rgba(2,145,178,0.2)]",
    Maintained: "bg-[var(--color-foreground)]/5 text-[var(--color-foreground)]/70 border-[var(--color-foreground)]/10 grayscale",
    Archived: "bg-gray-500/10 text-gray-500/50 border-gray-500/20 shadow-none grayscale opacity-60"
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${styles[status]}`}>
      {status}
    </span>
  );
};

const LinkButton = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0291B2]/5 hover:bg-[#0291B2]/10 text-[#0291B2] border border-[#0291B2]/20 rounded-lg text-[11px] font-bold transition-all active:scale-95 group/btn"
    title={label}
    onClick={(e) => e.stopPropagation()}
  >
    <Icon size={14} />
    <span>{label}</span>
  </a>
);

export default function ProjectGrid({ projects }: { projects: ProjectData[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full px-2">
      {projects.map((project) => {
        const { frontmatter, slug, content } = project;
        const hasImage = !!frontmatter.coverImage;
        const excerpt = content.split('\n').filter(line => line.trim() !== '').slice(0, 3).join(' ');

        return (
          <div
            key={slug}
            className="group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] ring-[#0291B2]/30 shadow-xl transition-all 
                       hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] 
                       hover:-translate-y-2 overflow-hidden h-[450px] w-full"
          >
            {/* Header Visual */}
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
              
              {/* Status Overlay */}
              <div className="absolute top-4 left-4 z-[30] pointer-events-none">
                <StatusBadge status={frontmatter.status} />
              </div>
            </div>

            {/* Text Area */}
            <div className="px-5 pt-4 pb-1 flex flex-col flex-1 overflow-hidden">
              <h3 className="text-2xl font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[#0291B2] transition-colors line-clamp-2 mb-2">
                {frontmatter.title}
              </h3>
              
              <p className="text-base sm:text-sm leading-relaxed text-[var(--foreground)] opacity-80 line-clamp-4 lg:line-clamp-5 overflow-hidden text-ellipsis mb-4 flex-1">
                {excerpt || "No description available for this project."}
              </p>
            </div>

            {/* Footer Zone (Action & Meta) */}
            <div className="h-[52px] flex items-center shrink-0 border-t border-black/5 dark:border-white/5 px-4 overflow-x-auto thin-scrollbar gap-2 z-[20] bg-black/5 dark:bg-white/5">
              {frontmatter.links.github && (
                <LinkButton href={frontmatter.links.github} icon={GithubIcon} label="GitHub" />
              )}
              {frontmatter.links.demo && (
                <LinkButton href={frontmatter.links.demo} icon={ExternalIcon} label="Demo" />
              )}
              {frontmatter.links.youtube && (
                <LinkButton href={frontmatter.links.youtube} icon={PlayIcon} label="Video" />
              )}
              
              <div className="ml-auto flex gap-1.5 overflow-hidden">
                 {frontmatter.tech_stack.slice(0, 2).map((tech) => (
                    <span 
                      key={tech} 
                      className="px-2 py-1 bg-[#0291B2]/10 text-[#0291B2] border border-[#0291B2]/20 rounded-md text-[9px] font-black uppercase tracking-tight whitespace-nowrap"
                    >
                      {tech}
                    </span>
                 ))}
                 {frontmatter.tech_stack.length > 2 && (
                    <span className="text-[10px] font-bold text-[#0291B2] self-center">
                      +{frontmatter.tech_stack.length - 2}
                    </span>
                 )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
