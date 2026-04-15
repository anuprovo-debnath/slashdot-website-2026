import { getMarkdownFiles } from '@/lib/markdown';
import { BlogGrid } from '@/components/BlogGrid';
import { PageHero } from '@/components/ui/PageHero';

export default function BlogIndexPage() {
  const posts = getMarkdownFiles('content/blog');

  return (
    <div className="min-h-screen pb-16">
      <PageHero className="pt-44 pb-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-[var(--foreground)] font-heading">
            Our Blog
          </h1>
          <p className="text-xl text-[var(--foreground)] opacity-80 max-w-2xl mx-auto">
            Updates, tutorials, and insights from Slashdot.
          </p>
        </div>
      </PageHero>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 pt-12 pb-16">
        {/* Dynamic client-rendered grid */}
        <BlogGrid posts={posts} />
      </div>
    </div>
  );
}
