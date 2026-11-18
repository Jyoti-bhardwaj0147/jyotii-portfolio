"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";
import { StackIcon } from "@/components/home/stackIcons";
import { creativeTools, techStack } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TOOL_REVEAL_DURATION = 0.65;
const TOOL_REVEAL_STAGGER = 0.12;

const toolGroups = [
  { title: "Tech Stack", items: techStack },
  { title: "Creative Tools", items: creativeTools },
] as const;

export default function AboutTools() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(() => {
    if (reduceMotion) return;

    const media = gsap.matchMedia();
    media.add({
      mobile: "(width < 640px)",
      small: "(640px <= width < 768px)",
      medium: "(768px <= width < 1024px)",
      large: "(1024px <= width < 1280px)",
      extraLarge: "(width >= 1280px)",
    }, (context) => {
      const conditions = context.conditions;
      const compact = conditions?.mobile || conditions?.small;
      const columns = conditions?.extraLarge ? 8 : conditions?.large ? 6 : conditions?.medium ? 4 : conditions?.small ? 3 : 2;

      sectionRef.current?.querySelectorAll<HTMLElement>("[data-tool-group],[data-experience]").forEach((group) => {
        const items = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));

        for (let index = 0; index < items.length; index += columns) {
          const row = items.slice(index, index + columns);
          gsap.fromTo(
            row,
            { autoAlpha: 0, y: compact ? 24 : 50, scale: compact ? 0.98 : 0.9 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: TOOL_REVEAL_DURATION,
              stagger: TOOL_REVEAL_STAGGER,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row[0],
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      });

      
    });

    return () => media.revert();
  }, { dependencies: [reduceMotion], scope: sectionRef, revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-labelledby="tools-heading" className="mt-24 sm:mt-32">
      <h2 id="tools-heading" className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 mb-8 font-display text-3xl font-bold tracking-tight text-foreground sm:mb-10 sm:text-5xl">
        Tech I Work With
      </h2>
      <div className="space-y-12">
        {toolGroups.map(({ title, items }) => (
          <div key={title}>
            <h3 className="mb-6 inline-block border-b border-line pb-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted">{title}</h3>
            <ul data-tool-group className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {items.map((item) => (
                <li key={item} data-reveal className="flex min-h-36 min-w-0 flex-col items-center justify-center gap-5 rounded-lg border border-line bg-surface-elevated px-3 py-5 text-center text-secondary">
                  <span className="flex h-12 items-center justify-center text-accent [&_span]:size-11 [&_svg]:size-11">
                    <StackIcon name={item} />
                  </span>
                  <span className="max-w-full break-words text-sm leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="text-left">
          <h3 className="mb-6 inline-block border-b border-line pb-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted">Experience</h3>
          <ul data-experience  className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { role: "HTML/CSS Developer", period: "2020 – Present" },
              { role: "Creative Frontend Engineer", period: "2022 – Present" },                    
              { role: "Next.js Developer & UI/UX Specialist", period: "2024 – Present" },
              
            ].map(({ role, period }) => (
              <li key={role} data-reveal>
                <p className="text-sm font-semibold leading-6 text-secondary [overflow-wrap:anywhere]">{role}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">{period}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
