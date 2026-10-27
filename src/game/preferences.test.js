import { describe, expect, it } from "vitest";
import { loadMuted, saveMuted } from "./preferences.js";

function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
  };
}

const brokenStorage = {
  getItem() {
    throw new Error("blocked");
  },
  setItem() {
    throw new Error("blocked");
  },
};

describe("sound preference", () => {
  it("is muted by default", () => {
    expect(loadMuted(fakeStorage())).toBe(true);
  });

  it("restores an explicit choice", () => {
    expect(loadMuted(fakeStorage({ "portfolio:muted": "false" }))).toBe(false);
    expect(loadMuted(fakeStorage({ "portfolio:muted": "true" }))).toBe(true);
  });

  it("treats unknown stored values as muted", () => {
    expect(loadMuted(fakeStorage({ "portfolio:muted": "maybe" }))).toBe(true);
  });

  it("round-trips through storage", () => {
    const storage = fakeStorage();
    saveMuted(false, storage);
    expect(loadMuted(storage)).toBe(false);
    saveMuted(true, storage);
    expect(loadMuted(storage)).toBe(true);
  });

  it("falls back to muted and never throws when storage is blocked", () => {
    expect(loadMuted(brokenStorage)).toBe(true);
    expect(() => saveMuted(false, brokenStorage)).not.toThrow();
  });

  it("falls back to muted when there is no storage at all", () => {
    expect(loadMuted(null)).toBe(true);
    expect(() => saveMuted(false, null)).not.toThrow();
  });
});
