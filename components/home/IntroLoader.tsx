"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP);

const sessionStorageKey = "jyotii-intro-seen";
export const introLoaderCompleteEvent = "jyotii-intro-loader-complete";

export default function IntroLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const accentLayerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [fontReady, setFontReady] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {
      if (active) setFontReady(true);
    });
    return () => { active = false; };
  }, []);

  useGSAP(
    () => {
      if (!isVisible || reduceMotion || !counterRef.current || !copyRef.current) {
        return;
      }

      try {
        if (window.sessionStorage.getItem(sessionStorageKey)) {
          gsap.set(loaderRef.current, { autoAlpha: 0 });
          gsap.set(accentLayerRef.current, { autoAlpha: 0 });
          gsap.delayedCall(0, () => setIsVisible(false));
          return;
        }
      } catch {
        // Show the intro when session storage is unavailable.
      }

      if (!fontReady) return;

      const counter = counterRef.current;
      const progress = { value: 0 };
      counter.textContent = "0";
      gsap.set(counter.parentElement, { autoAlpha: 1 });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          try {
            window.sessionStorage.setItem(sessionStorageKey, "true");
          } catch {
          }
          window.dispatchEvent(new Event(introLoaderCompleteEvent));
          setIsVisible(false);
        },
      });

      timeline
        .to(progress, {
          value: 100,
          duration: 2.4,
          ease: "power1.inOut",
          onUpdate: () => {
            counter.textContent = String(Math.floor(progress.value));
          },
        })
        .fromTo(
          ".intro-loader__progress",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 2.4,
            ease: "power1.inOut",
          },
          "<",
        )
        .fromTo(
          copyRef.current,
          { opacity: 0, yPercent: 115 },
          { duration: 0.85, opacity: 1, yPercent: 0 },
          "<",
        )
        .to(
          loaderRef.current,
          {
            yPercent: -100,
            force3D: true,
            duration: 1.2,
            ease: "power2.inOut",
          },
          "+=0.3",
        )
        .to(
          accentLayerRef.current,
          {
            yPercent: -100,
            force3D: true,
            duration: 1.2,
            ease: "power2.inOut",
          },
          "<+=0.2",
        );
    },
    { dependencies: [isVisible, reduceMotion, fontReady], scope: loaderRef, revertOnUpdate: true },
  );

  if (!isVisible || reduceMotion) {
    return null;
  }

  return (
    <>
      <div ref={accentLayerRef} aria-hidden="true" className="fixed inset-0 z-[99] bg-accent will-change-transform" />
      <div
        ref={loaderRef}
        className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-[#101113] will-change-transform motion-reduce:hidden"
        style={{
          paddingTop: "max(clamp(1.25rem, 2.5vw, 2rem), env(safe-area-inset-top))",
          paddingRight: "max(clamp(1.25rem, 2.5vw, 2rem), env(safe-area-inset-right))",
          paddingBottom: "max(clamp(1.5rem, 2.5vw, 2rem), env(safe-area-inset-bottom))",
          paddingLeft: "max(clamp(1.25rem, 2.5vw, 2rem), env(safe-area-inset-left))",
        }}
        aria-hidden="true"
      >
        <p className="flex shrink-0 items-baseline self-end whitespace-nowrap text-[clamp(3.0rem,min(18vw,32dvh),12rem)] font-sans font-light leading-none tracking-[-0.065em] tabular-nums opacity-0">
          <span ref={counterRef} className="text-[#44494c]">0</span>
          <span className="text-accent">%</span>
        </p>
        <p className="mt-6 max-w-[28rem] text-sm leading-relaxed text-[#7d858c] sm:text-lg lg:text-xl pb-10 font-display">
          <span className="block overflow-hidden"><span ref={copyRef} className="block opacity-0">Design with purpose. Build with passion. Turn bold ideas into meaningful digital experiences.</span></span>
        </p>
        <div className="intro-loader__progress absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent" />
      </div>
    </>
  );
}
