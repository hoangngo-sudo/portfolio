"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useWebHaptics } from "web-haptics/react";

const THEMES = [
  { id: "black" as const, glow: "rgba(179,179,179,0.35)", label: "Black theme" },
  { id: "teal"  as const, glow: "rgba(13,148,136,0.35)",  label: "Teal theme"  },
] as const;

// Press spring: snappy compress + quick release, which feels physical
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
            // Active state is client-only (localStorage)
            suppressHydrationWarning
            onClick={() => {
              haptic.trigger("selection");
              setTheme(id);
            }}
            whileTap={reduced ? undefined : { scale: 0.82 }}
            transition={reduced ? { duration: 0 } : PRESS_SPRING}
            className="relative h-8 w-8 shrink-0 aspect-square rounded-full border-none
              bg-linear-to-b from-keycap-cap-from to-keycap-cap-to
              focus-visible:ring-2 focus-visible:ring-accent/50
              focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg
              focus-visible:outline-none"
            style={{
              opacity: isActive ? 1 : 0.35,
              boxShadow: isActive
                ? `inset 0 0 0 1px rgba(255,255,255,0.12), 0 0 10px ${glow}`
                : "inset 0 0 0 1px rgba(255,255,255,0.06)",
              transition: "opacity 200ms ease-out, box-shadow 200ms ease-out",
            }}
          >
            {isActive && (
              <motion.span
                layoutId="theme-ring"
                className="pointer-events-none absolute -inset-[1px] rounded-full ring-2 ring-white/50"
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 350, damping: 16, mass: 0.7 }
                }
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

