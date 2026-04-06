"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="border-b border-black/10 dark:border-white/10 bg-[var(--color-bg)] sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              {/* Light Mode Logo */}
              <img 
                src="/slashdot-website-2026/logos/SlashDot_text_White_BG.png" 
                alt="Slashdot" 
                className="h-10 w-auto dark:hidden" 
              />
              {/* Dark Mode Logo */}
              <img 
                src="/slashdot-website-2026/logos/SlashDot_text_Black_BG.png" 
                alt="Slashdot" 
                className="h-10 w-auto hidden dark:block" 
              />
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
            <Link href="/tech" className="hover:text-[var(--color-primary)] transition-colors">Tech</Link>
            <Link href="/about" className="hover:text-[var(--color-primary)] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[var(--color-primary)] transition-colors">Contact</Link>
            <ThemeToggle />
          </div>
          <div className="flex items-center md:hidden space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none"
              aria-expanded="false"
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
          isOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-black/10 dark:border-white/10 px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[var(--color-bg)]">
          <Link href="/" className="block px-3 py-2 rounded-md font-medium hover:text-[var(--color-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Home</Link>
          <Link href="/tech" className="block px-3 py-2 rounded-md font-medium hover:text-[var(--color-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Tech</Link>
          <Link href="/about" className="block px-3 py-2 rounded-md font-medium hover:text-[var(--color-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">About</Link>
          <Link href="/contact" className="block px-3 py-2 rounded-md font-medium hover:text-[var(--color-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
