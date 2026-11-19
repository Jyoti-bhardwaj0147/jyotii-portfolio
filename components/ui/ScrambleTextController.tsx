"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

if (typeof window !== "undefined") gsap.registerPlugin(ScrambleTextPlugin, useGSAP);

export default function ScrambleTextController() {
  useGSAP((_, contextSafe) => {
    const scramble = (element: HTMLElement) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const text = element.dataset.scrambleText ?? element.textContent?.trim();
      if (!text) return;

      element.dataset.scrambleText = text;
      gsap.killTweensOf(element);

      const runScramble = () =>
        gsap.to(element, {
          duration: 0.8,
          ease: "power1.out",
          scrambleText: {
            text,
            chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            speed: 1,
            revealDelay: 0.1,
            delimiter: " ",
            tweenLength: false,
          },
        });
      (contextSafe?.(runScramble) ?? runScramble)();
    };

    const getScrambleElement = (target: EventTarget | null) =>
      target instanceof Element
        ? target.closest<HTMLElement>(".scramble-text")
        : null;

    const handlePointerOver = (event: PointerEvent) => {
      const element = getScrambleElement(event.target);
      if (
        !element ||
        (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))
      ) {
        return;
      }

      scramble(element);
    };

    const handleFocusIn = (event: FocusEvent) => {
      const element = getScrambleElement(event.target);
      if (
        !element ||
        (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))
      ) {
        return;
      }

      scramble(element);
    };

    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("focusin", handleFocusIn);
      document.querySelectorAll<HTMLElement>(".scramble-text").forEach((element) => {
        gsap.killTweensOf(element);
      });
    };
  });

  return null;
}
