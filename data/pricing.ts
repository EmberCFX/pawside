import type { PricingConfig, ServiceSlug } from "@/types";

/**
 * PLACEHOLDER PRICING — set real numbers before launch.
 *
 * Single source of truth for every price on the site. All amounts are integer
 * cents. The quote engine in lib/pricing.ts reads only from this object, so
 * changing a price never requires touching a component. When a backend arrives,
 * replace this export with a fetch that returns the same shape.
 */
export const pricing: PricingConfig = {
  currency: "USD",
  services: [
    {
      slug: "dog-walking",
      startingAt: 2000,
      durations: [
        { minutes: 20, price: 2000, label: "20 min", note: "Quick potty break" },
        { minutes: 30, price: 2600, label: "30 min", note: "Most popular" },
        { minutes: 45, price: 3400, label: "45 min" },
        { minutes: 60, price: 4200, label: "60 min", note: "Best for high energy" },
      ],
      additionalPetFee: 500,
      petsIncluded: 1,
    },
    {
      slug: "pet-sitting",
      startingAt: 2800,
      durations: [
        { minutes: 30, price: 2800, label: "30 min" },
        { minutes: 45, price: 3600, label: "45 min" },
        { minutes: 60, price: 4400, label: "60 min", note: "Most popular" },
        { minutes: 90, price: 6200, label: "90 min", note: "Great for multi-pet homes" },
      ],
      additionalPetFee: 600,
      petsIncluded: 1,
    },
    {
      slug: "drop-in-visits",
      startingAt: 1900,
      durations: [
        { minutes: 20, price: 1900, label: "20 min", note: "Essentials only" },
        { minutes: 30, price: 2400, label: "30 min", note: "Most popular" },
        { minutes: 45, price: 3200, label: "45 min" },
      ],
      additionalPetFee: 500,
      petsIncluded: 1,
    },
    {
      slug: "overnight-care",
      startingAt: 11500,
      durations: [],
      additionalPetFee: 1500,
      petsIncluded: 1,
    },
    {
      slug: "puppy-care",
      startingAt: 2200,
      durations: [
        { minutes: 20, price: 2200, label: "20 min", note: "Potty trip" },
        { minutes: 30, price: 2800, label: "30 min", note: "Most popular" },
        { minutes: 45, price: 3600, label: "45 min" },
      ],
      additionalPetFee: 600,
      petsIncluded: 1,
    },
    {
      slug: "cat-care",
      startingAt: 1900,
      durations: [
        { minutes: 20, price: 1900, label: "20 min" },
        { minutes: 30, price: 2400, label: "30 min", note: "Most popular" },
        { minutes: 45, price: 3100, label: "45 min" },
        { minutes: 60, price: 3800, label: "60 min" },
      ],
      additionalPetFee: 400,
      petsIncluded: 1,
    },
  ],
  fees: {
    holidaySurcharge: 1200,
    bookingFee: 300,
    lastMinuteRate: 0.1,
    /** Pet care is untaxed in many states — confirm locally before launch. */
    taxRate: 0,
  },
  recurringDiscounts: {
    "one-time": 0,
    weekly: 0.05,
    "multi-weekly": 0.08,
    custom: 0.05,
  },
};

/** Overnight rate lives outside the duration table since it's priced per night. */
export const overnightNightlyRate = 11500;

export function getServicePricing(slug: ServiceSlug) {
  const entry = pricing.services.find((service) => service.slug === slug);
  if (!entry) {
    throw new Error(`Missing pricing configuration for service "${slug}"`);
  }
  return entry;
}

export function startingPrice(slug: ServiceSlug): number {
  return getServicePricing(slug).startingAt;
}

/**
 * Dates that carry the holiday surcharge. PLACEHOLDER LIST — extend yearly, or
 * replace with a holiday calendar service.
 */
export const holidayDates = [
  "2026-01-01",
  "2026-05-25",
  "2026-07-04",
  "2026-09-07",
  "2026-11-26",
  "2026-11-27",
  "2026-12-24",
  "2026-12-25",
  "2026-12-31",
];

export function isHolidayDate(date: string | null): boolean {
  return Boolean(date && holidayDates.includes(date));
}
