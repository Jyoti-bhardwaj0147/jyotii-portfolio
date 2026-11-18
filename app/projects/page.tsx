import Header from "@/components/header/Header";
import Projects from "@/components/projects/Projects";
import Footer from "@/components/footer/Footer";

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
