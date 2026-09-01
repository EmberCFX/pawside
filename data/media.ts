/**
 * Photography slots.
 *
 * Every image on the site is registered here so photography can be swapped
 * without touching a single component. Drop real files into /public/photos and
 * set `src` (e.g. "/photos/hero-golden.jpg"), or point `src` at a remote URL on
 * an allowed host (see next.config.ts remotePatterns).
 *
 * While `src` is null, <Photo /> renders an on-brand placeholder using the logo's
 * heart-line motif — intentional-looking, zero network requests, and impossible
 * to mistake for finished art.
 */
export type MediaTone = "cream" | "sand" | "mint" | "navy";
export type MediaMotif = "duo" | "heart" | "none";

export interface MediaSlot {
  /** Path to the photograph. Null renders the branded placeholder. */
  src: string | null;
  /** Required. Describes the final intended image so it survives a photo swap. */
  alt: string;
  /** Intrinsic size of the asset at `src`. Update to match any replacement. */
  width: number;
  height: number;
  tone: MediaTone;
  motif: MediaMotif;
  /** Art direction note for whoever shoots or sources the real photo. */
  brief: string;
}

export const media = {
  "hero-primary": {
    src: "/photos/hero-primary.jpg",
    alt: "A golden retriever resting on a sunlit living room rug, looking calmly toward the window",
    width: 1024,
    height: 1536,
    tone: "cream",
    motif: "duo",
    brief:
      "Vertical. Real home interior, warm afternoon light, dog relaxed and unposed. No props, no studio backdrop.",
  },
  "hero-secondary": {
    src: "/photos/hero-secondary.jpg",
    alt: "A caregiver clipping a leash onto an excited terrier by a front door",
    width: 1024,
    height: 1024,
    tone: "sand",
    motif: "none",
    brief: "Square. Hands-and-leash detail at the door. Candid, slight motion blur is welcome.",
  },
  "emotional-wide": {
    src: "/photos/emotional-wide.jpg",
    alt: "A dog curled up asleep on a couch beside a window in the late afternoon",
    width: 1536,
    height: 1024,
    tone: "navy",
    motif: "heart",
    brief:
      "Wide, editorial. Quiet and warm — the feeling of a pet who is comfortable at home. Subject sits right of centre so the left third stays clear for the headline overlay.",
  },
  "how-it-works": {
    src: "/photos/how-it-works.jpg",
    alt: "A phone showing a Pawside visit summary held in one hand on a walk",
    width: 1024,
    height: 1536,
    tone: "sand",
    motif: "none",
    brief:
      "Vertical. Phone in hand outdoors, leash visible. Keep the screen soft and out of focus rather than legible — a real screenshot can be composited later if we want the UI to read.",
  },
  "service-dog-walking": {
    src: "/photos/service-dog-walking.jpg",
    alt: "A dog walking on a leash along a tree-lined neighborhood sidewalk",
    width: 1536,
    height: 1024,
    tone: "sand",
    motif: "none",
    brief: "Low angle, moving dog, dappled light through street trees.",
  },
  "service-pet-sitting": {
    src: "/photos/service-pet-sitting.jpg",
    alt: "A cat and a dog relaxing together in a bright living room",
    width: 1536,
    height: 1024,
    tone: "cream",
    motif: "duo",
    brief: "Multi-pet household at ease. Lived-in home, not a set.",
  },
  "service-drop-in-visits": {
    src: "/photos/service-drop-in-visits.jpg",
    alt: "A bowl being refilled with fresh water in a kitchen while a dog waits nearby",
    width: 1536,
    height: 1024,
    tone: "cream",
    motif: "none",
    brief: "Task-focused detail shot: hands, bowl, kitchen floor.",
  },
  "service-overnight-care": {
    src: "/photos/service-overnight-care.jpg",
    alt: "A dog asleep on a dog bed in a dimly lit bedroom at night",
    width: 1536,
    height: 1024,
    tone: "navy",
    motif: "heart",
    brief: "Evening interior, lamplight, calm. Should feel safe rather than dark.",
  },
  "service-puppy-care": {
    src: "/photos/service-puppy-care.jpg",
    alt: "A puppy chewing a toy on a kitchen floor beside a training pad",
    width: 1536,
    height: 1024,
    tone: "mint",
    motif: "none",
    brief: "Playful energy, slightly messy realism. Avoid greeting-card cuteness.",
  },
  "service-cat-care": {
    src: "/photos/service-cat-care.jpg",
    alt: "A tabby cat stretching on a windowsill in morning light",
    width: 1536,
    height: 1024,
    tone: "cream",
    motif: "none",
    brief: "Backlit window light, cat mid-stretch. Quiet and elegant.",
  },
  "report-photo-1": {
    src: "/photos/report-photo-1.jpg",
    alt: "A beagle mid-walk on a gravel path, tail up",
    width: 900,
    height: 900,
    tone: "sand",
    motif: "none",
    brief: "Looks like a caregiver's phone photo — slightly imperfect framing is the point.",
  },
  "report-photo-2": {
    src: "/photos/report-photo-2.jpg",
    alt: "A dog lying in the grass in a fenced backyard",
    width: 900,
    height: 900,
    tone: "mint",
    motif: "none",
    brief: "Backyard, grass, relaxed pose.",
  },
  "report-photo-3": {
    src: "/photos/report-photo-3.jpg",
    alt: "A freshly filled water bowl and a full food bowl on a kitchen mat",
    width: 900,
    height: 900,
    tone: "cream",
    motif: "none",
    brief: "Simple proof-of-care detail.",
  },
  "about-portrait": {
    src: "/photos/about-portrait.jpg",
    alt: "Pawside's founder sitting on a porch step with two dogs",
    width: 1024,
    height: 1536,
    tone: "cream",
    motif: "duo",
    brief:
      "Vertical portrait, natural light, genuine. This photo carries the whole About page — it must be the real founder before launch, not a stand-in.",
  },
  "about-detail": {
    src: "/photos/about-detail.jpg",
    alt: "A hand resting on a senior dog's shoulder",
    width: 1536,
    height: 1024,
    tone: "sand",
    motif: "heart",
    brief: "Close, tender, no faces required.",
  },
  "careers-team": {
    src: "/photos/careers-team.jpg",
    alt: "Two Pawside caregivers loading leashes into a car on a quiet residential street",
    width: 1536,
    height: 1024,
    tone: "cream",
    motif: "heart",
    brief:
      "Candid, working, unposed. Must be real caregivers before launch rather than a stand-in team photo.",
  },
  "pet-luna": {
    src: "/photos/pet-luna.jpg",
    alt: "Luna, a black cat with green eyes",
    width: 600,
    height: 600,
    tone: "navy",
    motif: "none",
    brief: "Pet avatar, tight crop on the face.",
  },
  "pet-bella": {
    src: "/photos/pet-bella.jpg",
    alt: "Bella, a golden retriever",
    width: 600,
    height: 600,
    tone: "cream",
    motif: "none",
    brief: "Pet avatar, tight crop on the face.",
  },
  "pet-max": {
    src: "/photos/pet-max.jpg",
    alt: "Max, a terrier mix",
    width: 600,
    height: 600,
    tone: "sand",
    motif: "none",
    brief: "Pet avatar, tight crop on the face.",
  },
  "pet-olive": {
    src: "/photos/pet-olive.jpg",
    alt: "Olive, a tuxedo cat",
    width: 600,
    height: 600,
    tone: "mint",
    motif: "none",
    brief: "Pet avatar, tight crop on the face.",
  },
} satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof media;

export function getMedia(key: string): MediaSlot | undefined {
  return (media as Record<string, MediaSlot>)[key];
}
