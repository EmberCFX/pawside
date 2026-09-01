/**
 * Business-wide configuration.
 *
 * Phone, email, site URL, and social links feed the footer, contact page,
 * booking confirmation, and the LocalBusiness structured data in lib/seo.ts.
 */
export const site = {
  name: "Pawside",
  legalName: "Pawside Pet Services",
  tagline: "Pet Services",
  description:
    "Trusted pet sitting, dog walking, and drop-in visits from a local caregiver who treats your pets like their own.",
  /** Set NEXT_PUBLIC_SITE_URL in production; used for canonical URLs and schema. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pawside.co",
  contact: {
    phone: "(413) 213-3973",
    phoneHref: "tel:+14132133973",
    email: "hello@pawside.co",
    responseTime: "Most messages answered within a few hours",
  },
  homeBase: {
    /** Street address is intentionally omitted — Pawside serves clients in their homes. */
    city: "Easthampton",
    state: "MA",
    stateName: "Massachusetts",
    postalCode: "01027",
    region: "the Pioneer Valley",
    latitude: 42.2668,
    longitude: -72.6687,
    /** Miles from home base that Pawside will travel. */
    serviceRadiusMiles: 15,
  },
  hours: [
    { days: "Monday – Friday", hours: "7:00 AM – 8:00 PM" },
    { days: "Saturday", hours: "8:00 AM – 7:00 PM" },
    { days: "Sunday", hours: "8:00 AM – 6:00 PM" },
    { days: "Overnight care", hours: "By arrangement, year-round" },
  ],
  /** Machine-readable hours for LocalBusiness schema. */
  openingHoursSpec: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "20:00" },
    { days: ["Saturday"], opens: "08:00", closes: "19:00" },
    { days: ["Sunday"], opens: "08:00", closes: "18:00" },
  ],
  /**
   * Only live profiles. Instagram / Facebook: add `{ name, href, handle }` here
   * once real accounts exist — do not invent handles or placeholder URLs.
   */
  social: [{ name: "TikTok", href: "https://www.tiktok.com/@pawside", handle: "@pawside" }],
  /** Trust markers shown near primary CTAs. */
  trustPoints: [
    "Insured & bonded",
    "Personalized care plans",
    "Photo updates every visit",
    "Flexible scheduling",
  ],
  policies: {
    cancellationWindowHours: 24,
    lastMinuteNoticeHours: 12,
    meetAndGreet: "Free meet & greet before your first visit",
  },
} as const;

export type Site = typeof site;
