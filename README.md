# Jyotii Bhardwaj — Next.js Developer & Designer

I build custom websites and digital experiences that pair thoughtful design with fast, responsive development. My work spans portfolio and brand websites, eCommerce experiences, and web apps, with attention to accessibility, search visibility, and motion that serves the interface.

**Portfolio:** [jyotiibhardwaj.com](https://jyotiibhardwaj.com/) · **Projects:** [View the portfolio](https://jyotiibhardwaj.com/projects) · **Work together:** [Get in touch](https://jyotiibhardwaj.com/contact)

## What I do

- **Next.js and React development:** custom, responsive sites and applications built around real content and business needs.
- **UI/UX design:** clear layouts, polished details, and intuitive flows across desktop and mobile.
- **Creative interaction:** purposeful animation with GSAP, Motion, and Three.js where it improves the experience.
- **Performance and discoverability:** attention to loading, accessibility, page metadata, canonical URLs, and search engine discovery.

## Selected projects

| Project | What it is | Live site |
| --- | --- | --- |
| Luna Cosmic | An immersive interface for moon phases and lunar insights. | [Explore Luna Cosmic](https://luna-cosmic.vercel.app/) |
| Visualis Focus | A wellness and visual focus experience. | [Explore Visualis](https://visualis-focus.vercel.app/) |
| Aura Interiors | A considered digital home for an interiors brand. | [Explore Aura Interiors](https://aura-interiors-v1.vercel.app/) |
| Jyotii Portfolio | This portfolio, bringing together design, motion, projects, and contact. | [Explore the portfolio](https://jyotiibhardwaj.com/) |

The full project selection is on the [Projects page](https://jyotiibhardwaj.com/projects).

## Built with

- **Application:** Next.js App Router, React, TypeScript, and Tailwind CSS.
- **Motion and visuals:** GSAP, Motion, Three.js, React Three Fiber, and Drei.
- **Deployment:** Cloudflare Workers through vinext and Vite, with a Workers Response Store service binding for caching.
- **Contact and SEO:** Resend for the contact form; Next.js Metadata API and `next-seo` for page metadata and structured data.

## Run locally

Use a current Node.js release supported by the installed Next.js and Vite versions, then install dependencies and start the Next.js development server:

```powershell
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). For the Cloudflare/vinext development path, run `npm run dev:vinext` and open [localhost:3001](http://localhost:3001).

The contact form needs server-side `RESEND_API_KEY` and `RESEND_FROM_EMAIL` values. Add them to a local `.env.local` for Next.js or the appropriate local Cloudflare environment file; keep those files out of Git. See [contact email setup](docs/contact-email.md) for sender-domain requirements and delivery behavior.

## Validate and deploy

```powershell
npx tsc --noEmit
npm run lint
node --test --test-isolation=none tests/*.test.mjs
npm run build
```

The production Cloudflare path uses the scripts already defined in `package.json`:

```powershell
npm run build:vinext
npm run deploy:response-store
npm run deploy:vinext
```

Configure the Cloudflare account, Worker bindings, and production secrets before deploying. The response-store command deploys the prebuilt cache Worker; the vinext command deploys the portfolio Worker. Set the custom domain in Cloudflare, then verify the four public routes, the contact flow, and `/sitemap.xml` and `/robots.txt` on the live domain. See [search visibility setup](docs/seo.md) for Search Console steps.

## Contact

Have a site or digital experience in mind? [Send me a message](https://jyotiibhardwaj.com/contact).
