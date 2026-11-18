"use client";

import { motion, useMotionValue, useSpring, type MotionProps } from "framer-motion";
import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";
import { setCursorHover } from "../cursorEvents";

type MagneticButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> & {
  children: ReactNode;
  proximityRadius?: number;
};

export default function MagneticButton({
  children,
  className,
  proximityRadius = 96,
  ...buttonProps
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 18, stiffness: 220, mass: 0.35 });
  const springY = useSpring(y, { damping: 18, stiffness: 220, mass: 0.35 });

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !buttonRef.current) {
        return;
      }

      const bounds = buttonRef.current.getBoundingClientRect();
      const closestX = Math.max(bounds.left, Math.min(event.clientX, bounds.right));
      const closestY = Math.max(bounds.top, Math.min(event.clientY, bounds.bottom));
      const distanceX = event.clientX - closestX;
      const distanceY = event.clientY - closestY;
      const distance = Math.hypot(distanceX, distanceY);

      if (distance > proximityRadius) {
        x.set(0);
        y.set(0);
        return;
      }

      const pull = distance === 0 ? 1 : 1 - distance / proximityRadius;
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      x.set((event.clientX - centerX) * 0.18 * pull);
      y.set((event.clientY - centerY) * 0.18 * pull);
    };

    const resetPosition = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", resetPosition);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetPosition);
    };
  }, [proximityRadius, reduceMotion, x, y]);

  return (
    <motion.button
      ref={buttonRef}
      {...buttonProps}
      className={className}
      onPointerEnter={(event) => {
        buttonProps.onPointerEnter?.(event);
        if (!reduceMotion) {
          setCursorHover(true);
        }
      }}
      onPointerLeave={(event) => {
        buttonProps.onPointerLeave?.(event);
        if (!reduceMotion) {
          setCursorHover(false);
        }
      }}
      style={{ x: reduceMotion ? 0 : springX, y: reduceMotion ? 0 : springY }}
    >
      {children}
    </motion.button>
  );
}
