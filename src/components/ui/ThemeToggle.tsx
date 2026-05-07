"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useWebHaptics } from "web-haptics/react";

const THEMES = [
  { id: "black" as const, glow: "rgba(124,133,148,0.6)", label: "Black theme" },
  { id: "teal"  as const, glow: "#0d948880",              label: "Teal theme"  },
] as const;

// Press spring: snappy compress + quick release — feels physical
const PRESS_SPRING = { type: "spring", stiffness: 700, damping: 30 } as const;

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
      {THEMES.map(({ id, glow, label }) => {
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
            className="relative h-9 w-9 shrink-0 aspect-square rounded-full border-none bg-linear-to-b from-keycap-cap-from to-keycap-cap-to focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg focus-visible:outline-none"
            style={{
              opacity: isActive ? 1 : 0.35,
              boxShadow: isActive ? `0 0 8px ${glow}` : "none",
              transition: "opacity 150ms ease, box-shadow 150ms ease",
            }}
          >
            {/* Inner surface dot — inverted gradient creates the recessed keycap depth */}
            <span
              className="pointer-events-none absolute inset-[6px] rounded-full bg-linear-to-b from-keycap-surface-from to-keycap-surface-to"
              aria-hidden="true"
            />
          </motion.button>
        );
      })}
    </div>
  );
}

