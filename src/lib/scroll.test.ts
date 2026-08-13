import { describe, it, expect } from "vitest";
import { resolveScrollBounce } from "./scroll";

describe("resolveScrollBounce", () => {
  it("returns 0 at the bottom boundary even when a bounce is passed", () => {
    // Regression: scrolling to #contact targets maxScroll, so a caller
    // bounce must never survive at the boundary (clamped spring bounce-back).
    expect(resolveScrollBounce(3403, 3402, 0.05)).toBe(0);
  });

  it("returns 0 at the top boundary even when a bounce is passed", () => {
    expect(resolveScrollBounce(0, 3402, 0.05)).toBe(0);
  });

  it("returns 0 when the target is exactly the boundary", () => {
    expect(resolveScrollBounce(3402, 3402, 0.05)).toBe(0);
  });

  it("returns 0 for a negative target (treated as top boundary)", () => {
    expect(resolveScrollBounce(-5, 3402, 0.05)).toBe(0);
  });

  it("honors an explicit bounce for a non-boundary target", () => {
    expect(resolveScrollBounce(500, 3402, 0.05)).toBe(0.05);
  });

  it("defaults to 0.2 for a non-boundary target with no explicit bounce", () => {
    expect(resolveScrollBounce(500, 3402)).toBe(0.2);
  });
});
