import { addDays, toISODate } from "@/lib/utils";
import type { BookingDraft, PetDraft, ServiceSlug } from "@/types";

/**
 * Booking-flow domain logic, kept out of components so it can be reused by an
 * API route when scheduling moves server-side.
 */

export const BOOKING_STEPS = [
  { id: "service", label: "Service", shortLabel: "Service" },
  { id: "pets", label: "Your pets", shortLabel: "Pets" },
  { id: "schedule", label: "Date & time", shortLabel: "Schedule" },
  { id: "details", label: "Visit details", shortLabel: "Details" },
  { id: "addons", label: "Add-ons", shortLabel: "Add-ons" },
  { id: "contact", label: "Contact", shortLabel: "Contact" },
  { id: "review", label: "Review", shortLabel: "Review" },
  { id: "payment", label: "Payment", shortLabel: "Payment" },
] as const;

export type BookingStepId = (typeof BOOKING_STEPS)[number]["id"];

/**
 * Arrival windows rather than exact times — an honest promise for a service that
 * drives between homes. PLACEHOLDER SCHEDULE: swap for real availability from
 * the scheduling backend (see lib/api.ts).
 */
export const timeSlots = [
  { id: "early-morning", label: "7:00 – 9:00 AM", detail: "Breakfast & first potty" },
  { id: "morning", label: "9:00 – 11:00 AM", detail: "Morning walk" },
  { id: "midday", label: "11:00 AM – 1:00 PM", detail: "Most requested" },
  { id: "afternoon", label: "1:00 – 3:00 PM", detail: "Midday break" },
  { id: "late-afternoon", label: "3:00 – 5:00 PM", detail: "Pre-dinner walk" },
  { id: "evening", label: "5:00 – 7:00 PM", detail: "Dinner & wind-down" },
  { id: "night", label: "7:00 – 9:00 PM", detail: "Last call of the night" },
];

export const overnightSlots = [
  { id: "overnight-standard", label: "7:00 PM – 7:00 AM", detail: "Standard overnight" },
  { id: "overnight-early", label: "5:00 PM – 7:00 AM", detail: "Early arrival" },
  { id: "overnight-late", label: "9:00 PM – 8:00 AM", detail: "Late arrival, later departure" },
];

export const frequencyOptions = [
  {
    id: "one-time" as const,
    label: "One time",
    description: "A single visit on the date you choose.",
  },
  {
    id: "weekly" as const,
    label: "Weekly",
    description: "Same day and time each week. 5% off every visit.",
  },
  {
    id: "multi-weekly" as const,
    label: "A few days a week",
    description: "Pick your days. 8% off every visit.",
  },
  {
    id: "custom" as const,
    label: "Custom schedule",
    description: "Irregular days, travel weeks, or split shifts. We'll confirm the details.",
  },
];

export function createPetDraft(id: string): PetDraft {
  return { id, name: "", type: "dog", breed: "", age: "" };
}

export function createBookingDraft(serviceSlug: ServiceSlug | null = null): BookingDraft {
  return {
    serviceSlug,
    durationMinutes: null,
    pets: [createPetDraft("pet-1")],
    date: null,
    time: null,
    frequency: "one-time",
    weekdays: [],
    addOnSlugs: [],
    membership: "none",
    address: { line1: "", line2: "", city: "", state: "MA", postalCode: "" },
    entryInstructions: "",
    careInstructions: "",
    contact: { firstName: "", lastName: "", email: "", phone: "" },
    promoCode: "",
  };
}

/** Calendar grid for a month, padded to whole weeks. */
export interface CalendarDay {
  iso: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
}

export function buildCalendar(year: number, month: number, today = new Date()): CalendarDay[] {
  const first = new Date(year, month, 1);
  const start = addDays(first, -first.getDay());
  const todayIso = toISODate(today);
  const days: CalendarDay[] = [];

  for (let i = 0; i < 42; i++) {
    const date = addDays(start, i);
    const iso = toISODate(date);
    days.push({
      iso,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: iso === todayIso,
      isPast: iso < todayIso,
    });
    // Stop after a complete week once the month is behind us.
    if (i >= 34 && date.getMonth() !== month && date.getDay() === 6) break;
  }

  return days;
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* ------------------------------------------------------------------ *
 * Validation
 * ------------------------------------------------------------------ */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Accepts (413) 213-3973, 413-213-3973, +1 413 213 3973, etc. */
const PHONE_PATTERN = /^\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return PHONE_PATTERN.test(value.trim());
}

/** Which steps are complete enough to advance. Drives the stepper and buttons. */
export function stepIssues(step: BookingStepId, draft: BookingDraft): string[] {
  const issues: string[] = [];

  switch (step) {
    case "service":
      if (!draft.serviceSlug) issues.push("Choose a service to continue.");
      break;
    case "pets":
      if (draft.pets.length === 0) issues.push("Add at least one pet.");
      draft.pets.forEach((pet, index) => {
        if (!pet.name.trim()) issues.push(`Add a name for pet ${index + 1}.`);
      });
      break;
    case "schedule":
      if (!draft.date) issues.push("Pick a date.");
      if (!draft.time) issues.push("Pick an arrival window.");
      if (
        (draft.frequency === "multi-weekly" || draft.frequency === "custom") &&
        draft.weekdays.length === 0
      ) {
        issues.push("Choose which days of the week you need.");
      }
      break;
    case "details":
      if (!draft.address.line1.trim()) issues.push("Add the street address.");
      if (!draft.address.city.trim()) issues.push("Add the city or town.");
      if (!draft.address.postalCode.trim()) issues.push("Add the ZIP code.");
      break;
    case "contact":
      if (!draft.contact.firstName.trim()) issues.push("Add your first name.");
      if (!isValidEmail(draft.contact.email)) issues.push("Add a valid email address.");
      if (!isValidPhone(draft.contact.phone)) issues.push("Add a valid phone number.");
      break;
    default:
      break;
  }

  return issues;
}

/** Human-readable summary of a recurring schedule. */
export function describeSchedule(draft: BookingDraft): string {
  const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const days = draft.weekdays
    .slice()
    .sort((a, b) => a - b)
    .map((index) => weekdayNames[index].slice(0, 3));

  switch (draft.frequency) {
    case "weekly":
      return "Every week, same day and time";
    case "multi-weekly":
      return days.length ? `Every ${days.join(", ")}` : "Multiple days each week";
    case "custom":
      return days.length ? `Custom schedule · ${days.join(", ")}` : "Custom schedule";
    default:
      return "One-time visit";
  }
}

/** Booking reference for the confirmation screen. Real numbers come from the backend. */
export function generateBookingNumber(seed = Date.now()): string {
  const suffix = (seed % 100000).toString().padStart(5, "0");
  return `PS-${new Date().getFullYear()}-${suffix}`;
}
