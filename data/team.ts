import type { TeamMember } from "@/types";

/**
 * SAMPLE CONTENT — replace with the real founder/team bios and photos.
 *
 * The array is intentionally plural: Pawside can add caregivers without any
 * layout change, and the About page adapts from one person to several.
 */
export const team: TeamMember[] = [
  {
    name: "Case",
    role: "Founder & Lead Caregiver",
    bio: "I started Pawside after years of watching friends and neighbors scramble for someone reliable. I'd rather know twenty families and their animals well than take every booking that comes in — that's the whole business model.",
    credentials: [
      "Pet First Aid & CPR certified",
      "Insured & bonded",
      "8 years caring for dogs and cats",
      "Comfortable with senior and medicated pets",
    ],
    mediaKey: "about-portrait",
    favoritePart:
      "The dogs who start waiting by the window five minutes before I'm due.",
  },
];

/** Care philosophy points used on the About page. */
export const values = [
  {
    title: "The animal sets the pace",
    description:
      "Some dogs want two miles. Some want to sniff one hedge for ten minutes. Neither is wrong, and we don't rush either.",
  },
  {
    title: "Say what actually happened",
    description:
      "If your cat hid the whole visit, or your dog didn't finish dinner, you'll hear it. Honest updates are worth more than reassuring ones.",
  },
  {
    title: "Consistency over volume",
    description:
      "We cap how many households we take so the same caregiver can keep showing up for the same pets.",
  },
  {
    title: "Your home, your rules",
    description:
      "Shoes off, no dogs on the couch, side door only, alarm code re-armed. Tell us once and it's how we operate.",
  },
];

/** Safety commitments — referenced on About and the Pet Safety policy page. */
export const safetyCommitments = [
  {
    title: "Pet first aid & CPR certified",
    description: "Recertified regularly, with a stocked kit in the car.",
  },
  {
    title: "Insured and bonded",
    description: "Coverage for the pets in our care and your home while we're in it.",
  },
  {
    title: "Vet and emergency contacts on file",
    description:
      "Your veterinarian, a backup clinic, and your emergency contact are saved with each pet profile before the first visit.",
  },
  {
    title: "Secure entry handling",
    description:
      "Codes and keys are stored without identifying details and shared only with your assigned caregiver.",
  },
  {
    title: "Weather and heat protocols",
    description:
      "Pavement checks in summer, paw protection in winter, and indoor enrichment when it isn't safe outside.",
  },
  {
    title: "GPS-tracked walks",
    description: "Every walk logs its route, duration, and distance in your visit summary.",
  },
];
