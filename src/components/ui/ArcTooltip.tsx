"use client";

import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";

interface ArcTooltipProps {
  label: string;
  isHovered: boolean;
  /** MotionValue of mouse X offset from center of the photo (px) */
  x: MotionValue<number>;
}

const springConfig = { stiffness: 100, damping: 15 };

export function ArcTooltip({ label, isHovered, x }: ArcTooltipProps) {
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
          initial={{ opacity: 0, y: 20, scale: 0.6 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 260,
              damping: 10,
            },
          }}
          exit={{ opacity: 0, y: 20, scale: 0.6 }}
          style={{
            translateX,
            rotate,
            whiteSpace: "nowrap",
          }}
          className="pointer-events-none absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
        >
          <div className="relative z-30 text-base font-bold text-white">
            {label}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
