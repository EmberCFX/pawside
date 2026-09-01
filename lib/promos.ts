import type Stripe from "stripe";
import { findPromoCode as findStaticPromoCode, promoCodes as staticPromoCodes } from "@/data/promoCodes";
import { getStripe } from "@/lib/stripe";
import type { PromoCode } from "@/types";

export type AdminPromo = PromoCode & {
  source: "stripe" | "built-in";
};

function couponOf(promo: Stripe.PromotionCode): Stripe.Coupon | null {
  const coupon = promo.promotion?.coupon;
  if (!coupon || typeof coupon === "string") return null;
  return coupon;
}

export function mapStripePromotionCode(promo: Stripe.PromotionCode): PromoCode | null {
  const coupon = couponOf(promo);
  if (!coupon) return null;

  const percent = coupon.percent_off;
  const amountOff = coupon.amount_off;
  if (!percent && !amountOff) return null;

  return {
    code: promo.code.toUpperCase(),
    label: coupon.name || promo.code,
    type: percent ? "percentage" : "fixed",
    value: percent ? percent / 100 : amountOff ?? 0,
    active: Boolean(promo.active && coupon.valid),
    firstTimeOnly: Boolean(promo.restrictions?.first_time_transaction),
    expiresAt: promo.expires_at
      ? new Date(promo.expires_at * 1000).toISOString().slice(0, 10)
      : coupon.redeem_by
        ? new Date(coupon.redeem_by * 1000).toISOString().slice(0, 10)
        : undefined,
    stripePromotionCodeId: promo.id,
    stripeCouponId: coupon.id,
    maxRedemptions: promo.max_redemptions ?? coupon.max_redemptions ?? undefined,
    timesRedeemed: promo.times_redeemed ?? coupon.times_redeemed ?? 0,
  };
}

export async function listStripePromos(): Promise<AdminPromo[]> {
  const stripe = getStripe();
  const builtIn: AdminPromo[] = staticPromoCodes.map((promo) => ({ ...promo, source: "built-in" }));
  if (!stripe) return builtIn;

  const listed = await stripe.promotionCodes.list({
    limit: 100,
    expand: ["data.promotion.coupon"],
  });
  const fromStripe = listed.data
    .map(mapStripePromotionCode)
    .filter((promo): promo is PromoCode => Boolean(promo))
    .map((promo) => ({ ...promo, source: "stripe" as const }));

  const stripeCodes = new Set(fromStripe.map((promo) => promo.code));
  return [...fromStripe, ...builtIn.filter((promo) => !stripeCodes.has(promo.code))];
}

export async function resolvePromoCode(input?: string | null): Promise<PromoCode | undefined> {
  const normalized = (input ?? "").trim().toUpperCase();
  if (!normalized) return undefined;

  const stripe = getStripe();
  if (stripe) {
    const listed = await stripe.promotionCodes.list({
      code: normalized,
      active: true,
      limit: 1,
      expand: ["data.promotion.coupon"],
    });
    const mapped = listed.data[0] ? mapStripePromotionCode(listed.data[0]) : null;
    if (mapped?.active) {
      if (mapped.expiresAt && mapped.expiresAt < new Date().toISOString().slice(0, 10)) {
        return undefined;
      }
      return mapped;
    }
  }

  return findStaticPromoCode(normalized);
}

export async function createStripePromo(input: {
  code: string;
  label: string;
  type: "percentage" | "fixed";
  value: number;
  maxRedemptions?: number;
  expiresAt?: string;
  firstTimeOnly?: boolean;
}) {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error("Add STRIPE_SECRET_KEY on Vercel to create promo codes.");
  }

  const code = input.code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
  if (code.length < 4 || code.length > 40) {
    throw new Error("Use 4–40 letters or numbers for the code.");
  }

  const couponParams: Stripe.CouponCreateParams = {
    name: input.label.trim() || code,
    duration: "once",
    metadata: { source: "pawside-admin" },
  };

  if (input.maxRedemptions && input.maxRedemptions > 0) {
    couponParams.max_redemptions = input.maxRedemptions;
  }
  if (input.expiresAt) {
    const expires = Date.parse(`${input.expiresAt}T23:59:59`);
    if (!Number.isNaN(expires)) {
      couponParams.redeem_by = Math.floor(expires / 1000);
    }
  }

  if (input.type === "percentage") {
    if (input.value < 1 || input.value > 100) {
      throw new Error("Percent off must be between 1 and 100.");
    }
    couponParams.percent_off = input.value;
  } else {
    const cents = Math.round(input.value * 100);
    if (cents < 100) {
      throw new Error("Fixed off must be at least $1.");
    }
    couponParams.amount_off = cents;
    couponParams.currency = "usd";
  }

  const coupon = await stripe.coupons.create(couponParams);
  const promo = await stripe.promotionCodes.create({
    promotion: { type: "coupon", coupon: coupon.id },
    code,
    active: true,
    max_redemptions: input.maxRedemptions && input.maxRedemptions > 0 ? input.maxRedemptions : undefined,
    expires_at: couponParams.redeem_by,
    restrictions: input.firstTimeOnly ? { first_time_transaction: true } : undefined,
    metadata: { source: "pawside-admin", label: couponParams.name ?? code },
  });

  const mapped = mapStripePromotionCode({
    ...promo,
    promotion: { type: "coupon", coupon },
  });
  if (!mapped) throw new Error("Stripe created the code, but we couldn’t read it back.");
  return mapped;
}

export async function deactivateStripePromo(id: string) {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error("Add STRIPE_SECRET_KEY on Vercel to update promo codes.");
  }
  await stripe.promotionCodes.update(id, { active: false });
}

export function checkoutPromoAdjustment(quote: { total: number; lines: Array<{ id: string; amount: number }> }, promo?: PromoCode) {
  const promoCents = Math.abs(quote.lines.find((line) => line.id === "promo")?.amount ?? 0);
  const useStripe = Boolean(promo?.stripePromotionCodeId && promoCents > 0);
  return {
    unitAmount: useStripe ? quote.total + promoCents : quote.total,
    discounts: useStripe ? [{ promotion_code: promo!.stripePromotionCodeId! }] : undefined,
  };
}
