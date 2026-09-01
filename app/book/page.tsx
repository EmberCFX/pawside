import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { addOns } from "@/data/addOns";
import { memberships } from "@/data/memberships";
import { getServicePricing } from "@/data/pricing";
import { isServiceSlug } from "@/data/services";
import { createBookingDraft, createPetDraft } from "@/lib/booking";
import { buildMetadata } from "@/lib/seo";
import type { AddOnSlug, BookingDraft, DurationMinutes, MembershipSlug } from "@/types";

export const metadata: Metadata = buildMetadata({
  title: "Book Pet Care",
  description:
    "Book pet sitting, dog walking, drop-in visits, or overnight care. Choose your service, schedule, and add-ons — nothing is charged until we confirm.",
  path: "/book",
});

/**
 * Deep links from the homepage estimator and service cards pre-fill the draft,
 * e.g. /book?service=dog-walking&duration=45&pets=2&addons=medication.
 * Anything unrecognized is ignored rather than trusted.
 */
export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const draft: BookingDraft = createBookingDraft();

  const serviceParam = first(params.service);
  if (serviceParam && isServiceSlug(serviceParam)) {
    draft.serviceSlug = serviceParam;
    const servicePricing = getServicePricing(serviceParam);
    const durationParam = Number(first(params.duration));
    const matched = servicePricing.durations.find((entry) => entry.minutes === durationParam);
    draft.durationMinutes = (matched?.minutes ??
      servicePricing.durations[1]?.minutes ??
      servicePricing.durations[0]?.minutes ??
      null) as DurationMinutes | null;
  }

  const petCount = Number(first(params.pets));
  if (Number.isFinite(petCount) && petCount > 1) {
    draft.pets = Array.from({ length: Math.min(4, Math.floor(petCount)) }, (_, index) =>
      createPetDraft(`pet-${index + 1}`),
    );
  }

  const addOnsParam = first(params.addons);
  if (addOnsParam) {
    const requested = addOnsParam.split(",");
    draft.addOnSlugs = addOns
      .filter((addOn) => requested.includes(addOn.slug) && !addOn.comingSoon)
      .map((addOn) => addOn.slug as AddOnSlug);
  }

  const membershipParam = first(params.membership);
  if (membershipParam && memberships.some((tier) => tier.slug === membershipParam)) {
    draft.membership = membershipParam as MembershipSlug;
  }

  const frequencyParam = first(params.frequency);
  if (frequencyParam === "weekly" || frequencyParam === "multi-weekly") {
    draft.frequency = frequencyParam;
  }

  return <BookingFlow initialDraft={draft} />;
}
