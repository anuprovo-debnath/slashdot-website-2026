import { getMarkdownFiles, getMarkdownFileBySlug } from '@/lib/markdown';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = getMarkdownFiles('blog');
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getMarkdownFileBySlug('blog', slug);

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
          <div className="flex items-center gap-4 text-[#0291B2] font-semibold tracking-wide">
            {formattedDate && (
              <time dateTime={post.frontmatter.date}>
                {formattedDate}
              </time>
            )}
            {post.frontmatter.author && (
              <>
                <span aria-hidden="true" className="text-gray-400">•</span>
                <span>{post.frontmatter.author}</span>
              </>
            )}
          </div>
          {post.frontmatter.tags && (
            <div className="flex flex-wrap gap-3 mt-6">
              {post.frontmatter.tags.map((tag: string) => (
                <span key={tag} className="px-4 py-1.5 bg-[#0291B2]/10 text-[#0291B2] rounded-full text-sm font-bold shadow-sm ring-1 ring-inset ring-[#0291B2]/20">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.frontmatter.coverImage && (
          <div className="mb-14 rounded-2xl overflow-hidden shadow-xl border border-[var(--border)]">
            <img
              src={post.frontmatter.coverImage}
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
          <MDXRemote source={post.content} />
        </div>
      </article>
    </div>
  );
}
