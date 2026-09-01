/**
 * Derives the Pawside color ramps from the two anchors sampled out of the logo:
 *   navy #011C35  (brand ink)
 *   mint #36CEC1  (accent)
 * Prints hex values to paste into tailwind.config.ts / globals.css.
 */

const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgbToHex = (r, g, b) =>
  "#" + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("").toUpperCase();

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  const d = max - min;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s, l];
}

function hslToHex(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let [r, g, b] = [0, 0, 0];
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

const NAVY = "#011C35";
const MINT = "#36CEC1";

const [nh, ns, nl] = rgbToHsl(...hexToRgb(NAVY));
const [mh, ms, ml] = rgbToHsl(...hexToRgb(MINT));
console.log(`navy ${NAVY} -> hsl(${nh.toFixed(1)}, ${(ns * 100).toFixed(1)}%, ${(nl * 100).toFixed(1)}%)`);
console.log(`mint ${MINT} -> hsl(${mh.toFixed(1)}, ${(ms * 100).toFixed(1)}%, ${(ml * 100).toFixed(1)}%)\n`);

/**
 * Light steps crush saturation so tints read as paper and ink, not sky-blue
 * SaaS chrome. Dark steps hold the logo hue. Mid steps stay slate.
 */
function ramp(hue, anchorSat, steps) {
  const out = {};
  for (const [key, { l, s }] of Object.entries(steps)) {
    out[key] = hslToHex(hue, anchorSat * s, l);
  }
  return out;
}

const navy = ramp(nh, ns, {
  50: { l: 0.962, s: 0.05 },
  100: { l: 0.918, s: 0.07 },
  200: { l: 0.84, s: 0.09 },
  300: { l: 0.72, s: 0.11 },
  400: { l: 0.54, s: 0.16 },
  500: { l: 0.4, s: 0.28 },
  600: { l: 0.3, s: 0.48 },
  700: { l: 0.22, s: 0.72 },
  800: { l: 0.155, s: 0.9 },
  900: { l: nl, s: 1 },
  950: { l: 0.06, s: 1 },
});

const mint = ramp(mh, ms, {
  50: { l: 0.965, s: 0.5 },
  100: { l: 0.925, s: 0.62 },
  200: { l: 0.855, s: 0.72 },
  300: { l: 0.76, s: 0.82 },
  400: { l: 0.63, s: 0.92 },
  500: { l: ml, s: 1 },
  600: { l: 0.42, s: 1 },
  700: { l: 0.33, s: 1 },
  800: { l: 0.25, s: 0.98 },
  900: { l: 0.19, s: 0.94 },
  950: { l: 0.11, s: 0.92 },
});

// Warm-neutral grays: a whisper of the navy hue keeps them from feeling clinical.
const sand = ramp(nh - 10, 0.14, {
  50: { l: 0.985, s: 0.5 },
  100: { l: 0.965, s: 0.7 },
  200: { l: 0.93, s: 0.85 },
  300: { l: 0.87, s: 1 },
  400: { l: 0.72, s: 1 },
  500: { l: 0.57, s: 1 },
  600: { l: 0.45, s: 1.1 },
  700: { l: 0.35, s: 1.2 },
  800: { l: 0.25, s: 1.3 },
  900: { l: 0.16, s: 1.4 },
  950: { l: 0.09, s: 1.5 },
});

const show = (name, r) => {
  console.log(`${name}: {`);
  for (const [k, v] of Object.entries(r)) console.log(`  ${k}: "${v}",`);
  console.log("},");
};
show("navy", navy);
show("mint", mint);
show("sand", sand);
