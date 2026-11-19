"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { projects } from "@/lib/data";
import useReducedMotion from "@/hooks/useReducedMotion";
import { SparklesCore } from "@/components/ui/sparkles";
import styles from "./HomeProjects.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

const HOME_PROJECT_COUNT = 4;

export function HomeProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reduceMotion || !headingRef.current) return;

      const media = gsap.matchMedia();
      media.add({ compact: "(max-width: 767px)", wide: "(min-width: 768px)" }, (context) => {
        const compact = context.conditions?.compact;

        gsap.fromTo(
          headingRef.current,
          { autoAlpha: 0, y: compact ? 24 : 50, filter: `blur(${compact ? 4 : 8}px)` },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 90%",
              end: "top 55%",
              scrub: 0.8,
            },
          },
        );

        sectionRef.current?.querySelectorAll<HTMLElement>("[data-project-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: compact ? 24 : 50, scale: compact ? 0.98 : 0.9 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top 90%",
                end: "top 55%",
                scrub: 0.8,
              },
            },
          );
        });
      });

      return () => media.revert();
    },
    { dependencies: [reduceMotion], scope: sectionRef, revertOnUpdate: true },
  );

  return (
    <section ref={sectionRef} id="work" aria-labelledby="projects-heading" className=" min-h-svh  flex gap-8 flex-col items-center relative  overflow-hidden py-20 sm:py-24 ">
      {!reduceMotion && (
        <div className="pointer-events-none absolute inset-x-0 -z-10 top-0 mx-auto h-40 w-[min(90%,40rem)]" aria-hidden="true">
          <div className="relative h-full w-full">
            {/* Gradients */}
            <div className="absolute left-[12.5%] top-0 bg-gradient-to-r from-transparent via-accent to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute left-[12.5%] top-0 bg-gradient-to-r from-transparent via-accent to-transparent h-px w-3/4" />
            <div className="absolute left-[37.5%] top-0 bg-gradient-to-r from-transparent via-accent-hover to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute left-[37.5%] top-0 bg-gradient-to-r from-transparent via-accent-hover to-transparent h-px w-1/4" />

            {/* Core component */}
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="work-sparkles-field h-full w-full"
              particleColor="#FFFFFF"
            />

            {/* Radial Gradient to prevent sharp edges */}
            <div className="absolute inset-0 h-full w-full bg-background transition-colors duration-300 [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 z-10">

        <div className="mb-12 flex flex-col items-center justify-center gap-5 sm:flex-row sm:items-center sm:justify-center sm:gap-0">

          <h2 ref={headingRef} id="projects-heading" className="font-display text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">Things I’ve <span className="font-playfair text-accent">built</span></h2>

        </div>
        <div className="mb-12 grid sm:grid-cols-2 gap-10 grid-cols-1 w-full max-w-6xl mx-auto">
          {projects.slice(0, HOME_PROJECT_COUNT).map((project) => (
            <div key={project.id} data-project-reveal className={styles.shadowWrap}>
              <a
                href={project.href ?? `/projects#${project.id}`}
                onPointerMove={(event) => {
                  const bounds = event.currentTarget.getBoundingClientRect();
                  event.currentTarget.style.setProperty("--glow-x", `${event.clientX - bounds.left}px`);
                  event.currentTarget.style.setProperty("--glow-y", `${event.clientY - bounds.top}px`);
                }}
                className={`${styles.card} group relative isolate flex min-w-0 flex-col rounded-2xl bg-surface-elevated/60 p-3 text-foreground hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
                  style={{ background: "radial-gradient(clamp(120px, 16vw, 160px) circle at var(--glow-x, 22%) var(--glow-y, 22%), color-mix(in srgb, var(--accent) 10%, transparent), transparent 80%)" }}
                />
                {project.imageSrc && (
                  <span className="relative block overflow-hidden rounded-xl border border-line/70">
                    <Image
                      src={project.imageSrc}
                      alt={project.imageAlt ?? project.title}
                      width={1352}
                      height={635}
                      loading="eager"
                      sizes="(min-width: 1280px) 600px, (min-width: 640px) 50vw, 100vw"
                      className="aspect-video w-full object-cover"
                    />
                  </span>
                )}
                <span className="relative flex flex-1 flex-col gap-2 px-2 pb-2 pt-5">
                  <span className="flex items-start justify-between gap-3 font-display text-xl font-bold">
                    <span>{project.title}</span>
                    <ArrowUpRight className="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
                  </span>
                  <span className="max-w-md text-[0.78125rem] leading-tight break-words text-secondary">{project.description}</span>
                </span>
              </a>
            </div>
          ))}
        </div>
        <div data-project-reveal className="flex justify-center">
          <a
            href="/projects"
            className="inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent" 
          >
            Explore all
            <ArrowUpRight className="size-5 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
