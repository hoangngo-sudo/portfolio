"use client";

import { useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * Splits text into individual words, each wrapped in a motion.span.
 * Words animate from blurred and vertically offset to clear and in-position.
 *
 * - `replay` uses whileInView (once: false) so the animation replays on scroll-back.
 * - `replay=false` uses initial/animate for a one-time entrance.
 * - `delay` shifts the start of the entire sequence, enabling coordination
 *   across multiple StaggeredBlurText blocks.
 */
interface StaggeredBlurTextProps {
  /** The text to animate (split by spaces into words). */
  text: string;
  /** Additional CSS classes on the container. */
  className?: string;
  /** HTML element to render the container as (default `"div"`). */
  as?: React.ElementType;
  /** Seconds to wait before the first word begins animating. */
  delay?: number;
  /** Seconds between each word's animation start. */
  stagger?: number;
  /** Duration of each word's blur→clear transition (seconds). */
  duration?: number;
  /** Initial blur radius in pixels. */
  blurAmount?: number;
  /** Initial vertical offset in pixels. */
  yOffset?: number;
  /** Target opacity after animation (default 1). Use 0.7 for dimmed text. */
  targetOpacity?: number;
  /** When true, uses whileInView so the animation replays on scroll-back. */
  replay?: boolean;
  /** aria-label for the container (uses `text` as fallback when omitted). */
  ariaLabel?: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (custom: { stagger: number; delay: number }) => ({
    transition: {
      staggerChildren: custom.stagger,
      delayChildren: custom.delay,
    },
  }),
};

const wordVariants: Variants = {
  hidden: (custom: { blurAmount: number; yOffset: number }) => ({
    filter: `blur(${custom.blurAmount}px)`,
    opacity: 0,
    y: custom.yOffset,
  }),
  visible: (custom: { duration: number; targetOpacity: number }) => ({
    filter: "blur(0px)",
    opacity: custom.targetOpacity,
    y: 0,
    transition: {
      type: "tween" as const,
      duration: custom.duration,
      ease: [0.215, 0.61, 0.355, 1] as const, // ease-out-cubic — entrance
    },
  }),
};

export function StaggeredBlurText({
  text,
  className,
  as: Component = "div",
  delay = 0,
  stagger = 0.04,
  duration = 0.5,
  blurAmount = 8,
  yOffset = 10,
  targetOpacity = 1,
  replay = false,
  ariaLabel,
}: StaggeredBlurTextProps) {
  const shouldReduceMotion = useReducedMotion();

  const words = useMemo(() => text.split(" "), [text]);

  // Respect prefers-reduced-motion: render plain text with no animation
  if (shouldReduceMotion) {
    return (
      <Component className={className} aria-label={ariaLabel ?? text}>
        {text}
      </Component>
    );
  }

  const containerCustom = { stagger, delay };
  const wordCustom = { blurAmount, yOffset, duration, targetOpacity };

  const content = (
    <motion.span
      variants={containerVariants}
      custom={containerCustom}
      initial="hidden"
      animate={replay ? undefined : "visible"}
      whileInView={replay ? "visible" : undefined}
      viewport={replay ? { once: false, amount: 0.3 } : undefined}
      style={{
        display: "inline",
        willChange: "transform, opacity",
      }}
      aria-label={ariaLabel ?? text}
      role={Component === "h1" || Component === "h2" ? "heading" : undefined}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          custom={wordCustom}
          style={{
            display: "inline-block",
            willChange: "transform, filter, opacity",
          }}
        >
          {word}
          {/* Non-breaking space keeps last word from collapsing into next element */}
          {i !== words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );

  return (
    <Component className={className} aria-label={ariaLabel ?? text}>
      {content}
    </Component>
  );
}
