/**
 * Dev-only visual check. Captures full-page screenshots and audits the
 * service-area map's SVG label boxes for overlap and clipping.
 *
 *   node scripts/shoot.mjs        (dev server must be running on :3000)
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const OUT = path.resolve("screenshots");
const BASE = "http://localhost:3000";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Scroll the whole page so lazy images and reveal animations settle. */
async function settle(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await sleep(700);
}

async function auditMap(page, label) {
  return page.evaluate((label) => {
    const svg = [...document.querySelectorAll("svg")].find(
      (s) => (s.getAttribute("aria-label") || "").startsWith("Map of"),
    );
    if (!svg) return { label, found: false };

    const frame = svg.getBoundingClientRect();
    const texts = [...svg.querySelectorAll("text")].map((t) => {
      const r = t.getBoundingClientRect();
      return { text: t.textContent.trim(), x: r.x, y: r.y, w: r.width, h: r.height };
    });

    const clipped = [];
    for (const t of texts) {
      const over = [];
      if (t.x < frame.x) over.push(`left by ${(frame.x - t.x).toFixed(0)}px`);
      if (t.y < frame.y) over.push(`top by ${(frame.y - t.y).toFixed(0)}px`);
      if (t.x + t.w > frame.right) over.push(`right by ${(t.x + t.w - frame.right).toFixed(0)}px`);
      if (t.y + t.h > frame.bottom) over.push(`bottom by ${(t.y + t.h - frame.bottom).toFixed(0)}px`);
      if (over.length) clipped.push(`"${t.text}" clipped ${over.join(", ")}`);
    }

    const overlaps = [];
    for (let i = 0; i < texts.length; i += 1) {
      for (let j = i + 1; j < texts.length; j += 1) {
        const a = texts[i];
        const b = texts[j];
        const hit =
          a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
        if (hit) overlaps.push(`"${a.text}" x "${b.text}"`);
      }
    }

    return {
      label,
      found: true,
      frame: `${frame.width.toFixed(0)}x${frame.height.toFixed(0)}`,
      labels: texts.map((t) => t.text),
      clipped,
      overlaps,
    };
  }, label);
}

async function auditImages(page) {
  return page.evaluate(() => {
    const out = { broken: [], placeholders: 0, real: 0 };
    for (const img of document.querySelectorAll("img")) {
      if (!img.complete || img.naturalWidth === 0) {
        out.broken.push(img.getAttribute("src") || "(no src)");
      }
    }
    // Placeholder slots render a div[role=img] instead of an <img>.
    out.placeholders = document.querySelectorAll('div[role="img"]').length;
    out.real = document.querySelectorAll('img[src*="/photos/"], img[src*="_next/image"]').length;
    return out;
  });
}

const shots = [
  { url: "/", name: "homepage", w: 1440 },
  { url: "/locations", name: "locations", w: 1440 },
  { url: "/about", name: "about", w: 1440 },
  { url: "/services/dog-walking", name: "dog-walking", w: 1440 },
  { url: "/book", name: "book", w: 1440 },
  { url: "/account", name: "account", w: 1440 },
  { url: "/", name: "homepage-mobile", w: 390 },
  { url: "/locations", name: "locations-mobile", w: 390 },
];

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await mkdir(OUT, { recursive: true });

const report = [];

for (const shot of shots) {
  await page.setViewport({ width: shot.w, height: shot.w === 390 ? 844 : 900, deviceScaleFactor: 1 });
  await page.goto(BASE + shot.url, { waitUntil: "networkidle2", timeout: 60000 });
  await settle(page);

  const file = path.join(OUT, `${shot.name}.png`);
  await page.screenshot({ path: file, fullPage: true });

  const images = await auditImages(page);
  const entry = { shot: `${shot.name} (${shot.w}px)`, file, images };
  if (shot.url === "/" || shot.url === "/locations") {
    entry.map = await auditMap(page, shot.name);
  }
  report.push(entry);
  console.log(`captured ${file}`);
}

await browser.close();

console.log("\n================ REPORT ================");
for (const r of report) {
  console.log(`\n## ${r.shot}`);
  console.log(`   images: ${r.images.real} real, ${r.images.placeholders} placeholder div(s)`);
  if (r.images.broken.length) console.log(`   BROKEN: ${r.images.broken.join(", ")}`);
  if (r.map) {
    if (!r.map.found) {
      console.log("   MAP: not found");
    } else {
      console.log(`   MAP frame ${r.map.frame}, ${r.map.labels.length} labels`);
      console.log(`   MAP overlaps: ${r.map.overlaps.length ? r.map.overlaps.join(" | ") : "none"}`);
      console.log(`   MAP clipped:  ${r.map.clipped.length ? r.map.clipped.join(" | ") : "none"}`);
    }
  }
}
console.log("\n========================================");
