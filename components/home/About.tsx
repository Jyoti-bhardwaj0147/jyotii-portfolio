"use client";

import { motion } from "framer-motion";
import { creativeTools, techStack } from "@/lib/data";
import useReducedMotion from "@/hooks/useReducedMotion";
import { StackIcon } from "./stackIcons";

const copyVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
};

export default function About() {
    const reduceMotion = useReducedMotion();

    return (
        <section id="about" className="py-20 sm:py-24">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-start lg:gap-8 lg:px-10">
                
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
                >
                    <motion.p variants={copyVariants} transition={{ duration: 0.55 }} className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                        About me
                    </motion.p>
                    <motion.h2 variants={copyVariants} transition={{ duration: 0.65 }} className="max-w-xl font-display text-4xl font-bold leading-[0.99] tracking-wider sm:text-6xl">
                        I&apos;m Jyotii, <br/><span className="font-playfair text-white">Next.js  Developer & Designer </span>
                    </motion.h2>
                    <motion.div variants={copyVariants} transition={{ duration: 0.55 }} className="mt-8 max-w-lg space-y-5 text-sm leading-7 text-secondary sm:text-sm sm:leading-6 mt-4 mb-4 tracking-wider">
                        <motion.p variants={copyVariants}>
                            I’m a <span className="font-playfair text-white">freelance Next.js developer and designer</span> creating distinctive digital experiences that bring together modern aesthetics, performance, and functionality. I help ambitious brands transform their ideas into engaging, high-quality websites.
                        </motion.p>
                        <motion.p variants={copyVariants}>
                           My approach blends creative design with thoughtful development. Using <span className="font-playfair text-white">Figma, Tailwind CSS, and GSAP</span>, I craft refined interfaces, fluid animations, and seamless interactions that make every digital experience feel intuitive and memorable.
                        </motion.p>
                        <motion.p variants={copyVariants}>
                           I build <span className="font-playfair text-white">custom websites, eCommerce platforms, and web apps</span> with React, Next.js, and Node.js, adding mobile solutions when needed. Each project is designed around your business goals to be scalable, easy to use, and built to last.
                        </motion.p>
                    </motion.div>
                </motion.div>
                

                <motion.div className="min-w-0 space-y-12 text-right">
                    {[
                        { title: "Tech I Work With", items: techStack, accent: false },
                        { title: "Creative Tools", items: creativeTools, accent: true },
                    ].map(({ title, items, accent }) => (
                        <div key={title}>
                            <h3 className="mb-6 inline-block border-b border-line pb-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted">{title}</h3>
                            <motion.div
                                initial={reduceMotion ? false : "hidden"}
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.25 }}
                                variants={{ hidden: {}, visible: { transition: { delayChildren: 0.08, staggerChildren: 0.045 } } }}
                                className="flex flex-wrap justify-end gap-2.5"
                            >
                                {items.map((item) => (
                                    <motion.span
                                        key={item}
                                        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                                        whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className={`inline-flex max-w-full items-center gap-2 rounded-full border bg-surface-elevated px-4 py-1 text-sm [overflow-wrap:anywhere] ${accent ? "border-accent-2/40 text-accent-2 hover:border-accent-hover hover:text-accent-hover hover:bg-surface-soft-accent" : "border-line text-secondary hover:border-accent-hover hover:text-accent-hover hover:bg-surface-soft-accent"}`}
                                    >
                                        <StackIcon name={item} />
                                        {item}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </div>
                    ))}
                    <div>
                        <h3 className="mb-6 inline-block border-b border-line pb-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted">Experience</h3>
                        <motion.ul
                            initial={reduceMotion ? false : "hidden"}
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.25 }}
                            variants={{ hidden: {}, visible: { transition: { delayChildren: 0.08, staggerChildren: 0.045 } } }}
                            className="space-y-5"
                        >
                            {[
                                { role: "Next.js Developer & UI/UX Specialist", period: "2024 – Present" },
                                { role: "Creative Frontend Engineer", period: "2022 – Present" },
                                { role: "HTML/CSS Developer", period: "2020 – Present" },
                            ].map(({ role, period }) => (
                                <motion.li
                                    key={role}
                                    variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                                    whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <p className="text-sm font-semibold leading-6 text-secondary [overflow-wrap:anywhere]">{role}</p>
                                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">{period}</p>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </div>
                </motion.div>
            </div>


        </section>

    );
}
