import React from 'react';
import { getMarkdownFiles } from '@/lib/markdown';
import { TeamDashboard } from '@/components/TeamDashboard';
import { JourneyTimeline } from '@/components/ui/JourneyTimeline';
import { TeamMember } from '@/components/ui/MemberFlipCard';
import { PageHero } from '@/components/ui/PageHero';

export const metadata = {
  title: 'Team | Slashdot 2026',
  description: 'Meet the people building the future at Slashdot.',
};

export default function TeamPage() {
  const membersData = getMarkdownFiles('content/team');
  const members = membersData as unknown as TeamMember[];

  const committeeOrder = ['Lead', 'Dev', 'Design', 'PR'];
  const sortedMembers = [...members].sort((a, b) => {
    const commA = a.frontmatter.committee || 'zzz';
    const commB = b.frontmatter.committee || 'zzz';
    const indexA = committeeOrder.indexOf(commA);
    const indexB = committeeOrder.indexOf(commB);
    const rankA = indexA === -1 ? 99 : indexA;
    const rankB = indexB === -1 ? 99 : indexB;
    if (rankA === rankB) return (a.frontmatter.name || '').localeCompare(b.frontmatter.name || '');
    return rankA - rankB;
  });

  return (
    <main className="min-h-screen pb-24 overflow-x-hidden">
      {/* Page Header with HeroCanvas */}
      <PageHero className="pt-44 pb-28 px-6">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center relative z-10">
          <div className="inline-flex items-center justify-center space-x-4 mb-6">
            <div className="h-px w-8 bg-[var(--color-primary)] opacity-50"></div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Core Contributors</span>
            <div className="h-px w-8 bg-[var(--color-primary)] opacity-50"></div>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-[var(--foreground)] font-heading">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-sky-400">Team</span></h1>
          <p className="text-xl text-[var(--foreground)] opacity-80 max-w-2xl mx-auto">
            Architects of the digital frontier. We build the systems, design the experiences, and lead the community.
          </p>
        </div>
      </PageHero>

      {/* Main Filterable Grid */}
      <TeamDashboard initialMembers={sortedMembers} />

      {/* Evolution Path */}
      <div className="mt-40 bg-gradient-to-b from-transparent via-[var(--color-primary)]/[0.02] to-transparent">
        <JourneyTimeline />
      </div>
    </main>
  );
}
