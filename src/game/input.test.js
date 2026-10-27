import { describe, expect, it } from "vitest";
import { createHeldKeys } from "./input.js";

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
