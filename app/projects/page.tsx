import { pageMetadata } from "@/lib/seo";
import Header from "@/components/header/Header";
import Projects from "@/components/projects/Projects";
import Footer from "@/components/footer/Footer";

export const metadata = pageMetadata("/projects", "Next.js & React Projects | Jyotii Bhardwaj", "Explore Jyotii Bhardwaj's Next.js and React portfolio: responsive websites, creative UI/UX design, and interactive experiences with GSAP and Three.js.");

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main id="top" className="flex-1 bg-background">
        <Projects />
      </main>
      <Footer />
    </>
  );
}
