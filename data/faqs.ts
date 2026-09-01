import type { Faq } from "@/types";

/** Homepage + /faq accordion content. Also emitted as FAQPage structured data. */
export const faqs: Faq[] = [
  {
    id: "how-sitting-works",
    question: "How does pet sitting work?",
    answer:
      "It starts with a free meet & greet at your home. We go through your pet's routine, meet them on their own turf, and figure out how many visits a day actually makes sense. After that you book online, we confirm, and you get a summary with photos after every visit.",
    category: "booking",
  },
  {
    id: "same-sitter",
    question: "Will I have the same sitter?",
    answer:
      "That's the whole idea. Pawside is built around the same caregiver returning to the same pets, because familiarity is what makes an animal relax. If a backup is ever needed, they receive your pet's full profile beforehand and you'll know who's coming before they arrive.",
    category: "care",
  },
  {
    id: "multiple-pets",
    question: "Can you care for multiple pets?",
    answer:
      "Yes, and most of our households have more than one. The first pet is included in the visit rate and each additional pet is a small per-visit fee. Different diets, medications, and personalities are normal — we keep separate routines straight.",
    category: "care",
  },
  {
    id: "medication",
    question: "Do you administer medication?",
    answer:
      "Yes. Pills, liquids, topicals, ear and eye drops, insulin, and subcutaneous fluids, as long as you show us your method during the meet & greet. Everything is logged with the time it was given.",
    category: "care",
  },
  {
    id: "entry",
    question: "How do I provide entry instructions?",
    answer:
      "During booking, or in your pet's profile. Lockbox, keypad code, garage code, hidden key, or a spare key we keep on file — whatever you prefer. Codes are stored with your booking and shared only with your assigned caregiver.",
    category: "logistics",
  },
  {
    id: "updates",
    question: "Do I receive updates?",
    answer:
      "Every visit. You get a summary of what happened — walk length, potty, food, water, medication, and a note from the caregiver — plus photos. No news is never the plan.",
    category: "care",
  },
  {
    id: "weather",
    question: "What happens during bad weather?",
    answer:
      "Your pet's safety decides the plan. In extreme heat, ice, thunderstorms, or poor air quality we shorten outdoor time and shift to indoor enrichment, then tell you what we did instead. Visits aren't skipped for weather — they're adapted.",
    category: "logistics",
  },
  {
    id: "recurring",
    question: "Do you offer recurring walks?",
    answer:
      "Yes, and they're the backbone of the schedule. Pick a weekly or multi-day-per-week rhythm and we hold that slot for you at a recurring discount. Skip a week any time.",
    category: "booking",
  },
  {
    id: "overnight",
    question: "Do you offer overnight care?",
    answer:
      "Yes — usually 7:00 PM to 7:00 AM in your home, including an evening walk, dinner, medication, overnight company, and a morning walk. The window can shift to fit your pet's bedtime.",
    category: "booking",
  },
  {
    id: "animals",
    question: "What animals do you care for?",
    answer:
      "Dogs and cats primarily, plus rabbits, guinea pigs, birds, and fish. For reptiles, farm animals, or anything with specialized handling needs, ask and we'll be straight with you about whether we're the right fit.",
    category: "care",
  },
  {
    id: "advance",
    question: "How far in advance should I book?",
    answer:
      "A few days is plenty for routine visits. For holidays and school vacation weeks, two to four weeks is safer — those fill first. Same-day requests are often possible with a short-notice fee.",
    category: "booking",
  },
  {
    id: "cancellation",
    question: "What is your cancellation policy?",
    answer:
      "Cancel or reschedule at no charge up to 24 hours before a visit. Inside 24 hours we charge half the visit rate, and inside 4 hours the full rate, because the time was held for you. Pawside+ members get a wider free window.",
    category: "policies",
  },
  {
    id: "insurance",
    question: "Are you insured?",
    answer:
      "Yes — Pawside carries pet-care liability insurance and is bonded. We'll share proof of coverage at the meet & greet, and we're happy to send it sooner if you'd like it before booking.",
    category: "policies",
  },
  {
    id: "keys",
    question: "What happens to my key between visits?",
    answer:
      "For recurring clients we can keep a labeled key with a code that isn't your name or address, stored in a locked box. For one-time bookings most people prefer a lockbox or keypad code they reset afterward.",
    category: "logistics",
  },
];

export function faqsByCategory(category: Faq["category"]): Faq[] {
  return faqs.filter((faq) => faq.category === category);
}

/** Shortlist used on the homepage. */
export const homepageFaqIds = [
  "how-sitting-works",
  "same-sitter",
  "multiple-pets",
  "medication",
  "updates",
  "weather",
  "recurring",
  "cancellation",
];

export const faqCategories: { id: Faq["category"]; label: string }[] = [
  { id: "booking", label: "Booking" },
  { id: "care", label: "Care" },
  { id: "logistics", label: "Logistics" },
  { id: "policies", label: "Policies" },
];
