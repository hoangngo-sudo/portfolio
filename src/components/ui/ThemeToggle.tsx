"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useWebHaptics } from "web-haptics/react";

const THEMES = [
  { id: "black" as const, color: "#7c8594", glow: "rgba(124,133,148,0.6)", label: "Black theme" },
  { id: "teal"  as const, color: "#0d9488", glow: "#0d948880",              label: "Teal theme"  },
] as const;

// Press spring: snappy compress + quick release — feels physical
const PRESS_SPRING = { type: "spring", stiffness: 700, damping: 30 } as const;
// Active ring travel: moderate spring, no overshoot
const RING_SPRING  = { type: "spring", stiffness: 380, damping: 28 } as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const haptic = useWebHaptics();
  const reduced = useReducedMotion();

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="flex items-center gap-1 p-1"
    >
      {THEMES.map(({ id, color, glow, label }) => {
        const isActive = theme === id;
        return (
          <motion.button
            key={id}
            role="radio"
            aria-checked={isActive}
            aria-label={label}
            onClick={() => {
              haptic.trigger("selection");
              setTheme(id);
            }}
            whileTap={reduced ? undefined : { scale: 0.82 }}
            transition={reduced ? { duration: 0 } : PRESS_SPRING}
            className="relative h-7 w-7 shrink-0 aspect-square rounded-full focus-visible:outline-2 focus-visible:outline-white/40 focus-visible:outline-offset-1"
            style={{
              backgroundColor: color,
              opacity: isActive ? 1 : 0.3,
              boxShadow: isActive ? `0 0 8px ${glow}` : "none",
              transition: "opacity 150ms ease, box-shadow 150ms ease",
            }}
          >
            {isActive && (
              <motion.span
                layoutId="theme-active-ring"
                className="pointer-events-none absolute -inset-0.5 rounded-full ring-2 ring-white/50"
                transition={reduced ? { duration: 0 } : RING_SPRING}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

