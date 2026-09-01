import type { Testimonial } from "@/types";

/**
 * SAMPLE CONTENT — replace with real, permissioned reviews before launch.
 *
 * Keep the shape identical and the components need no changes. Do not publish
 * these as if they were real customers.
 */
export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    quote:
      "I used to spend the whole workday feeling guilty. Now I get a photo of Bella flopped in the grass at 1:15 and I just get back to work.",
    ownerName: "Marissa",
    petName: "Bella",
    petType: "dog",
    location: "Easthampton",
    rating: 5,
    serviceSlug: "dog-walking",
    mediaKey: "pet-bella",
  },
  {
    id: "t-2",
    quote:
      "Our cat hides from everyone. The updates said exactly that for two days, then a photo of her on the counter on day three. That honesty is why I keep booking.",
    ownerName: "Dev",
    petName: "Olive",
    petType: "cat",
    location: "Northampton",
    rating: 5,
    serviceSlug: "cat-care",
    mediaKey: "pet-olive",
  },
  {
    id: "t-3",
    quote:
      "Max is thirteen and on four medications. Everything was given on time, written down, and explained. I stopped checking my phone every hour on vacation.",
    ownerName: "Joanne",
    petName: "Max",
    petType: "dog",
    location: "Southampton",
    rating: 5,
    serviceSlug: "pet-sitting",
    mediaKey: "pet-max",
  },
  {
    id: "t-4",
    quote:
      "We brought home a puppy two weeks before a work trip. Three visits a day, same crate routine we were using, no backsliding on training.",
    ownerName: "Alex",
    petName: "Juno",
    petType: "dog",
    location: "Holyoke",
    rating: 5,
    serviceSlug: "puppy-care",
  },
  {
    id: "t-5",
    quote:
      "The overnight option changed how we travel. Luna sleeps in her own bed and someone's there if she gets anxious at 3 AM.",
    ownerName: "Priya",
    petName: "Luna",
    petType: "cat",
    location: "Amherst",
    rating: 5,
    serviceSlug: "overnight-care",
    mediaKey: "pet-luna",
  },
  {
    id: "t-6",
    quote:
      "Same person every week. Cooper hears the car door and loses his mind before she's even at the porch. You can't fake that.",
    ownerName: "Ben",
    petName: "Cooper",
    petType: "dog",
    location: "Easthampton",
    rating: 5,
    serviceSlug: "dog-walking",
  },
  {
    id: "t-7",
    quote:
      "Booked a drop-in at 8 AM for the same afternoon because a meeting ran over. Confirmed in twenty minutes, no fuss about it.",
    ownerName: "Tasha",
    petName: "Pepper",
    petType: "dog",
    location: "Westhampton",
    rating: 5,
    serviceSlug: "drop-in-visits",
  },
  {
    id: "t-8",
    quote:
      "Two dogs, one who's reactive on leash. They asked more questions in the meet & greet than our last sitter asked in a year.",
    ownerName: "Nora",
    petName: "Rosie & Gus",
    petType: "dog",
    location: "Hadley",
    rating: 5,
    serviceSlug: "pet-sitting",
  },
];

/** Featured on the homepage social-proof band. */
export const featuredTestimonialIds = ["t-1", "t-2", "t-3", "t-5"];
