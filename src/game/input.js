const LEFT = ["ArrowLeft", "KeyA"];
const RIGHT = ["ArrowRight", "KeyD"];
const UP = ["ArrowUp", "KeyW"];
const DOWN = ["ArrowDown", "KeyS"];
const MOVEMENT_KEYS = new Set([...LEFT, ...RIGHT, ...UP, ...DOWN]);

/**
 * Tracks which movement keys are held. Kaplay only hears keyboard events on the canvas, so a key
 * released while focus was elsewhere (for example inside a panel) would stay "down" forever.
 * Feed this from window-level key events and clear it whenever focus or visibility changes.
 */
export function createHeldKeys() {
  const held = new Set();
  const down = (codes) => codes.some((code) => held.has(code));

  return {
    press(code) {
      if (MOVEMENT_KEYS.has(code)) held.add(code);
    },
    release(code) {
      held.delete(code);
    },
    clear() {
      held.clear();
    },
    direction() {
      return {
        dx: (down(RIGHT) ? 1 : 0) - (down(LEFT) ? 1 : 0),
        dy: (down(DOWN) ? 1 : 0) - (down(UP) ? 1 : 0),
      };
    },
  };
}
