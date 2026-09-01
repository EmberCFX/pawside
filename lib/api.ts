import type { BookingDraft, Quote } from "@/types";

/**
 * BACKEND INTEGRATION POINTS.
 *
 * Everything the site needs from a server lives behind these functions. Today
 * they post to the route handlers in app/api/*, which validate input and return
 * mock responses. Swapping in Supabase, Stripe, or a scheduling provider means
 * editing those route handlers — components never change.
 *
 * Checklist to go live:
 *   1. Auth              — replace the mock session in lib/session.ts.
 *   2. Database          — persist bookings, pets, customers (see /types).
 *   3. Payments          — Stripe PaymentIntent in app/api/checkout/route.ts.
 *                          Keys come from env vars; never expose the secret key.
 *   4. Availability      — real slots in app/api/availability/route.ts.
 *   5. Notifications     — confirmation email/SMS on booking creation.
 *   6. Promo validation  — move data/promoCodes.ts server-side.
 */

export interface BookingSubmission {
  draft: BookingDraft;
  quote: Quote;
}

export interface BookingResponse {
  ok: boolean;
  bookingNumber: string;
  message?: string;
  checkoutUrl?: string | null;
}

export async function submitBooking(
  payload: BookingSubmission & { payNow?: boolean },
): Promise<BookingResponse> {
  const response = await fetch("/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as BookingResponse & { message?: string };
  if (!response.ok || !data.ok) {
    throw new Error(data.message || "We couldn't submit that booking. Please try again or call us.");
  }

  return data;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  petType: string;
  service: string;
  message: string;
}

export async function submitContact(payload: ContactSubmission): Promise<{ ok: boolean }> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("We couldn't send that message. Please email or call us instead.");
  }

  return response.json();
}

/**
 * Stripe placeholder. The real implementation creates a PaymentIntent on the
 * server and returns only its client secret — the secret key stays in
 * STRIPE_SECRET_KEY on the server, and the publishable key is read from
 * NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY on the client.
 */
export interface CheckoutIntent {
  clientSecret: string | null;
  /** Cents. Re-priced server-side; never trust the client's total. */
  amount: number;
  mode: "live" | "placeholder";
}

export async function createCheckoutIntent(payload: BookingSubmission): Promise<CheckoutIntent> {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Payment setup failed. Please try again.");
  }

  return response.json();
}
