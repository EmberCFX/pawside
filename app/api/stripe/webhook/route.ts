import { NextResponse } from "next/server";
import { bookingEmailPayload, getBookingByNumber } from "@/lib/bookings";
import { sendPaymentNotice } from "@/lib/email";
import { getStripe } from "@/lib/stripe";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ message: "Stripe webhook is not configured." }, { status: 501 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ message: "Missing signature." }, { status: 400 });
  }

  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ message: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingNumber = session.metadata?.bookingNumber;
    const db = createServiceSupabase();

    if (bookingNumber && db) {
      await db
        .from("bookings")
        .update({
          payment_status: "paid",
          status: "confirmed",
          stripe_session_id: session.id,
          stripe_payment_intent:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
        })
        .eq("booking_number", bookingNumber);

      const row = await getBookingByNumber(bookingNumber);
      if (row) {
        await sendPaymentNotice(bookingEmailPayload(row));
      }
    }
  }

  return NextResponse.json({ received: true });
}
