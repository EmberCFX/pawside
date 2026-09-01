import {
  Bath,
  Bike,
  Cat,
  Clock,
  Dog,
  Footprints,
  GraduationCap,
  Home,
  Moon,
  Scissors,
  Sun,
  Truck,
} from "lucide-react";
import type { Service, ServiceSlug, UpcomingService } from "@/types";

/**
 * The six bookable services. Everything else on the site — nav, cards, booking
 * flow, sitemap, structured data, individual SEO pages — is generated from here.
 * Adding a seventh service means adding one entry (plus a pricing row in
 * data/pricing.ts) and nothing else.
 */
export const services: Service[] = [
  {
    slug: "dog-walking",
    name: "Dog Walking",
    longName: "Dog Walking",
    tagline: "Working late? We'll handle the walk.",
    summary:
      "Perfect for exercise, potty breaks, and breaking up long days at home.",
    description:
      "A real walk at your dog's pace — sniff stops included. We follow the route and pace they're used to, watch for heat and ice, and leave them with fresh water and a tired, happy face. You get a summary, a map, and photos before we lock up.",
    icon: Footprints,
    durations: [20, 30, 45, 60],
    defaultDuration: 30,
    pricingUnit: "visit",
    included: [
      "Leashed walk at your dog's pace",
      "Potty break and hydration check",
      "Paw wipe-down before we leave",
      "Fresh water refill",
      "Photo update and visit summary",
      "Doors locked, lights and alarm as you asked",
    ],
    idealFor: [
      "Dogs home alone during a long workday",
      "High-energy breeds who need a midday outlet",
      "Owners with unpredictable schedules",
      "Post-surgery dogs cleared for short, gentle walks",
    ],
    addOnSlugs: ["extended-playtime", "medication", "fresh-food-prep", "photo-package", "brushing"],
    faqs: [
      {
        question: "What if the weather is bad?",
        answer:
          "Safety sets the plan. In heat, ice, thunderstorms, or air-quality alerts we shorten the walk and move the time indoors — potty break, then enrichment, puzzle games, or training practice so they still burn energy. You'll always hear what we chose and why.",
      },
      {
        question: "Do you walk multiple dogs at once?",
        answer:
          "Only dogs from the same household, and only if they walk well together. Pawside doesn't run group walks with unfamiliar dogs.",
      },
      {
        question: "Can you use our harness and route?",
        answer:
          "Please — it's what your dog expects. Tell us where the gear lives and which way you normally turn out of the driveway, and we'll follow it.",
      },
    ],
    mediaKey: "service-dog-walking",
    featured: true,
    seo: {
      title: "Dog Walking",
      description:
        "Reliable dog walking with photo updates and a visit summary every time. 20, 30, 45, and 60-minute walks around the Pioneer Valley.",
      h1: "Dog walking that fits their real routine",
    },
  },
  {
    slug: "pet-sitting",
    name: "Pet Sitting",
    longName: "In-Home Pet Sitting",
    tagline: "Heading away? They'll stay comfortable at home.",
    summary:
      "Personalized care while you're working, traveling, or away for the day.",
    description:
      "Your pet stays in the place they already feel safe. We follow their normal day — meals, meds, walks, play, naps, and the spot on the couch they insist on — and keep the house looking lived-in while you're gone.",
    icon: Home,
    durations: [30, 45, 60, 90],
    defaultDuration: 60,
    pricingUnit: "visit",
    included: [
      "Care built around your pet's written routine",
      "Meals, fresh water, and treats as directed",
      "Medication administered on schedule",
      "Walk, yard time, or indoor play",
      "Litter, crate, or bedding tidied",
      "Mail, lights, and blinds handled on request",
      "Photo updates and a summary after every visit",
    ],
    idealFor: [
      "Travel and weekends away",
      "Pets who get stressed at boarding facilities",
      "Multi-pet households with different routines",
      "Anyone who'd rather not disrupt their pet's day",
    ],
    addOnSlugs: [
      "extra-walk",
      "medication",
      "fresh-food-prep",
      "litter-cleanup",
      "plant-watering",
      "mail-pickup",
      "home-check",
      "photo-package",
    ],
    faqs: [
      {
        question: "How many visits a day do most pets need?",
        answer:
          "Dogs usually do best with three or four visits a day; most cats are comfortable with one or two. We'll suggest a schedule after the meet & greet, and you can adjust it any time.",
      },
      {
        question: "Will the same person come every time?",
        answer:
          "That's the goal, and on most bookings it's the same caregiver start to finish. If a backup is ever needed, they get your pet's full profile first and you'll know before the visit.",
      },
      {
        question: "Can you water plants and bring in the mail?",
        answer:
          "Yes — add them at checkout. They're small things that make a house look occupied while you're gone.",
      },
    ],
    mediaKey: "service-pet-sitting",
    featured: true,
    seo: {
      title: "In-Home Pet Sitting",
      description:
        "In-home pet sitting that keeps your pet in their own space, on their own routine, with photo updates after every visit.",
      h1: "Pet sitting in the home they already love",
    },
  },
  {
    slug: "drop-in-visits",
    name: "Drop-In Visits",
    longName: "Drop-In Visits",
    tagline: "A quick check-in, done properly.",
    summary:
      "Quick check-ins for feeding, water, medication, litter, potty breaks, and attention.",
    description:
      "A focused 20 or 30 minutes covering the essentials: out to potty, food and fresh water, meds if needed, litter scooped, and a few minutes of company before we go. Ideal for the days when you're only gone a little too long.",
    icon: Clock,
    durations: [20, 30, 45],
    defaultDuration: 30,
    pricingUnit: "visit",
    included: [
      "Potty break or litter scoop",
      "Feeding and fresh water",
      "Medication if scheduled",
      "Quick wellness check",
      "A few minutes of attention or play",
      "Photo update and visit summary",
    ],
    idealFor: [
      "Long workdays and unexpected overtime",
      "Cats who need daily eyes on them",
      "Midday potty breaks for house-trained dogs",
      "Post-op or senior pets who need monitoring",
    ],
    addOnSlugs: ["extra-walk", "medication", "litter-cleanup", "fresh-food-prep", "home-check"],
    faqs: [
      {
        question: "How is a drop-in different from pet sitting?",
        answer:
          "It's shorter and task-focused. A drop-in covers the essentials in 20–30 minutes; pet sitting is a longer visit with more time for walks, play, and company.",
      },
      {
        question: "Can I book drop-ins twice a day?",
        answer:
          "Absolutely, and most travel schedules use exactly that. Pick both times in the booking flow and we'll space them across the day.",
      },
      {
        question: "Is there a same-day option?",
        answer:
          "Often yes. Same-day requests inside 12 hours carry a small short-notice fee, and we'll confirm by text before anything is charged.",
      },
    ],
    mediaKey: "service-drop-in-visits",
    featured: true,
    seo: {
      title: "Drop-In Pet Visits",
      description:
        "20 to 45-minute drop-in visits for feeding, water, medication, litter, and potty breaks — with a photo update every time.",
      h1: "Drop-in visits for the days that run long",
    },
  },
  {
    slug: "overnight-care",
    name: "Overnight Care",
    longName: "Overnight Pet Sitting",
    tagline: "Someone there when the house gets quiet.",
    summary:
      "Keep your pet comfortable at home with extended evening and overnight care.",
    description:
      "We arrive in the evening and stay through the night, so your pet keeps their bedtime, their bed, and company through the dark hours. Morning includes breakfast, meds, and a walk before we head out.",
    icon: Moon,
    durations: [],
    defaultDuration: null,
    pricingUnit: "night",
    included: [
      "12 hours of overnight coverage",
      "Evening walk or yard time",
      "Dinner, breakfast, and fresh water",
      "Medication morning and night",
      "Overnight company through the quiet hours",
      "Morning walk before departure",
      "House kept secure and tidy",
    ],
    idealFor: [
      "Pets with separation anxiety",
      "Senior pets who shouldn't be alone at night",
      "Puppies still learning to hold it overnight",
      "Trips where boarding isn't the right fit",
    ],
    addOnSlugs: [
      "extra-walk",
      "medication",
      "fresh-food-prep",
      "plant-watering",
      "mail-pickup",
      "home-check",
      "photo-package",
    ],
    faqs: [
      {
        question: "What hours does an overnight cover?",
        answer:
          "Typically 7:00 PM to 7:00 AM. We can shift the window earlier or later to match your pet's bedtime, and daytime visits can be added on either side.",
      },
      {
        question: "Do you sleep at our home?",
        answer:
          "Yes. We stay overnight so your pet isn't alone, and we only use the space you've set aside for us.",
      },
      {
        question: "Can you handle a puppy who wakes up at 2 AM?",
        answer:
          "That's part of the job. Overnight potty trips get logged in the morning summary so you can see how the night actually went.",
      },
    ],
    mediaKey: "service-overnight-care",
    featured: true,
    seo: {
      title: "Overnight Pet Sitting",
      description:
        "Overnight pet sitting in your own home — evening walk, dinner, medication, company through the night, and a morning walk.",
      h1: "Overnight care, in their own bed",
    },
  },
  {
    slug: "puppy-care",
    name: "Puppy Care",
    longName: "Puppy Visits & Care",
    tagline: "The frequent visits puppies actually need.",
    summary:
      "Extra visits, potty routines, feeding, playtime, and attention for growing puppies.",
    description:
      "Puppies need more of everything: more potty trips, more small meals, more short bursts of play, more consistency. We work from your training plan so the cues, words, and rewards stay identical whether you're home or not.",
    icon: Dog,
    durations: [20, 30, 45],
    defaultDuration: 30,
    pricingUnit: "visit",
    included: [
      "Frequent potty trips on your schedule",
      "Small meals and measured portions",
      "Crate routine followed exactly",
      "Short play and enrichment bursts",
      "Reinforcement of the cues you're teaching",
      "Accident cleanup, no drama",
      "Photo updates and a summary each visit",
    ],
    idealFor: [
      "New puppies between 8 weeks and a year",
      "Crate and potty training in progress",
      "Owners back at work after bringing a puppy home",
      "Households needing three or more visits a day",
    ],
    addOnSlugs: ["extended-playtime", "extra-walk", "fresh-food-prep", "photo-package", "medication"],
    faqs: [
      {
        question: "How often should a puppy be visited?",
        answer:
          "A rough guide is one hour per month of age between potty trips, so an eight-week puppy needs someone every two hours. We'll map a realistic schedule with you.",
      },
      {
        question: "Can you keep up our training?",
        answer:
          "Yes — share your cues, marker word, and treat rules and we'll use exactly those. Consistency is most of what makes training stick.",
      },
      {
        question: "What about accidents in the crate?",
        answer:
          "We clean the crate and bedding, get your puppy comfortable again, and note it in the summary so you can spot patterns.",
      },
    ],
    mediaKey: "service-puppy-care",
    featured: true,
    seo: {
      title: "Puppy Visits & Care",
      description:
        "Frequent puppy visits for potty training, small meals, crate routines, and play — following the training plan you've already started.",
      h1: "Puppy care on puppy time",
    },
  },
  {
    slug: "cat-care",
    name: "Cat Care",
    longName: "Cat Sitting & Care",
    tagline: "Quiet company, on their terms.",
    summary:
      "Feeding, litter maintenance, playtime, medication assistance, and companionship.",
    description:
      "Cats do best at home, and they notice when things change. We keep feeding times, litter, water, and play consistent — and we know the difference between a cat who wants attention and one who wants us to sit still and be ignored.",
    icon: Cat,
    durations: [20, 30, 45, 60],
    defaultDuration: 30,
    pricingUnit: "visit",
    included: [
      "Measured meals and fresh water",
      "Litter scooped and refreshed",
      "Wand or laser play if they're interested",
      "Medication, including pills and injections",
      "Wellness check — eating, drinking, hiding, output",
      "Blinds, lights, and mail on request",
      "Photo updates and a visit summary",
    ],
    idealFor: [
      "Travel and weekends away",
      "Shy cats who hide from strangers",
      "Senior cats on daily medication",
      "Multi-cat homes with separate feeding stations",
    ],
    addOnSlugs: ["litter-cleanup", "medication", "fresh-food-prep", "plant-watering", "photo-package"],
    faqs: [
      {
        question: "Our cat hides from strangers. Is that a problem?",
        answer:
          "It's normal and we don't force it. We do the tasks, sit quietly nearby, and confirm they're eating, drinking, and using the box. Most cats come out by the third visit — some never do, and that's fine too.",
      },
      {
        question: "Can you give injections or pills?",
        answer:
          "Yes, including insulin and subcutaneous fluids when you've shown us your method. Tell us what works and what to skip if they refuse.",
      },
      {
        question: "How long can cats go between visits?",
        answer:
          "Most healthy adult cats are comfortable with one visit a day. Kittens, seniors, and cats on medication usually need two.",
      },
    ],
    mediaKey: "service-cat-care",
    featured: true,
    seo: {
      title: "Cat Sitting & Care",
      description:
        "Cat sitting with measured meals, clean litter, medication, quiet company, and a photo update after every visit.",
      h1: "Cat care that respects the cat",
    },
  },
  {
    slug: "grooming",
    name: "Grooming",
    longName: "In-Home Grooming",
    tagline: "A tidy-up without the salon stress.",
    summary: "Baths, brush-outs, nail trims, and paw cleaning — in the home they already know.",
    description:
      "No crate in a waiting room, no strange dryer. We bring the bath, brush, and nail care to your kitchen or tub and work at your pet's pace. You get them back clean, with a photo of the before-and-after.",
    icon: Scissors,
    durations: [30, 45, 60, 90],
    defaultDuration: 60,
    pricingUnit: "visit",
    included: [
      "Nail trim and paw wipe",
      "Brush-out to cut mats and shedding",
      "Bath and towel dry when booked at 45 minutes or longer",
      "Ear wipe and sanitary tidy on request",
      "Your products used if you prefer them",
      "Photo update when we're done",
    ],
    idealFor: [
      "Pets who hate the salon",
      "Seniors who do better at home",
      "Muddy weeks and seasonal blowouts",
      "Between-groomer maintenance",
    ],
    addOnSlugs: ["bath-paw-cleaning", "brushing", "photo-package", "medication"],
    faqs: [
      {
        question: "Do you do haircuts and breed clips?",
        answer:
          "We handle baths, brush-outs, nails, and tidy-ups. Full breed clips and scissor cuts still belong with a salon groomer — we'll tell you honestly if that's what they need.",
      },
      {
        question: "What if my dog is nervous about water?",
        answer:
          "We go slower, use a handheld sprayer or a wipe-down instead of a full bath, and stop if they're overwhelmed. A half-done calm visit beats a finished one that wrecks their week.",
      },
      {
        question: "Do I need to provide shampoo?",
        answer:
          "We bring a gentle unscented wash. If they have a prescription or favorite bottle, leave it out and we'll use that.",
      },
    ],
    mediaKey: "service-grooming",
    featured: true,
    seo: {
      title: "In-Home Pet Grooming",
      description:
        "In-home grooming for Pioneer Valley pets — baths, brush-outs, and nail trims without the salon trip.",
      h1: "Grooming at home, on their terms",
    },
  },
  {
    slug: "pet-transportation",
    name: "Pet Transportation",
    longName: "Pet Transportation",
    tagline: "A ride to the vet, groomer, or daycare.",
    summary: "Door-to-door trips with updates when we pick up and when we arrive.",
    description:
      "We'll collect your pet, get them settled in the car, and take them where they need to go — vet, groomer, daycare, or home again — with a text when we leave and when we hand them off.",
    icon: Truck,
    durations: [30, 45, 60],
    defaultDuration: 30,
    pricingUnit: "visit",
    included: [
      "Pickup at your door",
      "Secure, leashed transfer into the car",
      "Direct trip to the appointment or facility",
      "Handoff to staff or you, as planned",
      "Text at pickup and on arrival",
      "Return trip can be booked as a second ride",
    ],
    idealFor: [
      "Vet visits during the workday",
      "Groomer drop-off and pickup",
      "Daycare commutes",
      "Pets who travel better with someone they know",
    ],
    addOnSlugs: ["photo-package", "medication", "special-occasion"],
    faqs: [
      {
        question: "Do you wait at the appointment?",
        answer:
          "The booked window covers the drive and handoff. If you want us to wait through the appointment and bring them home, book a longer trip or a second ride home.",
      },
      {
        question: "How far will you go?",
        answer:
          "Anywhere in our regular service area is the 30-minute rate. Longer trips toward Springfield, Worcester, or Hartford use the 45- or 60-minute rate — we'll confirm before we leave.",
      },
      {
        question: "Can two pets ride together?",
        answer:
          "Yes, if they're from the same household and ride well together. The additional-pet fee covers the second seat.",
      },
    ],
    mediaKey: "service-pet-transportation",
    featured: true,
    seo: {
      title: "Pet Transportation",
      description:
        "Pet transportation in the Pioneer Valley — rides to the vet, groomer, or daycare with updates at pickup and arrival.",
      h1: "A ride there, and a text when you arrive",
    },
  },
  {
    slug: "adventure-outings",
    name: "Adventure Outings",
    longName: "Adventure Outings",
    tagline: "Trail time for dogs who need real mileage.",
    summary: "Longer off-neighborhood walks and hikes for high-energy dogs.",
    description:
      "A neighborhood loop isn't enough for every dog. Adventure outings are 60 to 120 minutes on trails and quiet roads — sniffing, hills, and a tired ride home — with water, a paw check, and photos from the path.",
    icon: Bike,
    durations: [60, 90, 120],
    defaultDuration: 60,
    pricingUnit: "visit",
    included: [
      "Trail or quiet-road outing at your dog's pace",
      "Water and a mid-outing break",
      "Paw check before we load back up",
      "Towel-off if the trail is wet or muddy",
      "Photo update from the outing",
      "Same familiar caregiver whenever we can",
    ],
    idealFor: [
      "High-energy and working breeds",
      "Dogs who are restless after a regular walk",
      "Weekdays when you can't get to the trail",
      "Adventurous seniors who still want the woods, slower",
    ],
    addOnSlugs: ["extended-playtime", "bath-paw-cleaning", "brushing", "photo-package"],
    faqs: [
      {
        question: "Where do you go?",
        answer:
          "Nearby conservation land, rail trails, and quiet roads in the Pioneer Valley. Tell us if they have a favorite loop or anywhere to avoid, and we'll stick to it.",
      },
      {
        question: "Is this off-leash?",
        answer:
          "Only if you've said they have reliable recall and the land allows it. Default is a long line or regular leash — we don't take chances with traffic or wildlife.",
      },
      {
        question: "What about ticks and weather?",
        answer:
          "We do a quick coat and paw check after wooded outings. In heat, ice, or storms we shorten the route or switch to a shaded neighborhood loop and tell you why.",
      },
    ],
    mediaKey: "service-adventure-outings",
    featured: true,
    seo: {
      title: "Adventure Outings & Trail Walks",
      description:
        "60- to 120-minute trail outings for Pioneer Valley dogs who need more than a neighborhood walk.",
      h1: "Outings with real mileage",
    },
  },
];

/** Services on the roadmap. Shown honestly as not-yet-available. */
export const upcomingServices: UpcomingService[] = [
  {
    name: "Doggy Daycare",
    description: "Supervised daytime play in small, matched groups.",
    icon: Sun,
    status: "planned",
  },
  {
    name: "Boarding",
    description: "Overnight stays in a vetted home when yours isn't an option.",
    icon: Bath,
    status: "planned",
  },
  {
    name: "Training Support",
    description: "Reinforcement between sessions with your trainer.",
    icon: GraduationCap,
    status: "planned",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export const serviceSlugs = services.map((service) => service.slug);

export function isServiceSlug(value: string): value is ServiceSlug {
  return serviceSlugs.includes(value as ServiceSlug);
}
