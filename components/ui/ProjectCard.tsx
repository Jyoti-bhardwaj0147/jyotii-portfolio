"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import workspaceImage from "@/public/images/creative-workspace.png";
import type { Project } from "@/lib/data";
import useReducedMotion from "@/hooks/useReducedMotion";

type ProjectCardProps = {
  project: Project;
  index: number;
  pinned?: boolean;
  eager?: boolean;
};

export default function ProjectCard({ project, index, pinned = false, eager = false }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  const className = `project-card group min-w-0 overflow-hidden rounded-[1.5rem] border border-line bg-surface-elevated p-3 text-foreground shadow-[0_24px_70px_-28px_rgba(0,0,0,0.45)] transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-[0_28px_80px_-30px_rgba(181,55,242,0.2)] sm:rounded-[2rem] sm:p-4 ${pinned ? "[@media(min-width:1024px)_and_(min-height:700px)]:absolute [@media(min-width:1024px)_and_(min-height:700px)]:inset-0" : ""}`;
  const content = (
    <div
      className={`flex h-full min-w-0 flex-col rounded-[1rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:min-h-[522px] ${pinned ? "[@media(min-width:1024px)_and_(min-height:700px)]:h-full [@media(min-width:1024px)_and_(min-height:700px)]:flex-row" : ""}`}>
      <figure className={`relative aspect-[16/10] shrink-0 overflow-hidden rounded-[1rem] border border-line bg-surface sm:max-md:max-h-[300px] sm:rounded-[1.25rem] ${pinned ? "[@media(min-width:1024px)_and_(min-height:700px)]:h-full [@media(min-width:1024px)_and_(min-height:700px)]:w-[56%]" : ""}`}>
        <Image
          src={project.imageSrc || workspaceImage}
          alt={project.imageSrc ? (project.imageAlt || `${project.title} project preview`) : ""}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes={pinned ? "(min-width: 1024px) and (min-height: 700px) 650px, (min-width: 768px) 45vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw"}
          className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.03]"
        />
        {!project.imageSrc && (
          <figcaption className="absolute inset-x-4 bottom-4 rounded-xl border border-white/15 bg-black/70 px-4 py-2.5 text-xs tracking-wide text-white backdrop-blur-md">
            Project preview coming soon
          </figcaption>
        )}
      </figure>
      <div className={`flex min-w-0 flex-1 flex-col px-3 pb-3 pt-6 sm:px-1.5 sm:pb-4 sm:pt-7 ${pinned ? "[@media(min-width:1024px)_and_(min-height:700px)]:justify-center [@media(min-width:1024px)_and_(min-height:700px)]:px-10 [@media(min-width:1024px)_and_(min-height:700px)]:py-8" : ""}`}>
        
        <h3 className="break-words font-display text-2xl font-medium leading-[1.15] tracking-[-0.04em] sm:text-3xl">{project.title}</h3>
        <p className="mt-2 max-w-md text-[0.78125rem] leading-tight break-words text-secondary">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Technologies used">
          {project.stackTags.map((tag) => (
            <span key={tag} className="rounded-full border border-line bg-surface px-2 py-1.5 text-xs leading-2 text-secondary">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-7">
          <div className="flex justify-center border-t border-line pt-4 ">
            <a
              href={project.href}
              target={project.href ? "_blank" : undefined}
              rel={project.href ? "noopener noreferrer" : undefined}
              aria-disabled={!project.href}
              className={`inline-flex min-h-9 max-w-full w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground ${project.href ? "hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent" : "cursor-not-allowed opacity-50"}`}
            >
              View Project
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  if (pinned) {
    return <article id={project.id} className={className} style={{ zIndex: 10 + index }}>{content}</article>;
  }

  return (
    <motion.article
      id={project.id}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08 }}
      className={className}
    >
      {content}
    </motion.article>
  );
}
