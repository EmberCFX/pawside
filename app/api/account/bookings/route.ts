import { NextResponse } from "next/server";
import { getProfile, getSessionUser } from "@/lib/auth";
import { bookingEmailPayload } from "@/lib/bookings";
import { sendCancellationNotice } from "@/lib/email";
import { createServiceSupabase } from "@/lib/supabase/server";
import type { BookingRow } from "@/lib/bookings";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Sign in to cancel a visit." }, { status: 401 });
  }

  let body: { bookingId?: string; bookingNumber?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const db = createServiceSupabase();
  if (!db) {
    return NextResponse.json({ ok: false, message: "Bookings aren’t connected yet." }, { status: 503 });
  }

  const profile = await getProfile();
  const email = (profile?.email || user.email || "").trim().toLowerCase();

  let query = db.from("bookings").select("*");
  if (body.bookingId) {
    query = query.eq("id", body.bookingId);
  } else if (body.bookingNumber) {
    query = query.eq("booking_number", body.bookingNumber);
  } else {
    return NextResponse.json({ ok: false, message: "Which visit should we cancel?" }, { status: 400 });
  }

  const { data, error: loadError } = await query.maybeSingle();
  if (loadError) {
    return NextResponse.json({ ok: false, message: loadError.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ ok: false, message: "We couldn’t find that visit." }, { status: 404 });
  }

  const booking = data as BookingRow;
  const owns =
    booking.customer_id === user.id ||
    (booking.contact_email || "").trim().toLowerCase() === email;
  if (!owns) {
    return NextResponse.json({ ok: false, message: "That visit isn’t on this account." }, { status: 403 });
  }

  if (booking.status === "completed") {
    return NextResponse.json({ ok: false, message: "That visit is already done." }, { status: 422 });
  }
  if (booking.status === "cancelled") {
    return NextResponse.json({ ok: true });
  }

  const { error } = await db.from("bookings").update({ status: "cancelled" }).eq("id", booking.id);
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  try {
    await sendCancellationNotice(bookingEmailPayload({ ...booking, status: "cancelled" }));
  } catch (err) {
    console.warn("[email] cancel notice failed", err);
  }

  return NextResponse.json({ ok: true });
}
