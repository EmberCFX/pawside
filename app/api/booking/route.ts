import { NextResponse } from "next/server";
import { bookingEmailPayload, insertBooking, quoteForDraft } from "@/lib/bookings";
import { sendBookingEmails } from "@/lib/email";
import { siteUrl } from "@/lib/env";
import { getSessionUser } from "@/lib/auth";
import { checkoutPromoAdjustment, resolvePromoCode } from "@/lib/promos";
import { getStripe } from "@/lib/stripe";
import type { BookingDraft } from "@/types";

export async function POST(request: Request) {
  let payload: { draft?: BookingDraft; payNow?: boolean };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const draft = payload.draft;
  if (!draft?.serviceSlug) {
    return NextResponse.json({ ok: false, message: "A service is required." }, { status: 422 });
  }
  if (!draft.contact?.email || !draft.contact?.phone) {
    return NextResponse.json(
      { ok: false, message: "Contact email and phone are required." },
      { status: 422 },
    );
  }

  try {
    const user = await getSessionUser();
    const { row } = await insertBooking(draft, user?.id);
    await sendBookingEmails(bookingEmailPayload(row));

    let checkoutUrl: string | null = null;

    if (payload.payNow) {
      const stripe = getStripe();
      const resolvedPromo = await resolvePromoCode(draft.promoCode);
      const quote = quoteForDraft(draft, resolvedPromo);
      if (!stripe) {
        return NextResponse.json({
          ok: true,
          bookingNumber: row.booking_number,
          total: quote.total,
          checkoutUrl: null,
          message: "Booking saved. Stripe is not configured, so nothing was charged.",
        });
      }

      const checkout = checkoutPromoAdjustment(quote, resolvedPromo);
      const sessionParams = {
        mode: "payment" as const,
        customer_email: row.contact_email,
        success_url: `${siteUrl()}/book/confirmation?booking=${row.booking_number}&paid=1`,
        cancel_url: `${siteUrl()}/book/confirmation?booking=${row.booking_number}&cancelled=1`,
        metadata: {
          bookingNumber: row.booking_number,
          promoCode: resolvedPromo?.code ?? "",
        },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: checkout.unitAmount,
              product_data: {
                name: `Pawside — ${row.service_name}`,
                description: [row.visit_date, row.visit_time].filter(Boolean).join(" · ") || undefined,
              },
            },
          },
        ],
      };
      const session = await stripe.checkout.sessions
        .create({ ...sessionParams, discounts: checkout.discounts })
        .catch(() =>
          stripe.checkout.sessions.create({
            ...sessionParams,
            line_items: [
              {
                ...sessionParams.line_items[0],
                price_data: {
                  ...sessionParams.line_items[0].price_data,
                  unit_amount: quote.total,
                },
              },
            ],
          }),
        );

      const db = (await import("@/lib/supabase/server")).createServiceSupabase();
      await db
        ?.from("bookings")
        .update({ stripe_session_id: session.id })
        .eq("booking_number", row.booking_number);

      checkoutUrl = session.url;
    }

    return NextResponse.json({
      ok: true,
      bookingNumber: row.booking_number,
      total: row.total,
      checkoutUrl,
      message: "Booking received.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Could not save that booking.",
      },
      { status: 500 },
    );
  }
}
