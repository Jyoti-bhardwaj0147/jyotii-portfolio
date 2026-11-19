import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import CustomCursor from "@/components/cursor/CustomCursor";
import ScrambleTextController from "@/components/ui/ScrambleTextController";
import LettersFlipping from "@/components/ui/LettersFlipping";
import "./globals.css";

const inter = localFont({
  src: "./fonts/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-inter",
    weight: "100 900",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-Bold.ttf",
  variable: "--font-space-grotesk",
  weight: "700",
  display: "swap",
});
const playfairDisplay = localFont({
  src: "./fonts/PlayfairDisplay-BoldItalic.ttf",
  variable: "--font-playfair-display",
  weight: "700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Jyotii Bhardwaj | Next.js Developer & Designer",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  keywords: ["Jyotii Bhardwaj", "freelance Next.js developer", "React developer", "web designer", "UI/UX designer", "GSAP animation", "responsive web development"],
  robots: { index: true, follow: true },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.webp",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="jyotii-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const theme = localStorage.getItem('jyotii-theme') || 'dark'; document.documentElement.dataset.theme = theme; } catch (_) { document.documentElement.dataset.theme = 'dark'; } })();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CustomCursor />
        <ScrambleTextController />
        {children}
        <div className="bottom-blur" aria-hidden="true" />
        <LettersFlipping />
      </body>
    </html>
  );
}
