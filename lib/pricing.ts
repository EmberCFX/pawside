import { getAddOn } from "@/data/addOns";
import { getMembership, memberships } from "@/data/memberships";
import { getServicePricing, isHolidayDate, overnightNightlyRate, pricing } from "@/data/pricing";
import { findPromoCode } from "@/data/promoCodes";
import { getService } from "@/data/services";
import type {
  AddOnSlug,
  DurationMinutes,
  MembershipSlug,
  Quote,
  QuoteLine,
  RecurringFrequency,
  ServiceSlug,
} from "@/types";

/**
 * The single quote engine.
 *
 * Both the homepage estimator and the multi-step booking flow call `buildQuote`,
 * so a marketing estimate and a checkout total can never disagree. All math is
 * in integer cents and every rate is read from data/pricing.ts,
 * data/memberships.ts, or data/promoCodes.ts — nothing is hardcoded here.
 *
 * Backend note: this function is pure and framework-free, so the same file can
 * be imported by an API route or a server action to re-price a booking
 * server-side before charging. Never trust a client-supplied total.
 */
export interface QuoteInput {
  serviceSlug: ServiceSlug | null;
  durationMinutes: DurationMinutes | null;
  /** Number of pets on the booking. */
  petCount: number;
  addOnSlugs: AddOnSlug[];
  frequency: RecurringFrequency;
  /** Selected weekdays for weekly / multi-weekly schedules (0 = Sunday). */
  weekdays?: number[];
  membership: MembershipSlug;
  /** ISO date, used for the holiday surcharge. */
  date?: string | null;
  /** Hours of notice before the visit; drives the short-notice fee. */
  noticeHours?: number;
  promoCode?: string;
  /** First-time customers unlock `firstTimeOnly` promos. */
  isFirstBooking?: boolean;
}

/** Average weeks per month, so recurring math isn't off by a visit. */
const WEEKS_PER_MONTH = 4.333;

const emptyQuote: Quote = {
  lines: [],
  subtotal: 0,
  discountTotal: 0,
  feeTotal: 0,
  tax: 0,
  total: 0,
  membershipSavings: 0,
  potentialMembershipSavings: 0,
  perVisitTotal: 0,
  visitsPerMonth: 1,
};

export function basePriceFor(
  serviceSlug: ServiceSlug,
  durationMinutes: DurationMinutes | null,
): number {
  const service = getService(serviceSlug);
  const servicePricing = getServicePricing(serviceSlug);

  if (service?.pricingUnit === "night") {
    return overnightNightlyRate;
  }

  const match = servicePricing.durations.find((entry) => entry.minutes === durationMinutes);
  return match?.price ?? servicePricing.startingAt;
}

export function visitsPerMonthFor(frequency: RecurringFrequency, weekdays: number[] = []): number {
  switch (frequency) {
    case "one-time":
      return 1;
    case "weekly":
      return Math.round(WEEKS_PER_MONTH);
    case "multi-weekly":
      return Math.round(Math.max(weekdays.length, 2) * WEEKS_PER_MONTH);
    case "custom":
      return Math.max(1, Math.round(Math.max(weekdays.length, 1) * WEEKS_PER_MONTH));
    default:
      return 1;
  }
}

export function buildQuote(input: QuoteInput): Quote {
  const {
    serviceSlug,
    durationMinutes,
    petCount,
    addOnSlugs,
    frequency,
    weekdays = [],
    membership: membershipSlug,
    date = null,
    noticeHours,
    promoCode,
    isFirstBooking = true,
  } = input;

  if (!serviceSlug) return emptyQuote;

  const service = getService(serviceSlug);
  const servicePricing = getServicePricing(serviceSlug);
  const membership = getMembership(membershipSlug);
  const isOvernight = service?.pricingUnit === "night";
  const unitLabel = isOvernight ? "night" : "visit";

  const lines: QuoteLine[] = [];

  /* Base rate ---------------------------------------------------------- */
  const base = basePriceFor(serviceSlug, durationMinutes);
  lines.push({
    id: "base",
    label: service?.name ?? "Visit",
    detail: isOvernight
      ? "Per night · 12 hours of coverage"
      : `${durationMinutes ?? servicePricing.durations[0]?.minutes ?? 30} minutes`,
    amount: base,
    kind: "base",
  });

  /* Additional pets ---------------------------------------------------- */
  const extraPets = Math.max(0, petCount - servicePricing.petsIncluded);
  const petFees = extraPets * servicePricing.additionalPetFee;
  if (petFees > 0) {
    lines.push({
      id: "pets",
      label: `Additional ${extraPets === 1 ? "pet" : "pets"}`,
      detail: `${extraPets} × ${(servicePricing.additionalPetFee / 100).toFixed(2)} per ${unitLabel}`,
      amount: petFees,
      kind: "pets",
    });
  }

  /* Add-ons ------------------------------------------------------------ */
  let addOnTotal = 0;
  for (const slug of addOnSlugs) {
    const addOn = getAddOn(slug);
    if (!addOn || addOn.comingSoon) continue;
    const quantity = addOn.perPet ? Math.max(1, petCount) : 1;
    const amount = addOn.price * quantity;
    addOnTotal += amount;
    lines.push({
      id: `addon-${slug}`,
      label: addOn.name,
      detail: addOn.perPet && quantity > 1 ? `${quantity} pets` : undefined,
      amount,
      kind: "addon",
    });
  }

  const careSubtotal = base + petFees + addOnTotal;

  /* Discounts ---------------------------------------------------------- */
  let discountTotal = 0;

  const recurringRate = pricing.recurringDiscounts[frequency] ?? 0;
  const recurringDiscount = Math.round(careSubtotal * recurringRate);
  if (recurringDiscount > 0) {
    discountTotal += recurringDiscount;
    lines.push({
      id: "recurring",
      label: "Recurring schedule discount",
      detail: `${Math.round(recurringRate * 100)}% off every visit`,
      amount: -recurringDiscount,
      kind: "discount",
    });
  }

  const membershipSavings = Math.round(careSubtotal * membership.visitDiscount);
  if (membershipSavings > 0) {
    discountTotal += membershipSavings;
    lines.push({
      id: "membership",
      label: `${membership.name} savings`,
      detail: `${Math.round(membership.visitDiscount * 100)}% member discount`,
      amount: -membershipSavings,
      kind: "discount",
    });
  }

  /* Fees --------------------------------------------------------------- */
  let feeTotal = 0;

  if (isHolidayDate(date)) {
    const gross = pricing.fees.holidaySurcharge;
    const surcharge = Math.round(gross * (1 - membership.holidaySurchargeDiscount));
    if (surcharge > 0) {
      feeTotal += surcharge;
      lines.push({
        id: "holiday",
        label: "Holiday surcharge",
        detail: membership.holidaySurchargeDiscount
          ? `${Math.round(membership.holidaySurchargeDiscount * 100)}% off as a member`
          : "Major holiday",
        amount: surcharge,
        kind: "fee",
      });
    }
  }

  if (
    typeof noticeHours === "number" &&
    noticeHours < 12 &&
    pricing.fees.lastMinuteRate > 0
  ) {
    const lastMinuteFee = Math.round(base * pricing.fees.lastMinuteRate);
    feeTotal += lastMinuteFee;
    lines.push({
      id: "short-notice",
      label: "Short-notice request",
      detail: "Booked within 12 hours",
      amount: lastMinuteFee,
      kind: "fee",
    });
  }

  const bookingFee =
    frequency === "one-time" && !membership.waivesBookingFee ? pricing.fees.bookingFee : 0;
  if (bookingFee > 0) {
    feeTotal += bookingFee;
    lines.push({
      id: "booking-fee",
      label: "Booking fee",
      detail: "Waived for Pawside+ members",
      amount: bookingFee,
      kind: "fee",
    });
  }

  /* Promo code -------------------------------------------------------- */
  const promo = promoCode ? findPromoCode(promoCode) : undefined;
  if (promo) {
    const eligible =
      (!promo.minSubtotal || careSubtotal >= promo.minSubtotal) &&
      (!promo.appliesTo || promo.appliesTo.includes(serviceSlug)) &&
      (!promo.firstTimeOnly || isFirstBooking);

    if (eligible) {
      const promoAmount =
        promo.type === "percentage"
          ? Math.round(careSubtotal * promo.value)
          : Math.min(promo.value, careSubtotal);
      if (promoAmount > 0) {
        discountTotal += promoAmount;
        lines.push({
          id: "promo",
          label: `Promo ${promo.code}`,
          detail: promo.label,
          amount: -promoAmount,
          kind: "discount",
        });
      }
    }
  }

  /* Totals ------------------------------------------------------------ */
  const preTax = Math.max(0, careSubtotal - discountTotal + feeTotal);
  const tax = Math.round(preTax * pricing.fees.taxRate);
  if (tax > 0) {
    lines.push({ id: "tax", label: "Tax", amount: tax, kind: "tax" });
  }

  const total = preTax + tax;

  /* What joining Pawside+ would save on this same booking -------------- */
  const potentialMembershipSavings =
    membershipSlug === "none" ? estimateMembershipUpside(careSubtotal, frequency) : 0;

  return {
    lines,
    subtotal: careSubtotal,
    discountTotal,
    feeTotal,
    tax,
    total,
    membershipSavings,
    potentialMembershipSavings,
    perVisitTotal: total,
    visitsPerMonth: visitsPerMonthFor(frequency, weekdays),
  };
}

/** Monthly savings a Pawside+ member would see at this booking's cadence. */
function estimateMembershipUpside(careSubtotal: number, frequency: RecurringFrequency): number {
  const plus = getMembership("pawside-plus");
  const perVisit =
    Math.round(careSubtotal * plus.visitDiscount) +
    (frequency === "one-time" && plus.waivesBookingFee ? pricing.fees.bookingFee : 0);
  return perVisit;
}

/**
 * Membership break-even math for the "does Pawside+ pay for itself?" calculator.
 * Returns the monthly picture for a given cadence and visit price.
 */
export interface MembershipComparison {
  slug: MembershipSlug;
  name: string;
  monthlyPrice: number;
  /** Cents saved on visits before the subscription cost. */
  grossMonthlySavings: number;
  /** Savings minus the subscription cost. Negative means it isn't worth it yet. */
  netMonthlySavings: number;
  /** Visits per month required to break even. */
  breakEvenVisits: number | null;
  worthIt: boolean;
}

export function compareMemberships(
  visitPrice: number,
  visitsPerMonth: number,
): MembershipComparison[] {
  return memberships
    .filter((tier) => tier.slug !== "none")
    .map((tier) => {
      const monthlyPrice = tier.monthlyPrice ?? 0;
      const perVisitSaving =
        Math.round(visitPrice * tier.visitDiscount) +
        (tier.waivesBookingFee ? pricing.fees.bookingFee : 0);
      const grossMonthlySavings = perVisitSaving * visitsPerMonth + tier.monthlyCredit;
      const netMonthlySavings = grossMonthlySavings - monthlyPrice;
      const breakEvenVisits =
        perVisitSaving > 0
          ? Math.max(1, Math.ceil((monthlyPrice - tier.monthlyCredit) / perVisitSaving))
          : null;

      return {
        slug: tier.slug,
        name: tier.name,
        monthlyPrice,
        grossMonthlySavings,
        netMonthlySavings,
        breakEvenVisits,
        worthIt: netMonthlySavings > 0,
      };
    });
}
