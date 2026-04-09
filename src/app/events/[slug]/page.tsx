import { getMarkdownFiles, getMarkdownFileBySlug } from '@/lib/markdown';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';

export const dynamicParams = false;

export async function generateStaticParams() {
  const events = getMarkdownFiles('events');
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getMarkdownFileBySlug('events', slug);

  if (!event) {
    notFound();
  }

  const formattedDate = event.frontmatter.date 
    ? format(parseISO(event.frontmatter.date), 'MMMM do, yyyy')
    : '';

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--foreground)]">
            {event.frontmatter.title}
          </h1>
          {formattedDate && (
            <time dateTime={event.frontmatter.date} className="text-lg md:text-xl text-[#0291B2] font-semibold tracking-wide">
              {formattedDate}
            </time>
          )}
          {event.frontmatter.tags && (
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {event.frontmatter.tags.map((tag: string) => (
                <span key={tag} className="px-4 py-1.5 bg-[#0291B2]/10 text-[#0291B2] rounded-full text-sm font-bold shadow-sm ring-1 ring-inset ring-[#0291B2]/20">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {event.frontmatter.coverImage && (
          <div className="mb-14 rounded-2xl overflow-hidden shadow-2xl shadow-black/5 ring-1 ring-black/5 dark:ring-white/10">
            <img 
              src={event.frontmatter.coverImage} 
              alt={event.frontmatter.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Global styles for MDX content could be placed here or in a global css file */}
        <div className="mdx-content text-lg leading-relaxed text-[var(--foreground)] opacity-90 space-y-6 
                        [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-10 
                        [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-8
                        [&>h3]:text-xl  [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:mt-6
                        [&>p]:mb-6      [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6
                        [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6
                        [&>li]:mb-2     [&>a]:text-[#0291B2] [&>a]:underline [&>a]:font-medium
                        [&>blockquote]:border-l-4 [&>blockquote]:border-[#0291B2] [&>blockquote]:pl-4 [&>blockquote]:italic">
          <MDXRemote source={event.content} />
        </div>
      </article>
    </div>
  );
}
