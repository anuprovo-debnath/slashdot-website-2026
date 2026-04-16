# Slashdot Website 2026

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

> **Slashdot IISER Kolkata** — The premier coding, designing, and technology club. This is the official high-fidelity website for the 2026 season.

---

## ✨ Overview

The **Slashdot Website 2026** is a premium, high-performance web experience built for the community at IISER Kolkata. It features a cinematic boot sequence, a mathematically-driven interactive hero section, and a horizontal navigation architecture that blends technical maturity with modern aesthetics.

### 🚀 Key Features

- **Cinematic Boot Sequence**: A high-fidelity terminal-style loading animation with staggered character reveals and session-aware persistence.
- **Interactive Hero Canvas**: A 600-particle canvas engine using inverse-proportion depth math to create a faux-parallax 3D effect.
- **Morphing Navigation**: A scroll-linked brand transition where the hero logo "flies" and scales into position in the navbar.
- **Horizontal Content Strips**: Specialized grid-snapping scrollers for Blogs, Events, and Projects.
- **View Transitions Engine**: native browser-level transitions for instant, fluid theme switching (Light/Dark mode).
- **Touch-Parity System**: Custom interaction delays and hover-mirroring to provide desktop-grade feedback on mobile touchscreens.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [React Icons (FA6)](https://react-icons.github.io/react-icons/) / [Lucide](https://lucide.dev/) |
| **Theming** | `next-themes` + View Transitions API |
| **Content** | MDX (Markdown for Blogs & Projects) |
| **Search** | Fuse.js (Pre-generated Static Index) |

---

## 📖 Documentation

The project architecture is thoroughly documented. Click the links below to explore specific subsystems:

### 🛠️ Core Systems
- **[Implementation Summary](docs/implementation_summary.md)**: The technical "Source of Truth" covering the Boot Sequence, Fonts, Deployment, and Mobile UX fixes.
- **[Home System](docs/system_home.md)**: Details on the Hero Canvas, Scroll-linked Fly animation, and Horizontal Strips.
- **[Branding & Typography](docs/implementation_summary.md#4-assets--icons)**: Guide to Arista Pro Bold integration and glyph fallbacks.

### 📱 Component Systems
- **[Navbar System](docs/system_navbar.md)**: Glassmorphism, Adaptive visibility, and mobile drawer logic.
- **[Footer System](docs/system_footer.md)**: 24-column grid architecture and Social grid.
- **[Search System](docs/system_search.md)**: Static index generation and fuzzy search implementation.

### 🎨 Feature Areas
- **[Blog System](docs/system_blog.md)**: MDX processing and responsive typography.
- **[Events System](docs/system_events.md)**: Floating calendar architecture and mobile scroll-sync.
- **[Fun Zone System](docs/system_funzone.md)**: Creative card geometry and external redirection logic.
- **[Projects System](docs/system_projects.md)**: Portfolio grid and detail page layout.
- **[Team System](docs/system_team.md)**: Core Node portal and interactive team grid.

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/anuprovo-debnath/slashdot-website-2026.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

The site is configured for **Static Export** (`output: 'export'`) and is optimized for deployment on **GitHub Pages**.

- **Workflow**: Automated via GitHub Actions (`.github/workflows/deploy.yml`).
- **Base Path**: Hosted at `/slashdot-website-2026/`.

---

## 🤝 Contributing & Support

For issues, feature requests, or collaboration, please reach out via the official channels:
- **Email**: [slashdot@iiserkol.ac.in](mailto:slashdot@iiserkol.ac.in)
- **GitHub**: [slashdot-iiserk](https://github.com/slashdot-iiserk)

&copy; 2026 Slashdot Club, IISER Kolkata. 
