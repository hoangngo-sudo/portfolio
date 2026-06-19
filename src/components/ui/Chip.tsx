"use client";

import { useRef } from "react";
import type { MouseEventHandler, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useSmoothCorners } from "@lisse/react";
import { useSound } from "@web-kits/audio/react";
import { tap } from "@/../lib/audio/minimal";

const PRESS_SPRING = { type: "spring" as const, stiffness: 600, damping: 20 };

interface ChipProps {
  label: string;
  href?: string;
  external?: boolean;
  icon?: ReactNode;
  className?: string;
  id?: string;
  download?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export function Chip({ label, href, external, icon, className = "", id, download, onClick }: ChipProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const playTap = useSound(tap);
  const reduced = useReducedMotion();

  // Apply squircle corners on whichever element renders; the hook is a no-op
  // when ref.current is null (the other branch).
  useSmoothCorners(linkRef, { radius: 8, smoothing: 0.6 }, { autoEffects: false });
  useSmoothCorners(spanRef, { radius: 8, smoothing: 0.6 }, { autoEffects: false });

  const baseClasses =
    "inline-flex cursor-pointer items-center gap-2 bg-dark-bg-alt dm-elevation-2 px-6 py-2.5 text-sm font-medium text-text-primary";

// ease-out-cubic, matches ShowMoreButton + TagPill for consistent hover easing
const CHIP_TRANSITION = "background-color 150ms cubic-bezier(0.215,0.61,0.355,1), color 150ms cubic-bezier(0.215,0.61,0.355,1)";

  if (href) {
    return (
      <motion.a
        ref={linkRef}
        id={id}
        href={href}
        download={download}
        onClick={(e) => {
          playTap();
          onClick?.(e);
        }}
        whileTap={reduced ? undefined : { scale: 0.97 }}
        transition={reduced ? { duration: 0 } : PRESS_SPRING}
        className={`${baseClasses} ${className} outline-offset-2`}
        style={{ transition: CHIP_TRANSITION }}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {icon}
        {label}
      </motion.a>
    );
  }

  return (
    <motion.span
      ref={spanRef}
      id={id}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={reduced ? { duration: 0 } : PRESS_SPRING}
      className={`${baseClasses} ${className}`}
      style={{ transition: CHIP_TRANSITION }}
    >
      {icon}
      {label}
    </motion.span>
  );
}
