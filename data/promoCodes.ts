import type { PromoCode } from "@/types";

/**
 * Promotion catalog.
 *
 * Built-in fallback codes. New campaigns are created in Admin → Promos and
 * live in Stripe. Booking validation prefers Stripe, then these.
 */
export const promoCodes: PromoCode[] = [
  {
    code: "WELCOME10",
    label: "10% off your first booking",
    type: "percentage",
    value: 0.1,
    firstTimeOnly: true,
    active: true,
  },
  {
    code: "REFERAFRIEND",
    label: "$25 off, referred by a friend",
    type: "fixed",
    value: 2500,
    minSubtotal: 5000,
    active: true,
  },
  {
    code: "MEETGREET",
    label: "$10 off after a meet & greet",
    type: "fixed",
    value: 1000,
    active: true,
  },
];

export function findPromoCode(input: string): PromoCode | undefined {
  const normalized = input.trim().toUpperCase();
  if (!normalized) return undefined;
  return promoCodes.find((promo) => promo.active && promo.code === normalized);
}
