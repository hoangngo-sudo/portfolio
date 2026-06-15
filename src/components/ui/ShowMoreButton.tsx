"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useSmoothCorners } from "@lisse/react";

const PRESS_SPRING = { type: "spring" as const, stiffness: 600, damping: 20 };

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
        className="inline-flex items-center bg-dark-bg-alt px-6 py-2.5 text-sm font-medium text-text-primary dm-elevation-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg focus-visible:outline-none select-none"
        style={{
          transition: "background-color 150ms ease",
        }}
      >
        {expanded ? "Show less" : "Show all courses"}
      </motion.button>
    </div>
  );
}
