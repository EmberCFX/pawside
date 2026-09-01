import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // An unrelated lockfile above this directory makes Next guess the wrong root.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    // WebP only. AVIF from the optimizer can fail to decode in Chromium,
    // and HTMLImageElement.decode() then rejects with the DOM Event —
    // Next's overlay shows that as "[object Event]".
    formats: ["image/webp"],
    // Photography slots live in data/media.ts. Real photos can be dropped in as
    // local files under /public/photos or as remote URLs from any host below.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  async redirects() {
    return [
      { source: "/booking", destination: "/book", permanent: true },
      { source: "/services/overnight", destination: "/services/overnight-care", permanent: true },
    ];
  },
};

export default nextConfig;
