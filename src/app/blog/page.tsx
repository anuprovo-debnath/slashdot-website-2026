import { getMarkdownFiles } from '@/lib/markdown';
import { format, parseISO } from 'date-fns';
import { BlogGrid } from '@/components/BlogGrid';

export default function BlogIndexPage() {
  const posts = getMarkdownFiles('content/blog');

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--foreground)] font-heading">
            Our Blog
          </h1>
          <p className="text-xl text-[var(--foreground)] opacity-80 max-w-2xl mx-auto">
            Updates, tutorials, and insights from Slashdot.
          </p>
        </header>

        {/* Dynamic client-rendered grid */}
        <BlogGrid posts={posts} />
      </div>
    </div>
  );
}
