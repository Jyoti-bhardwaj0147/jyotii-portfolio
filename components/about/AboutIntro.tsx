"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useReducedMotion from "@/hooks/useReducedMotion";

gsap.registerPlugin(useGSAP);

export default function AboutIntro({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(() => {
    const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } })
      .set(sectionRef.current, { visibility: "visible" });

    if (!reduceMotion) timeline
      .from("aside, [data-about-tagline]", { duration: 0.4, opacity: 0, y: 18 })
      .from("[data-about-line]", { duration: 0.4, opacity: 0, yPercent: 115, stagger: 0.08 })
      .from("[data-about-description]", { duration: 0.2, opacity: 0, y: 18 });

    const start = () => timeline.play();
    window.addEventListener("jyotii-header-entrance-complete", start, { once: true });
    if (document.querySelector('header[data-entrance-complete="true"]')) start();

    return () => window.removeEventListener("jyotii-header-entrance-complete", start);
  }, { scope: sectionRef, dependencies: [reduceMotion], revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-labelledby="about-heading" style={{ visibility: "hidden" }} className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
      {children}
    </section>
  );
}
