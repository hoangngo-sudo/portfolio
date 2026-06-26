"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { smoothScrollTo } from "@/lib/scroll";
import { useWebHaptics } from "web-haptics/react";
import { useSound } from "@web-kits/audio/react";
import { send } from "@/../lib/audio/minimal";
import { useSmoothCorners } from "@lisse/react";

/** Inner component so useSmoothCorners runs after the button mounts into DOM */
function BackToTopButton({
  onClick,
  shouldReduceMotion,
  springTransition,
  exitTransition,
}: {
  onClick: () => void;
  shouldReduceMotion: boolean | null;
  springTransition: { type: "spring"; stiffness: number; damping: number } | { duration: number };
  exitTransition: { type: "tween"; duration: number; ease: readonly [number, number, number, number] } | { duration: number };
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  useSmoothCorners(btnRef, { radius: 20, smoothing: 0.6 }, { autoEffects: false });

  return (
    <motion.button
      ref={btnRef}
      onClick={onClick}
      aria-label="Back to top"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 0.85, y: 0, transition: springTransition }}
      exit={{ opacity: 0, transition: exitTransition }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      transition={springTransition}
      className="fixed right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] z-50 cursor-pointer bg-dark-bg-alt dm-elevation-2 px-4 py-2 text-sm font-medium text-text-primary hover:opacity-100! focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg focus-visible:outline-none select-none"
    >
      Back to top
    </motion.button>
  );
}

export function BackToTopFAB() {
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const haptic = useWebHaptics();
  const playSend = useSound(send);

  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 600, damping: 20 };

  const exitTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "tween" as const, duration: 0.15, ease: [0.215, 0.61, 0.355, 1] as const };

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;

      setVisible((prev) => {
        // Hysteresis: show above 200, hide below 100.
        // Prevents flicker when mouse-wheel scrolling near the boundary.
        if (prev) return y > 100;
        return y > 200;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <BackToTopButton
          onClick={() => {
            haptic.trigger("medium");
            playSend();
            smoothScrollTo(0, { duration: 0.6, bounce: 0.05 });
          }}
          shouldReduceMotion={shouldReduceMotion}
          springTransition={springTransition}
          exitTransition={exitTransition}
        />
      )}
    </AnimatePresence>
  );
}
