"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";

interface ArcTooltipProps {
  label: string;
  isHovered: boolean;
  /** MotionValue of mouse X offset from center of the photo (px) */
  x: MotionValue<number>;
}

const springConfig = { stiffness: 70, damping: 12 };

export function ArcTooltip({ label, isHovered, x }: ArcTooltipProps) {
  const shouldReduceMotion = useReducedMotion();
  const rotate = useSpring(
    useTransform(x, [0, 200], [-35, 35]),
    springConfig,
  );
  const translateX = useSpring(
    useTransform(x, [0, 200], [-40, 40]),
    springConfig,
  );

  return (
    <AnimatePresence>
      {isHovered && (
        <>
          {/* Flexbox wrapper handles pure centering (no transform
              conflict with Motion's x/rotate below) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-16 z-50 flex justify-center"
          >
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.93 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                },
              }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.93 }}
              style={{
                x: translateX,
                rotate,
                whiteSpace: "nowrap",
                willChange: "transform",
              }}
            >
          <div
            className="flex flex-col items-center"
            style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.25))" }}
          >
            <div className="rounded-md bg-dark-bg-alt px-4 py-2 text-xs">
              <div className="text-base font-bold text-text-primary">
                {label}
              </div>
            </div>
            {/* Triangle tip */}
            <div className="-mt-px h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-dark-bg-alt" />
          </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
