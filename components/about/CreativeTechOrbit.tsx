"use client";

import { useId, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CodeXml } from "lucide-react";
import { siNextdotjs, siReact, siTypescript, siTailwindcss, siFigma, siGsap, siNodedotjs, siPostgresql, type SimpleIcon } from "simple-icons";
import { motion, useReducedMotion } from "motion/react";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP);

interface OrbitTechnology {
  name: string;
  icon: SimpleIcon;
  color: string;
  angle: number;
  radiusX: number;
  radiusY: number;
}

// One revolution in seconds. Bounded phase variation keeps badges separated.
const ORBIT_SECONDS = 48;
const technologies: OrbitTechnology[] = [
  { name: "Next.js", icon: siNextdotjs, color: "#ffffff", angle: -80, radiusX: 185, radiusY: 120 },
  { name: "TypeScript", icon: siTypescript, color: "#3178c6", angle: -35, radiusX: 192, radiusY: 125 },
  { name: "Figma", icon: siFigma, color: "#a259ff", angle: 10, radiusX: 185, radiusY: 120 },
  { name: "PostgreSQL", icon: siPostgresql, color: "#83b7e0", angle: 55, radiusX: 192, radiusY: 125 },
  { name: "Node.js", icon: siNodedotjs, color: "#83cd29", angle: 100, radiusX: 185, radiusY: 120 },
  { name: "GSAP", icon: siGsap, color: "#be59ff", angle: 145, radiusX: 192, radiusY: 125 },
  { name: "Tailwind CSS", icon: siTailwindcss, color: "#38c8de", angle: 190, radiusX: 185, radiusY: 120 },
  { name: "React", icon: siReact, color: "#61dafb", angle: 235, radiusX: 192, radiusY: 125 },
];
const particles = [[17, 46], [32, 20], [62, 12], [80, 27], [87, 61], [63, 85], [30, 80], [44, 38], [70, 69], [21, 65]];

function orbitPoint(technology: OrbitTechnology, angle: number) {
  const tilt = -12 * Math.PI / 180;
  const x = technology.radiusX * Math.cos(angle);
  const y = technology.radiusY * Math.sin(angle);
  return { x: x * Math.cos(tilt) - y * Math.sin(tilt), y: x * Math.sin(tilt) + y * Math.cos(tilt) };
}

export default function CreativeTechOrbit() {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const id = useId();
  const reduce = useReducedMotion();

  useGSAP(() => {
    const card = root.current;
    const stage = scene.current;
    if (!card || !stage) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const nodes = Array.from(stage.querySelectorAll<HTMLElement>("[data-orbit-badge]"));
      const setters = nodes.map((node) => ({ x: gsap.quickSetter(node, "x", "px"), y: gsap.quickSetter(node, "y", "px") }));
      const floatY = gsap.quickSetter(stage.querySelector("[data-sphere-float]"), "y", "px");
      const cursorX = gsap.quickSetter(stage.querySelector("[data-sphere-cursor]"), "x", "px");
      const cursorY = gsap.quickSetter(stage.querySelector("[data-sphere-cursor]"), "y", "px");
      const bloom = gsap.quickSetter(stage.querySelector("[data-bloom]"), "opacity");
      const dots = Array.from(stage.querySelectorAll("[data-particle]")).map((dot) => ({ opacity: gsap.quickSetter(dot, "opacity"), y: gsap.quickSetter(dot, "y", "px") }));
      let scale = stage.clientWidth / 500;
      let visible = false;
      let entered = false;
      let hovered = false;
      let focused = false;
      let speed = 0;
      let orbitTime = 0;
      let ambientTime = 0;
      let px = 0;
      let py = 0;
      let targetX = 0;
      let targetY = 0;
      const entrance = gsap.timeline({ paused: true, defaults: { duration: 0.9, ease: "power3.out" } })
        .from(card.querySelectorAll("[data-orbit-copy]"), { opacity: 0, y: 14, stagger: 0.08 }, 0)
        .from(stage.querySelector("[data-sphere-entrance]"), { opacity: 0, scale: 0.85 }, 0.15)
        .from(stage.querySelector("[data-rings]"), { opacity: 0 }, 0.25)
        .from(nodes.map((node) => node.firstElementChild), { opacity: 0, scale: 0.8, stagger: 0.07 }, 0.35);

      const tick = (_time: number, delta: number) => {
        if (!visible || document.hidden) return;
        const dt = Math.min(delta / 1000, 0.05);
        const blend = 1 - Math.exp(-dt * 7);
        speed += ((hovered || focused ? 0 : 1) - speed) * blend;
        orbitTime += dt * speed;
        ambientTime += dt;
        technologies.forEach((technology, index) => {
          const startAngle = technology.angle * Math.PI / 180;
          const angle = startAngle + orbitTime * Math.PI * 2 / ORBIT_SECONDS
            + 0.045 * (Math.sin(orbitTime / 9 + index) - Math.sin(index));
          const start = orbitPoint(technology, startAngle);
          const point = orbitPoint(technology, angle);
          setters[index].x((point.x - start.x) * scale);
          setters[index].y((point.y - start.y) * scale);
        });
        floatY(Math.sin(ambientTime * Math.PI / 5) * 6 * scale);
        bloom(0.48 + Math.sin(ambientTime * Math.PI / 6) * 0.12);
        px += (targetX - px) * blend;
        py += (targetY - py) * blend;
        cursorX(px);
        cursorY(py);
        dots.forEach((dot, index) => {
          dot.opacity(0.3 + (Math.sin(ambientTime / 2.8 + index) + 1) * 0.25);
          dot.y(Math.sin(ambientTime / 4 + index) * 2);
        });
      };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !entered) { entered = true; entrance.play(); }
      }, { threshold: 0.12 });
      observer.observe(card);
      const resize = new ResizeObserver(() => { scale = stage.clientWidth / 500; });
      resize.observe(stage);
      const enter = (event: PointerEvent) => {
        if (event.pointerType !== "touch") hovered = event.target instanceof Element && Boolean(event.target.closest("[data-orbit-badge]"));
      };
      const exitBadge = (event: PointerEvent) => {
        hovered = event.relatedTarget instanceof Element && Boolean(event.relatedTarget.closest("[data-orbit-badge]"));
      };
      const leave = () => { hovered = false; targetX = 0; targetY = 0; };
      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        hovered = event.target instanceof Element && Boolean(event.target.closest("[data-orbit-badge]"));
        const rect = stage.getBoundingClientRect();
        targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
        targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
      };
      const focusIn = () => { focused = true; };
      const focusOut = (event: FocusEvent) => { focused = event.relatedTarget instanceof Node && stage.contains(event.relatedTarget); };
      stage.addEventListener("pointerover", enter);
      stage.addEventListener("pointerout", exitBadge);
      stage.addEventListener("pointerleave", leave);
      stage.addEventListener("pointermove", move);
      stage.addEventListener("focusin", focusIn);
      stage.addEventListener("focusout", focusOut);
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        observer.disconnect();
        resize.disconnect();
        stage.removeEventListener("pointerover", enter);
        stage.removeEventListener("pointerout", exitBadge);
        stage.removeEventListener("pointerleave", leave);
        stage.removeEventListener("pointermove", move);
        stage.removeEventListener("focusin", focusIn);
        stage.removeEventListener("focusout", focusOut);
        // quickSetter writes are not timeline-owned; clear them on preference changes.
        gsap.set(nodes, { clearProps: "transform" });
        gsap.set(stage.querySelectorAll("[data-sphere-float], [data-sphere-cursor], [data-particle], [data-bloom]"), { clearProps: "transform,opacity" });
      };
    });
    return () => media.revert();
  }, { scope: root });

  return (
    <motion.article ref={root} aria-labelledby={`${id}-heading`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} whileHover={reduce ? undefined : { y: -3 }} transition={{ duration: reduce ? 0 : 0.25 }} className={`creative-orbit-card flex min-h-72 min-w-0 flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface p-7 sm:col-span-2 sm:p-9 lg:row-span-2`}>
      <div className="creative-orbit-copy">
        <p id={`${id}-heading`} data-orbit-copy className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">My stack</p>
      </div>
      <div className="creative-orbit-visualSlot">
      <div ref={scene} className="creative-orbit-scene" aria-label="Creative technology orbit">
        <div aria-hidden="true" className="creative-orbit-atmosphere" />
        <svg data-rings aria-hidden="true" className="creative-orbit-rings" viewBox="0 0 500 360" fill="none">
          <defs><linearGradient id={`${id}-ring`} x1="50" y1="100" x2="450" y2="260" gradientUnits="userSpaceOnUse"><stop stopColor="#eab5ff" stopOpacity="0.55" /><stop offset="0.45" stopColor="#8244bc" stopOpacity="0.15" /><stop offset="1" stopColor="#c26cff" stopOpacity="0.65" /></linearGradient></defs>
          <g stroke={`url(#${id}-ring)`} strokeWidth="0.8">
            <ellipse cx="250" cy="180" rx="185" ry="120" transform="rotate(-12 250 180)" />
            <ellipse cx="250" cy="180" rx="205" ry="139" transform="rotate(-12 250 180)" opacity="0.4" />
            <ellipse cx="250" cy="180" rx="122" ry="38" transform="rotate(-10 250 180)" />
          </g>
        </svg>
        <div aria-hidden="true" className="creative-orbit-sphereAnchor">
          <div data-sphere-entrance><div data-sphere-cursor><div data-sphere-float className="creative-orbit-sphere">
            <div data-bloom className="creative-orbit-bloom" />
            <div className="creative-orbit-hoverBloom" />
            <CodeXml strokeWidth={1.8} className="creative-orbit-code" />
          </div></div></div>
        </div>
        <svg aria-hidden="true" className="creative-orbit-frontRing" viewBox="0 0 500 360" fill="none"><path d="M130 201 C151 226 341 216 370 159" stroke={`url(#${id}-ring)`} strokeWidth="0.85" /></svg>
        <div aria-hidden="true" className="creative-orbit-particles">{particles.map(([x, y], index) => <i key={index} data-particle style={{ left: `${x}%`, top: `${y}%`, width: index % 3 === 0 ? 3 : 2, height: index % 3 === 0 ? 3 : 2 }} />)}</div>
        <ul className="creative-orbit-badges" aria-label="Technologies I use">
          {technologies.map((technology) => {
            const point = orbitPoint(technology, technology.angle * Math.PI / 180);
            // Keep SSR coordinates within CSS serialization precision for hydration.
            return <li key={technology.name} data-orbit-badge className="creative-orbit-badgePosition" style={{ left: `${Number((50 + point.x / 5).toFixed(3))}%`, top: `${Number((50 + point.y / 3.6).toFixed(3))}%` }}>
              <span className="creative-orbit-badgeEntrance"><span tabIndex={0} aria-label={technology.name} className="creative-orbit-badge">
                {technology.name === "Figma" ? <svg aria-hidden="true" viewBox="0 0 24 36" className="creative-orbit-logo"><path d="M6 36a6 6 0 0 0 6-6v-6H6a6 6 0 0 0 0 12" fill="#0acf83" /><path d="M0 18a6 6 0 0 1 6-6h6v12H6a6 6 0 0 1-6-6" fill="#a259ff" /><path d="M0 6a6 6 0 0 1 6-6h6v12H6a6 6 0 0 1-6-6" fill="#f24e1e" /><path d="M12 0h6a6 6 0 0 1 0 12h-6" fill="#ff7262" /><circle cx="18" cy="18" r="6" fill="#1abcfe" /></svg> : <svg aria-hidden="true" viewBox="0 0 24 24" className="creative-orbit-logo" fill={technology.color}><path d={technology.icon.path} /></svg>}
                <span aria-hidden="true" className="creative-orbit-tooltip">{technology.name}</span>
              </span></span>
            </li>;
          })}
        </ul>
      </div>
      </div>
    </motion.article>
  );
}
