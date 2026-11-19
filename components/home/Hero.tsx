"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { contact } from "@/lib/data";
import MagneticButton from "../ui/MagneticButton";
import useReducedMotion from "@/hooks/useReducedMotion";
import { CometCard } from "@/components/ui/comet-card";
import { introLoaderCompleteEvent } from "./IntroLoader";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP);

const headline = ["Hey", "I'm Jyotii"];

function currentExperience() {
  const today = new Date();
  const monthsSinceStart = (today.getFullYear() - 2020) * 12 + today.getMonth() - 2 - Number(today.getDate() < 8);
  return Math.max(0, Math.floor(monthsSinceStart / 6)) * 0.5;
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [experience, setExperience] = useState(6.5);
  const [isCardHovered, setIsCardHovered] = useState(false);

  useEffect(() => {
    const updateExperience = () => setExperience(currentExperience());
    updateExperience();
    const interval = window.setInterval(updateExperience, 60 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      if (reduceMotion) {
        return;
      }

      const cometCards = heroRef.current?.querySelectorAll<HTMLElement>(".comet-card");

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      timeline
        .from(".hero-line", {
          duration: 0.85,
          opacity: 0,
          yPercent: 115,
          stagger: 0.12,
        })
        .from(
          ".hero-tagline",
          { duration: 0.65, opacity: 0, y: 18 },
          "-=0.35",
        );



      if (cometCards?.length) {
        timeline.from(
          cometCards,
          { duration: 0.65, opacity: 0, y: 18 },
          0,
        );
      }



      const glow = gsap.to(".hero-glow", {
        paused: true,
        duration: 7,
        x: 36,
        y: 20,
        scale: 1.08,
        opacity: 0.75,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const startHero = () => {
        timeline.play();
        glow.play();
      };

      window.addEventListener(introLoaderCompleteEvent, startHero, { once: true });

      try {
        if (window.sessionStorage.getItem("jyotii-intro-seen")) {
          startHero();
        }
      } catch {
        // Wait for the loader's completion event when storage is unavailable.
      }

      return () => window.removeEventListener(introLoaderCompleteEvent, startHero);
    },
    { dependencies: [reduceMotion], scope: heroRef, revertOnUpdate: true },
  );

  return (
    <>


      <section ref={heroRef} id="top" className="relative flex min-h-screen items-center overflow-hidden pt-24 sm:pt-28">
        <div className="grid-paper pointer-events-none absolute inset-0 opacity-60" />
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{ opacity: isCardHovered ? 0.65 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0"
        >
          <div className="hero-glow absolute -right-32 top-24 size-96 rounded-full bg-surface-soft-accent blur-3xl -z-10 opacity-60" />
          <div className="hero-glow absolute top-54 left-0 size-[min(80vw,24rem)] rounded-full bg-surface-soft-accent blur-3xl lg:bottom-12 lg:left-[42%] -z-10 opacity-60" />
          <div className="hero-glow absolute top-0 left-0 size-[min(80vw,24rem)] rounded-full bg-surface-soft-accent blur-3xl lg:bottom-12 lg:left-[0%] -z-10 opacity-100" />
        </motion.div>
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,26.5rem)] lg:items-center lg:gap-16 xl:gap-26">
          <div>
            <p className="hero-tagline mb-7 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent"><span className="dot" />Freelance Next.js developer</p>
            <h1 className="font-display text-[clamp(3.25rem,10vw,9.5rem)] font-bold leading-[0.88] tracking-[-0.06em] text-foreground">{headline.map((line, index) => <span key={line} className="block overflow-hidden pb-1"><span className="hero-line block">{line}{index === 2 && <span className="text-accent">.</span>}</span></span>)}</h1>
            <div className="hero-tagline mt-7 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between md:gap-8">
              <div className="max-w-xl">
                <p className="text-base leading-7 text-secondary sm:text-lg sm:leading-8 font-bold tracking-wider">
                  I&apos;m Jyotii, a <span className="font-playfair text-white">freelance Next.js developer</span> with {experience}+ years crafting interfaces that feel as good as they perform, from first pixel to final deploy.<br />
                </p>
                <p className="text-sm leading-7 text-secondary sm:text-sm sm:leading-6 mt-4 mb-4 tracking-wider">
                  I turn bold ideas into high-performance digital experiences. </p>
                <p className="text-sm leading-7 text-secondary sm:text-sm sm:leading-6 tracking-wider">
                  From startups to eCommerce brands and creative teams worldwide, I build fast, scalable custom <span className="font-playfair text-white">Next.js websites</span> with sharp design, <span className="font-playfair text-white">strong SEO</span>, and seamless interactions—crafted from the ground up to grow with your vision.

                </p>
              </div>
            </div>
          </div>
          <motion.div
            onHoverStart={() => setIsCardHovered(true)}
            onHoverEnd={() => setIsCardHovered(false)}
            className="comet-card w-full max-w-[26.5rem] justify-self-center lg:justify-self-end"
          >
            <CometCard>
              <button
                type="button"
                className="flex w-full cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-surface-elevated px-2 pt-2 saturate-0 hover:saturate-100 md:px-4 md:pt-4"
                aria-label="Portfolio of Jyotii Bhardwaj, freelance Next.js developer"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "none",
                  opacity: 1,
                }}
              >
                <div className="mx-2 flex-1">
                  <div className="relative mt-2 aspect-[4/5] w-full rounded-[16px] bg-surface-elevated">
                    <img
                      loading="lazy"
                      className="absolute inset-0 h-full w-full rounded-[16px] object-cover contrast-75"
                      alt="Portfolio of Jyotii Bhardwaj, freelance Next.js developer"
                      src="/images/jyotii-bhardwaj.png"
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                        opacity: 1,
                      }}
                    />


                  </div>
                </div>

              </button>
            </CometCard>
          </motion.div>
          
        </div>
      </section >
    </>
  );
}
