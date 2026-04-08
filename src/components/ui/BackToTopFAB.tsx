"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { smoothScrollTo } from "@/lib/scroll";

export function BackToTopFAB() {
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 600, damping: 20 };

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
          onClick={() => smoothScrollTo(0)}
          aria-label="Back to top"
          className="fixed right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] z-50 cursor-pointer rounded-lg border-none bg-linear-to-b from-keycap-cap-from to-keycap-cap-to px-2 py-2 text-white shadow-[0_6px_10px_rgb(0_0_0/0.3)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
          whileTap={{ scale: 0.93 }}
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
