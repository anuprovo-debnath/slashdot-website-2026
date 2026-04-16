import { HomeHero } from "@/components/home/HomeHero";
import { getMarkdownFiles } from "@/lib/markdown";
import { getEvents } from "@/lib/events";
import { getProjects } from "@/lib/projects";
import { HomeStrip } from "@/components/home/HomeStrip";
import { BlogCard } from "@/components/BlogCard";
import { ProjectCard } from "@/components/ProjectCard";
import { EventCard } from "@/components/EventCard";
import { HomeFunPreview } from "@/components/home/HomeFunPreview";
import Link from 'next/link';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Slashdot | The Coding & Designing Club of IISER Kolkata',
  description: 'The official website of the Slashdot club, showcasing our blog, events, and projects.',
};

export default function Home() {
  // Fetch data
  const allBlogs = getMarkdownFiles('content/blog');
  const recentBlogs = allBlogs.slice(0, 9); // Total 9 max

  const allEvents = getEvents();
  const topEvents = allEvents.slice(0, 8); // Total 8 max

  const allProjects = getProjects();
  const activeProjects = allProjects.slice(0, 9); // Same as blogs

  const allFunZone = getMarkdownFiles('content/funzone');
  const funMemes = allFunZone.filter(item => item.frontmatter.category?.trim().toLowerCase() === 'meme');
  const funGames = allFunZone.filter(item => item.frontmatter.category?.trim().toLowerCase() === 'game');
  const funArt = allFunZone.filter(item => {
    const cat = item.frontmatter.category?.trim().toLowerCase();
    return cat === 'art' || cat === 'design';
  });

  return (
    <div className="flex flex-col w-full">
      {/* The cinematic interactive Hero Canvas */}
      <HomeHero />

      <div className="flex flex-col items-center w-full bg-[var(--background)] pb-24 z-10 relative overflow-hidden">

        {/* 1. MISSION BRIEFS (Events) - 2 rows, horizontal scrolling */}
        <HomeStrip
          title="Mission Briefs"
          subtitle="Upcoming Events & Workshops"
          viewAllLink="/events"
          rows={2}
          columnLayout="auto-cols-[100%]"
        >
          {topEvents.map((event) => (
            <div key={event.slug} className="snap-start w-full h-full py-1">
              <EventCard event={event} />
            </div>
          ))}
        </HomeStrip>

        {/* 2. LATEST TRANSMISSIONS (Blogs) - 1 row, horizontal scrolling */}
        <HomeStrip
          title="Latest Transmissions"
          subtitle="From the Slashdot Blog"
          viewAllLink="/blog"
          rows={1}
          columnLayout="auto-cols-[100%] sm:auto-cols-[calc(50%-16px)] lg:auto-cols-[calc(33.333%-21.333px)]"
        >
          {recentBlogs.map((post, index) => (
            <div key={post.slug} className="snap-start w-full">
              <BlogCard post={post} index={index} />
            </div>
          ))}
        </HomeStrip>

        {/* 3. ACTIVE PROTOTYPES (Projects) - 1 row, horizontal scrolling */}
        <HomeStrip
          title="Active Prototypes"
          subtitle="Member Showcases & Tools"
          viewAllLink="/projects"
          rows={1}
          columnLayout="auto-cols-[100%] sm:auto-cols-[calc(50%-16px)] lg:auto-cols-[calc(33.333%-21.333px)]"
        >
          {activeProjects.map((project) => (
            <div key={project.slug} className="snap-start w-full">
              <ProjectCard project={project} />
            </div>
          ))}
        </HomeStrip>

        {/* 4. NEURAL PLAYGROUND (Fun Zone Preview) */}
        <HomeFunPreview memes={funMemes} games={funGames} art={funArt} />

        {/* 5. TEAM PORTAL - High impact standalone banner */}
        <section className="w-full max-w-5xl mx-auto px-10 mt-20">
          <Link
            href="/team"
            className="group relative flex flex-col md:flex-row items-center justify-between p-12 rounded-3xl bg-[var(--background)] ring-[3px] ring-foreground/5 hover:ring-primary/40 transition-all overflow-hidden hover:shadow-[0_0_60px_rgba(2,145,178,0.15)] group"
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-2 text-center md:text-left">
              <h3 className="text-3xl font-heading font-black tracking-widest uppercase group-hover:text-primary transition-colors">Core Nodes</h3>
              <p className="text-foreground/70 max-w-md">Meet the humans behind the matrices. Explore the Slashdot hierarchy and contributor profiles.</p>
            </div>
            <div className="mt-8 md:mt-0 relative z-10">
              <div className="px-8 py-4 bg-foreground text-background dark:bg-white dark:text-black rounded-full font-black uppercase tracking-widest text-sm group-hover:bg-primary group-hover:var(--color-primary) transition-all transform group-hover:scale-105 active:scale-95">
                Meet the Team
              </div>
            </div>
          </Link>
        </section>

      </div>
    </div>
  );
}
