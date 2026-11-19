import { JsonLdScript } from "next-seo";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import { pageMetadata } from "@/lib/seo";
import About from "@/components/home/About";
import Client from "@/components/home/client";
import Collob from "@/components/home/collob";
import Cta from "@/components/home/Cta";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Hero from "@/components/home/Hero";
import IntroLoader from "@/components/home/IntroLoader";
import TechStack from "@/components/home/TechStack";
import { HomeProjects } from "@/components/homeprojects/HomeProjects";
import StarsBackground from "@/components/ui/StarsBackground";
import { TracingBeam } from "@/components/ui/tracing-beam";
import TracingBeamDemo from "@/components/tracing-beam-demo";
import { Compare } from "@/components/ui/compare";

export const metadata = pageMetadata("/", "Jyotii Bhardwaj | Next.js Developer & Designer", "Freelance Next.js developer and designer crafting responsive React websites, refined UI/UX, and smooth GSAP animations for brands worldwide.");

export default function Home() {
  return (
    <>
      <JsonLdScript scriptKey="website" data={{ "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: `${SITE_URL}/`, description: SITE_DESCRIPTION }} />
      <IntroLoader />
      <Header />
      <div className="relative isolate">
        <main className="relative z-10 flow-root bg-background">
          <Hero />
          <About />
          <div className="relative isolate">
            <Client />
            <Collob />
          </div>
          <HomeProjects />
          {/* <TracingBeamDemo className="mt-20"  /> */}
          <Cta />
        </main>
        <Footer pinned />
      </div>
    </>
  );
}
