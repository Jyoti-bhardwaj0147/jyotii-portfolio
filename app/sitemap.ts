import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Last relevant page updates: commit ecc30c3 (SEO metadata and contact link).
  // Update each timestamp when that page's content or metadata changes.
  const pages = [
    { path: "/", lastModified: "2026-11-19T13:17:48+05:30" },
    { path: "/about", lastModified: "2026-11-19T13:17:48+05:30" },
    { path: "/projects", lastModified: "2026-11-19T13:17:48+05:30" },
    { path: "/contact", lastModified: "2026-11-19T13:17:48+05:30" },
  ];

  return pages.map(({ path, lastModified }) => ({
    url: new URL(path, SITE_URL).href,
    lastModified,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
