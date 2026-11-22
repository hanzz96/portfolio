import { describe, expect, it } from "vitest";
import { createHeldKeys, placeIndexForKey } from "./input.js";

describe("placeIndexForKey", () => {
  it("maps the number row and numpad 1-5 to place indexes 0-4", () => {
    expect(["Digit1", "Digit2", "Digit3", "Digit4", "Digit5"].map(placeIndexForKey)).toEqual([0, 1, 2, 3, 4]);
    expect(["Numpad1", "Numpad5"].map(placeIndexForKey)).toEqual([0, 4]);
  });

  it("ignores every other key", () => {
    for (const code of ["Digit0", "Digit6", "KeyW", "ArrowUp", "Space", "Enter", ""]) {
      expect(placeIndexForKey(code)).toBe(-1);
    }
  });
});

describe("createHeldKeys", () => {
  it("starts with no direction", () => {
    expect(createHeldKeys().direction()).toEqual({ dx: 0, dy: 0 });
  });

  it("maps arrow keys and WASD to the same directions", () => {
    const arrows = createHeldKeys();
    arrows.press("ArrowLeft");
    arrows.press("ArrowUp");
    const wasd = createHeldKeys();
    wasd.press("KeyA");
    wasd.press("KeyW");
    expect(arrows.direction()).toEqual({ dx: -1, dy: -1 });
    expect(wasd.direction()).toEqual(arrows.direction());
  });

  it("stops when the key is released", () => {
    const keys = createHeldKeys();
    keys.press("KeyD");
    expect(keys.direction()).toEqual({ dx: 1, dy: 0 });
    keys.release("KeyD");
    expect(keys.direction()).toEqual({ dx: 0, dy: 0 });
  });

  it("cancels out opposite keys", () => {
    const keys = createHeldKeys();
    keys.press("ArrowLeft");
    keys.press("KeyD");
    expect(keys.direction()).toEqual({ dx: 0, dy: 0 });
  });

  it("keeps moving while either alias of a direction is still held", () => {
    const keys = createHeldKeys();
    keys.press("ArrowDown");
    keys.press("KeyS");
    keys.release("ArrowDown");
    expect(keys.direction()).toEqual({ dx: 0, dy: 1 });
  });

  it("ignores keys that are not movement keys", () => {
    const keys = createHeldKeys();
    keys.press("KeyE");
    keys.press("Escape");
    expect(keys.direction()).toEqual({ dx: 0, dy: 0 });
  });

  it("forgets everything on clear, so a key released while the page lost focus cannot stick", () => {
    const keys = createHeldKeys();
    keys.press("ArrowRight");
    keys.press("KeyS");
    keys.clear();
    expect(keys.direction()).toEqual({ dx: 0, dy: 0 });
  });

  it("is safe to release a key that was never pressed", () => {
    const keys = createHeldKeys();
    expect(() => keys.release("KeyW")).not.toThrow();
    expect(keys.direction()).toEqual({ dx: 0, dy: 0 });
  });
});
