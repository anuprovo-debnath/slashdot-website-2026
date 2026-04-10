import { getProjects } from '@/lib/projects';
import { getMarkdownFileBySlug } from '@/lib/markdown';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import SlashdotFallbackCover from '@/components/ui/SlashdotFallbackCover';

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Active:     "bg-[#0291B2]/10 text-[#0291B2] border-[#0291B2]/20",
    Maintained: "bg-foreground/5 text-foreground/70 border-foreground/10",
    Archived:   "bg-gray-500/10 text-gray-500/50 border-gray-500/20 grayscale opacity-60",
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border ${styles[status] ?? ''}`}>
      {status}
    </span>
  );
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getMarkdownFileBySlug('content/projects', slug);

  if (!project) notFound();

  const { frontmatter, content } = project;
  const formattedDate = frontmatter.date
    ? format(parseISO(frontmatter.date), 'MMMM do, yyyy')
    : '';

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto">
        {/* Back link — mirrors blog detail */}
        <Link
          href="/projects"
          className="inline-flex items-center text-[#0291B2] hover:text-[#0291B2]/80 font-semibold mb-8 transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--foreground)] leading-tight font-heading">
            {frontmatter.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center justify-between gap-3 w-full border-b border-black/5 dark:border-white/10 pb-4 mb-6 text-[15px] font-bold tracking-tight">
            <div className="flex items-center gap-3">
              <StatusBadge status={frontmatter.status} />
              {frontmatter.category && (
                <span className="text-black/40 dark:text-white/40 uppercase tracking-widest text-[12px]">
                  {frontmatter.category.replace('_', ' ')}
                </span>
              )}
            </div>
            {formattedDate && (
              <time dateTime={frontmatter.date} className="text-black/40 dark:text-white/40 uppercase tracking-widest text-[12px]">
                {formattedDate}
              </time>
            )}
          </div>

          {/* Tech stack tags */}
          {frontmatter.tech_stack?.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mb-6">
              {frontmatter.tech_stack.map((tech: string) => (
                <span key={tech} className="px-4 py-1.5 bg-[#0291B2]/10 text-[#0291B2] rounded-full text-sm font-bold shadow-sm ring-1 ring-inset ring-[#0291B2]/20">
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Project links */}
          {(frontmatter.links?.github || frontmatter.links?.demo || frontmatter.links?.youtube) && (
            <div className="flex flex-wrap gap-3 mt-4">
              {frontmatter.links.github && (
                <a href={frontmatter.links.github} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 px-5 py-2 bg-[#0291B2] text-white rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-md">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  View on GitHub
                </a>
              )}
              {frontmatter.links.demo && (
                <a href={frontmatter.links.demo} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 px-5 py-2 border-2 border-[#0291B2] text-[#0291B2] rounded-full text-sm font-bold hover:bg-[#0291B2] hover:text-white transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Live Demo
                </a>
              )}
              {frontmatter.links.youtube && (
                <a href={frontmatter.links.youtube} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 px-5 py-2 border-2 border-red-500/50 text-red-500 rounded-full text-sm font-bold hover:bg-red-500 hover:text-white transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Watch Video
                </a>
              )}
            </div>
          )}
        </header>

        {/* Cover image */}
        {frontmatter.coverImage ? (
          <div className="mb-14 rounded-2xl overflow-hidden shadow-xl border border-black/10 dark:border-white/10">
            <img src={frontmatter.coverImage} alt={frontmatter.title} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        ) : (
          <div className="mb-14 rounded-2xl overflow-hidden shadow-xl border border-black/10 dark:border-white/10 h-[280px]">
            <SlashdotFallbackCover className="h-full" />
          </div>
        )}

        {/* MDX Content — identical styling to blog posts */}
        <div className="mdx-content text-lg leading-relaxed text-[var(--foreground)] opacity-90 space-y-6 
                        [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-10 [&>h1]:text-[#0291B2]
                        [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-8
                        [&>h3]:text-xl  [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:mt-6
                        [&>p]:mb-6      [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6
                        [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6
                        [&>li]:mb-2     [&>a]:text-[#0291B2] [&>a]:underline [&>a]:font-medium
                        [&>blockquote]:border-l-4 [&>blockquote]:border-[#0291B2] [&>blockquote]:pl-4 [&>blockquote]:italic">
          <MDXRemote source={content} />
        </div>
      </article>
    </div>
  );
}
