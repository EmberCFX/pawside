import { NextResponse } from "next/server";
import { getProfile, getSessionUser } from "@/lib/auth";
import { bookingEmailPayload } from "@/lib/bookings";
import { sendCancellationNotice, sendRescheduleNotice } from "@/lib/email";
import { createServiceSupabase } from "@/lib/supabase/server";
import type { BookingRow } from "@/lib/bookings";

export const dynamic = "force-dynamic";

function todayInEastern() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00`));
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Sign in to update a visit." }, { status: 401 });
  }

  let body: {
    action?: string;
    bookingId?: string;
    bookingNumber?: string;
    date?: string;
    time?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const action = body.action === "reschedule" ? "reschedule" : "cancel";

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
    return NextResponse.json({ ok: false, message: "Which visit should we update?" }, { status: 400 });
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

  if (action === "reschedule") {
    if (booking.status === "cancelled") {
      return NextResponse.json({ ok: false, message: "That visit is already cancelled." }, { status: 422 });
    }
    const date = (body.date ?? "").trim();
    const time = (body.time ?? "").trim();
    if (!isIsoDate(date) || !time) {
      return NextResponse.json({ ok: false, message: "Pick a new date and arrival window." }, { status: 400 });
    }
    if (date < todayInEastern()) {
      return NextResponse.json({ ok: false, message: "Choose a date from today onward." }, { status: 422 });
    }
    if (date === booking.visit_date && time === (booking.visit_time || "").trim()) {
      return NextResponse.json({ ok: false, message: "That’s already the scheduled time." }, { status: 422 });
    }

    const { error } = await db
      .from("bookings")
      .update({
        visit_date: date,
        visit_time: time,
        status: "pending",
      })
      .eq("id", booking.id);
    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }

    const updated = { ...booking, visit_date: date, visit_time: time, status: "pending" };
    try {
      await sendRescheduleNotice(bookingEmailPayload(updated), {
        previousDate: booking.visit_date,
        previousTime: booking.visit_time,
      });
    } catch (err) {
      console.warn("[email] reschedule notice failed", err);
    }

    return NextResponse.json({ ok: true });
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
