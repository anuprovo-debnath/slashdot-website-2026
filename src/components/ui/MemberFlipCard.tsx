"use client";

import React, { useState, useRef } from 'react';
import { TagSystem } from './TagSystem';
import { FaGithub, FaLinkedin, FaTwitter, FaLink } from 'react-icons/fa';
import { getImgPath } from '@/lib/imgUtils';

export interface TeamMember {
  slug: string;
  frontmatter: {
    name: string;
    position: string;
    bio?: string;
    image?: string;
    committee?: string;
    tenure?: string;
    isAlumni?: boolean;
    tech_stack?: string[];
    socials?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      portfolio?: string;
    };
  };
  content?: string;
}

export function MemberFlipCard({ member }: { member: TeamMember }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { name, position, bio, image, committee, tenure, tech_stack, socials, isAlumni } = member.frontmatter;

  return (
    <div 
      className={`relative w-full h-[450px] group cursor-pointer perspective-[1000px] ${isAlumni ? 'grayscale focus:grayscale-0 hover:grayscale-0 transition-all duration-500' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
      id={name}
      ref={cardRef}
    >
      <div 
        className={`w-full h-full relative transition-transform duration-700 group-hover:-translate-y-2`}
        style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front Face */}
        <div 
          className={`absolute inset-0 w-full h-full flex flex-col bg-[var(--background)] rounded-2xl ring-[3px] ring-[#0291B2]/30 shadow-xl group-hover:ring-[#0291B2]/80 group-hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:group-hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] transition-all overflow-hidden ${isFlipped ? 'pointer-events-none' : 'pointer-events-auto'}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-[340px] relative bg-[#0291B2]/5 overflow-hidden border-b border-black/10 dark:border-white/10 shrink-0">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getImgPath(image)} alt={name} className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <span className="font-heading text-6xl text-gray-400 opacity-20">/.</span>
              </div>
            )}
            {/* Gradient Overlay for Text Pop */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-80" />
          </div>
          
          <div className="flex-1 p-5 flex flex-col justify-center text-center bg-[var(--background)] z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight text-[var(--foreground)] group-hover:text-[#0291B2] transition-colors line-clamp-1 shrink-0 mb-1">{name}</h3>
            <p className="text-[12px] font-bold opacity-60 tracking-[0.2em] uppercase mt-1 truncate text-[var(--color-primary)]">{position}</p>
          </div>
        </div>

        {/* Back Face */}
        <div 
          className={`absolute inset-0 w-full h-full flex flex-col bg-[var(--background)] rounded-2xl ring-[3px] ring-[#0291B2]/30 shadow-xl group-hover:ring-[#0291B2]/80 group-hover:shadow-[0_0_40px_rgba(2,145,178,0.4)] dark:group-hover:shadow-[0_0_40px_rgba(2,145,178,0.25)] transition-all overflow-hidden ${isFlipped ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="p-6 flex-1 flex flex-col bg-[#0291B2]/[0.02]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-extrabold leading-tight text-[var(--color-primary)]">{name}</h2>
                <span className="text-[10px] font-mono opacity-50 block mt-2 uppercase tracking-widest">{committee} • {tenure}</span>
              </div>
              
              <div className="flex gap-3 text-[var(--color-primary)] opacity-70">
                {socials?.github && <a href={socials.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="hover:opacity-100 hover:scale-110 transition-all"><FaGithub size={18} /></a>}
                {socials?.linkedin && <a href={socials.linkedin} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="hover:opacity-100 hover:scale-110 transition-all"><FaLinkedin size={18} /></a>}
                {socials?.twitter && <a href={socials.twitter} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="hover:opacity-100 hover:scale-110 transition-all"><FaTwitter size={18} /></a>}
                {socials?.portfolio && <a href={socials.portfolio} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="hover:opacity-100 hover:scale-110 transition-all"><FaLink size={18} /></a>}
              </div>
            </div>
            
            <p className="text-[13px] opacity-70 leading-relaxed flex-1 overflow-y-auto hide-scrollbar line-clamp-6">
              {bio || "Passionate about building the next generation of web experiences."}
            </p>
          </div>

          <div 
            onClick={e => e.stopPropagation()} // Prevent flip when clicking tags
            className={`relative z-20 transition-all duration-700 ease-out transform ${isFlipped ? 'opacity-100 translate-y-0 delay-100 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}
          >
            <TagSystem tags={tech_stack || []} cardRef={cardRef} title={`${name}'s Stack`} />
          </div>
        </div>
      </div>
    </div>
  );
}
