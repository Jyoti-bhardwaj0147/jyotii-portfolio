"use client";

import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";
import { introLoaderCompleteEvent } from "../home/IntroLoader";

gsap.registerPlugin(useGSAP, SplitText);

export default function Header() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLabelRef = useRef<HTMLSpanElement>(null);
  const previousMenuOpenRef = useRef(isMenuOpen);
  const navigationRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuTimeline = useRef<gsap.core.Timeline | null>(null);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  useGSAP(() => {
    const labelChanged = previousMenuOpenRef.current !== isMenuOpen;
    previousMenuOpenRef.current = isMenuOpen;
    if (reduceMotion || !menuLabelRef.current) return;
    const split = SplitText.create(menuLabelRef.current, { type: "chars", tag: "span" });
    gsap.set(split.chars, { display: "inline-block" });
    if (labelChanged) gsap.fromTo(split.chars,
      { yPercent: 85, rotationX: -85, autoAlpha: 0 },
      {
        yPercent: 0,
        rotationX: 0,
        autoAlpha: 1,
        transformOrigin: "center bottom",
        duration: 0.48,
        stagger: 0.045,
        ease: "power3.out",
        overwrite: true,
      },
    );
    return () => {
      gsap.killTweensOf(split.chars);
      split.revert();
    };
  }, { scope: menuRef, dependencies: [isMenuOpen, reduceMotion], revertOnUpdate: true });

  useGSAP(() => {
    const navigation = navigationRef.current;
    if (!navigation) return;

    if (reduceMotion) {
      gsap.set(navigation, { autoAlpha: isMenuOpen ? 1 : 0, clipPath: "inset(0 0 0 0 round 1rem)" });
      gsap.set(navigation.querySelectorAll("a"), { clearProps: "all" });
      menuTimeline.current = null;
      return;
    }

    const links = navigation.querySelectorAll("a");
    gsap.set(navigation, { autoAlpha: 0, clipPath: "inset(0 0 100% 0 round 1rem)" });
    gsap.set(links, { y: 12, autoAlpha: 0 });
    menuTimeline.current = gsap.timeline({ paused: true })
      .to(navigation, { autoAlpha: 1, duration: 0.01 }, 0)
      .fromTo(navigation, {
        clipPath: "inset(0 0 100% 0 round 1rem)",
      }, {
        clipPath: "inset(0 0 0% 0 round 1rem)",
        duration: 0.5,
        ease: "sine.inOut",
      }, 0)
      .to(links, {
        y: 0,
        autoAlpha: 1,
        duration: 0.42,
        stagger: 0.18,
        ease: "sine.inOut",
      }, 0.40);

    if (isMenuOpen) menuTimeline.current.progress(1);
    return () => {
      menuTimeline.current = null;
    };
  }, { scope: menuRef, dependencies: [reduceMotion], revertOnUpdate: true });

  useEffect(() => {
    if (reduceMotion) {
      if (navigationRef.current) gsap.set(navigationRef.current, { autoAlpha: isMenuOpen ? 1 : 0 });
      return;
    }
    if (isMenuOpen) menuTimeline.current?.play();
    else menuTimeline.current?.reverse();
  }, [isMenuOpen, reduceMotion]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    let enterTimeout: number | undefined;

    if (reduceMotion || pathname !== "/") {
      enterTimeout = window.setTimeout(() => setHasEntered(true), 0);
      return () => window.clearTimeout(enterTimeout);
    }

    let hasSeenIntro = false;

    try {
      hasSeenIntro = window.sessionStorage.getItem("jyotii-intro-seen") === "true";
    } catch {
      hasSeenIntro = false;
    }

    if (hasSeenIntro) {
      enterTimeout = window.setTimeout(() => setHasEntered(true), 0);
      return () => window.clearTimeout(enterTimeout);
    }

    const handleIntroComplete = () => setHasEntered(true);
    window.addEventListener(introLoaderCompleteEvent, handleIntroComplete);

    return () => {
      window.removeEventListener(introLoaderCompleteEvent, handleIntroComplete);
      if (enterTimeout !== undefined) {
        window.clearTimeout(enterTimeout);
      }
    };
  }, [reduceMotion, pathname]);

  return (
    <motion.header
      ref={headerRef}
      initial={{ opacity: 0, y: -24 }}
      animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (!hasEntered || !headerRef.current) return;
        headerRef.current.dataset.entranceComplete = "true";
        window.dispatchEvent(new Event("jyotii-header-entrance-complete"));
      }}
      className="fixed inset-x-0 top-0 z-50 border-0 bg-background/0  transition-colors"
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="group flex items-center gap-3 font-display font-bold tracking-tight text-foreground backdrop-blur-[5px] rounded-full p-2 focus-visible:outline-0 focus-visible:outline-offset-0 focus-visible:outline-accent" aria-label="Jyotii home">
          <Image
            src="/images/logo/jyotii-nextjs-developer.png"
            alt="Jyotii Next.js developer logo"
            width={40}
            height={40}
            priority
            className="size-10 object-contain transition-transform group-hover:rotate-6"
          />
        </Link>
        <div className="flex items-center gap-3">
          
          <div ref={menuRef} className="relative drop-shadow-[0_12px_20px_rgba(0,0,0,0.3)]">
            <button
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="main-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex min-h-9 bg-accent items-center gap-2 rounded-full border-0 px-4 text-lg font-semibold text-bg shadow-[0_4px_12px_rgba(0,0,0,0.22),0_12px_28px_rgba(0,0,0,0.14)] transition-colors hover:border-0  focus-visible:outline-0 "
            >
              <span key={isMenuOpen ? "close" : "menu"} ref={menuLabelRef} className="whitespace-nowrap">{isMenuOpen ? "Close" : "Menu"}</span>
            </button>
            <nav
                  ref={navigationRef}
                  id="main-navigation"
                  aria-label="Main navigation"
                  aria-hidden={!isMenuOpen}
                  inert={!isMenuOpen}
                  className="invisible absolute right-0 top-full mt-3 w-[min(20rem,calc(100vw-2.5rem))] origin-top-right rounded-2xl  bg-accent p-2"
                >
                  {[
                    { label: "Home", href: "/" },
                    { label: "About", href: "/about" },
                    { label: "Projects", href: "/projects" },
                    { label: "Contact", href: "/contact" },
                  ].map(({ label, href }) => (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-lg px-2 py-2 text-sm no-underline uppercase text-black text-3xl sm:text-3xl md:text-4xl font-semibold text-bg transition-colors  hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      <span className="letter-flip">{label}</span>
                    </a>
                  ))}
            </nav>
          </div>
        </div>
      </div>
      
    </motion.header>
    
  );
}
