"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { hexToRgb } from "@/lib/color";
import { useSmoothCorners, type SmoothCornerOptions } from "@lisse/react";

type AsProp<T extends React.ElementType> = { as?: T };

type SpotlightCardProps<T extends React.ElementType = "div"> = AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof AsProp<T> | "children"> & {
    spotlightColor?: string;
    spotlightSize?: number;
    smoothCorners?: SmoothCornerOptions;
    children?: React.ReactNode;
  };

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
    smoothCorners,
    ...rest
  } = props as SpotlightCardProps<"div">;
  const className = classNameProp ?? "";
  const Tag = (as ?? "div") as React.ElementType;
  const internalRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const reducedMotionRef = useRef(false);
  const isTouchRef = useRef(false);
  const accentColorRef = useRef<string | null>(null);

  const { colors } = useTheme();

  // Resolve ref: forward ref takes priority, fallback to internal
  const rootRef = (ref as React.RefObject<HTMLElement>) ?? internalRef;

  useSmoothCorners(
    rootRef as React.RefObject<HTMLElement>,
    smoothCorners ?? { radius: 0, smoothing: 0 },
    { autoEffects: false },
  );

  const finalClassName = smoothCorners
    ? className.replace(/\brounded-\S+/g, "")
    : className;

  // Derive the spotlight color from the theme accent.
  // Recomputes on theme change via re-render from useTheme.
  // (accentColorRef is populated for event handlers, not render.)
  const resolvedColor =
    spotlightColor ??
    (() => {
      const rgb = hexToRgb(colors.accent);
      return rgb
        ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`
        : "rgba(13, 148, 136, 0.15)";
    })();

  // Cache prefers-reduced-motion + touch detection once on mount
  useEffect(() => {
    reducedMotionRef.current =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    isTouchRef.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (reducedMotionRef.current || isTouchRef.current) return;
    rectRef.current = rootRef.current?.getBoundingClientRect() ?? null;

    // Reset glow position to center so each new hover starts clean.
    // Invisible at this point because opacity is 0 and transitions in.
    if (glowRef.current) glowRef.current.style.transform = "";

    // Cache the accent color for use outside React's render cycle
    if (!spotlightColor) {
      const rgb = hexToRgb(colors.accent);
      accentColorRef.current = rgb
        ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`
        : "rgba(13, 148, 136, 0.15)";
    }

    if (glowRef.current) glowRef.current.style.opacity = "1";
  }, [spotlightColor, colors.accent, rootRef]);

  const handleMouseLeave = useCallback(() => {
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
    const el = rootRef.current;
    if (el) {
      el.style.removeProperty("--spot-x");
      el.style.removeProperty("--spot-y");
    }
  }, [rootRef]);

  const handleFocus = useCallback(() => {
    if (reducedMotionRef.current || isTouchRef.current) return;
    if (glowRef.current) glowRef.current.style.opacity = "1";
    // Expose centered cursor coords for children
    const el = rootRef.current;
    const rect = el?.getBoundingClientRect();
    if (el && rect) {
      el.style.setProperty("--spot-x", `${rect.width / 2}px`);
      el.style.setProperty("--spot-y", `${rect.height / 2}px`);
    }
  }, [rootRef]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotionRef.current || isTouchRef.current || !glowRef.current || !rectRef.current) return;
      const x = e.clientX - rectRef.current.left;
      const y = e.clientY - rectRef.current.top;
      const w = rectRef.current.width;
      const h = rectRef.current.height;

      // Move glow element so its pre-rendered gradient center
      // follows the cursor. Compositor-only (S-tier).
      glowRef.current.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px)`;

      // Expose cursor coords as CSS custom properties for children
      const el = rootRef.current;
      if (el) {
        el.style.setProperty("--spot-x", `${x}px`);
        el.style.setProperty("--spot-y", `${y}px`);
      }
    },
    [rootRef],
  );

  return (
    <Tag
      {...rest}
      ref={rootRef}
      data-spotlight-card
      className={`relative overflow-hidden ${finalClassName}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleMouseLeave}
    >
      {/* Pre-rendered radial gradient moved via compositor transform.
          Center offset so the gradient center aligns with the card center
          at translate(0,0). 2× card size ensures coverage when moved. */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute z-0 opacity-0 transition-opacity duration-200 ease-out will-change-transform"
        style={{
          width: "200%",
          height: "200%",
          top: "-50%",
          left: "-50%",
          background: `radial-gradient(circle at center, ${resolvedColor}, transparent ${spotlightSize / 2}%)`,
        }}
      />
      <div className="relative z-1">{children}</div>
    </Tag>
  );
}

const SpotlightCard = React.forwardRef(SpotlightCardInner) as <
  T extends React.ElementType = "div",
>(
  props: SpotlightCardProps<T> & { ref?: React.ForwardedRef<Element> },
) => React.ReactElement;

export default SpotlightCard;
