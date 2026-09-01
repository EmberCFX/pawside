import type { Invoice, PetProfile, Visit, VisitReport } from "@/types";

/**
 * MOCK ACCOUNT DATA.
 *
 * The dashboard renders entirely from these fixtures so the UI can be reviewed
 * before auth exists. Integration point: replace each export with a query
 * (Supabase, Prisma, etc.) returning the same shape — see lib/api.ts.
 */

export const currentCustomer = {
  firstName: "Marissa",
  lastName: "Okafor",
  email: "marissa@example.com",
  phone: "(413) 555-0119",
  address: "18 Pleasant Street, Easthampton, MA 01027",
  membershipSlug: "pawside-plus" as const,
  memberSince: "2025-03-14",
  /** Cents of unused care credit. */
  credit: 0,
  entryInstructions: "Keypad on side door, code 4-4-1-9. Please re-lock and leave the porch light on.",
};

export const petProfiles: PetProfile[] = [
  {
    id: "pet-bella",
    name: "Bella",
    type: "dog",
    breed: "Golden Retriever",
    age: "6 years",
    weight: "68 lb",
    birthday: "2020-04-02",
    veterinarian: "Valley Veterinary Clinic — (413) 555-0170",
    emergencyContact: "Dan Okafor — (413) 555-0121",
    feedingRoutine: "1.5 cups kibble at 7:30 AM and 5:30 PM. One dental chew after dinner.",
    walkRoutine: "Left out of the driveway toward the pond. Around 30 minutes, longer if it's cool.",
    medication: "Glucosamine chew with breakfast.",
    allergies: "Chicken — check treat labels.",
    behaviorNotes:
      "Friendly with everyone. Pulls hard for the first two minutes, then settles. Terrified of the vacuum.",
    favoriteToys: "Blue rope tug, deflated soccer ball",
    favoriteTreats: "Peanut butter biscuits (in the tin on the counter)",
    specialInstructions: "Towel by the back door for muddy paws. She will pretend she hasn't eaten.",
    entryInstructions: "Side door keypad, code 4-4-1-9.",
    mediaKey: "pet-bella",
  },
  {
    id: "pet-olive",
    name: "Olive",
    type: "cat",
    breed: "Tuxedo, domestic shorthair",
    age: "11 years",
    weight: "9 lb",
    birthday: "2015-09-20",
    veterinarian: "Valley Veterinary Clinic — (413) 555-0170",
    emergencyContact: "Dan Okafor — (413) 555-0121",
    feedingRoutine: "Half a can of wet food morning and evening. Dry food topped off as needed.",
    walkRoutine: "Indoor only. Never let her onto the porch.",
    medication: "Thyroid pill in a pill pocket each morning.",
    allergies: "None known.",
    behaviorNotes:
      "Hides under the bed for the first day or two. Will come out for the wand toy. Does not like being picked up.",
    favoriteToys: "Feather wand, crinkle ball",
    favoriteTreats: "Freeze-dried salmon",
    specialInstructions: "Two litter boxes — one in the basement, one in the upstairs bath.",
    entryInstructions: "Side door keypad, code 4-4-1-9.",
    mediaKey: "pet-olive",
  },
];

export const upcomingVisits: Visit[] = [
  {
    id: "v-2041",
    petNames: ["Bella"],
    serviceSlug: "dog-walking",
    serviceName: "Dog Walking",
    date: "2026-09-02",
    time: "1:00 PM",
    durationMinutes: 30,
    caregiverName: "Case",
    status: "confirmed",
    total: 2470,
    recurring: true,
  },
  {
    id: "v-2042",
    petNames: ["Bella", "Olive"],
    serviceSlug: "pet-sitting",
    serviceName: "Pet Sitting",
    date: "2026-09-05",
    time: "9:00 AM",
    durationMinutes: 60,
    caregiverName: "Case",
    status: "scheduled",
    total: 4750,
    recurring: false,
  },
  {
    id: "v-2043",
    petNames: ["Bella"],
    serviceSlug: "dog-walking",
    serviceName: "Dog Walking",
    date: "2026-09-09",
    time: "1:00 PM",
    durationMinutes: 30,
    caregiverName: "Case",
    status: "scheduled",
    total: 2470,
    recurring: true,
  },
];

export const pastVisits: Visit[] = [
  {
    id: "v-2038",
    petNames: ["Bella"],
    serviceSlug: "dog-walking",
    serviceName: "Dog Walking",
    date: "2026-08-26",
    time: "1:00 PM",
    durationMinutes: 30,
    caregiverName: "Case",
    status: "completed",
    total: 2470,
    recurring: true,
    reportId: "r-8801",
  },
  {
    id: "v-2035",
    petNames: ["Olive"],
    serviceSlug: "cat-care",
    serviceName: "Cat Care",
    date: "2026-08-19",
    time: "5:30 PM",
    durationMinutes: 30,
    caregiverName: "Case",
    status: "completed",
    total: 2280,
    recurring: false,
    reportId: "r-8794",
  },
  {
    id: "v-2031",
    petNames: ["Bella", "Olive"],
    serviceSlug: "pet-sitting",
    serviceName: "Pet Sitting",
    date: "2026-08-11",
    time: "10:00 AM",
    durationMinutes: 60,
    caregiverName: "Case",
    status: "completed",
    total: 4750,
    recurring: false,
    reportId: "r-8780",
  },
];

/**
 * The homepage "Pawside Report" sample and the dashboard report cards share this
 * shape, so the marketing preview can never drift from the real product.
 */
export const visitReports: VisitReport[] = [
  {
    id: "r-8801",
    petName: "Bella",
    serviceName: "Dog Walking",
    date: "Tuesday, August 26",
    time: "2:30 PM",
    caregiverName: "Case",
    durationMinutes: 31,
    distanceMiles: 1.4,
    tasks: [
      { label: "Walk", status: "done", detail: "31 minutes · 1.4 miles" },
      { label: "Potty", status: "done", detail: "Both, normal" },
      { label: "Food", status: "done", detail: "Half scoop, finished it" },
      { label: "Water", status: "done", detail: "Bowl washed and refilled" },
      { label: "Medication", status: "not-required" },
      { label: "Paws wiped", status: "done" },
    ],
    note: "Bella had a great walk today and spent the last few minutes relaxing in the backyard. She ate her snack and has fresh water. Left the towel on the hook by the back door.",
    photoCount: 3,
    mediaKeys: ["report-photo-1", "report-photo-2", "report-photo-3"],
  },
  {
    id: "r-8794",
    petName: "Olive",
    serviceName: "Cat Care",
    date: "Wednesday, August 19",
    time: "5:30 PM",
    caregiverName: "Case",
    durationMinutes: 30,
    tasks: [
      { label: "Wet food", status: "done", detail: "Half can, ate about two-thirds" },
      { label: "Water", status: "done" },
      { label: "Litter", status: "done", detail: "Both boxes scooped" },
      { label: "Thyroid pill", status: "done", detail: "Given at 5:40 PM in a pill pocket" },
      { label: "Playtime", status: "done", detail: "Feather wand, about 8 minutes" },
    ],
    note: "Olive came out on her own tonight, which is new. Played until she got bored of me. Blinds closed, hall light on.",
    photoCount: 2,
    mediaKeys: ["report-photo-2", "report-photo-3"],
  },
  {
    id: "r-8780",
    petName: "Bella & Olive",
    serviceName: "Pet Sitting",
    date: "Tuesday, August 11",
    time: "10:00 AM",
    caregiverName: "Case",
    durationMinutes: 60,
    distanceMiles: 0.9,
    tasks: [
      { label: "Walk", status: "done", detail: "22 minutes · 0.9 miles" },
      { label: "Breakfast", status: "done", detail: "Both fed separately" },
      { label: "Litter", status: "done" },
      { label: "Medication", status: "done", detail: "Olive's thyroid pill" },
      { label: "Playtime", status: "done", detail: "Rope tug with Bella" },
      { label: "Mail", status: "done", detail: "On the entry table" },
    ],
    note: "Quiet morning. Bella napped after her walk and Olive supervised from the stairs. Everyone's fed, water's fresh, doors locked.",
    photoCount: 4,
    mediaKeys: ["report-photo-1", "report-photo-3"],
  },
];

export const invoices: Invoice[] = [
  {
    id: "inv-1",
    number: "PS-2026-0184",
    date: "2026-08-26",
    description: "Dog Walking · 30 min · Bella",
    amount: 2470,
    status: "paid",
  },
  {
    id: "inv-2",
    number: "PS-2026-0179",
    date: "2026-08-19",
    description: "Cat Care · 30 min · Olive",
    amount: 2280,
    status: "paid",
  },
  {
    id: "inv-3",
    number: "PS-2026-0171",
    date: "2026-08-11",
    description: "Pet Sitting · 60 min · Bella & Olive",
    amount: 4750,
    status: "paid",
  },
  {
    id: "inv-4",
    number: "PS-2026-0166",
    date: "2026-08-01",
    description: "Pawside+ membership — August",
    amount: 1900,
    status: "paid",
  },
];

export const messages = [
  {
    id: "m-1",
    from: "Case",
    initials: "C",
    date: "Aug 26",
    preview:
      "Bella did great today. Heads up that the side gate latch is sticking — I got it closed but wanted you to know.",
    unread: true,
  },
  {
    id: "m-2",
    from: "Pawside",
    initials: "P",
    date: "Aug 24",
    preview:
      "Your September recurring walks are confirmed. Reply here if you need to skip a week.",
    unread: false,
  },
  {
    id: "m-3",
    from: "Case",
    initials: "C",
    date: "Aug 19",
    preview: "Olive came out to play tonight! First time. Photos are in the visit summary.",
    unread: false,
  },
];

export function getVisitReport(id: string): VisitReport | undefined {
  return visitReports.find((report) => report.id === id);
}

export function getPetProfile(id: string): PetProfile | undefined {
  return petProfiles.find((pet) => pet.id === id);
}
