"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { detectVisitor, getVisitorBackground } from "@/lib/visitor";

export default function ToolCard({ children, label, locationBackground = false }: { children: ReactNode; label: string; locationBackground?: boolean }) {
  const reduce = useReducedMotion();
  const [background, setBackground] = useState<string>();
  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    if (!locationBackground) return;
    const timer = window.setTimeout(() => {
      try {
        setBackground(getVisitorBackground(detectVisitor(navigator.language, Intl.DateTimeFormat().resolvedOptions().timeZone)));
      } catch { /* Keep the existing surface when visitor detection is unavailable. */ }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [locationBackground]);
  return (
    <motion.article aria-label={label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} whileHover={reduce ? undefined : { y: -3 }} transition={{ duration: reduce ? 0 : 0.25 }} className="relative isolate min-w-0 overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:col-span-2 sm:p-8">
      {locationBackground && background && <Image src={background} alt="" aria-hidden="true" fill sizes="(min-width: 1024px) 600px, (min-width: 640px) 90vw, 100vw" onLoad={() => setImageLoaded(true)} className={`pointer-events-none -z-20 object-cover object-center transition-opacity duration-700 motion-reduce:transition-none ${imageLoaded ? "opacity-100" : "opacity-0"}`} />}
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 ${locationBackground ? "bg-[linear-gradient(155deg,var(--surface)_15%,rgba(8,7,12,0.75)_50%,rgba(8,7,12,0.5)),radial-gradient(ellipse_at_top_right,var(--accent),transparent_75%)]" : "bg-[radial-gradient(ellipse_at_top_right,var(--surface-soft-accent),transparent_65%)]"}`} />
      {children}
    </motion.article>
  );
}
