import { describe, expect, it } from "vitest";
import { readableBrandColor } from "./color.js";

const FALLBACK = "#ecfff8";

describe("readableBrandColor", () => {
  it("keeps bright brand colors, normalised to #RRGGBB", () => {
    expect(readableBrandColor("F7DF1E")).toBe("#F7DF1E");
    expect(readableBrandColor("#2496ed")).toBe("#2496ED");
  });

  it("keeps mid-tone brand colors that are still visible on the dark background", () => {
    expect(readableBrandColor("4479A1")).toBe("#4479A1"); // MySQL
    expect(readableBrandColor("3178C6")).toBe("#3178C6"); // TypeScript
  });

  it("falls back for brand colors too dark to see on the dark background", () => {
    expect(readableBrandColor("000000")).toBe(FALLBACK); // Next.js
    expect(readableBrandColor("231F20")).toBe(FALLBACK); // Kafka
    expect(readableBrandColor("0E1128")).toBe(FALLBACK); // Unreal Engine
  });

  it("accepts a custom fallback", () => {
    expect(readableBrandColor("000000", "#ffd166")).toBe("#ffd166");
  });

  it("falls back on malformed input instead of throwing", () => {
    expect(readableBrandColor("")).toBe(FALLBACK);
    expect(readableBrandColor("nope")).toBe(FALLBACK);
    expect(readableBrandColor(undefined)).toBe(FALLBACK);
  });
});
