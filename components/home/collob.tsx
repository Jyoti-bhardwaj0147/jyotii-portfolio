"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, Code2, Compass, PenTool, Rocket } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";
import { techStack } from "@/lib/data";
import { StackIcon } from "./stackIcons";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

const steps = [
  { label: "Strategy", Icon: Compass },
  { label: "Design", Icon: PenTool },
  { label: "Build", Icon: Code2 },
  { label: "Test", Icon: CheckCircle2 },
  { label: "Launch", Icon: Rocket },
];

const stackRows = [techStack.slice(0, 10), techStack.slice(10)];
const cardMinHeight = "min-h-60";

export default function Collob() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);
  const stepLineRef = useRef<SVGPathElement>(null);
  const stepBeamRef = useRef<SVGGElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const list = stepsRef.current;
    if (!list) return;

    const updatePath = () => {
      // Layout offsets stay stable while the parent scroll reveal transforms it.
      const path = Array.from(list.children, (child, index) => {
        const item = child as HTMLElement;
        return `${index === 0 ? "M" : "L"} ${item.offsetLeft + item.offsetWidth / 2} ${item.offsetTop + item.offsetHeight / 2}`;
      }).join(" ");
      const line = stepLineRef.current;
      line?.setAttribute("d", path);
      const length = line?.getTotalLength() ?? 0;
      stepBeamRef.current?.querySelectorAll("path").forEach((segment, index) => {
        segment.setAttribute("d", path);
        const start = 8 + (15 - index) * 5;
        segment.style.strokeDasharray = `8 ${length + 100}`;
        segment.style.setProperty("--beam-start", `${start}px`);
        segment.style.setProperty("--beam-end", `${start - length - 100}px`);
      });
    };

    updatePath();
    const observer = new ResizeObserver(updatePath);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (reduceMotion) return;

      const media = gsap.matchMedia();
      media.add({ compact: "(max-width: 767px)", wide: "(min-width: 768px)" }, (context) => {
        const compact = context.conditions?.compact;

        sectionRef.current?.querySelectorAll<HTMLElement>("[data-collob-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, 
              y: compact ? 24 : 50, 
              scale: compact ? 0.98 : 0.90 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top 90%",
                end: "top 55%",
                scrub: 0.8,
              },
            },
          );
        });
      });

      return () => media.revert();
    },
    { dependencies: [reduceMotion], scope: sectionRef, revertOnUpdate: true },
  );

  return (
    <section ref={sectionRef} id="collaboration" aria-labelledby="collaboration-heading" className="relative z-10 min-h-svh bg-background py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-10">
        <article data-collob-reveal tabIndex={0} className={`collob-card relative isolate flex ${cardMinHeight} min-w-0 flex-col justify-end overflow-hidden rounded-3xl border border-line bg-surface p-7 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-9`}>
          <div className="collob-copy mt-12">
            <h2 id="collaboration-heading" className="mt-2 font-display text-xl font-bold leading-tight tracking-tight ">Direct collaboration.</h2>
            <p className="mt-2 max-w-md text-[0.78125rem] leading-tight break-words text-white/90 ">
              Work directly with me from the first idea to the final launch, with clear updates and decisions made together at every stage.
            </p>
          </div>
        </article>        

        <article data-collob-reveal tabIndex={0} className={`flex ${cardMinHeight} min-w-0 flex-col justify-end overflow-hidden rounded-3xl border border-line bg-surface p-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-9`}>
          <div className="collob-stack space-y-2" aria-label="Frontend technologies">
            {stackRows.map((row, rowIndex) => (
              <div key={rowIndex} className="collob-stack-viewport">
                <div className={`collob-stack-track ${rowIndex === 0 ? "collob-stack-track-forward" : "collob-stack-track-backward"}`}>
                  {[0, 1].map((copyIndex) => (
                    <div key={copyIndex} className="collob-stack-group" aria-hidden={copyIndex === 1}>
                      {row.map((item) => (
                        <div key={item} className="collob-stack-tile">
                          <span className="collob-stack-icon"><StackIcon name={item} brandColors /></span>
                          <span className="collob-stack-name">{item}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

         <div className="collob-copy mt-4">
          <h3 className="mt-4 font-display text-xl font-bold leading-tight text-foreground ">Tech Stack</h3>
          <p className="mt-2 max-w-md text-[0.78125rem] leading-tight break-words text-white/90 ">
              Work directly with me from the first idea to the final launch, with clear updates and decisions made together at every stage.
            </p>
          </div>
          
        </article>

        <article data-collob-reveal className="min-w-0 rounded-3xl border border-line bg-surface-elevated p-7 sm:p-9  lg:col-span-2">
          
          <div className="relative mt-3">
            <svg aria-hidden="true" className="collob-step-line pointer-events-none absolute inset-0 h-full w-full">
              <path ref={stepLineRef} className="collob-step-track" />
              <g ref={stepBeamRef} className="collob-step-beam">
                {Array.from({ length: 16 }, (_, index) => (
                  <path
                    key={index}
                    className="collob-step-beam-segment"
                    style={{
                      strokeWidth: 0.35 + (index / 15) * 1.15,
                      opacity: 0.12 + ((index + 1) / 16) ** 2 * 0.88,
                    } as CSSProperties}
                  />
                ))}
              </g>
            </svg>
          <ol ref={stepsRef} className="relative z-10 grid grid-cols-5 gap-1.5 sm:gap-3">
            {steps.map(({ label, Icon }, index) => (
              <li key={label} className="flex m-auto items-center justified-center gap-3 rounded-2xl border border-line bg-surface p-2 sm:p-3 xl:flex-col xl:items-center xl:justify-center xl:gap-2 xl:p-4">
                <Icon aria-hidden="true" className="size-4 shrink-0 text-accent sm:size-5" />
                {/* <span className="min-w-0 text-sm font-semibold text-foreground">{label}</span>
                <span className="ml-auto text-xs font-semibold tabular-nums text-muted xl:ml-0">0{index + 1}</span> */}
              </li>
            ))}
          </ol>
          </div>

          <div className="collob-copy mt-4">
          <h3 className="mt-4 font-display text-xl font-bold leading-tight text-foreground ">From idea to launch.</h3>
          <p className="mt-2 max-w-md text-[0.78125rem] leading-tight break-words text-white/90 ">
              Work directly with me from the first idea to the final launch, with clear updates and decisions made together at every stage.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
