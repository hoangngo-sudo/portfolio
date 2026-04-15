"use client";

import { forwardRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useWebHaptics } from "web-haptics/react";

interface KeycapButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const KeycapButton = forwardRef<HTMLButtonElement, KeycapButtonProps>(
  function KeycapButton({ children, className = "", ...props }, ref) {
    const shouldReduceMotion = useReducedMotion();
    const haptic = useWebHaptics();

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
        transition={springTransition}
      >
        <motion.button
          ref={ref}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border-none bg-linear-to-b from-keycap-cap-from to-keycap-cap-to px-2 py-2 text-white shadow-[0_6px_10px_rgb(0_0_0/0.3)] focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg focus-visible:outline-none ${className}`}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.93 }}
          transition={springTransition}
          {...buttonProps}
          onClick={(e) => {
            haptic.trigger("medium");
            buttonProps.onClick?.(e);
          }}
        >
          <span className="inline-flex items-center gap-2 rounded-[200px] bg-linear-to-b from-keycap-surface-from to-keycap-surface-to px-4 py-2 text-sm font-medium">
            {children}
          </span>
        </motion.button>
      </motion.div>
    );
  }
);
