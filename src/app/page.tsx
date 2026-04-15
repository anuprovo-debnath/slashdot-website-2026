import { HomeHero } from "@/components/home/HomeHero";
import { getMarkdownFiles } from "@/lib/markdown";
import { getEvents } from "@/lib/events";
import { getProjects } from "@/lib/projects";
import { BlogGrid } from "@/components/BlogGrid";
import { EventCard } from "@/components/EventCard";
import ProjectGrid from "@/components/ProjectGrid";
import Link from 'next/link';

export default function Home() {
  // Fetch data
  const allBlogs = getMarkdownFiles('content/blog');
  const recentBlogs = allBlogs.slice(0, 3);

  const allEvents = getEvents();
  const topEvents = allEvents.slice(0, 3);

  const allProjects = getProjects();
  const activeProjects = allProjects.slice(0, 3);

  return (
    <div className="flex flex-col w-full">
      {/* The cinematic interactive Hero Canvas */}
      <HomeHero />

      <div className="flex flex-col items-center w-full bg-[var(--background)] pb-24 z-10 relative">
        
        {/* Latest Blogs Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-foreground/10 pb-4">
            <div className="flex flex-col">
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-widest uppercase text-foreground">Latest Transmissions</h2>
              <p className="text-foreground/60 mt-2 uppercase tracking-[0.2em] text-sm md:text-base">From the Slashdot Blog</p>
            </div>
            <Link href="/blog" className="px-6 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors font-bold uppercase tracking-wider rounded-xl">
              View All Posts
            </Link>
          </div>
          <BlogGrid posts={recentBlogs} />
        </section>

        {/* Live & Upcoming Events */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-foreground/10 pb-4">
            <div className="flex flex-col">
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-widest uppercase text-foreground">Mission Briefs</h2>
              <p className="text-foreground/60 mt-2 uppercase tracking-[0.2em] text-sm md:text-base">Upcoming Events & Workshops</p>
            </div>
            <Link href="/events" className="px-6 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors font-bold uppercase tracking-wider rounded-xl">
              Launch Calendar
            </Link>
          </div>
          <div className="flex flex-col gap-6">
            {topEvents.map(event => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </section>

        {/* Active Prototypes */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-foreground/10 pb-4">
            <div className="flex flex-col">
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-widest uppercase text-foreground">Active Prototypes</h2>
              <p className="text-foreground/60 mt-2 uppercase tracking-[0.2em] text-sm md:text-base">Member Showcases & Tools</p>
            </div>
            <Link href="/projects" className="px-6 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors font-bold uppercase tracking-wider rounded-xl">
              Explore Projects
            </Link>
          </div>
          <ProjectGrid projects={activeProjects} />
        </section>

        {/* Discovery Portals (Fun Zone & Team) */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/fun-zone" className="group relative flex flex-col justify-end p-8 h-64 rounded-2xl bg-[var(--background)] ring-[3px] ring-foreground/10 hover:ring-primary/80 transition-all overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(var(--color-primary-rgb),0.3)]">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-3xl font-heading font-black tracking-widest uppercase relative z-10 group-hover:text-primary transition-colors">The Fun Zone</h3>
            <p className="text-foreground/70 mt-2 relative z-10">Memes, HTML5 Games, and Generative Art strictly calibrated for zero productivity.</p>
          </Link>
          
          <Link href="/team" className="group relative flex flex-col justify-end p-8 h-64 rounded-2xl bg-[var(--background)] ring-[3px] ring-foreground/10 hover:ring-primary/80 transition-all overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(var(--color-primary-rgb),0.3)]">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-3xl font-heading font-black tracking-widest uppercase relative z-10 group-hover:text-primary transition-colors">Core Nodes</h3>
            <p className="text-foreground/70 mt-2 relative z-10">Explore the Slashdot Team hierarchy and view individual member contributions.</p>
          </Link>
        </section>

      </div>
    </div>
  );
}
