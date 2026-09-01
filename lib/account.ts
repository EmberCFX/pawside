import { getProfile } from "@/lib/auth";
import {
  formatBookingAddress,
  getBookingsForCustomer,
  getLatestBookingForCustomer,
  type BookingRow,
} from "@/lib/bookings";
import { createServiceSupabase } from "@/lib/supabase/server";
import { memberships } from "@/data/memberships";
import type { MembershipSlug, Visit, VisitStatus } from "@/types";

export function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export async function getAccountDetails() {
  const profile = await getProfile();
  if (!profile) return null;

  const booking = await getLatestBookingForCustomer(profile.id, profile.email);
  const { firstName, lastName } = splitFullName(profile.full_name || booking?.contact_name || "");

  return {
    firstName,
    lastName,
    email: profile.email,
    phone: profile.phone || booking?.contact_phone || "",
    emergencyContactName: profile.emergency_contact_name || "",
    emergencyContactPhone: profile.emergency_contact_phone || "",
    address: booking ? formatBookingAddress(booking) : "",
    entryInstructions: booking?.entry_instructions || "",
    hasBooking: Boolean(booking),
  };
}

export type AccountPet = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  notes: string;
};

export async function getAccountPets() {
  const profile = await getProfile();
  if (!profile) return [];

  const db = createServiceSupabase();
  const fromTable: AccountPet[] = [];
  if (db) {
    const { data } = await db.from("pets").select("*").eq("owner_id", profile.id).order("created_at");
    for (const pet of data ?? []) {
      fromTable.push({
        id: pet.id,
        name: pet.name,
        type: pet.type || "",
        breed: pet.breed || "",
        age: pet.age || "",
        notes: pet.notes || "",
      });
    }
  }

  const bookings = await getBookingsForCustomer(profile.id, profile.email);
  const fromBookings: AccountPet[] = [];
  for (const booking of bookings) {
    const pets = Array.isArray(booking.pets_json) ? booking.pets_json : [];
    for (const pet of pets as Array<{ id?: string; name?: string; type?: string; breed?: string; age?: string; notes?: string }>) {
      const name = pet.name?.trim();
      if (!name) continue;
      const key = name.toLowerCase();
      if (fromTable.some((row) => row.name.toLowerCase() === key)) continue;
      if (fromBookings.some((row) => row.name.toLowerCase() === key)) continue;
      fromBookings.push({
        id: pet.id || `${booking.id}-${key}`,
        name,
        type: pet.type || "",
        breed: pet.breed || "",
        age: pet.age || "",
        notes: pet.notes || "",
      });
    }
  }

  return [...fromTable, ...fromBookings];
}

function visitStatus(status: string): VisitStatus {
  if (status === "confirmed") return "confirmed";
  if (status === "completed") return "completed";
  if (status === "cancelled") return "cancelled";
  return "scheduled";
}

export function bookingToVisit(row: BookingRow): Visit {
  const pets = Array.isArray(row.pets_json)
    ? (row.pets_json as Array<{ name?: string }>)
        .map((pet) => pet.name?.trim())
        .filter((name): name is string => Boolean(name))
    : [];

  return {
    id: row.id,
    bookingNumber: row.booking_number,
    petNames: pets,
    serviceSlug: row.service_slug as Visit["serviceSlug"],
    serviceName: row.service_name || row.service_slug,
    date: row.visit_date || row.created_at.slice(0, 10),
    time: row.visit_time || "",
    durationMinutes: row.duration_minutes,
    caregiverName: "Pawside",
    status: visitStatus(row.status),
    total: row.total,
    recurring: row.frequency !== "one-time" && Boolean(row.frequency),
  };
}

export async function getAccountVisits() {
  const profile = await getProfile();
  if (!profile) return { upcoming: [] as Visit[], past: [] as Visit[], membership: "none" as MembershipSlug, bookings: [] as BookingRow[] };

  const bookings = await getBookingsForCustomer(profile.id, profile.email);
  const today = new Date().toISOString().slice(0, 10);
  const visits = bookings.map(bookingToVisit);
  const upcoming = visits.filter(
    (visit) => visit.status !== "completed" && visit.status !== "cancelled" && visit.date >= today,
  );
  const past = visits.filter(
    (visit) => visit.status === "completed" || visit.status === "cancelled" || visit.date < today,
  );
  const rawMembership = bookings.find((row) => row.membership && row.membership !== "none")?.membership;
  const membership = (
    memberships.some((tier) => tier.slug === rawMembership) ? rawMembership : "none"
  ) as MembershipSlug;

  return { upcoming, past, membership, bookings };
}
