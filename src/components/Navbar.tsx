"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Team", href: "/team" },
  { name: "Blog", href: "/blog" },
  { name: "Projects", href: "/projects" },
  { name: "Events", href: "/events" },
  { name: "Fun Zone", href: "/fun-zone" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "border-b border-black/10 dark:border-white/10 bg-[var(--color-bg)]/80 backdrop-blur-md py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <div className="relative h-10 w-40 overflow-hidden">
                <Image
                  src="/slashdot-website-2026/logos/Logo_White_BG.png"
                  alt="Slashdot"
                  fill
                  className="object-contain dark:hidden transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                  priority
                />
                <Image
                  src="/slashdot-website-2026/logos/Logo_Black_BG.png"
                  alt="Slashdot"
                  fill
                  className="object-contain hidden dark:block transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center space-x-1">
            <div className="flex items-center space-x-1 mr-4">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? "text-[var(--color-primary)] bg-[var(--color-primary)]/5" 
                        : "text-neutral-600 dark:text-neutral-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
                    }`}
                  >
                    {link.name}
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
                className="ml-2 bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-[var(--color-primary)]/20 active:scale-95 whitespace-nowrap"
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
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100 border-t border-black/10 dark:border-white/10" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-4 pb-8 space-y-2 bg-[var(--color-bg)] shadow-2xl">
          {NAV_LINKS.map((link) => {
             const isActive = pathname === link.href;
             return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10" 
                    : "hover:text-[var(--color-primary)] hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
             );
          })}
          <div className="pt-4 mt-4 border-t border-black/10 dark:border-white/10">
            <Link
              href="#join-us"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-4 rounded-xl font-bold bg-[var(--color-primary)] text-white hover:brightness-110 transition-all shadow-lg shadow-[var(--color-primary)]/20"
            >
              JOIN THE CLUB
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
