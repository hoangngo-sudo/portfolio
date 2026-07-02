"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useSmoothCorners } from "@lisse/react";
import { PRESS_SPRING } from "@/lib/motion-tokens";

interface ShowMoreButtonProps {
  expanded: boolean;
  onClick: () => void;
}

export function ShowMoreButton({ expanded, onClick }: ShowMoreButtonProps) {
  const reduced = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement>(null);
  useSmoothCorners(btnRef, { radius: 20, smoothing: 0.6 }, { autoEffects: false });

  return (
    <div className="flex justify-center pt-6">
      <motion.button
        ref={btnRef}
        type="button"
        onClick={onClick}
        aria-expanded={expanded}
        aria-controls="courses-grid"
        whileTap={reduced ? undefined : { scale: 0.97 }}
        transition={reduced ? { duration: 0 } : PRESS_SPRING}
        className="inline-flex items-center bg-dark-bg-alt px-4 py-2 text-sm font-medium text-text-primary dm-elevation-2 cursor-pointer focus-ring select-none"
        style={{
          transition: "var(--hover-transition)",
        }}
      >
        {expanded ? "Show less" : "Show all courses"}
      </motion.button>
    </div>
  );
}
