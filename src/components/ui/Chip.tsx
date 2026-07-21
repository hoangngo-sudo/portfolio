"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import type { MouseEventHandler, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSmoothCorners } from "@lisse/react";
import { useSound } from "@web-kits/audio/react";
import { tap } from "@/lib/audio/minimal";
import { PRESS_SPRING } from "@/lib/motion-tokens";

interface ChipProps {
  label: string;
  href?: string;
  external?: boolean;
  icon?: ReactNode;
  iconKey?: string;
  className?: string;
  id?: string;
  download?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

/**
 * Icon crossfade with blur + scale + opacity.
 * Shares the same duration and easing as AnimatedLabel so both
 * resolve together as one unified motion.
 * First render is a plain element with no animation to avoid
 * slide-in/scale-in on initial page load.
 */
function AnimatedIcon({ icon, iconKey, reduced }: { icon: ReactNode; iconKey?: string; reduced: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);

  if (!icon) return null;
  if (!ready) {
    return <span style={{ display: "inline-flex" }}>{icon}</span>;
  }
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        key={iconKey}
        initial={reduced ? false : { opacity: 0, scale: 0.5, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={reduced ? undefined : { opacity: 0, scale: 0.5, filter: "blur(4px)" }}
        transition={reduced ? { duration: 0 } : { duration: CROSSFADE.duration, ease: CROSSFADE.ease }}
        style={{ display: "inline-flex" }}
      >
        {icon}
      </motion.span>
    </AnimatePresence>
  );
}

/*
 * ANIMATION STORYBOARD
 *
 * CSS animation-based crossfade :
 *   exit     outgoing always slides right (+6px), fades out, blurs
 *   enter    incoming slides in from direction of dir, fades in, un-blurs
 *            "Copied!" from left (-6px), email from right (+6px)
 *   width    container morphs via CSS transition on width
 *
 * Uses CSS @keyframes instead of Motion AnimatePresence so the exit
 * animation plays on mount.
 * Keyframes defined in globals.css.
 */

const CROSSFADE = {
  slide:     6,           // px horizontal offset
  blur:      "2px",       // match ThemeToggle
  duration:  0.25,        // seconds; user-initiated per Emil's principles
  ease:      [0, 0, 0.2, 1] as const, // ease-out, matches EASE_OUT from motion-tokens
};

/**
 * Crossfade between label values, ThemeToggle-style CSS animation.
 * 
 * On label change:
 *   - The outgoing label mounts with a CSS animation (exit-right,
 *     plays from opacity 1→0, translateX 0→6px).
 *   - The incoming label mounts with a CSS animation (enter-from-left
 *     or enter-from-right, plays from opacity 0→1, translateX -6/6px→0).
 *   - The container width transitions via CSS `transition: width`.
 * 
 * The animated structure renders from the first render, but CSS animations
 * are gated by `isLabelChange` (animKey > 0) so they only play on actual
 * label swaps, not on initial page load.
 */
function AnimatedLabel({ label, reduced }: { label: string; reduced: boolean }) {
  const [fadingLabel, setFadingLabel] = useState<string | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  const prevLabelRef = useRef(label);
  const animKeyRef = useRef(0);

  // Measure the current label's natural width for container morph
  useLayoutEffect(() => {
    if (measureRef.current) {
      setWidth(measureRef.current.scrollWidth);
    }
  }, [label]);

  // On label change: trigger crossfade
  useEffect(() => {
    if (label !== prevLabelRef.current) {
      const old = prevLabelRef.current;
      prevLabelRef.current = label;
      animKeyRef.current++;

      setFadingLabel(old);

      const timer = setTimeout(() => setFadingLabel(null), 250);
      return () => clearTimeout(timer);
    }
  }, [label]);

  const dir = label === "Copied!" ? "left" : "right";
  const animKey = animKeyRef.current;
  const isLabelChange = animKey > 0;

  if (reduced) {
    return <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>{label}</span>;
  }

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        whiteSpace: "nowrap",
        verticalAlign: "middle",
        width: width ? `${width}px` : "auto",
        transition: "width 250ms ease-out",
      }}
    >
      {/* Measurement span for width */}
      <span ref={measureRef} aria-hidden="true" style={{ position: "absolute", visibility: "hidden", whiteSpace: "nowrap" }}>
        {label}
      </span>
      {/* Sizer provides intrinsic height */}
      <span aria-hidden="true" style={{ visibility: "hidden", display: "inline-block" }}>
        {label}
      </span>

      {/* Fading-out previous label covers the current label, then reveals it */}
      {fadingLabel !== null && (
        <span
          key={`out-${animKey}`}
          style={{
            position: "absolute",
            inset: 0,
            whiteSpace: "nowrap",
            animation: isLabelChange
              ? "label-exit-right 250ms cubic-bezier(0,0,0.2,1) forwards"
              : "none",
          }}
        >
          {fadingLabel}
        </span>
      )}

      {/* Entering current label only animates on label changes,
          not on initial mount. `isLabelChange` is true once animKey > 0,
          which only happens after a label swap. */}
      <span
        key={`in-${animKey}`}
        style={{
          position: "absolute",
          inset: 0,
          whiteSpace: "nowrap",
          animation: isLabelChange
            ? `label-enter-from-${dir} 250ms cubic-bezier(0,0,0.2,1) forwards`
            : "none",
        }}
      >
        {label}
      </span>
    </span>
  );
}

export function Chip({ label, href, external, icon, iconKey, className = "", id, download, onClick }: ChipProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const playTap = useSound(tap);
  const reduced = useReducedMotion();

  // Apply squircle corners on whichever element renders; the hook is a no-op
  // when ref.current is null (the other branch).
  useSmoothCorners(linkRef, { radius: 8, smoothing: 0.6 }, { autoEffects: false });
  useSmoothCorners(spanRef, { radius: 8, smoothing: 0.6 }, { autoEffects: false });

  const baseClasses =
    "inline-flex cursor-pointer items-center gap-2 bg-dark-bg-alt dm-elevation-2 px-4 py-2 text-sm font-medium text-text-primary focus-ring";

// ease-out-cubic, matches ShowMoreButton + TagPill for consistent hover easing
const CHIP_TRANSITION = "var(--hover-transition)";

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
          (e.currentTarget as HTMLElement).blur();
        }}
        whileTap={reduced ? undefined : { scale: 0.96 }}
        transition={reduced ? { duration: 0 } : PRESS_SPRING}
        className={`${baseClasses} ${className} outline-offset-2`}
        style={{ transition: CHIP_TRANSITION }}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <AnimatedIcon icon={icon} iconKey={iconKey ?? label} reduced={!!reduced} />
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
        (e.currentTarget as HTMLElement).blur();
      }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      transition={reduced ? { duration: 0 } : PRESS_SPRING}
      className={`${baseClasses} cursor-pointer select-none ${className}`}
      style={{ transition: CHIP_TRANSITION }}
    >
      <AnimatedIcon icon={icon} iconKey={iconKey ?? label} reduced={!!reduced} />
      <AnimatedLabel label={label} reduced={!!reduced} />
    </motion.span>
  );
}
