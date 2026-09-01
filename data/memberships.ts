import type { Membership, MembershipSlug } from "@/types";

/**
 * Membership tiers drive both the pricing page and the live savings math in the
 * quote engine. `visitDiscount`, `monthlyCredit`, `waivesBookingFee`, and
 * `holidaySurchargeDiscount` are read directly by lib/pricing.ts, so a plan
 * change is a data edit, never a UI edit.
 */
export const memberships: Membership[] = [
  {
    slug: "none",
    name: "Pay as you go",
    tagline: "Book whenever you need us.",
    monthlyPrice: null,
    visitDiscount: 0,
    monthlyCredit: 0,
    waivesBookingFee: false,
    holidaySurchargeDiscount: 0,
    benefits: [
      "Standard visit pricing",
      "Book one-time or recurring visits",
      "Photo updates and visit summaries",
      "Free meet & greet",
    ],
  },
  {
    slug: "pawside-plus",
    name: "Pawside+",
    tagline: "For pets who need us regularly.",
    monthlyPrice: 2900,
    visitDiscount: 0.05,
    monthlyCredit: 0,
    waivesBookingFee: true,
    holidaySurchargeDiscount: 0.5,
    benefits: [
      "5% off every visit",
      "Priority scheduling before open booking",
      "No booking fees",
      "Half-price holiday surcharge",
      "Reschedule free up to 12 hours ahead",
      "Birthday visit treat for your pet",
    ],
    featured: true,
    badge: "Most popular",
  },
  {
    slug: "pawside-plus-premium",
    name: "Pawside+ Premium",
    tagline: "For households booking us most weeks.",
    monthlyPrice: 5900,
    visitDiscount: 0.1,
    monthlyCredit: 3200,
    waivesBookingFee: true,
    holidaySurchargeDiscount: 1,
    benefits: [
      "10% off every visit",
      "One 30-minute walk included monthly",
      "First priority on holidays and school breaks",
      "No booking fees, no holiday surcharge",
      "Free cancellation up to 4 hours ahead",
      "Member-only add-ons at cost",
      "Dedicated caregiver whenever scheduling allows",
    ],
    badge: "Best value",
  },
];

export function getMembership(slug: MembershipSlug): Membership {
  const membership = memberships.find((tier) => tier.slug === slug);
  if (!membership) {
    throw new Error(`Unknown membership tier "${slug}"`);
  }
  return membership;
}

export const paidMemberships = memberships.filter((tier) => tier.slug !== "none");

/** Prepaid visit bundles — an alternative to subscribing. */
export const visitBundles = [
  {
    slug: "walk-10",
    name: "10-Walk Bundle",
    description: "Ten 30-minute walks to use whenever you need them.",
    visits: 10,
    /** Cents. */
    price: 28800,
    regularPrice: 32000,
    expiresInMonths: 6,
  },
  {
    slug: "visit-20",
    name: "20-Visit Bundle",
    description: "Twenty 30-minute drop-ins for regular weekly coverage.",
    visits: 20,
    price: 54000,
    regularPrice: 60000,
    expiresInMonths: 9,
  },
];

/** Gift cards. Amounts in cents. */
export const giftCardAmounts = [5000, 10000, 15000, 25000];

/** Referral program. */
export const referralProgram = {
  /** Cents credited to the referrer once the friend completes a first visit. */
  referrerCredit: 2500,
  /** Cents off the friend's first booking. */
  friendCredit: 2500,
  code: "REFERAFRIEND",
};
