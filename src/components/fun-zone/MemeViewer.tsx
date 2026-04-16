'use client';

import React from 'react';
import { getImgPath } from '@/lib/imgUtils';

interface MemeViewerProps {
  slug?: string;
  className?: string;
}

const MEME_IMAGES: Record<string, string> = {
  'works-on-my-machine': '/images/memes/works-on-my-machine.webp',
  'ui-vs-ux-desire-path': '/images/memes/ui-vs-ux-desire-path.jpg',
  '99-bugs-in-the-code': '/images/memes/99-bugs-in-the-code.jpg',
  'graphic-design-passion': '/images/memes/graphic-design-passion.jpg',
  'frontend-vs-backend-horse': '/images/memes/frontend-vs-backend-horse.webp',
  'css-overflow-struggle': '/images/memes/css-overflow-struggle.webp',
};

const MemeViewer: React.FC<MemeViewerProps> = ({ slug, className = "" }) => {
  const imageUrl = MEME_IMAGES[slug || ''];

  if (!imageUrl) return null;

  return (
    <div className={`relative flex items-center justify-center bg-black/90 p-8 ${className}`}>
      <div className="relative w-full h-full max-w-4xl max-h-full">
        <img
          src={getImgPath(imageUrl)}
          alt={slug || 'meme'}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};

export default MemeViewer;
