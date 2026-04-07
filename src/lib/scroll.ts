import { animate, type AnimationPlaybackControls } from "framer-motion";

let activeScroll: AnimationPlaybackControls | null = null;

/**
 * Smooth-scroll to a target Y position using framer-motion spring animation.
 * Temporarily disables CSS scroll-behavior to avoid conflicting with the
 * JS-driven animation (which causes visible jitter on mobile).
 */
export function smoothScrollTo(targetY: number) {
  // Cancel any in-flight scroll animation
  if (activeScroll) activeScroll.stop();

  // Disable CSS smooth-scroll so window.scrollTo calls are instant
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  activeScroll = animate(window.scrollY, targetY, {
    onUpdate: (value) => window.scrollTo(0, value),
    onComplete: () => {
      html.style.scrollBehavior = prev;
      activeScroll = null;
    },
    type: "spring",
    visualDuration: 0.33,
    bounce: 0.2









    














    









    














    









    














    









    














    









    














    

    
  });
}

/**
 * Smooth-scroll to a DOM element by ID using framer-motion spring animation.
 */
export function smoothScrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  smoothScrollTo(window.scrollY + rect.top);
}
