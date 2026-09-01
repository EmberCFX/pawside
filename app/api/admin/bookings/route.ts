import { NextResponse } from "next/server";
import { getAdminBookings } from "@/lib/admin";
import { getAdminProfile } from "@/lib/auth";
import { createServiceSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminProfile();
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { rows, error } = await getAdminBookings();
  if (error) {
    return NextResponse.json({ bookings: [], message: error }, { status: 500 });
  }

  return NextResponse.json({ bookings: rows });
}

export async function PATCH(request: Request) {
  const admin = await getAdminProfile();
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const db = createServiceSupabase();
  if (!db || !body.bookingNumber) {
    return NextResponse.json({ ok: false, message: "Booking isn’t available to update." }, { status: 400 });
  }

  const patch: Record<string, string> = {};
  if (body.status) patch.status = body.status;
  if (body.payment_status) patch.payment_status = body.payment_status;

  if (!Object.keys(patch).length) {
    return NextResponse.json({ ok: false, message: "Nothing to update." }, { status: 400 });
  }

  const { error } = await db.from("bookings").update(patch).eq("booking_number", body.bookingNumber);
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
