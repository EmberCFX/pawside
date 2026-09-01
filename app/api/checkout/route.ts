import { NextResponse } from "next/server";
import { quoteForDraft } from "@/lib/bookings";
import { siteUrl } from "@/lib/env";
import { checkoutPromoAdjustment, resolvePromoCode } from "@/lib/promos";
import { getStripe } from "@/lib/stripe";
import type { BookingDraft } from "@/types";

export async function POST(request: Request) {
  let payload: { draft?: BookingDraft; bookingNumber?: string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const draft = payload.draft;
  if (!draft?.serviceSlug) {
    return NextResponse.json({ message: "A service is required." }, { status: 422 });
  }

  const resolvedPromo = await resolvePromoCode(draft.promoCode);
  const quote = quoteForDraft(draft, resolvedPromo);
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json({
      clientSecret: null,
      url: null,
      amount: quote.total,
      mode: "placeholder",
    });
  }

  const checkout = checkoutPromoAdjustment(quote, resolvedPromo);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: draft.contact?.email,
    success_url: `${siteUrl()}/book/confirmation?booking=${payload.bookingNumber ?? "PS"}&paid=1`,
    cancel_url: `${siteUrl()}/book?cancelled=1`,
    metadata: {
      bookingNumber: payload.bookingNumber ?? "",
      promoCode: resolvedPromo?.code ?? "",
    },
    discounts: checkout.discounts,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: checkout.unitAmount,
          product_data: { name: `Pawside — ${draft.serviceSlug}` },
        },
      },
    ],
  });

  return NextResponse.json({
    clientSecret: null,
    url: session.url,
    amount: quote.total,
    mode: "live",
  });
}
