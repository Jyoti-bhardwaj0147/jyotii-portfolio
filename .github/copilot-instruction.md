# Copilot Build Prompt — Jyotii Portfolio (Pro / Award-Level Version)

Paste this into GitHub Copilot Chat in the scaffolded Next.js project (with `.github/copilot-instructions.md` already in place).

---

Build a single-page freelance developer portfolio in **Next.js 14 (App Router), TypeScript, and Tailwind CSS**, for Jyotii — a freelance Next.js developer with 6.5+ years of experience. This should feel like an award-winning, cinematic site, not a template. Use **GSAP (with ScrollTrigger) for the macro-experience** and **Framer Motion for the micro-experience** — never both on the same element.

## Foundations

- Dark/light theme toggle via `data-theme` on `<html>`, default **dark**, persisted in `localStorage`, no flash-of-wrong-theme.
- Fonts via `next/font/google`: "Space Grotesk" for display, "Inter" for body.
- Palette — dark: ink-navy `#0B0D12` background, amber `#E8B84B` primary accent, mint `#6FE3C4` secondary accent. Light: warm paper `#F7F4EC` background, deeper amber accent.
- Animate **only `transform` and `opacity`** — never `width`, `height`, `top`, `left`.
- All GSAP setup goes through the official `@gsap/react` `useGSAP` hook, so cleanup on unmount is automatic — never raw `useEffect` for ScrollTrigger.
- Respect `prefers-reduced-motion` globally: build a `useReducedMotion` hook and use it to strip the intro loader, magnetic effects, and pinned scroll sequences down to simple fades/no motion for users who need it.

## Sections & the pro techniques to apply

**1. Intro Loader (GSAP)**
Full-screen dark loader on first visit: animate bold custom typography or a morphing geometric shape, then crossfade into the hero. Store a `sessionStorage` "visited" flag so returning users (same session) skip straight to the hero.

**2. Header**
Fixed, blurred background. Logo = rounded square with initial "J" on the left. Theme toggle + "Ping me on WhatsApp" button (`https://wa.me/<phone>`) on the right. Entrance animates in right after the loader.

**3. Hero — magnetic + custom cursor (Framer Motion)**
Kinetic headline load sequence (GSAP timeline), tagline, two CTAs, a stats row. Replace the default cursor with a custom fluid dot (Framer Motion, `useMotionValue` + `useSpring` for smooth follow). Buttons and social links get a magnetic pull toward the cursor on proximity. Optional: a subtle interactive particle/abstract-shape background via React Three Fiber, lazy-loaded and skipped under reduced motion.

**4. About**
Two-column bio + photo, revealed on scroll with Framer Motion `whileInView`.

**5. Work — scroll-pinned showcase (GSAP ScrollTrigger)**
Instead of a static grid, pin the section and drive project transitions with scroll: either horizontal scroll through 6 projects, or a stacked-deck effect where each project card slides/stacks over the previous one in 3D space (`transform: translateZ/rotate`, scrubbed to scroll position, `scrub: 1`). On hover, the custom cursor expands into a small floating "View Case Study" badge (Framer Motion `AnimatePresence` + `layoutId`). Each project: role label, title, description, stack-tag pills.
Add a tech-stack filter (React / Node / Design, etc.) above or beside the showcase — filtering re-sorts the visible projects using Framer Motion `layoutId` so items glide to new positions instead of jumping.

**6. Tech Stack**
Two chip groups ("Tech I Work With" and "Creative Tools") from the lists below, revealed with a staggered `whileInView` animation, subtle hover scale/glow per chip.

**7. Marquee banner (GSAP)**
A full-width section with oversized, styled typography (core skills or a short philosophy line) scrolling infinitely and smoothly (60fps) horizontally, built with a GSAP `xPercent` loop, not a naive CSS `animation` that jitters over time.

**8. CTA**
Centered bold closing statement + prominent WhatsApp button, magnetic hover.

**9. Footer**
Name/title, nav links, socials, copyright.

## Content data

Tech I Work With: React, Next.js, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS, Node.js, Express, Python, Java, PHP, SQL, MongoDB, PostgreSQL, MySQL, Git, Docker, Vercel, Netlify, Postman
Creative Tools: CapCut, Photoshop, Figma

Use 6 placeholder projects (title, one-line description, 3 stack tags each) in a typed `lib/data.ts`, easy for me to edit later. Leave a clear `TODO` for the WhatsApp number and email.

## Step-by-Step Implementation Prompts

Feed Copilot Chat **one step at a time**, in order, instead of the whole spec at once — it builds more reliably that way and you can review/fix each piece before moving on. Run each prompt in the project root with `.github/copilot-instructions.md` already in place.

---

### Step 0 — Dependencies
```
Install and configure the following in this Next.js 14 App Router + TypeScript + Tailwind project: framer-motion, gsap, @gsap/react. Confirm the Tailwind config supports CSS variables for theming.
```

### Step 1 — Theme system
```
Set up dark/light theming using a `data-theme` attribute on the <html> element, default "dark". Persist the choice in localStorage and prevent flash-of-wrong-theme by setting the attribute via an inline script in app/layout.tsx before hydration. Add a ThemeToggle client component with a sun/moon icon toggle, styled with Tailwind and CSS variables for --bg, --surface, --text, --accent (amber #E8B84B), --accent-2 (mint #6FE3C4), with warm paper light-mode equivalents.
```

### Step 2 — Design tokens & fonts
```
Configure next/font/google for "Space Grotesk" (display/headings) and "Inter" (body). Wire both into tailwind.config.ts as font-display and font-body. Set up the color tokens from Step 1 as Tailwind theme extensions.
```

### Step 3 — Reduced motion hook
```
Create a hooks/useReducedMotion.ts hook that checks prefers-reduced-motion via matchMedia and updates reactively. This will gate the intro loader, custom cursor, and pinned scroll sequences later.
```

### Step 4 — Intro loader (GSAP)
```
Build components/IntroLoader.tsx: a full-screen dark overlay shown on first visit only, animated with GSAP — a bold typography or geometric morph sequence — then crossfades out into the hero. Use sessionStorage to skip the loader for returning visitors in the same session. Skip entirely if useReducedMotion is true. Use the useGSAP hook from @gsap/react for setup/cleanup.
```

### Step 5 — Header
```
Build components/Header.tsx: fixed position, blurred background, a rounded-square logo with the initial "J" on the left, and on the right a ThemeToggle plus a "Ping me on WhatsApp" button linking to https://wa.me/<phone> (leave phone as a TODO constant). Animate it sliding in with Framer Motion right after the intro loader finishes.
```

### Step 6 — Custom cursor + magnetic buttons (Framer Motion)
```
Build components/CustomCursor.tsx: a fluid dot that follows the mouse using Framer Motion's useMotionValue and useSpring (not raw setState on mousemove). Build components/ui/MagneticButton.tsx: a button wrapper where the element gently pulls toward the cursor within a proximity radius, using useMotionValue + useSpring. Both should no-op under reduced motion. Do not hide the native cursor's focus outline for keyboard users.
```

### Step 7 — Hero
```
Build components/Hero.tsx: a GSAP timeline on load animating headline lines in (stagger, power3.out easing), then tagline, then two CTA buttons ("View my work", "Start a project" using MagneticButton), then a stats row (years experience, projects, tools). Include a subtle animated background (grid pattern + radial glow). Full viewport height.
```

### Step 8 — About
```
Build components/About.tsx: two-column layout (bio text + photo), revealed on scroll using Framer Motion whileInView, staggerChildren for the paragraphs. Use next/image with the image at images/jyotii-bhardwaj.png for the photo, with appropriate alt text.
```

### Step 9 — lib/data.ts
```
Create a typed lib/data.ts exporting: 6 placeholder projects (id, role, title, description, stackTags: string[]), the techStack array, and the creativeTools array using these exact lists — Tech: React, Next.js, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS, Node.js, Express, Python, Java, PHP, SQL, MongoDB, PostgreSQL, MySQL, Git, Docker, Vercel, Netlify, Postman. Creative: CapCut, Photoshop, Figma.
```

### Step 10 — Work: scroll-pinned showcase (GSAP ScrollTrigger)
```
Build components/Work.tsx using data from lib/data.ts: pin the section with GSAP ScrollTrigger (via useGSAP) and drive project transitions with scroll — implement a stacked-card effect where each project slides/rotates over the previous one using transform only, scrubbed to scroll position (scrub: 1). Add components/ui/ProjectCard.tsx for each card (role label, title, description, stack-tag pills). On card hover, the CustomCursor should expand into a small "View Case Study" badge — use AnimatePresence. Provide a full non-pinned fallback (simple vertical stack, fade-in) when useReducedMotion is true.
```

### Step 11 — Tech stack filter with layoutId
```
Add a filter control above Work.tsx (e.g. "All / React / Node / Design") that filters the visible projects by a category field on each project in lib/data.ts. Animate the filtered project list with Framer Motion layoutId so items glide to their new position instead of jumping. Update lib/data.ts to include a category per project.
```

### Step 12 — Tech Stack section
```
Build components/TechStack.tsx: two chip groups ("Tech I Work With", "Creative Tools") from lib/data.ts, revealed with a staggered whileInView animation, subtle hover scale/glow per chip using Tailwind + Framer Motion.
```

### Step 13 — Infinite marquee (GSAP)
```
Build components/Marquee.tsx: a full-width section with large styled typography (a short skills/philosophy line) scrolling infinitely and smoothly horizontally at 60fps, implemented with a GSAP xPercent-based loop (not a plain CSS animation that drifts/jitters over time). Duplicate the content enough times to avoid visible looping gaps.
```

### Step 14 — CTA & Footer
```
Build components/Cta.tsx: centered bold closing statement and a prominent WhatsApp button (MagneticButton). Build components/Footer.tsx: name/title, nav links to each section, socials, copyright year computed at runtime.
```

### Step 15 — Assemble the page
```
Wire IntroLoader, Header, Hero, About, Work, TechStack, Marquee, Cta, and Footer together in app/page.tsx in that order. Confirm CustomCursor is mounted once at the layout level, not per-section.
```

### Step 16 — Performance & accessibility pass
```
Review the whole app: confirm every animation only touches transform/opacity, every GSAP instance is created and cleaned up via useGSAP, the intro loader/custom cursor/pinned scroll all degrade gracefully under prefers-reduced-motion, and all interactive elements remain keyboard-focusable with visible focus states despite the custom cursor.
```

## Optional stack upgrades (mention where relevant, don't force)

- Tailwind CSS paired with **shadcn/ui** or **Aceternity UI** for production-ready Framer Motion primitives (canvas cards, grid backgrounds) instead of building every primitive from scratch.
- **React Three Fiber** for the optional hero particle/shape background — keep it isolated in its own lazy-loaded client component so it never blocks initial page load.

## File structure

```
src/
├── app/layout.tsx        (fonts, metadata, theme script)
├── app/page.tsx          (composes all sections)
├── components/
│   ├── IntroLoader.tsx
│   ├── CustomCursor.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Work.tsx           (pinned showcase + filter)
│   ├── TechStack.tsx
│   ├── Marquee.tsx
│   ├── Cta.tsx
│   ├── Footer.tsx
│   ├── ThemeToggle.tsx
│   └── ui/
│       ├── MagneticButton.tsx
│       └── ProjectCard.tsx
├── lib/data.ts
├── lib/animations.ts      (shared GSAP timelines / Framer variants)
└── hooks/useReducedMotion.ts
```

## Non-negotiable performance/accessibility rules

- Only animate `transform`/`opacity`.
- All GSAP/ScrollTrigger instances created and cleaned up via `useGSAP`.
- Full reduced-motion fallback path, not just shorter durations.
- Custom cursor and 3D background must not block or slow initial render — lazy-load them.
- Everything must remain keyboard-navigable and screen-reader sensible even with the custom cursor active (don't hide focus outlines).