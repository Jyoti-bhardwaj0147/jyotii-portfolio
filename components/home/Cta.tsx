"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import MagneticButton from "../ui/MagneticButton";
import { BackgroundBeams } from "../ui/background-beams";
import useReducedMotion from "@/hooks/useReducedMotion";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Cta() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
      () => {
        if (reduceMotion ) return;
  
        const media = gsap.matchMedia();
        media.add({ compact: "(max-width: 767px)", wide: "(min-width: 768px)" }, (context) => {
          const compact = context.conditions?.compact; 
         
  
          sectionRef.current?.querySelectorAll<HTMLElement>("[data-cta-reveal]").forEach((element) => {
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
    <section ref={sectionRef} id="cta" className="relative z-10 mb-20 mt-20 w-full px-5 sm:mb-24 sm:mt-0 sm:px-8 lg:px-10">
      <div data-cta-reveal className="relative isolate mx-auto w-full max-w-7xl overflow-hidden rounded-3xl bg-accent px-6 py-12 text-bg antialiased sm:px-10 sm:py-16 lg:px-16 lg:py-20 backdrop-blur-[5px]">
        <BackgroundBeams className="pointer-events-none z-0 opacity-85" />
        <div className="relative z-10">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] ">Have something in mind?</p>
          <h2 className="font-display text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.95] tracking-tight">Let&apos;s make it real.</h2>
          <MagneticButton
            type="button"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-background px-5 py-3 text-center text-sm font-bold text-foreground transition-shadow duration-300 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-background motion-reduce:transition-none sm:mt-10 sm:w-auto sm:px-7 sm:py-4"
            onClick={() => router.push("/contact")}
          >
            Contact me <span className="ml-2" aria-hidden="true">↗</span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
