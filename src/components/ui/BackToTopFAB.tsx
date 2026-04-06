"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { smoothScrollTo } from "@/lib/scroll";

export function BackToTopFAB() {
  const [visible, setVisible] = useState(false);

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
          className="fixed right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] z-50 rounded-md bg-accent px-4 py-2 text-xs text-white shadow-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", bounce: 0.2, visualDuration: 0.3 }}
        >
          Back to top
        </motion.button>
      )}
    </AnimatePresence>
  );
}
