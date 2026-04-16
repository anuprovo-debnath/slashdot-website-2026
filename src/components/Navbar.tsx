"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { getEventStatus } from "@/lib/eventUtils";
import { EventData } from "@/lib/events";

const NAV_LINKS = [
  { name: "Team", href: "/team" },
  { name: "Blog", href: "/blog" },
  { name: "Projects", href: "/projects" },
  { name: "Events", href: "/events", hasLiveDot: true },
  { name: "Fun Zone", href: "/fun-zone" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const pathname = usePathname();
  const logoRef = React.useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isSkipped, setIsSkipped] = React.useState(false);
  const [shouldAnimate, setShouldAnimate] = React.useState(false);
  const [hasLiveEvent, setHasLiveEvent] = React.useState(false);
  // Guard: skip scroll updates while a View Transition is in progress,
  // because the API temporarily resets scrollY to 0 during snapshot capture.
  const isTransitioningRef = React.useRef(false);

  React.useEffect(() => {
    const calcProgress = () => {
      const winScroll = window.scrollY;
      const viewH = window.visualViewport?.height || window.innerHeight;
      const height = document.documentElement.scrollHeight - viewH;
      return height > 0 ? Math.min(100, Math.max(0, (winScroll / height) * 100)) : 0;
    };

    const handleScroll = () => {
      // Ignore scroll events fired during a View Transition snapshot
      if (isTransitioningRef.current) return;
      setScrolled(window.scrollY > 20);
      setScrollProgress(calcProgress());
    };

    // Listen for view transition start/end to gate the scroll handler
    const handleTransitionStart = () => { isTransitioningRef.current = true; };
    const handleTransitionEnd = () => {
      isTransitioningRef.current = false;
      // Resync after transition ends with the real scroll position
      setScrolled(window.scrollY > 20);
      setScrollProgress(calcProgress());
    };

    const handleReady = (e?: any) => {
      setIsLoaded(true);
      if (e?.detail?.skipped) {
        setIsSkipped(true);
        setShouldAnimate(true);
      } else {
        // Wait for flight animation to finish before triggering the typing reveal
        setTimeout(() => setShouldAnimate(true), 1200);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener('slashdot:loading-ready', handleReady);
    window.addEventListener('slashdot:transition-start', handleTransitionStart);
    window.addEventListener('slashdot:transition-end', handleTransitionEnd);

    // Initial check in case we mounted after the event fired (e.g., fast refresh)
    if (document.body.classList.contains('stage-active-site')) {
      handleReady();
    }

    // Failsafe: if still hidden after 8 seconds, reveal regardless
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 8000);

    // Check for live events
    const checkLiveStatus = async () => {
      try {
        const response = await fetch('/api/events/status', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setHasLiveEvent(data.hasLiveEvent);
        }
      } catch (err) {
        console.error("Failed to fetch live status", err);
      }
    };

    checkLiveStatus();
    const statusInterval = setInterval(checkLiveStatus, 30000); // 30s Heartbeat for live status sync (matches existing Dynamic Status Hub heartbeat)

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('slashdot:loading-ready', handleReady);
      window.removeEventListener('slashdot:transition-start', handleTransitionStart);
      window.removeEventListener('slashdot:transition-end', handleTransitionEnd);
      clearTimeout(timer);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <>
    <nav
      // className={`fixed top-0 left-0 right-0 z-50 transition duration-300 transform-gpu border-b ${scrolled
      //   ? "border-black/10 dark:border-white/10 bg-[var(--color-bg)]/80 backdrop-blur-md py-3"
      //   : "border-transparent bg-transparent py-3"
      //   }`}
      className={`fixed top-0 left-0 right-0 z-50 transition duration-300 transform-gpu border-b 
        ${"border-black/10 dark:border-white/10 bg-[var(--color-bg)]/80 backdrop-blur-md py-3"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group relative no-underline">
              {/* Collision prevention overlay */}
              <div
                id="final-logo-pos"
                ref={logoRef}
                className={`flex items-center text-3xl font-heading tracking-[0.08em] select-none transition-opacity duration-500 ${pathname !== '/' && shouldAnimate ? "mini-reveal-logo" : ""}`}
                style={{
                  // Keep it physically hidden on home page so the other animation can take over
                  opacity: pathname !== '/' ? (isLoaded ? 1 : 0) : 0,
                  visibility: pathname !== '/' ? 'visible' : 'hidden' // Added visibility for extra safety
                }}
              >
                <span id="final-logo-text" className="text-neutral-800 dark:text-white flex items-center">
                  {"Slashdot".split('').map((char, i) => (
                    <span
                      key={i}
                      // ONLY apply the animation class if we are NOT on the home page
                      className={pathname !== '/' && shouldAnimate ? "logo-char-reveal" : "opacity-0"}
                      style={{ "--i": i } as any}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span
                  // ONLY apply the animation class if we are NOT on the home page
                  className={`text-[var(--color-primary)] ml-1 ${pathname !== '/' && shouldAnimate ? "logo-dot-slide" : "opacity-0"}`}
                >
                  /.
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center space-x-1">
            <div className="flex items-center space-x-1 mr-4">
              {NAV_LINKS.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 rounded-full text-base font-medium transition-all duration-200 relative ${isActive
                      ? "text-[var(--color-primary)]"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
                      }`}
                  >
                    {link.name}
                    {link.hasLiveDot && hasLiveEvent && (
                      <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-live shadow-[0_0_8px_rgba(var(--color-live-rgb),0.5)]"></span>
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center pl-4 border-l border-black/10 dark:border-white/10 space-x-3">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('slashdot:open-search'))}
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all group"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-[var(--color-primary)] transition-colors" />
              </button>

              <ThemeToggle />

              <Link
                href="#join-us"
                className="ml-2 bg-[var(--color-primary)] text-white px-7 py-2.5 rounded-full font-bold text-base hover:brightness-110 transition-all shadow-lg shadow-[var(--color-primary)]/20 active:scale-95 whitespace-nowrap"
              >
                JOIN
              </Link>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('slashdot:open-search'))}
              className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <div className="relative">
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                  {hasLiveEvent && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                    </span>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll Progress Indicator */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-primary)] transition-all duration-150 ease-out shadow-[0_0_8px_var(--color-primary)]"
        style={{ width: `${scrollProgress}%` }}
      />

      <style jsx>{`
        .mini-reveal-logo {
          --rev-base-delay: 0.1s;
          --rev-dot-duration: 1.28s;
          --rev-char-duration: 0.1s;
          --rev-char-stagger: 0.16s;
        }

        @keyframes mini-reveal-dot {
          0% { transform: translateX(-160px); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes mini-reveal-char {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .logo-char-reveal {
          display: inline-block;
          opacity: 0;
          animation: mini-reveal-char var(--rev-char-duration) step-end forwards;
          animation-delay: calc(var(--i) * var(--rev-char-stagger) + var(--rev-base-delay) + 0.1s);
        }

        .logo-dot-slide {
          display: inline-block;
          opacity: 0;
          animation: mini-reveal-dot var(--rev-dot-duration) linear forwards;
          animation-delay: var(--rev-base-delay);
        }
      `}</style>
      </nav>

      {/* Mobile Menu - Extracted as sibling to float above hero text */}
      <div
        className={`md:hidden fixed top-[89px] left-0 right-0 z-[70] bg-[var(--color-bg)] overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[calc(100vh-89px)] opacity-100 border-b border-black/10 dark:border-white/10 shadow-2xl" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 pt-4 pb-8 space-y-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl font-medium transition-colors relative ${isActive
                  ? "text-[var(--color-primary)]"
                  : "hover:text-[var(--color-primary)] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
              >
                {link.name}
                {link.hasLiveDot && hasLiveEvent && (
                  <span className="absolute top-1/2 -translate-y-1/2 right-4 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-live shadow-[0_0_8px_rgba(var(--color-live-rgb),0.5)]"></span>
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-black/10 dark:border-white/10">
            <Link
              href="#join-us"
              onClick={(e) => {
                if (isOpen) {
                  e.preventDefault();
                  setIsOpen(false);
                  setTimeout(() => {
                    const el = document.getElementById("join-us");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 300);
                }
              }}
              className="block w-full text-center px-4 py-4 rounded-xl font-bold bg-[var(--color-primary)] text-white hover:brightness-110 transition-all shadow-lg shadow-[var(--color-primary)]/20"
            >
              JOIN THE CLUB
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
