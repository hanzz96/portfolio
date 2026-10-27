const DEFAULT_FALLBACK = "#ecfff8";

// Page background the icons sit on (#081019), and the WCAG minimum contrast for graphics.
const BACKGROUND_LUMINANCE = 0.0051;
const MIN_CONTRAST = 3;

function channel(value) {
  const scaled = value / 255;
  return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * A brand color to tint an icon with on the dark page. Very dark brand colors (Next.js, Kafka...)
 * would vanish, so those get the fallback instead.
 */
export function readableBrandColor(hex, fallback = DEFAULT_FALLBACK) {
  const clean = typeof hex === "string" ? hex.replace(/^#/, "") : "";
  if (!/^[0-9a-f]{6}$/i.test(clean)) return fallback;

  const contrast = (luminance(clean) + 0.05) / (BACKGROUND_LUMINANCE + 0.05);
  return contrast >= MIN_CONTRAST ? `#${clean.toUpperCase()}` : fallback;
}
