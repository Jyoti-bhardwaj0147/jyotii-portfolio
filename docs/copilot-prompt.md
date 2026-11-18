# Copilot Prompt — Jyotii Portfolio (Next.js)

Paste this into GitHub Copilot Chat (or Copilot Workspace) in a fresh Next.js project.

---

Build a single-page freelance developer portfolio in **Next.js 14 (App Router) with TypeScript and Tailwind CSS**. This is for Jyotii, a freelance Next.js developer with 6.5+ years of experience.

**Global requirements**
- App Router, TypeScript, Tailwind CSS.
- Dark/light theme toggle, implemented with a `data-theme` attribute on `<html>` and Tailwind's `dark:` variant (or CSS variables). Default theme is **dark**. Persist the choice in `localStorage` and avoid a flash of wrong theme on load (set the attribute in a small inline script or via `next-themes`).
- Use `framer-motion` for animations: page-load hero sequence, scroll-triggered reveals (via `whileInView`), hover micro-interactions. Keep motion restrained — one orchestrated hero sequence, not fade-up on every element.
- Fully responsive, keyboard-accessible, respects `prefers-reduced-motion`.
- Fonts: "Space Grotesk" for display/headings, "Inter" for body text, loaded via `next/font/google`.
- Color palette: deep ink-navy background (`#0B0D12`) with a warm amber accent (`#E8B84B`) and a soft mint secondary accent (`#6FE3C4`) in dark mode; warm paper background (`#F7F4EC`) with a deeper amber accent in light mode.

**Sections (single page, in this order)**
1. **Header** — fixed/sticky, blurred background. Logo on the left: a rounded square with the initial "J". Theme toggle and a "Ping me on WhatsApp" button (`https://wa.me/<phone-number>`) on the right.
2. **Hero** — full viewport height. Large kinetic headline (animate lines/words in on load), a short tagline introducing Jyotii as a freelance Next.js developer with 6.5+ years of experience, two CTA buttons ("View my work", "Start a project"), and a small stats row (years of experience, projects, tools). Subtle animated background (grid pattern or gradient glow).
3. **About** — two-column layout: bio text on one side (mention Next.js, React, GSAP/Framer Motion, Three.js, Node.js), a photo/avatar placeholder on the other.
4. **Work** — a responsive grid of **6 project cards**, each with a role/category label, project title, short description, and a row of stack-tag pills. Hover lift + subtle glow on cards.
5. **Tech Stack** — two grouped chip grids:
   - "Tech I Work With": React, Next.js, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS, Node.js, Express, Python, Java, PHP, SQL, MongoDB, PostgreSQL, MySQL, Git, Docker, Vercel, Netlify, Postman
   - "Creative Tools": CapCut, Photoshop, Figma
6. **CTA** — centered closing section with a bold statement and a prominent WhatsApp button.
7. **Footer** — name/title, quick nav links, socials, copyright.

**File structure to generate**
- `app/layout.tsx` — fonts, metadata, theme script
- `app/page.tsx` — composes all sections
- `components/Header.tsx`, `Hero.tsx`, `About.tsx`, `Work.tsx`, `TechStack.tsx`, `Cta.tsx`, `Footer.tsx`, `ThemeToggle.tsx`
- `lib/data.ts` — exports the 6 projects and the tech/creative tool lists as typed arrays, so content is easy to edit
- `tailwind.config.ts` with the custom color tokens and font families wired up

Use placeholder project content (title, one-line description, 3 stack tags each) that I can edit later in `lib/data.ts`. Leave a clear `TODO` comment for the WhatsApp phone number and email.
