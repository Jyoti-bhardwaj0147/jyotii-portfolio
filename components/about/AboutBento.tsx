"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";

import { ArrowUpRight } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
import CreativeTechOrbit from "./CreativeTechOrbit";
import { ClockCard, WeatherCard, GithubCardLink } from "@/components/about/BentoLive";
import LocalGreetingCard from "@/components/about/LocalGreetingCard";
import TimeOverlapCard from "@/components/about/TimeOverlapCard";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

type AboutBentoProps = {
  contributionYear: number;
  contributionTotal: number | null;
};

export default function AboutBento({ contributionYear, contributionTotal }: AboutBentoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(() => {
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
  }, { dependencies: [reduceMotion], scope: sectionRef, revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-labelledby="bento-heading" className="mt-24 sm:mt-32">
      <div className="mb-8 sm:mb-10">
        <h2 ref={headingRef} id="bento-heading" className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
          The tools, the time, the little details.
        </h2>
      </div>
      <div className="about-bento grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div data-project-reveal className="grid min-w-0 sm:col-span-2 lg:row-span-2">
          <CreativeTechOrbit />
        </div>
        <div data-project-reveal className="grid min-w-0">
          <ClockCard />
        </div>
        <div data-project-reveal className="grid min-w-0">
          <WeatherCard />
        </div>
        <div data-project-reveal className="grid min-w-0 sm:col-span-2">
          <GithubCardLink>
            <div className="flex items-start justify-between">
              <IconBrandGithub aria-hidden="true" className="size-8 text-accent" />
              <ArrowUpRight aria-hidden="true" className="size-5 text-secondary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
            <div>
              <h3 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">Find me on GitHub</h3>
              <div className="mt-5 border-t border-line pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Recent contributions</p>
                <p className="mt-1 font-display text-4xl font-bold tabular-nums text-foreground">
                  {contributionTotal === null ? "--" : contributionTotal.toLocaleString("en-US")}
                </p>
                <p className="mt-1 text-sm text-secondary">
                  {contributionTotal === null ? "Count unavailable right now" : `Total in ${contributionYear}`}
                </p>
              </div>
            </div>
          </GithubCardLink>
        </div>
        <div data-project-reveal className="grid min-w-0 sm:col-span-2">
          <LocalGreetingCard />
        </div>
        <div data-project-reveal className="grid min-w-0 sm:col-span-2">
          <TimeOverlapCard />
        </div>
      </div>
    </section>
  );
}
