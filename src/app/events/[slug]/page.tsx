import { getMarkdownFileBySlug, getMarkdownFiles } from '@/lib/markdown';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';

// 1. Tell Next.js not to try generating pages that don't exist
export const dynamicParams = false;

// 2. Generate the static paths for export
export async function generateStaticParams() {
  const events = getMarkdownFiles('content/events');
  return events.map((event) => ({
    slug: event.slug,
  }));
}

// 3. The actual page component
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Notice the argument order fix: directory first, slug second based on markdown.ts
  const post = getMarkdownFileBySlug('content/events', slug);
  
  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto p-8 prose prose-invert prose-cyan pt-24 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-[var(--foreground)]">{post.frontmatter.title}</h1>
      <div className="mdx-content text-[var(--foreground)] opacity-90 leading-relaxed text-lg 
                      [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6
                      [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-8
                      [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:mt-6">
        <MDXRemote source={post.content} />
      </div>
    </main>
  );
}
