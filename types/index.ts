import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ *
 * Services
 * ------------------------------------------------------------------ */

export type ServiceSlug =
  | "dog-walking"
  | "pet-sitting"
  | "drop-in-visits"
  | "overnight-care"
  | "puppy-care"
  | "cat-care";

/** Durations are minutes. `null` means the service is priced per night/day. */
export type DurationMinutes = 20 | 30 | 45 | 60 | 90 | 120;

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  slug: ServiceSlug;
  /** Short label used in nav, chips and cards. */
  name: string;
  /** Longer label used in page titles and structured data. */
  longName: string;
  tagline: string;
  /** Card-length description. */
  summary: string;
  /** Two or three sentences for service page intros. */
  description: string;
  icon: LucideIcon;
  /** Ordered durations offered; empty for overnight-style services. */
  durations: DurationMinutes[];
  defaultDuration: DurationMinutes | null;
  /** Per-night pricing instead of per-visit. */
  pricingUnit: "visit" | "night";
  included: string[];
  idealFor: string[];
  addOnSlugs: AddOnSlug[];
  faqs: ServiceFaq[];
  /** Media slot key from data/media.ts. */
  mediaKey: string;
  /** Show on the homepage services grid. */
  featured: boolean;
  /** Unique SEO copy. */
  seo: {
    title: string;
    description: string;
    h1: string;
  };
}

/** Services Pawside plans to launch. Rendered as "coming soon" rather than hidden. */
export interface UpcomingService {
  name: string;
  description: string;
  icon: LucideIcon;
  status: "planned" | "waitlist";
}

/* ------------------------------------------------------------------ *
 * Add-ons
 * ------------------------------------------------------------------ */

export type AddOnSlug =
  | "extra-walk"
  | "extended-playtime"
  | "medication"
  | "fresh-food-prep"
  | "litter-cleanup"
  | "pet-transportation"
  | "photo-package"
  | "bath-paw-cleaning"
  | "brushing"
  | "additional-pet"
  | "special-occasion"
  | "plant-watering"
  | "mail-pickup"
  | "home-check"
  | "holiday-visit";

export interface AddOn {
  slug: AddOnSlug;
  name: string;
  description: string;
  /** Cents. All money in this codebase is integer cents. */
  price: number;
  icon: LucideIcon;
  /** Grouping for the add-ons marketing section. */
  category: "care" | "comfort" | "home" | "extras";
  /** Surface this add-on during checkout for these services. */
  suggestedFor: ServiceSlug[];
  /** Charged per pet rather than per visit. */
  perPet?: boolean;
  /** Not yet launched — shown but not selectable. */
  comingSoon?: boolean;
}

/* ------------------------------------------------------------------ *
 * Pricing
 * ------------------------------------------------------------------ */

export interface DurationPrice {
  minutes: DurationMinutes;
  /** Cents. */
  price: number;
  label: string;
  /** Optional helper copy, e.g. "Most popular". */
  note?: string;
}

export interface ServicePricing {
  slug: ServiceSlug;
  /** Cents, shown as "from" pricing in cards. */
  startingAt: number;
  durations: DurationPrice[];
  /** Cents per additional pet, per visit. */
  additionalPetFee: number;
  /** Free additional pets before the fee applies. */
  petsIncluded: number;
}

export interface PricingConfig {
  currency: "USD";
  services: ServicePricing[];
  fees: {
    /** Cents added to holiday-date visits. */
    holidaySurcharge: number;
    /** Cents, applied to one-time bookings only. */
    bookingFee: number;
    /** Percentage (0-1) applied to late-notice bookings. */
    lastMinuteRate: number;
    /** Sales tax rate (0-1). Set to 0 where services are untaxed. */
    taxRate: number;
  };
  /** Discounts (0-1) applied to recurring schedules. */
  recurringDiscounts: Record<RecurringFrequency, number>;
}

/* ------------------------------------------------------------------ *
 * Memberships
 * ------------------------------------------------------------------ */

export type MembershipSlug = "none" | "pawside-plus" | "pawside-plus-premium";

export interface Membership {
  slug: MembershipSlug;
  name: string;
  tagline: string;
  /** Cents per month. `null` renders as "Free". */
  monthlyPrice: number | null;
  /** Discount (0-1) applied to visit subtotals. */
  visitDiscount: number;
  /** Cents of care credit issued monthly. */
  monthlyCredit: number;
  /** Booking fee waived for members. */
  waivesBookingFee: boolean;
  /** Discount (0-1) applied to the holiday surcharge. */
  holidaySurchargeDiscount: number;
  benefits: string[];
  featured?: boolean;
  badge?: string;
}

/* ------------------------------------------------------------------ *
 * Booking
 * ------------------------------------------------------------------ */

export type RecurringFrequency = "one-time" | "weekly" | "multi-weekly" | "custom";

export type PetType = "dog" | "cat" | "other";

export interface PetDraft {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: string;
  notes?: string;
}

export interface BookingDraft {
  serviceSlug: ServiceSlug | null;
  durationMinutes: DurationMinutes | null;
  pets: PetDraft[];
  date: string | null;
  time: string | null;
  frequency: RecurringFrequency;
  /** 0 = Sunday. Used for weekly / multi-weekly schedules. */
  weekdays: number[];
  addOnSlugs: AddOnSlug[];
  membership: MembershipSlug;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
  };
  entryInstructions: string;
  careInstructions: string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  promoCode: string;
  /** Marketing/attribution passthrough for the future backend. */
  referralSource?: string;
}

export interface QuoteLine {
  id: string;
  label: string;
  detail?: string;
  /** Cents. Negative for discounts. */
  amount: number;
  kind: "base" | "pets" | "addon" | "fee" | "discount" | "tax";
}

export interface Quote {
  lines: QuoteLine[];
  /** Cents. */
  subtotal: number;
  discountTotal: number;
  feeTotal: number;
  tax: number;
  total: number;
  /** Cents saved by the selected membership on this booking. */
  membershipSavings: number;
  /** Cents this booking would save if they joined Pawside+. */
  potentialMembershipSavings: number;
  /** Per-occurrence total for recurring schedules. */
  perVisitTotal: number;
  visitsPerMonth: number;
}

/* ------------------------------------------------------------------ *
 * Promotions
 * ------------------------------------------------------------------ */

export interface PromoCode {
  code: string;
  label: string;
  /** Percentage (0-1) or fixed cents, depending on `type`. */
  type: "percentage" | "fixed";
  value: number;
  /** Cents. Minimum subtotal required. */
  minSubtotal?: number;
  appliesTo?: ServiceSlug[];
  /** ISO date. */
  expiresAt?: string;
  firstTimeOnly?: boolean;
  active: boolean;
}

/* ------------------------------------------------------------------ *
 * Content
 * ------------------------------------------------------------------ */

export interface Testimonial {
  id: string;
  quote: string;
  ownerName: string;
  petName: string;
  petType: PetType;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  serviceSlug?: ServiceSlug;
  /** Media slot key from data/media.ts. */
  mediaKey?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: "booking" | "care" | "logistics" | "policies";
}

export interface ServiceArea {
  slug: string;
  name: string;
  state: string;
  /** Neighborhoods and villages inside this area. */
  neighborhoods: string[];
  /** Shown on the locations page and the local landing page H1. */
  blurb: string;
  /** Drive-time band from the Pawside home base. */
  status: "core" | "nearby" | "waitlist";
  /** Approximate travel time copy, e.g. "10 min". */
  travelTime?: string;
  /** Real coordinates. ServiceAreaMap projects these, so a new town self-places. */
  coords: { lat: number; lng: number };
  /** Nudges the map label off the pin when neighbours would collide. */
  labelAnchor?: "start" | "middle" | "end";
  labelOffset?: { x: number; y: number };
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  credentials: string[];
  mediaKey?: string;
  favoritePart: string;
}

/* ------------------------------------------------------------------ *
 * Visit reports & account
 * ------------------------------------------------------------------ */

export interface VisitReportTask {
  label: string;
  status: "done" | "not-required" | "skipped";
  detail?: string;
}

export interface VisitReport {
  id: string;
  petName: string;
  serviceName: string;
  date: string;
  time: string;
  caregiverName: string;
  durationMinutes: number;
  distanceMiles?: number;
  tasks: VisitReportTask[];
  note: string;
  photoCount: number;
  mediaKeys: string[];
}

export interface PetProfile {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: string;
  weight: string;
  birthday: string;
  veterinarian: string;
  emergencyContact: string;
  feedingRoutine: string;
  walkRoutine: string;
  medication: string;
  allergies: string;
  behaviorNotes: string;
  favoriteToys: string;
  favoriteTreats: string;
  specialInstructions: string;
  entryInstructions: string;
  mediaKey?: string;
}

export type VisitStatus = "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled";

export interface Visit {
  id: string;
  petNames: string[];
  serviceSlug: ServiceSlug;
  serviceName: string;
  date: string;
  time: string;
  durationMinutes: number | null;
  caregiverName: string;
  status: VisitStatus;
  /** Cents. */
  total: number;
  recurring: boolean;
  reportId?: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  description: string;
  /** Cents. */
  amount: number;
  status: "paid" | "due" | "refunded";
}
