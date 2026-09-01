"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { ToggleChip } from "@/components/ui/Field";
import { addOnsForService } from "@/data/addOns";
import { getServicePricing } from "@/data/pricing";
import { getService } from "@/data/services";
import { cn, formatPrice, listToSentence } from "@/lib/utils";
import type { AddOnSlug, DurationMinutes, PetDraft, ServiceSlug } from "@/types";

/**
 * Add-ons with contextual recommendations.
 *
 * Suggestions are derived from what the visitor already chose — service,
 * duration, pet count, trip length — and are never pre-selected. That's the line
 * between a helpful nudge and a dark pattern: the default state always costs
 * less, and dismissing a suggestion takes no effort.
 */
interface Suggestion {
  id: string;
  headline: string;
  detail: string;
  action: { label: string; run: () => void };
}

export function AddOnSelector({
  serviceSlug,
  durationMinutes,
  pets,
  selected,
  onChange,
  onDurationChange,
  isRecurring,
  onMakeRecurring,
}: {
  serviceSlug: ServiceSlug;
  durationMinutes: DurationMinutes | null;
  pets: PetDraft[];
  selected: AddOnSlug[];
  onChange: (slugs: AddOnSlug[]) => void;
  onDurationChange: (minutes: DurationMinutes) => void;
  isRecurring: boolean;
  onMakeRecurring: () => void;
}) {
  const service = getService(serviceSlug);
  const servicePricing = getServicePricing(serviceSlug);
  const available = addOnsForService(serviceSlug);
  const petNames = pets.map((pet) => pet.name.trim()).filter(Boolean);
  const subject = petNames.length ? listToSentence(petNames) : "Your pet";

  const toggle = (slug: AddOnSlug, checked: boolean) =>
    onChange(checked ? [...selected, slug] : selected.filter((entry) => entry !== slug));

  /* Contextual suggestions -------------------------------------------- */
  const suggestions: Suggestion[] = [];

  // Longer visit: only offered when a longer duration actually exists.
  const currentIndex = servicePricing.durations.findIndex(
    (entry) => entry.minutes === durationMinutes,
  );
  const nextDuration =
    currentIndex >= 0 ? servicePricing.durations[currentIndex + 1] : undefined;
  const currentPrice = servicePricing.durations[currentIndex]?.price;

  if (nextDuration && currentPrice !== undefined) {
    suggestions.push({
      id: "upgrade-duration",
      headline: "Give them a little more time",
      detail: `Upgrade to ${nextDuration.label} for ${formatPrice(
        nextDuration.price - currentPrice,
      )} more. More sniffing, less rushing.`,
      action: {
        label: `Make it ${nextDuration.label}`,
        run: () => onDurationChange(nextDuration.minutes),
      },
    });
  }

  if (!isRecurring) {
    suggestions.push({
      id: "make-recurring",
      headline: "Need this every week?",
      detail: "A recurring schedule holds your slot and takes 5% off every visit.",
      action: { label: "Set up recurring", run: onMakeRecurring },
    });
  }

  if (pets.length > 1 && !selected.includes("extended-playtime")) {
    const playtime = available.find((addOn) => addOn.slug === "extended-playtime");
    if (playtime) {
      suggestions.push({
        id: "multi-pet-play",
        headline: `${pets.length} pets, one visit`,
        detail: `Extra playtime gives everyone their turn — ${formatPrice(playtime.price)} for 15 minutes.`,
        action: {
          label: "Add playtime",
          run: () => toggle("extended-playtime", true),
        },
      });
    }
  }

  if (
    (serviceSlug === "pet-sitting" || serviceSlug === "overnight-care") &&
    !selected.includes("home-check")
  ) {
    suggestions.push({
      id: "away-bundle",
      headline: "Away for a few days?",
      detail: "Mail pickup, plant watering, and a home check keep the house looking lived-in.",
      action: {
        label: "Add home care",
        run: () =>
          onChange(
            Array.from(new Set([...selected, "mail-pickup", "plant-watering", "home-check"])) as AddOnSlug[],
          ),
      },
    });
  }

  const recommendedSlugs = new Set(
    available
      .filter((addOn) =>
        serviceSlug === "cat-care"
          ? ["litter-cleanup", "medication", "photo-package"].includes(addOn.slug)
          : ["extended-playtime", "medication", "photo-package"].includes(addOn.slug),
      )
      .map((addOn) => addOn.slug),
  );

  const recommended = available.filter((addOn) => recommendedSlugs.has(addOn.slug));
  const rest = available.filter((addOn) => !recommendedSlugs.has(addOn.slug));

  return (
    <div>
      {suggestions.length ? (
        <div className="mb-8">
          <p className="mb-3 inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase text-mint-700">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            Suggested for {subject}
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {suggestions.slice(0, 4).map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex flex-col justify-between rounded-card border border-mint-500/30 bg-mint-50/60 p-4"
              >
                <div>
                  <p className="text-[0.9375rem] font-medium text-navy-900">
                    {suggestion.headline}
                  </p>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-sand-700">
                    {suggestion.detail}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={suggestion.action.run}
                  className="mt-3.5 inline-flex w-fit items-center gap-1.5 rounded-button bg-white px-3 py-2 text-[0.8125rem] font-medium text-navy-900 ring-1 ring-inset ring-sand-800/10 transition-all hover:ring-sand-800/25"
                >
                  {suggestion.action.label}
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-sand-500">
            Nothing is added automatically — you choose everything below.
          </p>
        </div>
      ) : null}

      {recommended.length ? (
        <div className={cn(suggestions.length && "border-t border-sand-800/8 pt-8")}>
          <p className="text-[0.9375rem] font-medium text-navy-900">
            Most common with {service?.name.toLowerCase()}
          </p>
          <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
            {recommended.map((addOn) => (
              <ToggleChip
                key={addOn.slug}
                checked={selected.includes(addOn.slug)}
                onChange={(checked) => toggle(addOn.slug, checked)}
                label={addOn.name}
                detail={addOn.description}
                price={`+${formatPrice(addOn.price)}`}
                icon={addOn.icon}
              />
            ))}
          </div>
        </div>
      ) : null}

      {rest.length ? (
        <div className="mt-8 border-t border-sand-800/8 pt-8">
          <p className="text-[0.9375rem] font-medium text-navy-900">Everything else</p>
          <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
            {rest.map((addOn) => (
              <ToggleChip
                key={addOn.slug}
                checked={selected.includes(addOn.slug)}
                onChange={(checked) => toggle(addOn.slug, checked)}
                label={addOn.name}
                detail={addOn.description}
                price={`+${formatPrice(addOn.price)}`}
                icon={addOn.icon}
              />
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-7 text-[0.8125rem] leading-relaxed text-sand-600">
        Skip all of this if you&apos;d rather keep it simple. Add-ons can be added later, even
        mid-trip — just text us.
      </p>
    </div>
  );
}
