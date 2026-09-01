import type { PromoCode } from "@/types";

/**
 * Promotion catalog.
 *
 * DEMO CODES ONLY — these exist so the booking flow can demonstrate the promo
 * architecture end to end. Before launch, either replace them with real
 * campaigns or move validation server-side (see app/api/promo/route.ts) so codes
 * can't be enumerated from the client bundle.
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
    label: "$20 off, referred by a friend",
    type: "fixed",
    value: 2000,
    minSubtotal: 4000,
    active: true,
  },
  {
    code: "MEETGREET",
    label: "$5 off after a meet & greet",
    type: "fixed",
    value: 500,
    active: true,
  },
];

export function findPromoCode(input: string): PromoCode | undefined {
  const normalized = input.trim().toUpperCase();
  if (!normalized) return undefined;
  return promoCodes.find((promo) => promo.active && promo.code === normalized);
}
