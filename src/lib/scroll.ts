import { animate, type AnimationPlaybackControls } from "motion";

let activeScroll: AnimationPlaybackControls | null = null;

/**
 * Smooth-scroll to a target Y position using framer-motion spring animation.
 * Temporarily disables CSS scroll-behavior to avoid conflicting with the
 * JS-driven animation.
 */
export function smoothScrollTo(targetY: number, options?: { duration?: number; bounce?: number }) {
  // Jump instantly for users who prefer reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo({ top: targetY, behavior: "instant" });
    return;
  }

  // Cancel any in-flight scroll animation
  if (activeScroll) activeScroll.stop();

  // Disable CSS smooth-scroll so window.scrollTo calls are instant
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  // Disable bounce at page boundaries (top / bottom) to avoid clipped overshoot
  const maxScroll = html.scrollHeight - window.innerHeight;
  const atBoundary = targetY <= 0 || targetY >= maxScroll;

  const visualDuration = options?.duration ?? 0.4;
  const bounce = options?.bounce ?? (atBoundary ? 0 : 0.2);

  const animation = animate(window.scrollY, targetY, {
    onUpdate: (value) => window.scrollTo(0, value),
    onComplete: () => {
      html.style.scrollBehavior = prev;
      // Only clear if this animation is still the active one.
      // Prevents a stopped animation's onComplete from wiping
      // the reference to a newer animation started after it.
      if (activeScroll === animation) {
        activeScroll = null;
      }
    },
    type: "spring",
    visualDuration,
    bounce,
  });
  activeScroll = animation;
}

/**
 * Smooth-scroll to a DOM element by ID using framer-motion spring animation.
 *
 * For sticky elements (which always sit at a fixed viewport position),
 * we find the element's natural position in the document flow by
 * temporarily disabling sticky, measuring, then restoring.
 *
 * The `contact` section uses a slightly longer, low-bounce spring
 * to create a harness-like deceleration that mirrors the hero
 * "back to top" feel: fast start, easing into a gentle stop.
 */
export function smoothScrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const style = getComputedStyle(el);
  const isSticky = style.position === "sticky" || style.position === "-webkit-sticky";
  const prevPosition = el.style.position;

  if (isSticky) {
    // Temporarily un-stick so getBoundingClientRect reports natural flow position
    el.style.position = "static";
  }

  // Force a layout recalculation before measuring
  void el.offsetHeight;

  const rect = el.getBoundingClientRect();
  const targetY = window.scrollY + rect.top;

  if (isSticky) {
    // Restore sticky positioning
    el.style.position = prevPosition;
  }

  // Force layout again after restoring sticky
  void el.offsetHeight;

  // Harness-like animation: fast start, gentle deceleration at the end.
  // Contact anchor scrolls far → longer visualDuration for perceptible easing.
  // Low bounce (0.1) gives a subtle "settle" without overshooting the boundary.
  smoothScrollTo(targetY, {
    duration: 0.6,
    bounce: 0.05,
  });
}
