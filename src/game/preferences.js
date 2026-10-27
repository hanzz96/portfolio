const MUTED_KEY = "portfolio:muted";

function defaultStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Sound is off until the visitor turns it on. Storage can be blocked, so never trust it. */
export function loadMuted(storage = defaultStorage()) {
  try {
    return storage?.getItem(MUTED_KEY) !== "false";
  } catch {
    return true;
  }
}

export function saveMuted(muted, storage = defaultStorage()) {
  try {
    storage?.setItem(MUTED_KEY, String(muted));
  } catch {
    // Preference just will not persist.
  }
}
