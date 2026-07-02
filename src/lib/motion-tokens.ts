/**
 * Shared motion/animation tokens used across interactive components.
 *
 * Import these instead of duplicating inline magic values.
 * All easings follow Emil Kowalski's design engineering principles:
 * - User-initiated interactions: ease-out (fast start, settle gently)
 * - System-initiated (entrance): ease-out-cubic (decelerating, calm)
 */

/** Tap/click press spring — fast, stiff, no wobble. */
export const PRESS_SPRING = {
  type: "spring" as const,
  stiffness: 600,
  damping: 20,
};

/** CSS ease-out cubic-bezier — standard entrance easing. */
export const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;

/** CSS ease-out — faster settle for user-initiated interactions. */
export const EASE_OUT = [0, 0, 0.2, 1] as const;

/** CSS ease-in-out-cubic — for oscillating animations (shakes). */
export const EASE_IN_OUT_CUBIC = [0.645, 0.045, 0.355, 1] as const;
