"use client";

import { useEffect, useRef, type ReactNode } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";

const colors = ["#f5d76e", "#f7ca18", "#f4d03f", "#ececec", "#ecf0f1", "#a2ded0"];

// Wrap any sections in this component to add the background; unwrap to remove it.
export default function StarsBackground({ children }: { children: ReactNode }) {
  const starsRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const container = starsRef.current;
    if (!container) return;

    const stars = Array.from({ length: 5000 }, () => {
      const star = document.createElement("span");
      const size = Math.random() * 3;
      const color = colors[Math.floor(Math.random() * colors.length)];
      Object.assign(star.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "100%",
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        background: color,
        boxShadow: `0 0 ${Math.random() * 10}px ${color}`,
      });
      container.appendChild(star);
      return star;
    });

    const animations: Animation[] = [];
    const move = () => {
      animations.forEach((animation) => animation.cancel());
      animations.length = 0;
      stars.forEach((star) => {
        const from = { top: star.style.top, left: star.style.left };
        const to = { top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` };
        Object.assign(star.style, to);
        animations.push(star.animate([from, to], { duration: 200_000, easing: "linear" }));
      });
    };

    if (!reduceMotion) move();
    const interval = reduceMotion ? undefined : window.setInterval(move, 200_000);
    return () => {
      window.clearInterval(interval);
      animations.forEach((animation) => animation.cancel());
      container.replaceChildren();
    };
  }, [reduceMotion]);

  return (
    <div className="relative isolate">
      <div
        ref={starsRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black/75 opacity-50"
      />
      {children}
    </div>
  );
}
