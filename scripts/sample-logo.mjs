/** Point/region sampler used to confirm the true brand hexes from the logo export. */
import fs from "node:fs";
import { PNG } from "pngjs";

const png = PNG.sync.read(fs.readFileSync(process.argv[2]));
const { width, height, data } = png;
const at = (x, y) => {
  const i = (width * y + x) << 2;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
};
const hex = (r, g, b) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

console.log(`size ${width}x${height}`);
console.log("corners (export background):");
for (const [x, y] of [[2, 2], [width - 3, 2], [2, height - 3], [width - 3, height - 3]]) {
  const [r, g, b] = at(x, y);
  console.log(`  (${x},${y}) ${hex(r, g, b)}`);
}

// Brightest pixels within each hue family: thick stroke interiors are unaffected by
// anti-aliasing against the black backdrop, so the peak is the true brand color.
let navy = null;
let mint = null;
const navyHist = new Map();
const mintHist = new Map();
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const [r, g, b, a] = at(x, y);
    if (a < 250) continue;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < 20) continue;
    const mintish = g > 100 && g - r > 40 && b > 80;
    const key = hex(r, g, b);
    if (mintish) {
      mintHist.set(key, (mintHist.get(key) ?? 0) + 1);
      if (!mint || lum > mint.lum) mint = { hex: key, lum };
    } else if (b >= r && b < 170 && r < 110) {
      navyHist.set(key, (navyHist.get(key) ?? 0) + 1);
      if (!navy || lum > navy.lum) navy = { hex: key, lum };
    }
  }
}

const top = (m, n = 8) =>
  [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

console.log("\nmost common navy-family pixels:");
for (const [h, n] of top(navyHist)) console.log(`  ${h}  ${n} px`);
console.log("brightest navy pixel:", navy?.hex);

console.log("\nmost common mint-family pixels:");
for (const [h, n] of top(mintHist)) console.log(`  ${h}  ${n} px`);
console.log("brightest mint pixel:", mint?.hex);

// Horizontal scan across the wordmark band and the heart arcs.
const scan = (label, y) => {
  const seen = new Map();
  for (let x = 0; x < width; x++) {
    const [r, g, b, a] = at(x, y);
    if (a < 250) continue;
    const key = hex(r, g, b);
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  console.log(`\n${label} (y=${y}):`);
  for (const [h, n] of top(seen, 5)) console.log(`  ${h}  ${n} px`);
};
scan("wordmark band", Math.round(height * 0.75));
scan("heart arc band", Math.round(height * 0.12));
