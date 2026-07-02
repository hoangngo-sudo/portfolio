import { describe, it, expect } from "vitest";
import { hexToRgb } from "./color";

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
