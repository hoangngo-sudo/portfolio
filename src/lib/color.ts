/** Parse 3- or 6-digit hex to {r,g,b}. Returns null on invalid input. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{3}(?:[0-9a-f]{3})?)$/i.exec(hex);
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

/**
 * Parse `oklch(L C H)` or `oklch(L C H / alpha)` to {r,g,b} (0-255).
 * Values outside the sRGB gamut are clamped. Returns null on invalid input.
 */
export function oklchToRgb(
  color: string,
): { r: number; g: number; b: number } | null {
  const match = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\s*\)$/i.exec(
    color.trim(),
  );
  if (!match) return null;
  const L = parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const H = (parseFloat(match[3]) * Math.PI) / 180;
  const a = C * Math.cos(H);
  const b = C * Math.sin(H);

  // Oklab -> linear sRGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  const rLin = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  // linear -> sRGB (gamma), clamped to the sRGB gamut
  const toSrgb = (v: number) => {
    const c = Math.min(1, Math.max(0, v));
    const out = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return Math.round(out * 255);
  };
  return { r: toSrgb(rLin), g: toSrgb(gLin), b: toSrgb(bLin) };
}

/** Parse a hex or oklch color to {r,g,b} (0-255). Returns null on invalid input. */
export function colorToRgb(
  color: string,
): { r: number; g: number; b: number } | null {
  const trimmed = color.trim();
  if (/^oklch\(/i.test(trimmed)) return oklchToRgb(trimmed);
  return hexToRgb(trimmed);
}
