/**
 * Brand asset pipeline.
 *
 * Reads the master Pawside logo PNG (black-background export), samples the true
 * brand colors, and emits transparent-background assets used by the site:
 *
 *   public/brand/pawside-logo.png        full lockup, transparent
 *   public/brand/pawside-logo-light.png  full lockup recolored for light surfaces
 *   public/brand/pawside-mark.png        heart + dog/cat mark only, transparent
 *   app/icon.png                         512px favicon — white + mint on transparent
 *   app/apple-icon.png                   180px apple touch icon on navy
 *
 * Run: node scripts/process-logo.mjs <source.png>
 */
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const SOURCE = process.argv[2];
if (!SOURCE) {
  console.error("usage: node scripts/process-logo.mjs <source.png>");
  process.exit(1);
}

const root = process.cwd();
const brandDir = path.join(root, "public", "brand");
fs.mkdirSync(brandDir, { recursive: true });

const png = PNG.sync.read(fs.readFileSync(SOURCE));
const { width, height, data } = png;
console.log(`source: ${width}x${height}`);

const idx = (x, y) => (width * y + x) << 2;
const hex = (r, g, b) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

/* ------------------------------------------------------------------ *
 * 1. Color sampling
 * ------------------------------------------------------------------ */

// Bucket every sufficiently-opaque, non-background pixel by quantized color.
const buckets = new Map();
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = idx(x, y);
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 200) continue;
    const max = Math.max(r, g, b);
    if (max < 24) continue; // black export background
    const key = `${r >> 3}:${g >> 3}:${b >> 3}`;
    const bucket = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    bucket.n++;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    buckets.set(key, bucket);
  }
}

const ranked = [...buckets.values()]
  .map((b) => ({
    n: b.n,
    r: Math.round(b.r / b.n),
    g: Math.round(b.g / b.n),
    bl: Math.round(b.b / b.n),
  }))
  .sort((a, b) => b.n - a.n);

const isMint = (c) => c.g > 120 && c.g - c.r > 40 && c.bl > 100;
const isNavy = (c) => c.bl > c.r && c.bl < 140 && c.r < 90 && c.g < 110 && c.bl > 30;

const topMint = ranked.filter(isMint)[0];
const topNavy = ranked.filter(isNavy)[0];

console.log("\ntop 12 colors by pixel count:");
for (const c of ranked.slice(0, 12)) {
  console.log(`  ${hex(c.r, c.g, c.bl)}  ${c.n} px`);
}
console.log("\nSAMPLED_NAVY =", topNavy ? hex(topNavy.r, topNavy.g, topNavy.bl) : "n/a");
console.log("SAMPLED_MINT =", topMint ? hex(topMint.r, topMint.g, topMint.bl) : "n/a");

/* ------------------------------------------------------------------ *
 * 2. Transparent-background lockup
 * ------------------------------------------------------------------ */

// Brand anchors sampled from this very export (see scripts/sample-logo.mjs).
const NAVY = [1, 28, 53];
const MINT = [54, 206, 193];
const lumOf = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;
const NAVY_LUM = lumOf(NAVY);
const MINT_LUM = lumOf(MINT);

/**
 * The export composites the artwork over pure black, so each pixel is
 * `brandColor * coverage`. Recovering coverage as alpha — instead of treating
 * luminance as alpha — is what keeps the near-black navy from washing out:
 * every artwork pixel is re-stamped with its exact brand hex and only the
 * alpha channel carries the anti-aliasing.
 */
function keyOutBlack(src, { navyColor = NAVY, mintColor = MINT } = {}) {
  const out = new PNG({ width: src.width, height: src.height });
  for (let i = 0; i < src.data.length; i += 4) {
    const r = src.data[i];
    const g = src.data[i + 1];
    const b = src.data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // Mint has a dominant green channel at every coverage level; navy does not.
    const mintish = g - r > 12 && g >= b;
    const [color, refLum] = mintish ? [mintColor, MINT_LUM] : [navyColor, NAVY_LUM];

    let alpha = Math.round((lum / refLum) * 255);
    if (alpha < 18) alpha = 0; // discard export noise instead of a grey haze
    if (alpha > 255) alpha = 255;

    out.data[i] = color[0];
    out.data[i + 1] = color[1];
    out.data[i + 2] = color[2];
    out.data[i + 3] = alpha;
  }
  return out;
}

/** Trim fully-transparent rows/columns. */
function trim(src, pad = 0) {
  let minX = src.width;
  let minY = src.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      if (src.data[((src.width * y + x) << 2) + 3] > 6) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(src.width - 1, maxX + pad);
  maxY = Math.min(src.height - 1, maxY + pad);
  return crop(src, minX, minY, maxX - minX + 1, maxY - minY + 1);
}

function crop(src, x0, y0, w, h) {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = ((src.width * (y0 + y) + (x0 + x)) << 2);
      const d = ((w * y + x) << 2);
      out.data[d] = src.data[s];
      out.data[d + 1] = src.data[s + 1];
      out.data[d + 2] = src.data[s + 2];
      out.data[d + 3] = src.data[s + 3];
    }
  }
  return out;
}

/** Box-filter downscale, alpha-weighted so transparent pixels don't darken edges. */
function resize(src, w, h) {
  const out = new PNG({ width: w, height: h });
  const sx = src.width / w;
  const sy = src.height / h;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const x0 = Math.floor(x * sx);
      const x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx));
      const y0 = Math.floor(y * sy);
      const y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let yy = y0; yy < y1 && yy < src.height; yy++) {
        for (let xx = x0; xx < x1 && xx < src.width; xx++) {
          const i = (src.width * yy + xx) << 2;
          const al = src.data[i + 3];
          r += src.data[i] * al;
          g += src.data[i + 1] * al;
          b += src.data[i + 2] * al;
          a += al;
          n++;
        }
      }
      const d = (w * y + x) << 2;
      out.data[d] = a ? Math.round(r / a) : 0;
      out.data[d + 1] = a ? Math.round(g / a) : 0;
      out.data[d + 2] = a ? Math.round(b / a) : 0;
      out.data[d + 3] = Math.round(a / n);
    }
  }
  return out;
}

/** Flatten onto an opaque background (for the apple touch icon). */
function flatten(src, [br, bg, bb]) {
  const out = new PNG({ width: src.width, height: src.height });
  for (let i = 0; i < src.data.length; i += 4) {
    const a = src.data[i + 3] / 255;
    out.data[i] = Math.round(src.data[i] * a + br * (1 - a));
    out.data[i + 1] = Math.round(src.data[i + 1] * a + bg * (1 - a));
    out.data[i + 2] = Math.round(src.data[i + 2] * a + bb * (1 - a));
    out.data[i + 3] = 255;
  }
  return out;
}

/** Center artwork inside a square canvas with padding. */
function square(src, size, padRatio = 0.08) {
  const inner = Math.round(size * (1 - padRatio * 2));
  const scale = Math.min(inner / src.width, inner / src.height);
  const w = Math.max(1, Math.round(src.width * scale));
  const h = Math.max(1, Math.round(src.height * scale));
  const scaled = resize(src, w, h);
  const out = new PNG({ width: size, height: size });
  out.data.fill(0);
  const ox = Math.round((size - w) / 2);
  const oy = Math.round((size - h) / 2);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = (w * y + x) << 2;
      const d = (size * (oy + y) + (ox + x)) << 2;
      out.data[d] = scaled.data[s];
      out.data[d + 1] = scaled.data[s + 1];
      out.data[d + 2] = scaled.data[s + 2];
      out.data[d + 3] = scaled.data[s + 3];
    }
  }
  return out;
}

const write = (p, img) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, PNG.sync.write(img));
  console.log(`wrote ${path.relative(root, p)}  ${img.width}x${img.height}`);
};

console.log("");

const ON_DARK_INK = [244, 247, 250]; // navy-50

// Full lockup, transparent. Navy linework survives on off-white surfaces.
const keyed = keyOutBlack(png);
write(path.join(brandDir, "pawside-logo.png"), trim(keyed, 8));

// Dark-surface variant: navy linework lifted to off-white so it reads on navy.
const keyedOnDark = keyOutBlack(png, { navyColor: ON_DARK_INK });
write(path.join(brandDir, "pawside-logo-on-dark.png"), trim(keyedOnDark, 8));

// Mark only — the wordmark's paw accent begins just past 61% of the export height.
const MARK_CUT = Math.round(height * 0.615);
const mark = trim(crop(keyed, 0, 0, width, MARK_CUT), 6);
write(path.join(brandDir, "pawside-mark.png"), mark);

const markOnDark = trim(crop(keyedOnDark, 0, 0, width, MARK_CUT), 6);
write(path.join(brandDir, "pawside-mark-on-dark.png"), markOnDark);

// Favicon: white + mint on transparent so it stays visible on dark browser tabs.
write(path.join(root, "app", "icon.png"), square(markOnDark, 512, 0.06));
write(
  path.join(root, "app", "apple-icon.png"),
  flatten(square(markOnDark, 180, 0.12), [14, 42, 71]),
);
