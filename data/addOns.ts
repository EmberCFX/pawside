import {
  Bath,
  Brush,
  CalendarHeart,
  Camera,
  Clock4,
  Footprints,
  Home,
  Leaf,
  Mailbox,
  PawPrint,
  Pill,
  ShoppingBag,
  Sparkles,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import type { AddOn, AddOnSlug, ServiceSlug } from "@/types";

/**
 * Add-on catalog. Prices are integer cents so no rounding drift creeps into
 * quotes. `suggestedFor` drives the contextual recommendations in the booking
 * flow — that's what keeps upsells relevant instead of pushy.
 */
export const addOns: AddOn[] = [
  {
    slug: "extra-walk",
    name: "Extra Walk",
    description: "A second 20-minute walk during the same visit.",
    price: 1500,
    icon: Footprints,
    category: "care",
    suggestedFor: ["pet-sitting", "drop-in-visits", "overnight-care", "puppy-care"],
  },
  {
    slug: "extended-playtime",
    name: "Extended Playtime",
    description: "15 extra minutes of fetch, tug, or puzzle work.",
    price: 1000,
    icon: Sparkles,
    category: "care",
    suggestedFor: ["dog-walking", "pet-sitting", "puppy-care", "cat-care", "adventure-outings"],
  },
  {
    slug: "medication",
    name: "Medication Assistance",
    description: "Pills, drops, topicals, or injections on schedule.",
    price: 800,
    icon: Pill,
    category: "care",
    suggestedFor: ["dog-walking", "pet-sitting", "drop-in-visits", "overnight-care", "cat-care", "puppy-care"],
  },
  {
    slug: "fresh-food-prep",
    name: "Fresh Food Prep",
    description: "Portioned raw, fresh, or home-cooked meals prepared to your instructions.",
    price: 800,
    icon: UtensilsCrossed,
    category: "care",
    suggestedFor: ["pet-sitting", "drop-in-visits", "overnight-care", "cat-care"],
  },
  {
    slug: "litter-cleanup",
    name: "Litter Deep Clean",
    description: "Full box change, wipe-down, and fresh litter.",
    price: 1000,
    icon: ShoppingBag,
    category: "care",
    suggestedFor: ["cat-care", "pet-sitting", "drop-in-visits"],
  },
  {
    slug: "bath-paw-cleaning",
    name: "Bath & Paw Cleaning",
    description: "A rinse and towel dry after a muddy day out.",
    price: 2800,
    icon: Bath,
    category: "comfort",
    suggestedFor: ["dog-walking", "pet-sitting", "overnight-care"],
  },
  {
    slug: "brushing",
    name: "Brush-Out",
    description: "10 minutes of brushing to cut down shedding and mats.",
    price: 1200,
    icon: Brush,
    category: "comfort",
    suggestedFor: ["dog-walking", "pet-sitting", "cat-care", "overnight-care"],
  },
  {
    slug: "additional-pet",
    name: "Additional Pet",
    description: "Care for another pet in the same household.",
    price: 800,
    icon: PawPrint,
    category: "care",
    perPet: true,
    suggestedFor: [],
  },
  {
    slug: "photo-package",
    name: "Photo & Video Package",
    description: "A short video and extra photos with every visit summary.",
    price: 500,
    icon: Camera,
    category: "extras",
    suggestedFor: [
      "dog-walking",
      "pet-sitting",
      "drop-in-visits",
      "overnight-care",
      "puppy-care",
      "cat-care",
      "grooming",
      "pet-transportation",
      "adventure-outings",
    ],
  },
  {
    slug: "special-occasion",
    name: "Special Occasion Visit",
    description: "Birthday or homecoming visit with a treat and a few photos.",
    price: 2000,
    icon: CalendarHeart,
    category: "extras",
    suggestedFor: ["pet-sitting", "drop-in-visits", "dog-walking"],
  },
  {
    slug: "plant-watering",
    name: "Plant Watering",
    description: "Indoor plants watered while you're away.",
    price: 500,
    icon: Leaf,
    category: "home",
    suggestedFor: ["pet-sitting", "overnight-care", "cat-care", "drop-in-visits"],
  },
  {
    slug: "mail-pickup",
    name: "Mail & Package Pickup",
    description: "Mail brought in and packages moved out of sight.",
    price: 500,
    icon: Mailbox,
    category: "home",
    suggestedFor: ["pet-sitting", "overnight-care", "cat-care"],
  },
  {
    slug: "home-check",
    name: "Home Check",
    description: "Lights, blinds, thermostat, and a quick look for leaks.",
    price: 700,
    icon: Home,
    category: "home",
    suggestedFor: ["pet-sitting", "overnight-care", "drop-in-visits"],
  },
  {
    slug: "holiday-visit",
    name: "Holiday Visit",
    description: "Care on a major holiday, when schedules fill up first.",
    price: 1500,
    icon: CalendarHeart,
    category: "extras",
    suggestedFor: [],
  },
  {
    slug: "pet-transportation",
    name: "Pet Transportation",
    description: "A ride to the vet, groomer, or daycare with door-to-door updates.",
    price: 3500,
    icon: Truck,
    category: "extras",
    suggestedFor: ["pet-sitting", "overnight-care", "drop-in-visits"],
  },
];

export function getAddOn(slug: AddOnSlug): AddOn | undefined {
  return addOns.find((addOn) => addOn.slug === slug);
}

export function getAddOns(slugs: AddOnSlug[]): AddOn[] {
  return slugs.map(getAddOn).filter((addOn): addOn is AddOn => Boolean(addOn));
}

/** Selectable add-ons for a service, in catalog order. */
export function addOnsForService(slug: ServiceSlug): AddOn[] {
  return addOns.filter((addOn) => addOn.suggestedFor.includes(slug) && !addOn.comingSoon);
}

export const addOnCategories: { id: AddOn["category"]; label: string; description: string }[] = [
  { id: "care", label: "Care", description: "More time, more attention, more of what they need." },
  { id: "comfort", label: "Comfort", description: "Small touches that make a visit feel better." },
  { id: "home", label: "Home", description: "The little things that keep a house looking lived-in." },
  { id: "extras", label: "Extras", description: "Occasion visits and richer updates." },
];
