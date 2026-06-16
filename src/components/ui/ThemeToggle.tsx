"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useWebHaptics } from "web-haptics/react";
import { useSound } from "@web-kits/audio/react";
import { toggleOn, toggleOff } from "@/../lib/audio/minimal";
import { useLayoutEffect, useRef, useState } from "react";
import { useSmoothCorners } from "@lisse/react";

// Press spring: matches ShowMoreButton/Chip pattern
const PRESS_SPRING = { type: "spring" as const, stiffness: 600, damping: 20 };

// Shake: on-screen movement uses ease-in-out per Easing Blueprint.
// Spring only supports 2 keyframes; tween with ease-in-out-cubic
// handles the 6-frame oscillation naturally.
const SHAKE_TRANSITION = {
  type: "tween" as const,
  duration: 0.35,
  ease: [0.645, 0.045, 0.355, 1] as const, // ease-in-out-cubic
};

const SHAKE_KEYFRAMES = [0, -4, 4, -4, 4, 0];

const CROSSFADE_DURATION_MS = 500;
const DOUBLE_CLICK_THRESHOLD_MS = 300;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const haptic = useWebHaptics();
  const reduced = useReducedMotion();
  const playToggleOn = useSound(toggleOn);
  const playToggleOff = useSound(toggleOff);
  const btnRef = useRef<HTMLButtonElement>(null);
  const blackMeasureRef = useRef<HTMLSpanElement>(null);
  const tealMeasureRef = useRef<HTMLSpanElement>(null);
  const lastClickRef = useRef<number>(0);
  const isTransitioning = useRef(false);
  const wipeRef = useRef(false);
  const [isShaking, setIsShaking] = useState(false);
  const [wordWidths, setWordWidths] = useState<{ black: number; teal: number } | null>(null);

  useSmoothCorners(btnRef, { radius: 8, smoothing: 0.6 }, { autoEffects: false });

  // Measure the natural text width of each word. We use dedicated
  // unconstrained measurement spans (absolute, no inset) so they
  // render at their intrinsic width rather than being stretched.
  useLayoutEffect(() => {
    if (blackMeasureRef.current && tealMeasureRef.current) {
      setWordWidths({
        black: blackMeasureRef.current.scrollWidth,
        teal: tealMeasureRef.current.scrollWidth,
      });
    }
  }, []);

  const handleClick = async () => {
    // Guard: ignore clicks during active page wipe
    if (wipeRef.current) return;

    const now = Date.now();
    const elapsed = now - lastClickRef.current;
    lastClickRef.current = now;

    // Rapid double-click during crossfade → shake + error haptic, skip toggle
    if (elapsed <= DOUBLE_CLICK_THRESHOLD_MS && isTransitioning.current) {
      haptic.trigger("error");
      if (!reduced) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);
      }
      return;
    }

    // Normal click → haptic + toggle
    haptic.trigger("medium");

    const newTheme = theme === "black" ? "teal" : "black";

    // Play toggle sound: ascending for teal, descending for black
    if (newTheme === "teal") playToggleOn();
    else playToggleOff();

    // Track transition window for double-click detection
    if (!reduced) {
      isTransitioning.current = true;
      setTimeout(() => {
        isTransitioning.current = false;
      }, CROSSFADE_DURATION_MS);
    }

    // Instant path: reduced motion or View Transitions API not supported
    if (!document.startViewTransition || reduced) {
      setTheme(newTheme);
      return;
    }

    // Animated path: diagonal wipe via View Transitions API
    wipeRef.current = true;
    document.documentElement.classList.add("diagonal-wipe-transition");
    try {
      const transition = document.startViewTransition(() => {
        setTheme(newTheme);
      });
      await transition.finished;
    } catch {
      // If startViewTransition threw synchronously, the callback never ran.
      // Fall back to instant switch so the user isn't stuck on the old theme.
      setTheme(newTheme);
    } finally {
      document.documentElement.classList.remove("diagonal-wipe-transition");
      wipeRef.current = false;
    }
  };

  return (
    <motion.button
      ref={btnRef}
      role="button"
      aria-pressed={theme === "black"}
      aria-label={`Switch ${theme === "black" ? "to teal" : "to black"} theme`}
      suppressHydrationWarning
      onClick={handleClick}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={reduced ? { duration: 0 } : PRESS_SPRING}
      animate={
        isShaking
          ? { x: SHAKE_KEYFRAMES, transition: SHAKE_TRANSITION }
          : { x: 0 }
      }
      className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-dark-bg-alt px-6 py-2.5 text-sm font-medium text-text-primary dm-elevation-2 select-none
        focus-visible:ring-2 focus-visible:ring-accent/50
        focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg
        focus-visible:outline-none"
    >
      <span>Switch</span>
      <span
        className="relative inline-block text-left"
        style={{
          width: wordWidths
            ? wordWidths[theme === "black" ? "teal" : "black"]
            : "auto",
          transition: reduced ? "none" : "width 500ms ease",
        }}
      >
        {/* Measurement-only: absolute but unconstrained (no inset), so
            scrollWidth returns the natural text width of each word. */}
        <span ref={blackMeasureRef} aria-hidden="true" className="absolute invisible whitespace-nowrap">Black</span>
        <span ref={tealMeasureRef} aria-hidden="true" className="absolute invisible whitespace-nowrap">Teal</span>
        {/* Invisible in-flow sizer: matches the destination word so the
            container has proper height and a correct starting width. */}
        <span aria-hidden="true" className="invisible">
          {theme === "black" ? "Teal" : "Black"}
        </span>
        {/* Layer 1: "Black", visible when offering to switch to black (current = teal) */}
        <span
          aria-hidden={theme === "black"}
          className="absolute inset-0"
          style={{
            opacity: theme === "teal" ? 1 : 0,
            filter: theme === "teal" ? "blur(0px)" : "blur(2px)",
            transition: reduced ? "none" : "opacity 500ms ease, filter 500ms ease",
          }}
        >
          Black
        </span>
        {/* Layer 2: "Teal", visible when offering to switch to teal (current = black) */}
        <span
          aria-hidden={theme === "teal"}
          className="absolute inset-0"
          style={{
            opacity: theme === "black" ? 1 : 0,
            filter: theme === "black" ? "blur(0px)" : "blur(2px)",
            transition: reduced ? "none" : "opacity 500ms ease, filter 500ms ease",
          }}
        >
          Teal
        </span>
      </span>
    </motion.button>
  );
}

