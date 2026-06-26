"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { MouseEventHandler, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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

/*
 * ANIMATION STORYBOARD
 *
 * key change triggers AnimatePresence enter/exit:
 *   exit     outgoing slides right, fades out, blurs
 *   enter    incoming slides in from left, fades in, un-blurs
 *   width    container morphs from old → new label width
 *
 * All three animations share the same duration + easing so
 * the morph, slide, and crossfade feel like one motion.
 */

const CROSSFADE = {
  slide:     6,           // px horizontal offset
  blur:      "2px",       // match ThemeToggle
  duration:  0.25,        // seconds — user-initiated per Emil's principles
  ease:      [0, 0, 0.2, 1] as const, // ease-out — user-initiated per Emil's principles
};

/**
 * Crossfade + width morph between label values.
 * The container width animates in sync with the text crossfade
 * so the resize never feels disconnected from the text swap.
 * Slide direction alternates: "Copied!" from left, email from right.
 */
function AnimatedLabel({ label, reduced }: { label: string; reduced: boolean }) {
  const [width, setWidth] = useState<number | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Measure the current label's intrinsic width and store it.
  // The container uses this explicit pixel width (with a CSS
  // transition) so it morphs smoothly instead of snapping.
  useLayoutEffect(() => {
    if (measureRef.current) {
      setWidth(measureRef.current.scrollWidth);
    }
  }, [label]);

  const transition = reduced
    ? { duration: 0 }
    : { duration: CROSSFADE.duration, ease: CROSSFADE.ease };

  // Direction: "Copied!" enters from left / exits right.
  // Email enters from right / exits left (the opposite).
  const dir = label === "Copied!" ? 1 : -1;

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        whiteSpace: "nowrap",
        width: width ?? "auto",
        transition: reduced
          ? "none"
          : `width ${CROSSFADE.duration}s cubic-bezier(${CROSSFADE.ease.join(",")})`,
      }}
    >
      {/* Sizer + measurement: in flow for height, invisible.
          Gives the container correct height and lets us measure
          the current label's width via scrollWidth. */}
      <span
        ref={measureRef}
        aria-hidden="true"
        style={{ visibility: "hidden", display: "inline-block" }}
      >
        {label}
      </span>
      <AnimatePresence initial={false} mode="sync">
        <motion.span
          key={label}
          initial={{
            opacity: 0,
            x: -CROSSFADE.slide * dir,
            filter: `blur(${CROSSFADE.blur})`,
          }}
          animate={{
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            x: CROSSFADE.slide * dir,
            filter: `blur(${CROSSFADE.blur})`,
          }}
          transition={transition}
          style={{
            position: "absolute",
            inset: 0,
            display: "inline-block",
          }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
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
    "inline-flex cursor-pointer items-center gap-2 bg-dark-bg-alt dm-elevation-2 px-4 py-2 text-sm font-medium text-text-primary";

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
        <AnimatedLabel label={label} reduced={!!reduced} />
      </motion.a>
    );
  }

  return (
    <motion.span
      ref={spanRef}
      id={id}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          (onClick as unknown as React.KeyboardEventHandler)?.(e);
        }
      }}
      onClick={(e) => {
        playTap();
        onClick?.(e as unknown as React.MouseEvent<HTMLAnchorElement>);
      }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={reduced ? { duration: 0 } : PRESS_SPRING}
      className={`${baseClasses} cursor-pointer select-none ${className}`}
      style={{ transition: CHIP_TRANSITION }}
    >
      {icon}
      <AnimatedLabel label={label} reduced={!!reduced} />
    </motion.span>
  );
}
