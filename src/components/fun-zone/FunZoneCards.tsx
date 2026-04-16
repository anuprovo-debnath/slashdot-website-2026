"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { TagPill } from '../ui/TagPill';
import { getImgPath } from '@/lib/imgUtils';
import { MemeData, GameData, ArtData } from '@/lib/funzone';

const getImprovedHash = (slug: string) => {
  let hash = slug.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  hash = ((hash >>> 16) ^ hash) * 0x45d9f3b;
  hash = ((hash >>> 16) ^ hash) * 0x45d9f3b;
  hash = (hash >>> 16) ^ hash;
  return Math.abs(hash); // Return absolute value here to keep the UI logic clean
};

export const MemeCard = ({ title, category, img, description, slug, onClick, className = "" }: MemeData & { onClick?: () => void; className?: string }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      className={`group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] shadow-xl transition-all overflow-hidden h-[450px] w-full ${className}
                 hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2
                 ${isPressed ? 'ring-[#0291B2]/80 shadow-[0_0_40px_rgba(2,145,178,0.4)] -translate-y-2' : 'ring-[#0291B2]/30'}`}
    >
      <Link
        href={`/fun-zone/${slug}`}
        onClick={onClick}
        className="absolute inset-0 z-[10]"
        aria-label={`View ${title}`}
      />
      <div className="flex flex-col h-[406px] overflow-hidden">
        <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10">
          <img
            src={getImgPath(img)}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${isPressed ? 'scale-110' : ''}`}
          />
          <div className={`absolute inset-0 bg-primary/0 transition-colors duration-500 ${isPressed ? 'bg-primary/10' : 'group-hover:bg-primary/10'}`}></div>
        </div>
        <div className="px-5 pt-4 pb-1 flex flex-col flex-1 overflow-hidden font-sans">
          <div className="flex flex-col flex-1 min-h-0 text-center items-center justify-start">
            <h3 className={`text-2xl sm:text-l font-extrabold leading-tight transition-colors line-clamp-2 shrink-0 mb-1 group-hover:text-[var(--color-primary)] ${isPressed ? 'text-[var(--color-primary)]' : 'text-[var(--foreground)]'}`}>
              {title}
            </h3>
            <p className="text-base sm:text-sm leading-relaxed text-[var(--foreground)] opacity-80 line-clamp-4 sm:line-clamp-5 overflow-hidden text-ellipsis">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="h-[48px] flex items-center shrink-0 border-t border-black/5 dark:border-white/5 px-4 relative z-[20]">
        <div className="flex flex-wrap gap-2 max-h-[26px] overflow-hidden flex-1 justify-center">
          <TagPill tag={category} />
        </div>
      </div>
    </div>
  );
};

export const GameCard = ({ title, description, url, imgUrl, tags, slug, onClick, className = "" }: GameData & { onClick?: () => void; className?: string }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      className={`group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] shadow-xl transition-all overflow-hidden h-[450px] w-full ${className}
                 hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2
                 ${isPressed ? 'ring-[#0291B2]/80 shadow-[0_0_40px_rgba(2,145,178,0.4)] -translate-y-2' : 'ring-[#0291B2]/30'}`}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="absolute inset-0 z-[10]"
        aria-label={`Play ${title}`}
      />
      <div className="flex flex-col h-[406px] overflow-hidden">
        <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10 flex items-center justify-center bg-[var(--background)]">
          <img
            src={getImgPath(imgUrl)}
            alt={title}
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${isPressed ? 'scale-110' : ''}`}
          />
          <div className={`absolute inset-0 bg-primary/0 transition-colors duration-500 ${isPressed ? 'bg-primary/10' : 'group-hover:bg-primary/10'}`}></div>
        </div>
        <div className="px-5 pt-4 pb-3 flex flex-col flex-1 overflow-hidden pointer-events-none font-sans">
          <div className="flex flex-col flex-1 min-h-0 w-full text-center items-center justify-start">
            <h3 className={`text-2xl sm:text-l font-extrabold leading-tight transition-colors line-clamp-1 shrink-0 mb-1 pointer-events-auto group-hover:text-[var(--color-primary)] ${isPressed ? 'text-[var(--color-primary)]' : 'text-[var(--foreground)]'}`}>
              {title}
            </h3>
            <p className="text-[14px] leading-relaxed text-[var(--foreground)] opacity-80 line-clamp-2 overflow-hidden text-ellipsis mb-1 pointer-events-auto">
              {description}
            </p>
            <div className="w-full mt-1 border-t border-black/5 dark:border-white/5 pt-1.5 flex-1 pointer-events-auto">
              <table className="w-full text-center text-[12px] opacity-70 mt-1 mx-auto">
                <tbody>
                  <tr><td className="py-0.5 text-left pl-4">👑 Neo</td><td className="text-right pr-4 font-bold">24,400</td></tr>
                  <tr><td className="py-0.5 text-left pl-4">Trinity</td><td className="text-right pr-4 font-bold">18,200</td></tr>
                  <tr><td className="py-0.5 text-left pl-4">Morpheus</td><td className="text-right pr-4 font-bold">12,100</td></tr>
                </tbody>
              </table>
            </div>

            <div className="w-full flex justify-center mt-2 pointer-events-auto">
              <span className="w-full max-w-[200px] py-1.5 bg-[var(--color-primary)] hover:bg-[#06b6d4] text-white rounded-full font-black text-[12px] uppercase tracking-widest shadow-md hover:shadow-[0_0_15px_rgba(2,145,178,0.5)] transition-all shrink-0 z-[20] flex items-center justify-center gap-1.5">
                Play Game
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[48px] flex items-center shrink-0 border-t border-black/5 dark:border-white/5 px-4 relative z-[20]">
        <div className="flex flex-wrap gap-2 max-h-[26px] overflow-hidden flex-1 justify-center w-full">
          {tags.map(tag => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ArtCard = ({ title, blurColor, slug, onClick, className = "" }: ArtData & { onClick?: () => void; className?: string }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      className={`group relative flex flex-col rounded-2xl bg-[var(--background)] ring-[3px] shadow-xl transition-all overflow-hidden h-[450px] w-full ${className}
                 hover:ring-[#0291B2]/80 hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] hover:-translate-y-2
                 ${isPressed ? 'ring-[#0291B2]/80 shadow-[0_0_40px_rgba(2,145,178,0.4)] -translate-y-2' : 'ring-[#0291B2]/30'}`}
    >
      <Link
        href={`/fun-zone/${slug}`}
        onClick={onClick}
        className="absolute inset-0 z-[10]"
        aria-label={`View ${title}`}
      />
      <div className="flex flex-col h-[406px] overflow-hidden">
        <div className="relative w-full h-[180px] shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10 flex items-center justify-center bg-black/5 dark:bg-white/5 pointer-events-auto">
          {/* Math-driven hue shift and rotation based on slug */}
          {(() => {
            const hashValue = getImprovedHash(slug);
            const hueShift = 60 + (hashValue % 241);
            const baseRot = hashValue % 360;
            return (
              <div
                className={`relative w-32 h-32 transition-transform duration-700 ease-out group-hover:scale-110 ${isPressed ? 'scale-110' : ''}`}
                style={{
                  animation: 'spin 20s linear infinite',
                  filter: `hue-rotate(${hueShift}deg)`
                }}
              >
                <div className={`absolute inset-0 rounded-full blur-[30px] opacity-40 transition-opacity duration-1000 ${isPressed ? 'opacity-70' : 'group-hover:opacity-70'}`} style={{ backgroundColor: blurColor }}></div>
                <div className={`absolute top-0 left-0 w-full h-full border-[6px] border-[#0291B2]/60 mix-blend-multiply dark:mix-blend-screen transition-all duration-700 ${isPressed ? 'border-[10px]' : 'group-hover:border-[10px]'}`} style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', transform: `rotate(${baseRot}deg)` }}></div>
                <div className="absolute top-[-10px] left-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] border-[2px] border-foreground/40 transition-all duration-1000 group-hover:rotate-45" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', transform: `rotate(${baseRot}deg)` }}></div>
                <div className="absolute top-[10px] left-[10px] w-[calc(100%-20px)] h-[calc(100%-20px)] border-[1px] border-[#0291B2]/40 transition-all duration-1000 group-hover:-rotate-45" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', transform: `rotate(${baseRot}deg)` }}></div>
              </div>
            );
          })()}
        </div>
        <div className="px-5 pt-4 pb-1 flex flex-col flex-1 overflow-hidden font-sans">
          <div className="relative flex items-center justify-center w-full mb-1 text-[13px] font-bold tracking-tight">
            <div className="z-[20] relative text-center">
              <span className="text-[var(--color-primary)] opacity-80 uppercase">By Slashdot Labs</span>
            </div>
          </div>
          <div className="flex flex-col flex-1 min-h-0 text-center items-center">
            <h3 className={`text-2xl sm:text-l font-extrabold leading-tight transition-colors line-clamp-2 shrink-0 mb-1 group-hover:text-[var(--color-primary)] ${isPressed ? 'text-[var(--color-primary)]' : 'text-[var(--foreground)]'}`}>
              {title}
            </h3>
            <p className="text-base sm:text-sm leading-relaxed text-[var(--foreground)] opacity-80 line-clamp-4 sm:line-clamp-5 overflow-hidden text-ellipsis">
              Mathematical explorations of the Slashdot brand matrix. Constructed on a strict Tan=3 slope for maximum visual fidelity and geometric precision.
            </p>
          </div>
        </div>
      </div>
      <div className="h-[48px] flex items-center shrink-0 border-t border-black/5 dark:border-white/5 px-4 relative z-[20]">
        <div className="flex flex-wrap gap-2 max-h-[26px] overflow-hidden flex-1 justify-center w-full">
          <TagPill tag="Generative" />
        </div>
      </div>
    </div>
  );
};
