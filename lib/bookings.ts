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
