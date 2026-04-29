"use client";

import type { MouseEventHandler, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface ChipProps {
  label: string;
  href?: string;
  external?: boolean;
  icon?: ReactNode;
  className?: string;
  id?: string;
  download?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  keycap?: boolean;
}

export function Chip({ label, href, external, icon, className = "", id, download, onClick, keycap }: ChipProps) {
  const shouldReduceMotion = useReducedMotion();

  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 600, damping: 20 };

  const baseClasses =
    "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-chip-border bg-transparent px-4 py-2 text-sm font-medium text-current/80 transition-[colors,transform] duration-150 ease-out hover:bg-chip-hover-bg hover:text-current active:scale-[0.97]";

  const capClasses =
    "inline-flex cursor-pointer items-center gap-2 rounded-lg border-none bg-linear-to-b from-keycap-cap-from to-keycap-cap-to px-2 py-2 text-current/80 shadow-[0_6px_10px_rgb(0_0_0/0.3)]";

  const surfaceClasses =
    "inline-flex items-center gap-2 rounded-[200px] bg-linear-to-b from-keycap-surface-from to-keycap-surface-to px-4 py-2 text-xs font-medium";

  if (keycap && href) {
    return (
      <motion.a
        id={id}
        href={href}
        download={download}
        onClick={onClick}
        className={`${capClasses} ${className}`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.93 }}
        transition={springTransition}
      >
        <span className={surfaceClasses}>
          {icon}
          {label}
        </span>
      </motion.a>
    );
  }

  if (href) {
    return (
      <a
        id={id}
        href={href}
        download={download}
        onClick={onClick}
        className={`${baseClasses} ${className}`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {icon}
        {label}
      </a>
    );
  }

  return (
    <span id={id} className={`${baseClasses} ${className}`}>
      {icon}
      {label}
    </span>
  );
}
