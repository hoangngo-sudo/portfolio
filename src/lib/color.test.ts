import { describe, it, expect } from "vitest";
import { hexToRgb, oklchToRgb, colorToRgb } from "./color";

describe("hexToRgb", () => {
  it("parses 6-digit hex with hash", () => {
    expect(hexToRgb("#0d9488")).toEqual({ r: 13, g: 148, b: 136 });
  });

  it("parses 6-digit hex without hash", () => {
    expect(hexToRgb("0d9488")).toEqual({ r: 13, g: 148, b: 136 });
  });

  it("parses 3-digit hex", () => {
    expect(hexToRgb("#abc")).toEqual({ r: 170, g: 187, b: 204 });
  });

  it("parses black", () => {
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("parses white", () => {
    expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("returns null for invalid input", () => {
    expect(hexToRgb("not-a-color")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(hexToRgb("")).toBeNull();
  });

  it("returns null for 4-digit hex (invalid)", () => {
    expect(hexToRgb("#abcd")).toBeNull();
  });

  it("returns null for 5-digit hex (invalid)", () => {
    expect(hexToRgb("#abcde")).toBeNull();
  });

  it("returns null for 1-digit hex (invalid)", () => {
    expect(hexToRgb("#a")).toBeNull();
  });

  it("returns null for 7-digit hex (invalid)", () => {
    expect(hexToRgb("#aabbccd")).toBeNull();
  });
});

describe("oklchToRgb", () => {
  it("parses white", () => {
    expect(oklchToRgb("oklch(1 0 0)")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("parses black", () => {
    expect(oklchToRgb("oklch(0 0 0)")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("parses an achromatic gray", () => {
    expect(oklchToRgb("oklch(0.767 0 0)")).toEqual({ r: 179, g: 179, b: 179 });
  });

  it("round-trips the text-primary token", () => {
    expect(oklchToRgb("oklch(0.942 0.009 258.3)")).toEqual({ r: 232, g: 236, b: 242 });
  });

  it("round-trips the ink-body token", () => {
    expect(oklchToRgb("oklch(0.278 0.03 256.8)")).toEqual({ r: 31, g: 41, b: 55 });
  });

  it("returns null for non-oklch input", () => {
    expect(oklchToRgb("#0d9488")).toBeNull();
    expect(oklchToRgb("")).toBeNull();
  });

  it("returns null for malformed oklch", () => {
    expect(oklchToRgb("oklch(0.6)")).toBeNull();
    expect(oklchToRgb("oklch(0.6 0.104)")).toBeNull();
  });
});

describe("colorToRgb", () => {
  it("parses hex", () => {
    expect(colorToRgb("#0d9488")).toEqual({ r: 13, g: 148, b: 136 });
  });

  it("parses oklch", () => {
    expect(colorToRgb("oklch(0.6 0.104 184.7)")).toEqual({ r: 12, g: 148, b: 136 });
  });

  it("returns null for invalid input", () => {
    expect(colorToRgb("not-a-color")).toBeNull();
  });
});
