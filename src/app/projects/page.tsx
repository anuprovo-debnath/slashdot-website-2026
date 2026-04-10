import { getProjects } from '@/lib/projects';
import ProjectGrid from '@/components/ProjectGrid';

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-12 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-[var(--foreground)] font-heading">
            Projects <span className="text-[#0291B2]">Showcase</span>
          </h1>
          <p className="text-xl text-[var(--foreground)] opacity-70 max-w-2xl mx-auto leading-relaxed">
            Highlighting internal tools, member spotlights, and innovative club initiatives 
            built for the IISER Kolkata community.
          </p>
        </header>

        {/* Dynamic Project Grid */}
        {projects.length > 0 ? (
          <ProjectGrid projects={projects} />
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl">
             <p className="text-lg opacity-50 font-bold uppercase tracking-widest">No Projects Found</p>
             <p className="text-sm opacity-40">Add your first project to content/projects/</p>
          </div>
        )}
      </div>
    </div>
  );
}
