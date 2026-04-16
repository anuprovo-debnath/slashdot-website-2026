'use client';
import React, { useEffect, useState, useRef } from 'react';

/**
 * HIGH-FIDELITY INTERACTIVE BRAND MATRIX
 * Optimized for Funzone Art Viewer.
 * Uses Tan=3 slanted geometry and mouse-aware parallax.
 */
export default function HeroMatrixArt({ className = "w-full h-full" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const layersRef = useRef<SVGGElement[]>([]);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    let animFrame: number;
    const tick = () => {
      if (maskRef.current) {
        maskRef.current.style.background = `radial-gradient(circle 350px at ${mouseRef.current.x}px ${mouseRef.current.y}px, transparent, var(--color-bg) 100%)`;
      }

      layersRef.current.forEach((layer, i) => {
        if (!layer) return;
        const speed = (i + 1) * 0.015;
        const dx = (mouseRef.current.x - window.innerWidth / 2) * speed;
        const dy = (mouseRef.current.y - window.innerHeight / 2) * speed;
        layer.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      animFrame = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animFrame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  if (!mounted) return <div className={className} />;

  return (
    <div className={`relative overflow-hidden pointer-events-none ${className}`}>
      {/* Interactive Hub Layer */}
      <div 
        className="absolute inset-0 z-10 mix-blend-soft-light opacity-30"
        style={{
          background: `radial-gradient(circle 400px at ${mouseRef.current.x}px ${mouseRef.current.y}px, rgba(var(--color-primary-rgb), 0.4), transparent 80%)`
        }}
      />

      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="matrix-spec-1" x="0" y="0" width="300" height="900" patternUnits="userSpaceOnUse">
             <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="300 -900" dur="60s" repeatCount="indefinite" />
             <line x1="100" y1="300" x2="200" y2="0" stroke="var(--color-primary)" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.2" />
          </pattern>
          <pattern id="matrix-spec-2" x="0" y="0" width="300" height="900" patternUnits="userSpaceOnUse">
             <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="-300 900" dur="80s" repeatCount="indefinite" />
             <line x1="50" y1="450" x2="150" y2="150" stroke="var(--color-primary)" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.1" />
          </pattern>
          <pattern id="matrix-spec-3" x="0" y="0" width="100" height="300" patternUnits="userSpaceOnUse">
             <circle cx="50" cy="150" r="1.5" fill="var(--color-primary)" fillOpacity="0.3">
                <animate attributeName="fill-opacity" values="0.1;0.5;0.1" dur="4s" repeatCount="indefinite" />
                <animate attributeName="r" values="1;2.2;1" dur="4s" repeatCount="indefinite" />
             </circle>
          </pattern>
          <pattern id="matrix-spec-4" x="0" y="0" width="400" height="1200" patternUnits="userSpaceOnUse">
             <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="400 -1200" dur="25s" repeatCount="indefinite" />
             <line x1="200" y1="600" x2="300" y2="300" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#matrix-spec-3)" />
        <g ref={el => { if (el) layersRef.current[0] = el; }} className="will-change-transform">
          <rect width="150%" height="150%" x="-25%" y="-25%" fill="url(#matrix-spec-1)" />
        </g>
        <g ref={el => { if (el) layersRef.current[1] = el; }} className="will-change-transform">
          <rect width="150%" height="150%" x="-25%" y="-25%" fill="url(#matrix-spec-2)" />
        </g>
        <g ref={el => { if (el) layersRef.current[2] = el; }} className="will-change-transform">
          <rect width="150%" height="150%" x="-25%" y="-25%" fill="url(#matrix-spec-4)" />
        </g>
      </svg>

      <div ref={maskRef} className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-90" />
    </div>
  );
}
