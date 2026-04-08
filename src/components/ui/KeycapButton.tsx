"use client";

import { forwardRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface KeycapButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const KeycapButton = forwardRef<HTMLButtonElement, KeycapButtonProps>(
  function KeycapButton({ children, className = "", ...props }, ref) {
    const shouldReduceMotion = useReducedMotion();

    const springTransition = shouldReduceMotion
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 600, damping: 20 };

    // Separate drag-related props to avoid React vs framer-motion type conflicts
    const {
      onDrag: _d,
      onDragEnd: _de,
      onDragStart: _ds,
      onDragOver: _do,
      onAnimationStart: _as,
      ...buttonProps
    } = props;

    return (
      <motion.div
        className="keycap-wrap"
        whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
        transition={springTransition}
      >
        <motion.button
          ref={ref}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-[14px] border-none bg-linear-to-b from-[#424242] to-[#343434] p-0 text-white shadow-[0_6px_10px_rgb(0_0_0/0.3)] focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg focus-visible:outline-none ${className}`}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
          whileTap={{ scale: 0.93 }}
          transition={springTransition}
          {...buttonProps}
        >
          <span className="inline-flex items-center gap-2 rounded-[50px] bg-linear-to-b from-[#2d2d2d] to-[#424242] px-4 py-2 text-sm font-medium">
            {children}
          </span>
        </motion.button>
      </motion.div>
    );
  }
);
