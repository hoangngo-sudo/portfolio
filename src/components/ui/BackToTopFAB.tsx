"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { smoothScrollTo } from "@/lib/scroll";
import { useWebHaptics } from "web-haptics/react";

export function BackToTopFAB() {
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const haptic = useWebHaptics();

  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 600, damping: 20 };

  const exitTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "tween" as const, duration: 0.15, ease: [0.215, 0.61, 0.355, 1] };

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 200);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => {
            haptic.trigger("medium");
            smoothScrollTo(0);
          }}
          aria-label="Back to top"
          className="fixed right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] z-50 cursor-pointer rounded-lg border-none bg-linear-to-b from-keycap-cap-from to-keycap-cap-to px-2 py-2 text-white shadow-[0_6px_10px_rgb(0_0_0/0.3)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: springTransition }}
          exit={{ opacity: 0, y: 16, transition: exitTransition }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.93 }}
          transition={springTransition}
        >
          <span className="inline-flex items-center rounded-[200px] bg-linear-to-b from-keycap-surface-from to-keycap-surface-to px-4 py-2 text-xs font-medium">
            Back to top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
