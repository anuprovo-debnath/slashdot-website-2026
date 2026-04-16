import React from 'react';
import { notFound } from 'next/navigation';
import SlashdotFallbackCover from '@/components/ui/SlashdotFallbackCover';
import SlashdotBackground from '@/components/ui/SlashdotBackground';
import HeroMatrixArt from '@/components/fun-zone/HeroMatrixArt';
import ArtViewerClient from '@/components/fun-zone/ArtViewerClient';
import MemeViewer from '@/components/fun-zone/MemeViewer';

const ART_REGISTRY: Record<string, { title: string; description: string; type: 'art' | 'design' | 'meme' }> = {
  'primary-slant': {
    title: 'The Primary Slant',
    description: 'The fundamental Slashdot brand matrix. Constructed on a strict Tan=3 slope, representing the 71.5° intersection of precision and momentum.',
    type: 'art',
  },
  'temporal-matrix': {
    title: 'Temporal Matrix',
    description: 'A deep-space background system utilizing multi-layered SVG patterns to create a sense of infinite, moving code architecture.',
    type: 'art',
  },
  'hero-engine': {
    title: 'Hero Engine V2',
    description: 'The flagship homepage background engine. Optimized for cinematic scale and sub-pixel clarity across all viewport widths.',
    type: 'design',
  },
  'works-on-my-machine': {
    title: 'The Developer\'s Classic: "It Works on My Machine"',
    description: 'A humorous take on the environment-specific bugs that plague developers.',
    type: 'meme',
  },
  'ui-vs-ux-desire-path': {
    title: 'UI vs. UX: The Desire Path',
    description: 'This meme perfectly illustrates the difference between User Interface and User Experience.',
    type: 'meme',
  },
  '99-bugs-in-the-code': {
    title: '99 Little Bugs in the Code',
    description: 'The never-ending cycle of debugging.',
    type: 'meme',
  },
  'graphic-design-passion': {
    title: 'Graphic Design is My Passion',
    description: 'A sarcastic take on low-quality design work.',
    type: 'meme',
  },
  'frontend-vs-backend-horse': {
    title: 'Frontend vs. Backend (The Horse)',
    description: 'Representing the disparity in polish between different parts of a project.',
    type: 'meme',
  },
  'css-overflow-struggle': {
    title: 'CSS Overflow: The Struggle is Real',
    description: 'The difficulty of mastering the CSS box model.',
    type: 'meme',
  }
};

export function generateStaticParams() {
  return Object.keys(ART_REGISTRY).map((slug) => ({
    slug,
  }));
}

export default async function FunZoneDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = ART_REGISTRY[slug];

  if (!meta) {
    notFound();
  }

  return <ArtViewerClient slug={slug} meta={meta} />;
}
