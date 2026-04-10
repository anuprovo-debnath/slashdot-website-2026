<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Mandates: Slashdot 2026

## 1. Documentation-First Protocol (CRITICAL)
You are an agent operating on a high-fidelity system. Before writing code, you MUST:
- **Scan `/docs/`**: Read `implementation_summary.md` for infrastructure and `blog_system.md` for UI logic.
- **Maintain Sync**: Any code change must be reflected in the relevant `.md` file in `/docs/`.
- **New Features**: Create a new `.md` in `/docs/` for any new page/system using the `blog_system.md` format.

## 2. Infrastructure Guardrails (from implementation_summary.md)
- **Tailwind v4**: No `tailwind.config.js` exists. Tokens are in `src/app/globals.css` under `@theme`.
- **Theme Logic**: Uses View Transitions API with `flushSync`. Do not remove the coordinate logic in `ThemeToggle.tsx`.
- **Navbar**: Must keep `transform-gpu` to prevent Chrome rendering flicker.
- **Paths**: Project is at subpath `/slashdot-website-2026/`. Respect the `<base>` tag.

## 3. Design Constraints (from blog_system.md)
- **Grid**: Cards are strictly **450px** high.
- **SVG Patterns**: Must use the **Tan=3 (71°)** slant ratio.
- **Hydration**: Use `mounted` state checks for `localStorage/window` to ensure `output: 'export'` compatibility.