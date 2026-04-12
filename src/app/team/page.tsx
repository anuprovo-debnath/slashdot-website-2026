import React from 'react';
import { getMarkdownFiles } from '@/lib/markdown';
import { TeamDashboard } from '@/components/TeamDashboard';
import { JourneyTimeline } from '@/components/ui/JourneyTimeline';
import { TeamMember } from '@/components/ui/MemberFlipCard';

export const metadata = {
  title: 'Team | Slashdot 2026',
  description: 'Meet the people building the future at Slashdot.',
};

export default function TeamPage() {
  // Utilizing the existing markdown ingestion engine to parse 'content/team'
  const membersData = getMarkdownFiles('content/team');
  const members = membersData as unknown as TeamMember[];

  // Rank sorting logic to keep Leads top, then Dev, Design, PR
  const committeeOrder = ['Lead', 'Dev', 'Design', 'PR'];
  const sortedMembers = [...members].sort((a, b) => {
    const commA = a.frontmatter.committee || 'zzz';
    const commB = b.frontmatter.committee || 'zzz';
    const indexA = committeeOrder.indexOf(commA);
    const indexB = committeeOrder.indexOf(commB);
    
    const rankA = indexA === -1 ? 99 : indexA;
    const rankB = indexB === -1 ? 99 : indexB;
    
    // Secondary sort by name if ranks match
    if (rankA === rankB) {
      return (a.frontmatter.name || '').localeCompare(b.frontmatter.name || '');
    }
    
    return rankA - rankB;
  });

  return (
    <main className="min-h-screen pb-24 pt-36">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center justify-center space-x-4 mb-6">
          <div className="h-px w-8 bg-[var(--color-primary)] opacity-50"></div>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Core Contributors</span>
          <div className="h-px w-8 bg-[var(--color-primary)] opacity-50"></div>
        </div>
        <h1 className="font-heading text-6xl md:text-8xl font-black mb-6 tracking-tight">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-sky-400">Team</span></h1>
        <p className="font-sans text-lg md:text-xl opacity-70 max-w-2xl font-medium">
          Architects of the digital frontier. We build the systems, design the experiences, and lead the community.
        </p>
      </div>

      {/* Main Filterable Grid */}
      <TeamDashboard initialMembers={sortedMembers} />

      {/* Evolution Path (Tan=3 spine) */}
      <div className="mt-40 bg-gradient-to-b from-transparent via-[var(--color-primary)]/[0.02] to-transparent">
        <JourneyTimeline />
      </div>
    </main>
  );
}
