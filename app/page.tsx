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

export default function Home() {
  return (
    <>
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
