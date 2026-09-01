import { NextResponse } from "next/server";
import { buildQuote } from "@/lib/pricing";
import { generateBookingNumber } from "@/lib/booking";
import type { BookingDraft } from "@/types";

/**
 * POST /api/booking — booking intake.
 *
 * MOCK IMPLEMENTATION. It validates the payload and re-prices server-side, then
 * returns a reference number without persisting anything.
 *
 * To go live, inside the marked block:
 *   1. Upsert the customer, pets, and booking rows (see /types for shapes).
 *   2. Create the recurring series when draft.frequency !== "one-time".
 *   3. Send the confirmation email/SMS.
 *   4. Notify the caregiver's schedule.
 *
 * The re-priced quote below is the authoritative amount — the client's total is
 * only used to detect tampering, never to charge.
 */
export async function POST(request: Request) {
  let payload: { draft?: BookingDraft };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const draft = payload.draft;

  if (!draft?.serviceSlug) {
    return NextResponse.json(
      { ok: false, message: "A service is required." },
      { status: 422 },
    );
  }

  if (!draft.contact?.email || !draft.contact?.phone) {
    return NextResponse.json(
      { ok: false, message: "Contact email and phone are required." },
      { status: 422 },
    );
  }

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

  const bookingNumber = generateBookingNumber();

  /* ---------------------------------------------------------------- *
   * INTEGRATION POINT — persist + notify here.
   * ---------------------------------------------------------------- */

  return NextResponse.json({
    ok: true,
    bookingNumber,
    /** Server-computed total in cents. */
    total: quote.total,
    message: "Booking request received.",
  });
}
