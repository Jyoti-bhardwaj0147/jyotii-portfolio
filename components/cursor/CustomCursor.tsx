"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";
import { cursorHoverEvent, type CursorHoverDetail } from "../cursorEvents";

export default function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 28, stiffness: 420, mass: 0.35 });
  const springY = useSpring(cursorY, { damping: 28, stiffness: 420, mass: 0.35 });
  const [isInteractive, setIsInteractive] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | undefined>();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return;
      }

      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };
    const handleCursorHover = (event: Event) => {
      const customEvent = event as CustomEvent<CursorHoverDetail>;
      setIsInteractive(customEvent.detail.active);
      setCursorLabel(customEvent.detail.active ? customEvent.detail.label : undefined);
    };
    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return;
      }

      const target = event.target instanceof Element ? event.target.closest("a, button") : null;
      if (target) {
        setIsInteractive(true);
        setCursorLabel(undefined);
      }
    };
    const handlePointerOut = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return;
      }

      const target = event.target instanceof Element ? event.target.closest("a, button") : null;
      const relatedTarget = event.relatedTarget instanceof Element ? event.relatedTarget.closest("a, button") : null;
      if (target && !relatedTarget) {
        setIsInteractive(false);
        setCursorLabel(undefined);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener(cursorHoverEvent, handleCursorHover);
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener(cursorHoverEvent, handleCursorHover);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerout", handlePointerOut);
    };
  }, [cursorX, cursorY, reduceMotion]);

  if (reduceMotion) {
    return null;
  }

  const hoverScale = isInteractive ? (cursorLabel ? 3.5 : 1.8) : 1;

  return (
    <>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] flex size-3 items-center justify-center rounded-full mix-blend-difference -translate-x-1/2 -translate-y-1/2"
        style={{ x: springX, y: springY }}
      >
        <motion.span
          className="flex size-3 items-center justify-center rounded-full bg-white"
          animate={{ scale: hoverScale }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
          <AnimatePresence>
            {cursorLabel && (
              <motion.span
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18 }}
                className="absolute whitespace-nowrap rounded-full bg-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-background"
              >
                {cursorLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>
      </motion.span>
    </>
  );
}
