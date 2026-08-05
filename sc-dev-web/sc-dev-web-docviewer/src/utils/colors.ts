export interface RGBA {
  r: number; // 0–255
  g: number; // 0–255
  b: number; // 0–255
  a: number; // 0–1
}

function parseHex(hex: string): RGBA | null {
  const raw = hex.trim().replace(/^#/, '');
  let r: number, g: number, b: number, a = 1;

  if (raw.length === 3) {
    r = parseInt(raw[0] + raw[0], 16);
    g = parseInt(raw[1] + raw[1], 16);
    b = parseInt(raw[2] + raw[2], 16);
  } else if (raw.length === 4) {
    r = parseInt(raw[0] + raw[0], 16);
    g = parseInt(raw[1] + raw[1], 16);
    b = parseInt(raw[2] + raw[2], 16);
    a = parseInt(raw[3] + raw[3], 16) / 255;
  } else if (raw.length === 6) {
    r = parseInt(raw.slice(0, 2), 16);
    g = parseInt(raw.slice(2, 4), 16);
    b = parseInt(raw.slice(4, 6), 16);
  } else if (raw.length === 8) {
    r = parseInt(raw.slice(0, 2), 16);
    g = parseInt(raw.slice(2, 4), 16);
    b = parseInt(raw.slice(4, 6), 16);
    a = parseInt(raw.slice(6, 8), 16) / 255;
  } else {
    return null;
  }

  return { r, g, b, a };
}

function parseRgb(color: string): RGBA | null {
  const match = color
    .trim()
    .match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/);
  if (!match) return null;

  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1,
  };
}

/**
 * Parses a CSS color string into an RGBA object.
 * Supports: #RGB, #RGBA, #RRGGBB, #RRGGBBAA, rgb(...), rgba(...)
 * Returns null if the format is unrecognised.
 */
export function parseColor(color: string): RGBA | null {
  const trimmed = color.trim();
  if (trimmed.startsWith('#')) return parseHex(trimmed);
  if (/^rgba?/i.test(trimmed)) return parseRgb(trimmed);
  return null;
}

/**
 * Returns an `rgba(...)` color with alpha = 0.4 that is visually
 * identical to the original color composited over a white (#fff) background.
 *
 * Math:
 *   visual  = a_src * C + (1 - a_src) * 255        (composite over white)
 *   visual  = 0.75  * C' + 0.25       * 255        (target composite)
 *   C'      = (visual - 63.75) / 0.75               (solve for new channel)
 *
 * Channel values are clamped to [0, 255].
 */
export function composeAlpha(color: string, targetAlpha = 0.4): string | null {
  const rgba = parseColor(color);
  if (!rgba) return null;

  const { r, g, b, a } = rgba;
  const white = 255;

  // composite original over white to get the opaque visual colour
  const visualR = a * r + (1 - a) * white;
  const visualG = a * g + (1 - a) * white;
  const visualB = a * b + (1 - a) * white;

  // solve for new channels that reproduce the same visual at target alpha
  const clamp = (v: number) => Math.min(white, Math.max(0, Math.round(v)));
  const solve = (visual: number) => (visual - (1 - targetAlpha) * white) / targetAlpha;

  const newR = clamp(solve(visualR));
  const newG = clamp(solve(visualG));
  const newB = clamp(solve(visualB));

  return `rgba(${newR}, ${newG}, ${newB}, ${targetAlpha})`;
}
