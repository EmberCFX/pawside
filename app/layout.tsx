import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { MobileCta } from "@/components/layout/MobileCta";
import { Navbar } from "@/components/layout/Navbar";
import { site } from "@/data/site";
import { getProfile } from "@/lib/auth";
import { localBusinessSchema, websiteSchema } from "@/lib/seo";
import "./globals.css";

/**
 * Type pairing.
 *
 * Poppins is the display face: geometric, single-story 'a', circular bowls, and
 * the same large x-height as the drawn Pawside wordmark, so headlines and the
 * logo read as one family. Inter carries body copy, labels, and dense UI where
 * Poppins' wide geometry would cost readability.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Care for them, even when you can't be there`,
    template: `%s | ${site.name} · ${site.tagline}`,
  },
  description: site.description,
  applicationName: site.legalName,
  keywords: [
    "pet sitting",
    "dog walking",
    "drop-in pet visits",
    "overnight pet sitting",
    "cat sitting",
    "puppy care",
    `pet care ${site.homeBase.city} ${site.homeBase.state}`,
  ],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.legalName,
    title: `${site.name} — Care for them, even when you can't be there`,
    description: site.description,
    url: site.url,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — Care for them, even when you can't be there`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Care for them, even when you can't be there`,
    description: site.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#011C35" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  const firstName = profile?.full_name?.trim().split(/\s+/)[0] || "";

  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <Navbar
          signedIn={
            profile
              ? { firstName, href: profile.role === "admin" ? "/admin" : "/account" }
              : null
          }
        />
        <main id="main" className="pt-[var(--nav-height)]">
          {children}
        </main>
        <Footer />
        <MobileCta />

        <script
          type="application/ld+json"
          // Static, developer-authored JSON-LD — no user input is interpolated.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
      </body>
    </html>
  );
}
