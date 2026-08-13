"use client";

// Must be the first import: patches requestAnimationFrame / performance.now /
// Date.now / setTimeout / setInterval before any animation library caches the
// real clock, so slow-mo actually works (Framer Motion and GSAP cache these).
import "@aiforui/lapse/install";

import { Lapse } from "@aiforui/lapse";

/**
 * Mounts the Lapse animation inspector panel (slow-mo, takes, scrubbing).
 * The side-effect import above patches the clock immediately on module load,
 * so the panel and the app share the same shared engine instance.
 */
export function LapseProvider() {
  return <Lapse />;
}
