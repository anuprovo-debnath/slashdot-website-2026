import { getMarkdownFiles } from '@/lib/markdown';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

export default function BlogIndexPage() {
  const posts = getMarkdownFiles('content/blog');

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--foreground)]">
            Our Blog
          </h1>
          <p className="text-xl text-[var(--foreground)] opacity-80 max-w-2xl mx-auto">
            Updates, tutorials, and insights from Slashdot.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {posts.map((post) => {
            const formattedDate = post.frontmatter.date 
              ? format(parseISO(post.frontmatter.date), 'MMMM do, yyyy')
              : '';

            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group relative flex flex-col items-start justify-between rounded-2xl bg-[var(--background)] ring-1 ring-[#0291B2]/20 p-8 shadow-sm transition-all hover:shadow-md hover:ring-[#0291B2]/50 hover:-translate-y-1">
                <div className="flex items-center gap-x-4 text-xs">
                  {formattedDate && (
                    <time dateTime={post.frontmatter.date} className="text-[#0291B2] font-semibold">
                      {formattedDate}
                    </time>
                  )}
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-2xl font-bold leading-6 text-[var(--foreground)] group-hover:text-[#0291B2] transition-colors">
                    <span className="absolute inset-0" />
                    {post.frontmatter.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-[var(--foreground)] opacity-80">
                    {post.frontmatter.excerpt}
                  </p>
                </div>
                {post.frontmatter.tags && (
                  <div className="flex flex-wrap gap-2 mt-6 relative z-10">
                    {post.frontmatter.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-[#0291B2]/10 text-[#0291B2] rounded-full text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
