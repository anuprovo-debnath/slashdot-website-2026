"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaDiscord, FaYoutube, FaInstagram, FaFacebookF, FaEnvelope } from "react-icons/fa6";

const SOCIAL_PLATFORMS = [
  {
    name: "GitHub",
    href: "https://github.com/slashdot-iiserk",
    icon: FaGithub,
    color: "#0FBF3E"
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/slashdot-club-iiser-kolkata/about/",
    icon: FaLinkedin,
    color: "#0077B5"
  },
  {
    name: "Discord",
    href: "https://discord.gg/F2FW2KAwHt",
    icon: FaDiscord,
    color: "#5865F2"
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@slashdotiiser",
    icon: FaYoutube,
    color: "#FF0000"
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/slashdotiiserkol/",
    icon: FaInstagram,
    color: "#E4405F",
    hoverClass: "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:shadow-[#ee2a7b]/20"
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/slashdotiiserk",
    icon: FaFacebookF,
    color: "#1877F2"
  }
];

export function Footer() {
  return (
    <footer id="join-us" className="bg-black/5 dark:bg-white/5 border-t border-black/10 dark:border-white/10 mt-auto scroll-mt-4 md:scroll-mt-20">
      {/* Join Us Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to <span className="text-[var(--color-primary)]">Join Us?</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg opacity-80">
            Be part of the next generation of tech enthusiasts. Share your projects,
            learn from industry experts, and compete with the best in the 2026 competition.
          </p>
          <div className="pt-4">
            <a
              href="mailto:slashdot@iiserkol.ac.in"
              className="inline-flex justify-center items-center px-8 py-3 text-base font-bold rounded-full text-white bg-[var(--color-primary)] hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-[var(--color-primary)]/20 hover:scale-105 active:scale-95"
            >
              JOIN
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="border-t border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-12 pb-8">
          {/* Grid Content */}
          <div className="grid grid-cols-1 md:grid-cols-24 items-start border-black/10 dark:border-white/10">

            {/* Brand Section */}
            <div className="md:col-span-7 order-3 md:order-1 flex flex-col space-y-2 items-center py-12 md:py-0 md:px-0">
              <div className="relative h-36 w-40">
                <Image
                  src="/slashdot-website-2026/logos/Logo_White_BG.png"
                  alt="Slashdot"
                  fill
                  className="object-contain dark:hidden"
                  unoptimized
                />
                <Image
                  src="/slashdot-website-2026/logos/Logo_Black_BG.png"
                  alt="Slashdot"
                  fill
                  className="object-contain hidden dark:block"
                  unoptimized
                />
              </div>
              <div className="pt-2 text-center">
                <h2 className="text-4xl font-bold font-[var(--font-heading)] text-[var(--color-primary)] leading-none">Slashdot</h2>
              </div>
            </div>

            {/* Links Hub (Middle Column) */}
            <div className="md:col-span-10 order-1 md:order-2 grid grid-cols-2 gap-x-10 sm:gap-x-20 gap-y-10 px-8 md:px-18 py-12 md:py-0 border-b md:border-b-0 md:border-x border-black/10 dark:border-white/10">
              {/* Quick Links */}
              <div className="flex flex-col space-y-6 items-start text-left">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">Sitemap</h3>
                <ul className="space-y-3 text-sm sm:text-base">
                  <li><Link href="/" className="opacity-70 hover:opacity-100 hover:text-[var(--color-primary)] transition-all">Home</Link></li>
                  <li><Link href="/team" className="opacity-70 hover:opacity-100 hover:text-[var(--color-primary)] transition-all">The Team</Link></li>
                  <li><Link href="/blog" className="opacity-70 hover:opacity-100 hover:text-[var(--color-primary)] transition-all">Blog</Link></li>
                  <li><Link href="/projects" className="opacity-70 hover:opacity-100 hover:text-[var(--color-primary)] transition-all">Projects</Link></li>
                  <li><Link href="/events" className="opacity-70 hover:opacity-100 hover:text-[var(--color-primary)] transition-all">Events</Link></li>
                </ul>
              </div>

              {/* Resources */}
              <div className="flex flex-col space-y-6 items-end text-right">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">Resources</h3>
                <ul className="space-y-3">
                  <li><Link href="/tech" className="opacity-70 hover:opacity-100 hover:text-[var(--color-primary)] transition-all">Design System</Link></li>
                  <li><Link href="/fun-zone" className="opacity-70 hover:opacity-100 hover:text-[var(--color-primary)] transition-all">Fun Zone</Link></li>
                  <li><a href="https://github.com/slashdot-iiserk" target="_blank" className="opacity-70 hover:opacity-100 hover:text-[var(--color-primary)] transition-all">Open Source</a></li>
                  <li><a href="mailto:slashdot@iiserkol.ac.in" className="opacity-70 hover:opacity-100 hover:text(--color-primary) transition-all">Help Center</a></li>
                </ul>
              </div>
            </div>

            {/* Social Section */}
            <div className="md:col-span-7 order-2 md:order-3 flex flex-col space-y-6 items-center py-12 md:py-0 md:px-0 border-b md:border-b-0 border-black/10 dark:border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">Connect</h3>
              <div className="flex flex-col items-center gap-6">

                {/* Email Display (Now Above) */}
                <div className="flex flex-col items-center">
                  <a
                    href="mailto:slashdot@iiserkol.ac.in"
                    className="text-sm font-medium opacity-70 hover:opacity-100 hover:text-[var(--color-primary)] transition-all flex items-center gap-2 group"
                  >
                    <FaEnvelope className="w-5 h-5 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
                    <span>slashdot@iiserkol.ac.in</span>
                  </a>
                </div>

                <div className="flex flex-col gap-6 w-full max-w-[200px]">
                  <div className="grid grid-cols-3 gap-6">
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.href}
                        target="_blank"
                        style={{ "--brand-color": platform.color } as React.CSSProperties}
                        className={`
                          relative w-12 h-12 rounded-full flex items-center justify-center 
                          bg-black/5 dark:bg-white/5
                          transition-all duration-300 hover:-translate-y-1 group shadow-sm
                          ${platform.hoverClass || "hover:bg-[var(--brand-color)] hover:shadow-[var(--brand-color)]/20 hover:text-white"}
                        `}
                        aria-label={platform.name}
                      >
                        <platform.icon className="w-6 h-6 text-black dark:text-white group-hover:text-white transition-colors duration-200" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section */}
          <div className="mt-4 md:mt-12 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 text-xs">
            <p>&copy; 2026 Slashdot Website Competition. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
