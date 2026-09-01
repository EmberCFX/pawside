import { getService } from "@/data/services";
import { generateBookingNumber } from "@/lib/booking";
import { buildQuote } from "@/lib/pricing";
import { createServiceSupabase } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import type { BookingDraft } from "@/types";

export type BookingRow = {
  id: string;
  booking_number: string;
  customer_id: string | null;
  service_slug: string;
  service_name: string | null;
  duration_minutes: number | null;
  frequency: string | null;
  visit_date: string | null;
  visit_time: string | null;
  weekdays: number[] | null;
  add_on_slugs: string[];
  membership: string | null;
  promo_code: string | null;
  pet_count: number;
  pets_json: unknown;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  entry_instructions: string | null;
  care_instructions: string | null;
  contact_name: string | null;
  contact_email: string;
  contact_phone: string | null;
  subtotal: number;
  total: number;
  status: string;
  payment_status: string;
  stripe_session_id: string | null;
  created_at: string;
};

export function quoteForDraft(draft: BookingDraft) {
  return buildQuote({
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
}

export function bookingEmailPayload(row: BookingRow) {
  const pets = Array.isArray(row.pets_json)
    ? (row.pets_json as Array<{ name?: string; type?: string }>)
        .map((pet) => [pet.name, pet.type].filter(Boolean).join(" · "))
        .join(", ")
    : `${row.pet_count} pet(s)`;

  const address = [row.address_line1, row.address_line2, row.city, row.state, row.postal_code]
    .filter(Boolean)
    .join(", ");

  return {
    bookingNumber: row.booking_number,
    contactName: row.contact_name || "Pet owner",
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone || "",
    serviceName: row.service_name || row.service_slug,
    date: row.visit_date,
    time: row.visit_time,
    pets: pets || "—",
    address: address || "—",
    totalLabel: formatPrice(row.total),
    paymentStatus: row.payment_status,
    careInstructions: row.care_instructions || undefined,
  };
}

export async function insertBooking(draft: BookingDraft, customerId?: string | null) {
  const db = createServiceSupabase();
  if (!db) {
    throw new Error("Bookings are not configured yet. Add the Supabase keys on Vercel.");
  }

  if (!draft.serviceSlug || !draft.contact?.email || !draft.contact?.phone) {
    throw new Error("Service, email, and phone are required.");
  }

  const quote = quoteForDraft(draft);
  const service = getService(draft.serviceSlug);
  const bookingNumber = generateBookingNumber();

  const row = {
    booking_number: bookingNumber,
    customer_id: customerId ?? null,
    service_slug: draft.serviceSlug,
    service_name: service?.name ?? draft.serviceSlug,
    duration_minutes: draft.durationMinutes,
    frequency: draft.frequency,
    visit_date: draft.date,
    visit_time: draft.time,
    weekdays: draft.weekdays ?? [],
    add_on_slugs: draft.addOnSlugs ?? [],
    membership: draft.membership,
    promo_code: draft.promoCode || null,
    pet_count: draft.pets?.length ?? 1,
    pets_json: draft.pets ?? [],
    address_line1: draft.address?.line1 ?? "",
    address_line2: draft.address?.line2 ?? "",
    city: draft.address?.city ?? "",
    state: draft.address?.state ?? "",
    postal_code: draft.address?.postalCode ?? "",
    entry_instructions: draft.entryInstructions ?? "",
    care_instructions: draft.careInstructions ?? "",
    contact_name: `${draft.contact.firstName} ${draft.contact.lastName}`.trim(),
    contact_email: draft.contact.email.trim().toLowerCase(),
    contact_phone: draft.contact.phone.trim(),
    subtotal: quote.subtotal,
    total: quote.total,
    status: "pending",
    payment_status: "unpaid",
  };

  const { data, error } = await db.from("bookings").insert(row).select("*").single();
  if (error || !data) {
    throw new Error(error?.message ?? "Could not save that booking.");
  }

  if (customerId) {
    const contactName = `${draft.contact.firstName} ${draft.contact.lastName}`.trim();
    const { data: existing } = await db
      .from("profiles")
      .select("full_name, phone")
      .eq("id", customerId)
      .maybeSingle();
    const patch: { full_name?: string; phone?: string } = {};
    if (!existing?.full_name && contactName) patch.full_name = contactName;
    if (!existing?.phone && draft.contact.phone.trim()) patch.phone = draft.contact.phone.trim();
    if (Object.keys(patch).length) {
      await db.from("profiles").update(patch).eq("id", customerId);
    }
  }

  return { row: data as BookingRow, quote };
}

export async function getBookingByNumber(bookingNumber: string) {
  const db = createServiceSupabase();
  if (!db) return null;
  const { data } = await db
    .from("bookings")
    .select("*")
    .eq("booking_number", bookingNumber)
    .maybeSingle();
  return (data as BookingRow | null) ?? null;
}

async function bookingsForCustomer(customerId: string, email: string) {
  const db = createServiceSupabase();
  if (!db) return [];

  const normalized = email.trim().toLowerCase();
  const [{ data: byId }, { data: byEmail }] = await Promise.all([
    db.from("bookings").select("*").eq("customer_id", customerId).order("created_at", { ascending: false }),
    db.from("bookings").select("*").eq("contact_email", normalized).order("created_at", { ascending: false }),
  ]);

  const seen = new Set<string>();
  const rows: BookingRow[] = [];
  for (const row of [...(byId ?? []), ...(byEmail ?? [])] as BookingRow[]) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    rows.push(row);
  }
  rows.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return rows;
}

/** Latest booking for this account — by user id, or by the email they booked with. */
export async function getLatestBookingForCustomer(customerId: string, email: string) {
  const rows = await bookingsForCustomer(customerId, email);
  return rows[0] ?? null;
}

export async function getBookingsForCustomer(customerId: string, email: string) {
  return bookingsForCustomer(customerId, email);
}

export function formatBookingAddress(row: Pick<
  BookingRow,
  "address_line1" | "address_line2" | "city" | "state" | "postal_code"
>) {
  return [row.address_line1, row.address_line2, row.city, row.state, row.postal_code]
    .filter(Boolean)
    .join(", ");
}
