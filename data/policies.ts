import { site } from "./site";

export interface PolicySection {
  heading: string;
  body: string[];
  list?: string[];
}

export interface Policy {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: PolicySection[];
}

/**
 * PLACEHOLDER LEGAL COPY.
 *
 * These read like real operating policies so the pages are usable at launch, but
 * they are not legal advice. Have counsel review the terms and privacy pages
 * before going live, then edit here — the pages render straight from this file.
 */
export const policies: Policy[] = [
  {
    slug: "cancellation",
    title: "Cancellation & Rescheduling",
    summary:
      "How much notice we need, what happens when plans change, and when a fee applies.",
    updated: "2026-08-01",
    sections: [
      {
        heading: "The short version",
        body: [
          `Cancel or reschedule at least ${site.policies.cancellationWindowHours} hours before your visit and there is no charge. Inside that window, we charge half the visit rate, because the time has already been held for you and turned away from someone else.`,
        ],
      },
      {
        heading: "Recurring visits",
        body: [
          "Skip a week whenever you need to — just let us know by the day before. Your recurring discount stays intact through short pauses. If you need to stop entirely, tell us and we will release the slot at the end of the current week.",
        ],
      },
      {
        heading: "Holidays and peak weeks",
        body: [
          "Holiday bookings need 72 hours notice to cancel without a charge. These dates fill months ahead and are hard to backfill.",
        ],
      },
      {
        heading: "When we cancel",
        body: [
          "If weather, illness, or an emergency means we cannot make a visit, you are never charged, and we will tell you as early as we possibly can. If a backup caregiver can cover, we will offer that first.",
        ],
      },
      {
        heading: "Late additions",
        body: [
          `Booking inside ${site.policies.lastMinuteNoticeHours} hours is welcome when we have room — a short-notice fee applies and is shown in your quote before you confirm.`,
        ],
      },
    ],
  },
  {
    slug: "pet-safety",
    title: "Pet Safety & Care Standards",
    summary: "The standards every Pawside visit is held to, and what we do when something is off.",
    updated: "2026-08-01",
    sections: [
      {
        heading: "Before the first visit",
        body: [
          "Every new client gets a free meet & greet. We meet your pets on their own turf, walk through the routine, test keys and entry codes, and write everything into your pet's profile so no visit ever depends on someone remembering.",
        ],
      },
      {
        heading: "During every visit",
        body: ["Regardless of service, every visit includes:"],
        list: [
          "Fresh water and a check on food",
          "A look over your pet for anything unusual — limping, scratching, appetite, mood",
          "Cleanup of any accidents",
          "A written summary and photos, sent the same day",
          "Doors, gates, and locks verified before we leave",
        ],
      },
      {
        heading: "Leashes and off-leash",
        body: [
          "Dogs are leashed at all times in public, no exceptions, regardless of recall. We use your equipment when you have a preference, and we carry backup leashes and slip leads. We do not visit dog parks unless you have asked for it in writing.",
        ],
      },
      {
        heading: "Weather",
        body: [
          "Extreme heat, ice, or thunderstorms shorten a walk into indoor enrichment and a quick relief break. We would rather give your dog fifteen good minutes than push through conditions that hurt their paws.",
        ],
      },
      {
        heading: "If something goes wrong",
        body: [
          "You get a call, not a text, the moment we think your pet needs a vet. If we cannot reach you, we contact your emergency contact and take your pet to the clinic listed on their profile. Care costs are billed to you, and we never delay treatment while waiting for approval on something urgent.",
        ],
      },
      {
        heading: "Caregiver screening",
        body: [
          "Every caregiver clears a background check, completes pet first-aid and CPR training, and shadows visits before ever working alone. You'll know who is coming before they arrive.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "What we collect, why we collect it, and what we never do with it.",
    updated: "2026-08-01",
    sections: [
      {
        heading: "What we collect",
        body: ["Only what a visit actually requires:"],
        list: [
          "Your name, email, phone, and service address",
          "Entry instructions and access codes",
          "Pet details — routine, medication, vet, emergency contact",
          "Booking history and payment records (card details are held by our payment processor, never by us)",
          "Basic, aggregate analytics about how the site is used",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "To schedule and deliver your visits, send visit reports, process payment, and answer your questions. That is the whole list.",
        ],
      },
      {
        heading: "What we never do",
        body: [
          "We do not sell your information. We do not share it with advertisers. We do not share your address or entry codes with anyone beyond the caregivers assigned to your visits.",
        ],
      },
      {
        heading: "Service providers",
        body: [
          "We rely on a small number of vendors — payment processing, scheduling, email delivery, and hosting. They receive only the data needed to do their job, and are bound to keep it confidential.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          `Ask for a copy of your data, corrections, or deletion at any time by emailing ${site.contact.email}. Deleting your account removes your profile and entry instructions; we retain invoices as long as tax law requires.`,
        ],
      },
      {
        heading: "Photos",
        body: [
          "Photos from your visits are yours. We only share them publicly if you tell us it is okay, and you can withdraw that at any time.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    summary: "The agreement between you and Pawside when you book a visit.",
    updated: "2026-08-01",
    sections: [
      {
        heading: "Booking",
        body: [
          "Booking a visit is a request until we confirm it. Confirmation arrives by text and email, usually within a few hours during business hours. Prices shown at checkout are what you pay unless the scope of the visit changes at your request.",
        ],
      },
      {
        heading: "Payment",
        body: [
          "One-time visits are charged after the visit is complete. Recurring visits are charged weekly. Memberships bill monthly on your signup date and can be cancelled any time before the next renewal.",
        ],
      },
      {
        heading: "Access to your home",
        body: [
          "You are responsible for making sure we can get in — a working key, code, or lockbox. If we cannot enter, we will call you immediately, and a lockout is billed as a completed visit because the time was held and travelled.",
        ],
      },
      {
        heading: "Your pet's behavior",
        body: [
          "Tell us honestly about bites, reactivity, resource guarding, or escape attempts. We can work with almost anything when we know about it. We reserve the right to end service if a pet is unsafe for our caregivers and we cannot find a safe arrangement.",
        ],
      },
      {
        heading: "If something happens",
        body: [
          "If a visit requires emergency veterinary care, we follow the clinic and contacts on your pet's profile and you are responsible for those costs. Pawside is not responsible for pre-existing medical conditions, harm caused by other animals or people, or damage from a pet's normal behavior in your home.",
        ],
      },
      {
        heading: "Changes",
        body: [
          `These terms may change as the business grows. We will email active clients before any material change takes effect. Questions go to ${site.contact.email}.`,
        ],
      },
    ],
  },
];

export function getPolicy(slug: string): Policy | undefined {
  return policies.find((policy) => policy.slug === slug);
}
