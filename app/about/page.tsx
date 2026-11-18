import type { Metadata } from "next";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import AboutTools from "@/components/about/AboutTools";
import AboutBento from "@/components/about/AboutBento";
import AboutAside from "@/components/about/AboutAside";
import AboutIntro from "@/components/about/AboutIntro";

export const metadata: Metadata = {
  title: "About | Jyotii Bhardwaj",
  description: "Meet Jyotii Bhardwaj, a design-minded Next.js developer based in India and working with clients worldwide.",
};

async function getContributionTotal(year: number): Promise<number | null> {
  try {
    const response = await fetch(`https://github.com/users/Jyoti-bhardwaj0147/contributions?from=${year}-01-01&to=${year}-12-31`, {
      headers: { Accept: "text/html", "User-Agent": "jyotii-portfolio" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;

    const html = await response.text();
    const match = html.match(new RegExp(`([0-9,]+)\\s+contributions?\\s+in\\s+${year}\\b`, "i"));
    return match ? Number(match[1].replaceAll(",", "")) : null;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const contributionYear = new Date().getUTCFullYear();
  const contributionTotal = await getContributionTotal(contributionYear);

  return (
    <>
      <Header />
      <main id="top" className="flex-1 bg-background">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-40 lg:px-10">
          <AboutIntro>
            <AboutAside />
            <div data-about-copy className="flex min-w-0 flex-col justify-center">
              <p data-about-tagline className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-accent">About me</p>
              <h1 id="about-heading" className="max-w-xl font-display text-[clamp(2.25rem,6vw,3.25rem)] font-bold leading-[0.97] tracking-[-0.06em] text-foreground">
                <span className="block overflow-hidden"><span data-about-line className="block">I&apos;m Jyotii,</span></span>
                <span className="block overflow-hidden"><span data-about-line className="block font-playfair text-white">Next.js  Developer & Designer</span></span>
              </h1>
              <div data-about-description className="mt-8 max-w-xl space-y-5 text-base leading-7 sm:leading-6 text-secondary sm:text-sm">
                <p>
                  I’m a <span className="font-playfair text-white">freelance Next.js developer and designer</span> creating distinctive digital experiences that bring together modern aesthetics, performance, and functionality. I help ambitious brands transform their ideas into engaging, high-quality websites.
                </p>
                <p>
                  My approach blends creative design with thoughtful development. Using <span className="font-playfair text-white">Figma, Tailwind CSS, and GSAP</span>, I craft refined interfaces, fluid animations, and seamless interactions that make every digital experience feel intuitive and memorable.
                </p>
                <p>
                  I build <span className="font-playfair text-white">custom websites, eCommerce platforms, and web apps</span> with React, Next.js, and Node.js, adding mobile solutions when needed. Each project is designed around your business goals to be scalable, easy to use, and built to last.
                </p>
              </div>
            </div>
          </AboutIntro>

          <AboutBento contributionYear={contributionYear} contributionTotal={contributionTotal} />

          <AboutTools />
        </div>
      </main>
      <Footer />
    </>
  );
}
