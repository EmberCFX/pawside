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
    return { row: null as BookingRow | null, error: setupError, emergency: null };
  }

  const { data, error } = await db
    .from("bookings")
    .select("*")
    .eq("booking_number", bookingNumber)
    .maybeSingle();

  if (error) {
    return { row: null as BookingRow | null, error: error.message, emergency: null };
  }

  const booking = (data as BookingRow | null) ?? null;
  let emergency: { name: string; phone: string } | null = null;
  if (booking) {
    let profileQuery = db.from("profiles").select("*");
    profileQuery = booking.customer_id
      ? profileQuery.eq("id", booking.customer_id)
      : profileQuery.eq("email", booking.contact_email);
    const { data: profile } = await profileQuery.maybeSingle();
    let name = (profile?.emergency_contact_name as string | undefined)?.trim() || "";
    let phone = (profile?.emergency_contact_phone as string | undefined)?.trim() || "";
    if ((!name && !phone) && booking.customer_id) {
      const { data: authUser } = await db.auth.admin.getUserById(booking.customer_id);
      const meta = authUser.user?.user_metadata ?? {};
      name = typeof meta.emergency_contact_name === "string" ? meta.emergency_contact_name.trim() : "";
      phone = typeof meta.emergency_contact_phone === "string" ? meta.emergency_contact_phone.trim() : "";
    }
    if (name || phone) emergency = { name, phone };
  }

  return { row: booking, error: null, emergency };
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
