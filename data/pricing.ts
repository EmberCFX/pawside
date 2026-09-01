import type { PricingConfig, ServiceSlug } from "@/types";

/**
 * Live rates. All amounts are integer cents. The quote engine in
 * lib/pricing.ts reads only from this object.
 *
 * Benchmarked August 2026 against Pioneer Valley and MA professional shops
 * (not Care.com / Rover gig rates): Sarah’s Pet Services in Northampton
 * ($29 / 30-min walk, $44+ hour hikes, $30 cat visits, $100 / 12-hr overnight),
 * Paw Maw & Claw ($25 drop-ins, $80–$125 in-home overnight), Pioneer Valley
 * Dogs ($45 / 40 min, $70 / 60 min enrichment), and the 2026 MA walk average
 * of $29 / 30 min (typical range $20–$46). Pawside sits just above the local
 * professional floor and below specialty hike pricing.
 */
export const pricing: PricingConfig = {
  currency: "USD",
  services: [
    {
      slug: "dog-walking",
      startingAt: 2500,
      durations: [
        { minutes: 20, price: 2500, label: "20 min", note: "Quick potty break" },
        { minutes: 30, price: 3200, label: "30 min", note: "Most popular" },
        { minutes: 45, price: 4200, label: "45 min" },
        { minutes: 60, price: 5200, label: "60 min", note: "Best for high energy" },
      ],
      additionalPetFee: 800,
      petsIncluded: 1,
    },
    {
      slug: "pet-sitting",
      startingAt: 3400,
      durations: [
        { minutes: 30, price: 3400, label: "30 min" },
        { minutes: 45, price: 4400, label: "45 min" },
        { minutes: 60, price: 5400, label: "60 min", note: "Most popular" },
        { minutes: 90, price: 7400, label: "90 min", note: "Great for multi-pet homes" },
      ],
      additionalPetFee: 1000,
      petsIncluded: 1,
    },
    {
      slug: "drop-in-visits",
      startingAt: 2500,
      durations: [
        { minutes: 20, price: 2500, label: "20 min", note: "Essentials only" },
        { minutes: 30, price: 3000, label: "30 min", note: "Most popular" },
        { minutes: 45, price: 4000, label: "45 min" },
      ],
      additionalPetFee: 800,
      petsIncluded: 1,
    },
    {
      slug: "overnight-care",
      startingAt: 14500,
      durations: [],
      additionalPetFee: 2000,
      petsIncluded: 1,
    },
    {
      slug: "puppy-care",
      startingAt: 2800,
      durations: [
        { minutes: 20, price: 2800, label: "20 min", note: "Potty trip" },
        { minutes: 30, price: 3600, label: "30 min", note: "Most popular" },
        { minutes: 45, price: 4600, label: "45 min" },
      ],
      additionalPetFee: 1000,
      petsIncluded: 1,
    },
    {
      slug: "cat-care",
      startingAt: 2500,
      durations: [
        { minutes: 20, price: 2500, label: "20 min" },
        { minutes: 30, price: 3000, label: "30 min", note: "Most popular" },
        { minutes: 45, price: 3800, label: "45 min" },
        { minutes: 60, price: 4600, label: "60 min" },
      ],
      additionalPetFee: 700,
      petsIncluded: 1,
    },
    {
      slug: "grooming",
      startingAt: 4500,
      durations: [
        { minutes: 30, price: 4500, label: "30 min", note: "Nails and tidy" },
        { minutes: 45, price: 6500, label: "45 min", note: "Bath" },
        { minutes: 60, price: 8000, label: "60 min", note: "Most popular" },
        { minutes: 90, price: 10500, label: "90 min", note: "Full tidy-up" },
      ],
      additionalPetFee: 2500,
      petsIncluded: 1,
    },
    {
      slug: "pet-transportation",
      startingAt: 3500,
      durations: [
        { minutes: 30, price: 3500, label: "30 min", note: "Local trip" },
        { minutes: 45, price: 4800, label: "45 min" },
        { minutes: 60, price: 6200, label: "60 min", note: "Longer haul" },
      ],
      additionalPetFee: 1000,
      petsIncluded: 1,
    },
    {
      slug: "adventure-outings",
      startingAt: 5800,
      durations: [
        { minutes: 60, price: 5800, label: "60 min", note: "Most popular" },
        { minutes: 90, price: 7800, label: "90 min" },
        { minutes: 120, price: 9800, label: "120 min", note: "Big mileage day" },
      ],
      additionalPetFee: 1500,
      petsIncluded: 1,
    },
  ],
  fees: {
    holidaySurcharge: 1800,
    bookingFee: 500,
    lastMinuteRate: 0.1,
    /** Pet care is untaxed in many states — confirm locally if that changes. */
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
export const overnightNightlyRate = 14500;

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
 * Dates that carry the holiday surcharge. Extend yearly, or replace with a
 * holiday calendar service.
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
