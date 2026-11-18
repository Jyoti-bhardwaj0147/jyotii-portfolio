"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useReducedMotion from "@/hooks/useReducedMotion";

const Globe = dynamic(() => import("./CollaborationGlobe"), { ssr: false });

class GlobeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="collaboration-fallback" /> : this.props.children; }
}

export default function GlobalCollaboration() {
  const card = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, hovered: false });
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = card.current;
    if (!element) return;
    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); preload.disconnect(); }
    }, { rootMargin: "200px" });
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    preload.observe(element);
    observer.observe(element);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => { preload.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useGSAP(() => {
    if (reduced) return;
    const tween = gsap.from(card.current, { opacity: 0, y: 20, duration: 0.65, ease: "power3.out", paused: true });
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { tween.play(); observer.disconnect(); }
    });
    if (card.current) observer.observe(card.current);
    return () => observer.disconnect();
  }, { scope: card, dependencies: [reduced], revertOnUpdate: true });

  return (
    <div ref={card} className="collaboration-card" aria-hidden="true"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || reduced) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointer.current = { x: (event.clientX - bounds.left) / bounds.width * 2 - 1, y: (event.clientY - bounds.top) / bounds.height * 2 - 1, hovered: true };
      }}
      onPointerLeave={() => { pointer.current = { x: 0, y: 0, hovered: false }; }}>
      {near && <GlobeBoundary><Globe reduced={reduced} active={visible && pageVisible} pointer={pointer} /></GlobeBoundary>}
    </div>
  );
}
