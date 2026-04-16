'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import SlashdotFallbackCover from '@/components/ui/SlashdotFallbackCover';
import SlashdotBackground from '@/components/ui/SlashdotBackground';
import HeroMatrixArt from '@/components/fun-zone/HeroMatrixArt';
import MemeViewer from '@/components/fun-zone/MemeViewer';

interface ArtViewerClientProps {
  slug: string;
  meta: {
    title: string;
    description: string;
    type: 'art' | 'design' | 'meme';
  };
}

const COMPONENT_MAP = {
  art: {
    'primary-slant': SlashdotFallbackCover,
    'temporal-matrix': SlashdotBackground,
  },
  design: {
    'hero-engine': HeroMatrixArt,
  },
  meme: MemeViewer
};

export default function ArtViewerClient({ slug, meta }: ArtViewerClientProps) {
  const [mounted, setMounted] = useState(false);
  const [frameSize, setFrameSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getComponent = () => {
    if (meta.type === 'meme') return COMPONENT_MAP.meme;
    if (meta.type === 'art' || meta.type === 'design') {
      const group = COMPONENT_MAP[meta.type as keyof typeof COMPONENT_MAP] as any;
      return group[slug as keyof typeof group] || SlashdotFallbackCover;
    }
    return SlashdotFallbackCover;
  };

  const FrameContent = getComponent();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div className="flex-1">
              <Link 
                href="/fun-zone" 
                className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm mb-4 hover:gap-3 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Funzone
              </Link>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading tracking-tight uppercase">
                {meta.title}
              </h1>
              <p className="text-lg text-foreground/70 max-w-2xl mt-4">
                {meta.description}
              </p>
            </div>

            {/* Frame Controls */}
            <div className="flex items-center gap-2 bg-foreground/5 p-1.5 rounded-2xl border border-foreground/10 shrink-0">
              <button 
                onClick={() => setFrameSize('mobile')}
                className={`p-3 rounded-xl transition-all ${frameSize === 'mobile' ? 'bg-primary text-white shadow-lg' : 'hover:bg-foreground/10'}`}
                title="Mobile View"
              >
                <Smartphone className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setFrameSize('tablet')}
                className={`p-3 rounded-xl transition-all ${frameSize === 'tablet' ? 'bg-primary text-white shadow-lg' : 'hover:bg-foreground/10'}`}
                title="Tablet View"
              >
                <Tablet className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setFrameSize('desktop')}
                className={`p-3 rounded-xl transition-all ${frameSize === 'desktop' ? 'bg-primary text-white shadow-lg' : 'hover:bg-foreground/10'}`}
                title="Desktop View"
              >
                <Monitor className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* THE FRAME */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/20 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className={`relative mx-auto transition-all duration-500 ease-in-out bg-neutral-900 border-[12px] border-neutral-800 rounded-[2.5rem] shadow-2xl overflow-hidden
              ${frameSize === 'desktop' ? 'w-full h-[600px]' : frameSize === 'tablet' ? 'w-[768px] h-[600px] max-w-full' : 'w-[375px] h-[600px] max-w-full'}`}
            >
              {/* Device Notch for mobile/tablet */}
              {frameSize !== 'desktop' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-800 rounded-b-2xl z-50 flex items-center justify-center">
                  <div className="w-10 h-1.5 bg-neutral-700 rounded-full" />
                </div>
              )}

              {/* Design Content */}
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <FrameContent className="w-full h-full" slug={slug} />
                
                {/* Frame Metadata Overlay */}
                <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-mono text-white/70 uppercase tracking-widest flex items-center gap-4">
                  <span>Renderer: SVG_PATTERN_V2</span>
                  <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                  <span>{frameSize.toUpperCase()} MODE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="p-8 rounded-3xl bg-foreground/5 border border-foreground/10">
                <h3 className="font-heading font-black text-xl mb-4 italic uppercase tracking-wider">01. Geometry</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  Every line is strictly constrained to the <strong>Tan=3</strong> brand slant. This ensures visual harmony across all components in the Slashdot design system.
                </p>
             </div>
             <div className="p-8 rounded-3xl bg-foreground/5 border border-foreground/10">
                <h3 className="font-heading font-black text-xl mb-4 italic uppercase tracking-wider">02. Motion</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  Using hardware-accelerated SVG transforms, layers move at prime-number durations (20s, 25s, 40s) to prevent recurring visual patterns.
                </p>
             </div>
             <div className="p-8 rounded-3xl bg-foreground/5 border border-foreground/10">
                <h3 className="font-heading font-black text-xl mb-4 italic uppercase tracking-wider">03. Performance</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  Unlike Canvas-based solutions, pure SVG patterns use minimal CPU overhead, maintaining 60FPS even on battery-constrained mobile browsers.
                </p>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
