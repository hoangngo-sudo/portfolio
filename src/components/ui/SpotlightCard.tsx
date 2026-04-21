"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

type AsProp<T extends React.ElementType> = { as?: T };

type SpotlightCardProps<T extends React.ElementType = "div"> = AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof AsProp<T> | "children"> & {
    spotlightColor?: string;
    spotlightSize?: number;
    children?: React.ReactNode;
  };

/** Parse 3- or 6-digit hex to {r,g,b}. Returns null on invalid input. */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{3,6})$/i.exec(hex);
  if (!m) return null;
  const h = m[1].length === 3
    ? m[1][0] + m[1][0] + m[1][1] + m[1][1] + m[1][2] + m[1][2]
    : m[1];
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

function SpotlightCardInner<T extends React.ElementType = "div">(
  props: SpotlightCardProps<T> & { ref?: React.ForwardedRef<Element> },
  ref: React.ForwardedRef<Element>,
) {
  const {
    as,
    children,
    className: classNameProp,
    spotlightColor,
    spotlightSize = 80,
    ...rest
  } = props as SpotlightCardProps<"div">;
  const className = classNameProp ?? "";
  const Tag = (as ?? "div") as React.ElementType;
  const internalRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const reducedMotionRef = useRef(false);
  const isTouchRef = useRef(false);
  const accentColorRef = useRef<string | null>(null);
  // rAF handle — ensures at most one pending write per frame
  const rafRef = useRef<number | null>(null);

  const { colors } = useTheme();

  // Resolve ref: forward ref takes priority, fallback to internal
  const rootRef = (ref as React.RefObject<HTMLElement>) ?? internalRef;

  // Cache prefers-reduced-motion + touch detection once on mount
  useEffect(() => {
    reducedMotionRef.current =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    isTouchRef.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (reducedMotionRef.current || isTouchRef.current) return;
    rectRef.current = rootRef.current?.getBoundingClientRect() ?? null;

    // Derive color from theme accent if no explicit spotlightColor
    if (!spotlightColor) {
      const rgb = hexToRgb(colors.accent);
      accentColorRef.current = rgb
        ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`
        : "rgba(13, 148, 136, 0.15)";
    }

    if (overlayRef.current) overlayRef.current.style.opacity = "1";
  }, [spotlightColor, colors.accent, rootRef]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (overlayRef.current) overlayRef.current.style.opacity = "0";
    const el = rootRef.current;
    if (el) {
      el.style.removeProperty("--spot-x");
      el.style.removeProperty("--spot-y");
    }
  }, [rootRef]);

  const handleFocus = useCallback(() => {
    if (reducedMotionRef.current || isTouchRef.current) return;
    // Derive color if not yet cached (keyboard-only user, no prior mouseenter)
    if (!spotlightColor && !accentColorRef.current) {
      const rgb = hexToRgb(colors.accent);
      accentColorRef.current = rgb
        ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`
        : "rgba(13, 148, 136, 0.15)";
    }
    if (overlayRef.current) {
      const color = spotlightColor ?? accentColorRef.current ?? "rgba(13, 148, 136, 0.15)";
      overlayRef.current.style.background =
        `radial-gradient(circle at 50% 50%, ${color}, transparent ${spotlightSize}%)`;
      overlayRef.current.style.opacity = "1";
    }
    // Expose centered cursor coords for children (e.g. ProjectImageReveal)
    const el = rootRef.current;
    const rect = el?.getBoundingClientRect();
    if (el && rect) {
      el.style.setProperty("--spot-x", `${rect.width / 2}px`);
      el.style.setProperty("--spot-y", `${rect.height / 2}px`);
    }
  }, [spotlightColor, spotlightSize, colors.accent, rootRef]);

  const handleBlur = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (overlayRef.current) overlayRef.current.style.opacity = "0";
    const el = rootRef.current;
    if (el) {
      el.style.removeProperty("--spot-x");
      el.style.removeProperty("--spot-y");
    }
  }, [rootRef]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotionRef.current || isTouchRef.current || !overlayRef.current || !rectRef.current) return;
      const x = e.clientX - rectRef.current.left;
      const y = e.clientY - rectRef.current.top;

      // Batch all writes into one rAF — caps to one repaint per vsync frame
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!overlayRef.current) return;
        const color = spotlightColor ?? accentColorRef.current ?? "rgba(13, 148, 136, 0.15)";
        overlayRef.current.style.background =
          `radial-gradient(circle at ${x}px ${y}px, ${color}, transparent ${spotlightSize}%)`;
        // Expose cursor coords as CSS custom properties for children
        const el = rootRef.current;
        if (el) {
          el.style.setProperty("--spot-x", `${x}px`);
          el.style.setProperty("--spot-y", `${y}px`);
        }
      });
    },
    [spotlightColor, spotlightSize, rootRef],
  );

  return (
    <Tag
      {...rest}
      ref={rootRef}
      data-spotlight-card
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-200"
      />
      <div className="relative z-1">{children}</div>
    </Tag>
  );
}

export const SpotlightCard = React.forwardRef(SpotlightCardInner) as <
  T extends React.ElementType = "div",
>(
  props: SpotlightCardProps<T> & { ref?: React.ForwardedRef<Element> },
) => React.ReactElement;

export default SpotlightCard;
