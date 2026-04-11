"use client";

import * as React from "react";
import Image from "next/image";

export function Footer() {
  return (
    <footer id="join-us" className="bg-black/5 dark:bg-white/5 border-t border-black/10 dark:border-white/10 mt-auto">
      {/* Join Us Section */}
      <div
        className="max-w-7xl mx-auto px-4 py-20 text-center"
      >
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-center">

            {/* Contact & Brand */}
            <div className="flex flex-col items-center md:items-start space-y-4 md:translate-x-10">
              <div className="relative">
                {/* Light Mode Logo */}
                <Image
                  src="/slashdot-website-2026/logos/Logo_White_BG.png"
                  alt="Slashdot"
                  width={800}
                  height={160}
                  className="h-24 md:h-32 w-auto dark:hidden"
                  unoptimized
                />
                {/* Dark Mode Logo */}
                <Image
                  src="/slashdot-website-2026/logos/Logo_Black_BG.png"
                  alt="Slashdot"
                  width={800}
                  height={160}
                  className="h-24 md:h-32 w-auto hidden dark:block"
                  unoptimized
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-col items-center space-y-8">
              <div className="text-sm font-semibold uppercase tracking-widest opacity-50">REACH US</div>
              <div className="flex flex-col items-center space-y-6">
                {/* Row 1 */}
                <div className="flex items-center justify-center gap-12">
                  <a
                    href="https://github.com/slashdot-iiserk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-[#0FBF3E] hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                    aria-label="GitHub"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 496 512" fill="currentColor">
                      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.5 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 389.9 8 244.8 8zM106.6 430.3c-1.1 2.2-4.1 2.2-6.5 0-2.3-2.2-2.3-4.6-1.1-6.8 1.1-2.2 4.1-2.2 6.5 0 2.2 2.2 2.2 4.6 1.1 6.8zm-19.1-12.2c1.1 2.2-1.2 4.7-4.1 5.3-2.9.7-5.9-1.2-6.7-3.3-.9-2.2 1.2-4.7 4.1-5.3 3.1-.7 6 1.2 6.7 3.3zm-14.9-10.4c.7 2.2-1.9 4.4-4.6 4.9-2.6 1-5.6 0-6.2-2s2-4.4 4.8-4.9c2.7-1 5.3 0 6 2z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/slashdot-club-iiser-kolkata/about/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-[#0077B5] hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 448 512" fill="currentColor">
                      <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                    </svg>
                  </a>
                  <a
                    href="mailto:slashdot@iiserkol.ac.in"
                    className="group p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                    aria-label="Email"
                  >
                    <Mail className="w-6 h-6" />
                  </a>
                </div>

                {/* Row 2 */}
                <div className="flex items-center justify-center gap-10">
                  <a
                    href="https://discord.gg/F2FW2KAwHt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-[#5865F2] hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                    aria-label="Discord"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 640 512" fill="currentColor">
                      <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.819,1.819,0,0,0-1.017-2.526c-16.095-6.118-31.332-13.461-45.741-21.944a1.831,1.831,0,0,1-.184-3.037c3.159-2.368,6.338-4.819,9.4-7.29a1.811,1.811,0,0,1,1.89-.256c96.274,44.159,200.4,44.159,295.4,0a1.812,1.812,0,0,1,1.89.256c3.061,2.446,6.241,4.922,9.4,7.29a1.831,1.831,0,0,1-.184,3.037c-14.409,8.483-29.646,15.826-45.741,21.944a1.819,1.819,0,0,0-1.017,2.526,350.5,350.5,0,0,0,30.037,48.842,1.9,1.9,0,0,0,2.063.676,486.29,486.29,0,0,0,146.953-74.189,1.983,1.983,0,0,0,.788-1.351C553.033,268.81,532.151,157.771,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.844,59.239C275.335,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@slashdotiiser"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-[#FF0000] hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                    aria-label="YouTube"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 576 512" fill="currentColor">
                      <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.781 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/slashdotiiserkol/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 448 512" fill="currentColor">
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/slashdotiiserk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-[#1877F2] hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                    aria-label="Facebook"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 320 512" fill="currentColor">
                      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="flex flex-col items-center md:items-end space-y-2 opacity-60 text-sm">
              <p>&copy; 2026 Slashdot Website Competition.</p>
              <p>All rights reserved to their respective owners.</p>
              <div className="flex space-x-4 pt-4">
                <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
