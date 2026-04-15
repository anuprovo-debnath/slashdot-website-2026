import { HomeHero } from "@/components/home/HomeHero";
import { getMarkdownFiles } from "@/lib/markdown";
import { getEvents } from "@/lib/events";
import { getProjects } from "@/lib/projects";
import { HomeStrip } from "@/components/home/HomeStrip";
import { BlogCard } from "@/components/BlogCard";
import { ProjectCard } from "@/components/ProjectCard";
import { EventCard } from "@/components/EventCard";
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

        {/* Discovery Portals (Fun Zone & Team) */}
        <section className="w-full max-w-5xl mx-auto px-10 my-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/fun-zone" className="group relative flex flex-col justify-end p-8 h-64 rounded-2xl bg-[var(--background)] ring-[3px] ring-foreground/10 hover:ring-primary/80 transition-all overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(var(--color-primary-rgb),0.3)]">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-2xl font-heading font-black tracking-widest uppercase relative z-10 group-hover:text-primary transition-colors">The Fun Zone</h3>
            <p className="text-foreground/70 mt-2 relative z-10 text-sm">Memes, HTML5 Games, and Generative Art strictly calibrated for zero productivity.</p>
          </Link>

          <Link href="/team" className="group relative flex flex-col justify-end p-8 h-64 rounded-2xl bg-[var(--background)] ring-[3px] ring-foreground/10 hover:ring-primary/80 transition-all overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(var(--color-primary-rgb),0.3)]">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-2xl font-heading font-black tracking-widest uppercase relative z-10 group-hover:text-primary transition-colors">Core Nodes</h3>
            <p className="text-foreground/70 mt-2 relative z-10 text-sm">Explore the Slashdot Team hierarchy and view individual member contributions.</p>
          </Link>
        </section>

      </div>
    </div>
  );
}
