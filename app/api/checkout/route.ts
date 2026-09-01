import { NextResponse } from "next/server";
import { buildQuote } from "@/lib/pricing";
import type { BookingDraft } from "@/types";

/**
 * POST /api/checkout — Stripe PaymentIntent (placeholder).
 *
 * Returns `mode: "placeholder"` until Stripe keys exist. The shape matches the
 * live response so the client never changes.
 *
 * Live implementation:
 *
 *   import Stripe from "stripe";
 *   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
 *   const intent = await stripe.paymentIntents.create({
 *     amount: quote.total,              // server-computed, never client-supplied
 *     currency: "usd",
 *     automatic_payment_methods: { enabled: true },
 *     metadata: { bookingNumber, service: draft.serviceSlug },
 *   });
 *   return NextResponse.json({ clientSecret: intent.client_secret, amount: quote.total, mode: "live" });
 *
 * STRIPE_SECRET_KEY stays server-side. The browser only ever sees
 * NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and the intent's client secret.
 */
export async function POST(request: Request) {
  let payload: { draft?: BookingDraft };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const draft = payload.draft;

  if (!draft?.serviceSlug) {
    return NextResponse.json({ message: "A service is required." }, { status: 422 });
  }

  // Always re-price on the server. A client-supplied total is untrusted input.
  const quote = buildQuote({
    serviceSlug: draft.serviceSlug,
    durationMinutes: draft.durationMinutes,
    petCount: draft.pets?.length ?? 1,
    addOnSlugs: draft.addOnSlugs ?? [],
    frequency: draft.frequency ?? "one-time",
    weekdays: draft.weekdays ?? [],
    membership: draft.membership ?? "none",
    date: draft.date,
    promoCode: draft.promoCode,
  });

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({
      clientSecret: null,
      amount: quote.total,
      mode: "placeholder",
    });
  }

  /* INTEGRATION POINT — create the PaymentIntent here. */
  return NextResponse.json({
    clientSecret: null,
    amount: quote.total,
    mode: "placeholder",
  });
}
