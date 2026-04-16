import { getMarkdownFiles, getMarkdownFileBySlug } from '@/lib/markdown';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { TagPill } from '@/components/ui/TagPill';
import { AuthorPill } from '@/components/ui/AuthorPill';
import { getImgPath, MDX_COMPONENTS } from '@/lib/imgUtils';

export const dynamicParams = false;

export async function generateStaticParams() {
  const items = await getMarkdownFiles('content/blog');
  return items.map((item) => ({
    slug: item.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getMarkdownFileBySlug('content/blog', slug);

  if (!post) {
    notFound();
  }

  const formattedDate = post.frontmatter.date
    ? format(parseISO(post.frontmatter.date), 'MMMM do, yyyy')
    : '';

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center text-[#0291B2] hover:text-[#0291B2]/80 font-semibold mb-8 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--foreground)] leading-tight">
            {post.frontmatter.title}
          </h1>
          <div className="flex items-center justify-between w-full border-b border-black/5 dark:border-white/10 pb-4 mb-8 text-[15px] font-bold tracking-tight">
            {post.frontmatter.author && (
              <div className="z-20 relative">
                <AuthorPill author={post.frontmatter.author} />
              </div>
            )}

            {formattedDate && (
              <time dateTime={post.frontmatter.date} className="text-black/40 dark:text-white/40 uppercase tracking-widest text-[12px]">
                {formattedDate}
              </time>
            )}
          </div>
          {post.frontmatter.tags && (
            <div className="flex flex-wrap gap-3 mt-6">
              {post.frontmatter.tags.map((tag: string) => (
                <TagPill key={tag} tag={tag} />
              ))}
            </div>
          )}
        </header>

        {post.frontmatter.coverImage && (
          <div className="mb-14 rounded-2xl overflow-hidden shadow-xl border border-[var(--border)]">
            <img
              src={getImgPath(post.frontmatter.coverImage)}
              alt={post.frontmatter.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        <div className="mdx-content text-lg leading-relaxed text-[var(--foreground)] opacity-90 space-y-6 
                        [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-10 [&>h1]:text-[#0291B2]
                        [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-8
                        [&>h3]:text-xl  [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:mt-6
                        [&>p]:mb-6      [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6
                        [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6
                        [&>li]:mb-2     [&>a]:text-[#0291B2] [&>a]:underline [&>a]:font-medium
                        [&>blockquote]:border-l-4 [&>blockquote]:border-[#0291B2] [&>blockquote]:pl-4 [&>blockquote]:italic">
          <MDXRemote source={post.content} components={MDX_COMPONENTS} />
        </div>
      </article>
    </div>
  );
}
