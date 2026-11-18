"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import ProjectCard from "../ui/ProjectCard";

// Change this number to control how many projects appear on /projects only.
// Projects display in the order defined in lib/data.ts.
const PROJECTS_PAGE_COUNT = 4;

export default function Projects() {
  return (
    <section id="projects" className="bg-surface py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
              Explore the{" "}
              <span className="font-playfair text-accent">projects.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-secondary"></p>
        </motion.div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Keep loading consistent for copies of the LCP image: Next tracks it by URL. */}
          {projects.slice(0, PROJECTS_PAGE_COUNT).map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              eager={index === 0 || project.imageSrc === projects[0]?.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
