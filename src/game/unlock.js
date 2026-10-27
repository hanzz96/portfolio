const UNLOCK_EVENTS = ["pointerdown", "keydown", "touchend"];

/**
 * Browsers refuse to play sound until the visitor interacts with the page. Run `onUnlock` once, on
 * the first interaction of any kind (not just a canvas click), and return a function that disarms it.
 */
export function armUnlock(target, onUnlock) {
  let armed = true;

  const disarm = () => {
    if (!armed) return;
    armed = false;
    for (const type of UNLOCK_EVENTS) target.removeEventListener(type, handler);
  };

  function handler() {
    disarm();
    onUnlock();
  }

  for (const type of UNLOCK_EVENTS) target.addEventListener(type, handler);
  return disarm;
}
