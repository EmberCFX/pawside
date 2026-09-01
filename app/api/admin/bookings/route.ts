import { NextResponse } from "next/server";
import { getAdminProfile } from "@/lib/auth";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function GET() {
  const admin = await getAdminProfile();
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const db = createServiceSupabase();
  if (!db) {
    return NextResponse.json({ bookings: [] });
  }

  const { data } = await db.from("bookings").select("*").order("created_at", { ascending: false });
  return NextResponse.json({ bookings: data ?? [] });
}

export async function PATCH(request: Request) {
  const admin = await getAdminProfile();
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const db = createServiceSupabase();
  if (!db || !body.bookingNumber) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const patch: Record<string, string> = {};
  if (body.status) patch.status = body.status;
  if (body.payment_status) patch.payment_status = body.payment_status;

  const { error } = await db.from("bookings").update(patch).eq("booking_number", body.bookingNumber);
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
