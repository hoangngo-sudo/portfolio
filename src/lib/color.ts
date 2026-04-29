/** Parse 3- or 6-digit hex to {r,g,b}. Returns null on invalid input. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{3,6})$/i.exec(hex);
  if (!m) return null;
  const h =
    m[1].length === 3
      ? m[1][0] + m[1][0] + m[1][1] + m[1][1] + m[1][2] + m[1][2]
      : m[1];
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
