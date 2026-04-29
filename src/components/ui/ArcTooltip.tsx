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

const springConfig = { stiffness: 100, damping: 15 };

export function ArcTooltip({ label, isHovered, x }: ArcTooltipProps) {
  const shouldReduceMotion = useReducedMotion();
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );

  return (
    <AnimatePresence>
      {isHovered && (
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
            translateX,
            rotate,
            whiteSpace: "nowrap",
          }}
          className="pointer-events-none absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-dark-bg-alt px-4 py-2 text-xs dm-elevation-2"
        >
          <div className="relative z-30 text-base font-bold text-text-primary">
            {label}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
