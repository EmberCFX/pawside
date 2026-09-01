import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Cents → "$24" / "$24.70". Whole dollars drop the decimals for cleaner display. */
export function formatPrice(cents: number, options?: { alwaysCents?: boolean }): string {
  const dollars = cents / 100;
  const showCents = options?.alwaysCents || cents % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(dollars);
}

/** Cents → "24.70", for inputs and tabular columns. */
export function formatAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function formatDuration(minutes: number | null): string {
  if (minutes === null) return "Overnight";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}

/**
 * Formats an ISO date (YYYY-MM-DD) without timezone drift. Passing the raw
 * string to `new Date()` would parse as UTC and shift the day for US users.
 */
export function formatDate(
  iso: string,
  options: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric" },
): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Intl.DateTimeFormat("en-US", options).format(new Date(year, month - 1, day));
}

export function formatShortDate(iso: string): string {
  return formatDate(iso, { month: "short", day: "numeric" });
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : plural ?? `${singular}s`;
}

/** Joins a list conversationally: "Bella, Olive, and Max". */
export function listToSentence(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Stable-enough id for client-side drafts. */
export function createId(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export const WEEKDAYS = [
  { index: 0, short: "Sun", label: "Sunday" },
  { index: 1, short: "Mon", label: "Monday" },
  { index: 2, short: "Tue", label: "Tuesday" },
  { index: 3, short: "Wed", label: "Wednesday" },
  { index: 4, short: "Thu", label: "Thursday" },
  { index: 5, short: "Fri", label: "Friday" },
  { index: 6, short: "Sat", label: "Saturday" },
] as const;
