"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function currentExperience() {
  const today = new Date();
  const monthsSinceStart = (today.getFullYear() - 2020) * 12 + today.getMonth() - 2 - Number(today.getDate() < 8);
  return Math.max(0, Math.floor(monthsSinceStart / 6)) * 0.5;
}

export default function Client() {
  const pinRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [experience, setExperience] = useState(6.5);

  useEffect(() => {
    const updateExperience = () => setExperience(currentExperience());
    updateExperience();
    const interval = window.setInterval(updateExperience, 60 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      if (reduceMotion) return;

      const pin = pinRef.current;
      const collaboration = pin?.parentElement?.querySelector<HTMLElement>("#collaboration");
      if (!pin || !collaboration) return;

      // Keep the wrapper in normal flow so entering/leaving the pin cannot jump.
      // The isolated parent holds it behind collaboration until that section covers it.
      gsap.set(pin, { position: "sticky", top: 0 });
      const updateStickyTop = () => {
        pin.style.top = `${Math.min(0, document.documentElement.clientHeight - pin.offsetHeight)}px`;
      };
      updateStickyTop();
      const sizeObserver = new ResizeObserver(updateStickyTop);
      sizeObserver.observe(pin);
      ScrollTrigger.addEventListener("refreshInit", updateStickyTop);

      const media = gsap.matchMedia();
      media.add({ compact: "(max-width: 767px)", wide: "(min-width: 768px)" }, (context) => {
        const compact = context.conditions?.compact;
        gsap.fromTo(
          sectionRef.current,
          { scale: 1, rotation: 0, borderRadius: 0 },
          {
            scale: compact ? 0.98 : 0.80,
            rotation: compact ? 1 : 1,
            borderRadius: compact ? 1 : 8,
            ease: "none",
            scrollTrigger: {
              trigger: collaboration,
              start: "top bottom",
              end: "top top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      sectionRef.current?.querySelectorAll<HTMLElement>("[data-client-reveal]").forEach((element, index) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            delay: index === 1 ? 0.12 : 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              once: true,
            },
          },
        );
      });

      return () => {
        sizeObserver.disconnect();
        ScrollTrigger.removeEventListener("refreshInit", updateStickyTop);
        media.revert();
      };
    },
    { dependencies: [reduceMotion], scope: sectionRef, revertOnUpdate: true },
  );

  return (
    <div ref={pinRef} className="relative -z-10">
    <section ref={sectionRef} id="clients" aria-labelledby="clients-heading" className="relative bg-accent  text-background min-h-svh py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <article data-client-reveal className="flex h-full min-h-72 min-w-0 flex-col justify-between rounded-3xl p-7 text-foreground sm:p-9 text-bg">
                  
              <h2 id="clients-heading" className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">What clients will get.</h2>
            
            <p className="mt-8 max-w-2xl text-sm leading-7 text-bg sm:text-base">
              Thoughtful strategy, distinctive design, and fast, accessible development shaped around your goals. You get clear communication, responsive layouts, strong SEO foundations, polished interactions, and a website built to grow with your business for years ahead.
            </p>
          </article>

          <article data-client-reveal className="flex min-h-72 min-w-0 items-end rounded-3xl bg-background p-7 text-foreground sm:p-9">
            <p className="font-display text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
              Driven by design, powered by code, and refined through interaction, I create websites that leave a lasting impression.
            </p>
          </article>

          <aside data-client-reveal aria-label="Portfolio at a glance" className="min-w-0 rounded-3xl bg-background/0 p-7 text-foreground sm:p-9 lg:col-span-2 text-center">
            <h3 className="font-display text-2xl text-bg font-bold tracking-tight sm:text-3xl">Building trust worldwide.</h3>
            <dl className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col">
                <dt className="mt-1 text-xs font-semibold uppercase tracking-wider text-bg">Years experience</dt>
                <dd className="order-first font-display text-4xl font-bold tabular-nums text-bg">{experience}+</dd>
              </div>
              <div className="flex flex-col">
                <dt className="mt-1 text-xs font-semibold uppercase tracking-wider text-bg">Projects shipped</dt>
                <dd className="order-first font-display text-4xl font-bold tabular-nums text-bg">40+</dd>
              </div>
              <div className="flex flex-col">
                <dt className="mt-1 text-xs font-semibold uppercase tracking-wider text-bg">Tools in the stack</dt>
                <dd className="order-first font-display text-4xl font-bold tabular-nums text-bg">20+</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
    </div>
  );
}
