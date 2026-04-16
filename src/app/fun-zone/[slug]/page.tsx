import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getMarkdownFiles, getMarkdownFileBySlug } from '@/lib/markdown';
import { getImgPath, MDX_COMPONENTS } from '@/lib/imgUtils';
import { TagPill } from '@/components/ui/TagPill';
import ArtViewerClient from '@/components/fun-zone/ArtViewerClient';
import ScrollToTop from '@/components/ui/ScrollToTop';

export async function generateStaticParams() {
  const items = await getMarkdownFiles('content/funzone');
  return items.map((item) => ({
    slug: item.slug,
  }));
}

export default async function FunZoneDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getMarkdownFileBySlug('content/funzone', slug);

  if (!item) {
    notFound();
  }

  const { frontmatter, content } = item;
  const isMeme = frontmatter.category === 'meme';

  // For Art and Design, we still use the specialized interactive viewer
  if (!isMeme && (frontmatter.category === 'art' || frontmatter.category === 'design')) {
    const meta = {
      title: frontmatter.title,
      description: frontmatter.description || '',
      type: frontmatter.category as any
    };
    return <ArtViewerClient slug={slug} meta={meta} />;
  }

  // For Memes or other content without specialized viewers, use the Blog-style layout
  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <ScrollToTop />
      <article className="max-w-3xl mx-auto">
        <Link href="/fun-zone" className="inline-flex items-center text-[#0291B2] hover:text-[#0291B2]/80 font-semibold mb-8 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Fun Zone
        </Link>
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--foreground)] leading-tight font-heading">
            {frontmatter.title}
          </h1>
          <div className="flex items-center justify-between w-full border-b border-black/5 dark:border-white/10 pb-4 mb-8 text-[15px] font-bold tracking-tight">
            <span className="text-black/40 dark:text-white/40 uppercase tracking-widest text-[12px]">
              {frontmatter.category?.toUpperCase() || 'MEME'}
            </span>
          </div>
          {frontmatter.tags && (
            <div className="flex flex-wrap gap-3 mt-6">
              {frontmatter.tags.map((tag: string) => (
                <TagPill key={tag} tag={tag} />
              ))}
            </div>
          )}
        </header>

        {frontmatter.image ? (
          <div className="mb-14 rounded-2xl overflow-hidden shadow-xl border border-[var(--border)] bg-black/5">
            <img
              src={getImgPath(frontmatter.image)}
              alt={frontmatter.title}
              className="w-full h-auto object-contain max-h-[600px] mx-auto"
            />
          </div>
        ) : frontmatter.coverImage ? (
          <div className="mb-14 rounded-2xl overflow-hidden shadow-xl border border-[var(--border)] bg-black/5">
            <img
              src={getImgPath(frontmatter.coverImage)}
              alt={frontmatter.title}
              className="w-full h-auto object-contain max-h-[600px] mx-auto"
            />
          </div>
        ) : null}

        <div className="mdx-content text-lg leading-relaxed text-[var(--foreground)] opacity-90 space-y-6 
                        [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-10 [&>h1]:text-[#0291B2]
                        [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-8
                        [&>h3]:text-xl  [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:mt-6
                        [&>p]:mb-6      [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6
                        [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6
                        [&>li]:mb-2     [&>a]:text-[#0291B2] [&>a]:underline [&>a]:font-medium
                        [&>blockquote]:border-l-4 [&>blockquote]:border-[#0291B2] [&>blockquote]:pl-4 [&>blockquote]:italic">
          <MDXRemote source={content} components={MDX_COMPONENTS} />
        </div>
      </article>
    </div>
  );
}
