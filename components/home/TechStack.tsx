"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { creativeTools, techStack } from "@/lib/data";
import useReducedMotion from "@/hooks/useReducedMotion";
import { StackIcon } from "./stackIcons";

const groupVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.045,
    },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function Chip({ children, name, accent = false, reduceMotion }: { children: ReactNode; name: Parameters<typeof StackIcon>[0]["name"]; accent?: boolean; reduceMotion: boolean }) {
  return (
    <motion.span
      variants={chipVariants}
      whileHover={reduceMotion ? undefined : { scale: 1.04 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`inline-flex max-w-full items-center gap-2 rounded-full border bg-surface-elevated px-4 py-2 text-sm [overflow-wrap:anywhere] ${accent ? "border-accent-2/40 text-accent-2 hover:border-accent-hover hover:text-accent-hover hover:bg-surface-soft-accent" : "border-line text-secondary hover:border-accent-hover hover:text-accent-hover hover:bg-surface-soft-accent"}`}
    >
      <StackIcon name={name} />
      {children}
    </motion.span>
  );
}

export default function TechStack() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="stack" className="border-t border-line py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">The toolbox</p>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">Curious by default.</h2>
          </div>
          <div className="space-y-12">
            <div>
              <h3 className="mb-5 font-display text-xl font-bold">Tech I Work With</h3>
              <motion.div
                initial={reduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={groupVariants}
                className="flex flex-wrap gap-2.5"
              >
                {techStack.map((item) => <Chip key={item} name={item} reduceMotion={reduceMotion}>{item}</Chip>)}
              </motion.div>
            </div>
            <div>
              <h3 className="mb-5 font-display text-xl font-bold">Creative Tools</h3>
              <motion.div
                initial={reduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={groupVariants}
                className="flex flex-wrap gap-2.5"
              >
                {creativeTools.map((item) => <Chip key={item} name={item} accent reduceMotion={reduceMotion}>{item}</Chip>)}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
