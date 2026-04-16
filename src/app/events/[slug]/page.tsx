import { getEvents, getEventBySlug } from '@/lib/events';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { TagPill } from '@/components/ui/TagPill';
import { EventStatusBadge } from '@/components/events/EventStatusBadge';
import { getImgPath, MDX_COMPONENTS } from '@/lib/imgUtils';

export const dynamicParams = false;

export function generateStaticParams() {
  const items = getEvents();
  return items.map((item) => ({
    slug: item.slug,
  }));
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const { title, date, time, category, status, resources, gallery } = event.frontmatter;

  const parsedDate = new Date(date);
  const formattedDate = !isNaN(parsedDate.getTime()) 
    ? format(parsedDate, 'MMMM do, yyyy')
    : date;

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto">
        <Link href="/events" className="inline-flex items-center text-[#0291B2] hover:text-[#0291B2]/80 font-bold mb-8 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events Hub
        </Link>
        <header className="mb-12">
          {/* Category Top Label */}
          <div className="mb-4">
            <TagPill tag={category} />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-[var(--foreground)] leading-tight">
            {title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full border-b border-black/5 dark:border-white/10 pb-6 mb-8 gap-4">
            <div className="flex flex-col gap-1">
              <time dateTime={date} className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                {formattedDate}
              </time>
              <span className="text-sm text-foreground/50 uppercase tracking-widest font-medium">
                {time}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <EventStatusBadge event={event.frontmatter} />
            </div>
          </div>

          {resources && Object.keys(resources).length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
              {Object.entries(resources).map(([type, url]) => (
                <a 
                  key={type} 
                  href={url as string} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[11px] font-black px-5 py-2.5 rounded-full border border-foreground/10 text-[var(--foreground)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all uppercase tracking-[0.15em] shadow-sm"
                >
                  {type}
                </a>
              ))}
            </div>
          )}
        </header>

        {(gallery && gallery.length > 0 ? gallery[0] : event.frontmatter.coverImage) && (
          <div className="mb-14 rounded-2xl overflow-hidden shadow-xl border border-[var(--border)]">
            <img
              src={getImgPath((gallery && gallery.length > 0 ? gallery[0] : event.frontmatter.coverImage) as string)}
              alt={`${title} highlight`}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Content Body */}
        <div className="mdx-content text-lg leading-relaxed text-[var(--foreground)] opacity-90 space-y-6 
                        [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-10 [&>h1]:text-[#0291B2]
                        [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-8
                        [&>h3]:text-xl  [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:mt-6
                        [&>p]:mb-6      [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6
                        [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6
                        [&>li]:mb-2     [&>a]:text-[#0291B2] [&>a]:underline [&>a]:font-medium
                        [&>blockquote]:border-l-4 [&>blockquote]:border-[#0291B2] [&>blockquote]:pl-4 [&>blockquote]:italic">
          <MDXRemote source={event.content} components={MDX_COMPONENTS} />
        </div>
      </article>
    </div>
  );
}

