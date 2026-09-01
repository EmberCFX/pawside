import { unstable_noStore as noStore } from "next/cache";
import { createServiceSupabase } from "@/lib/supabase/server";
import type { BookingRow } from "@/lib/bookings";

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  pet_type: string | null;
  service: string | null;
  message: string;
  created_at: string;
};

function serviceKeyRole(): string | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  try {
    const payload = key.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(Buffer.from(normalized, "base64").toString("utf8")) as {
      role?: string;
    };
    return json.role ?? null;
  } catch {
    return null;
  }
}

function serviceClientOrError() {
  const db = createServiceSupabase();
  if (!db) {
    return { db: null, error: "Supabase isn’t connected. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Vercel." };
  }
  const role = serviceKeyRole();
  if (role && role !== "service_role") {
    return {
      db: null,
      error:
        "Admin can’t read all bookings because SUPABASE_SERVICE_ROLE_KEY is not the service role key. Replace it on Vercel with the service_role secret from Supabase → Settings → API.",
    };
  }
  return { db, error: null };
}

export async function getAdminBookings() {
  noStore();
  const { db, error: setupError } = serviceClientOrError();
  if (!db) {
    return { rows: [] as BookingRow[], error: setupError };
  }

  const { data, error } = await db
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { rows: [] as BookingRow[], error: error.message };
  }

  return { rows: (data ?? []) as BookingRow[], error: null };
}

export async function getAdminBooking(bookingNumber: string) {
  noStore();
  const { db, error: setupError } = serviceClientOrError();
  if (!db) {
    return { row: null as BookingRow | null, error: setupError };
  }

  const { data, error } = await db
    .from("bookings")
    .select("*")
    .eq("booking_number", bookingNumber)
    .maybeSingle();

  if (error) {
    return { row: null as BookingRow | null, error: error.message };
  }

  return { row: (data as BookingRow | null) ?? null, error: null };
}

export async function getAdminMessages() {
  noStore();
  const { db, error: setupError } = serviceClientOrError();
  if (!db) {
    return { rows: [] as ContactMessageRow[], error: setupError };
  }

  const { data, error } = await db
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { rows: [] as ContactMessageRow[], error: error.message };
  }

  return { rows: (data ?? []) as ContactMessageRow[], error: null };
}
