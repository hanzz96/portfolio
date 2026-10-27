import { describe, expect, it } from "vitest";
import { armUnlock } from "./unlock.js";

describe("armUnlock", () => {
  it("runs the callback on the first pointerdown, keydown or touchend", () => {
    for (const type of ["pointerdown", "keydown", "touchend"]) {
      const target = new EventTarget();
      let calls = 0;
      armUnlock(target, () => calls++);
      target.dispatchEvent(new Event(type));
      expect(calls).toBe(1);
    }
  });

  it("runs only once, however many interactions follow", () => {
    const target = new EventTarget();
    let calls = 0;
    armUnlock(target, () => calls++);
    target.dispatchEvent(new Event("pointerdown"));
    target.dispatchEvent(new Event("keydown"));
    target.dispatchEvent(new Event("pointerdown"));
    expect(calls).toBe(1);
  });

  it("ignores unrelated events", () => {
    const target = new EventTarget();
    let calls = 0;
    armUnlock(target, () => calls++);
    target.dispatchEvent(new Event("mousemove"));
    target.dispatchEvent(new Event("keyup"));
    expect(calls).toBe(0);
  });

  it("can be disarmed before any interaction", () => {
    const target = new EventTarget();
    let calls = 0;
    const disarm = armUnlock(target, () => calls++);
    disarm();
    target.dispatchEvent(new Event("pointerdown"));
    expect(calls).toBe(0);
  });

  it("is safe to disarm twice or after it has fired", () => {
    const target = new EventTarget();
    const disarm = armUnlock(target, () => {});
    target.dispatchEvent(new Event("keydown"));
    expect(() => {
      disarm();
      disarm();
    }).not.toThrow();
  });
});
