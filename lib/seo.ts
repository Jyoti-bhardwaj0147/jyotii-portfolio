import type { Metadata } from "next";

export const SITE_URL = "https://jyotiibhardwaj.com";
export const SITE_NAME = "Jyotii Bhardwaj | Next.js Developer & Designer";
export const SITE_DESCRIPTION = "Freelance Next.js developer and designer crafting responsive React websites, refined UI/UX, and smooth GSAP animations for brands worldwide.";

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = new URL(path, SITE_URL).href;
  const image = { url: `${SITE_URL}/images/projects/project-4-v1.png`, alt: "Jyotii Bhardwaj - Next.js developer and designer portfolio" };
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", locale: "en_US", siteName: SITE_NAME, url, title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
