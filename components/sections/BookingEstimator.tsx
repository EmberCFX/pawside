"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Info, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { OptionChips, ToggleChip } from "@/components/ui/Field";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { addOnsForService } from "@/data/addOns";
import { getServicePricing } from "@/data/pricing";
import { services } from "@/data/services";
import { buildQuote } from "@/lib/pricing";
import { cn, formatPrice } from "@/lib/utils";
import type { AddOnSlug, DurationMinutes, ServiceSlug } from "@/types";

/**
 * "Build the perfect visit" — the homepage estimator.
 *
 * Reads services, durations, and add-ons from the data layer and prices through
 * the same buildQuote() the checkout uses, so a visitor's estimate always
 * matches what they'll see at review. Nothing about pricing is hardcoded here.
 */
const ESTIMATOR_SERVICES: ServiceSlug[] = [
  "pet-sitting",
  "dog-walking",
  "drop-in-visits",
  "overnight-care",
];

export function BookingEstimator() {
  const [serviceSlug, setServiceSlug] = useState<ServiceSlug>("dog-walking");
  const [duration, setDuration] = useState<DurationMinutes | null>(30);
  const [petCount, setPetCount] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnSlug[]>([]);
  const reduceMotion = useReducedMotion();

  const service = services.find((entry) => entry.slug === serviceSlug)!;
  const servicePricing = getServicePricing(serviceSlug);
  const isOvernight = service.pricingUnit === "night";
  const availableAddOns = addOnsForService(serviceSlug);

  const quote = useMemo(
    () =>
      buildQuote({
        serviceSlug,
        durationMinutes: duration,
        petCount,
        // Drop add-ons that don't apply after a service switch.
        addOnSlugs: selectedAddOns.filter((slug) =>
          availableAddOns.some((addOn) => addOn.slug === slug),
        ),
        frequency: "one-time",
        membership: "none",
      }),
    [serviceSlug, duration, petCount, selectedAddOns, availableAddOns],
  );

  const handleServiceChange = (next: ServiceSlug) => {
    setServiceSlug(next);
    const nextService = services.find((entry) => entry.slug === next)!;
    setDuration(nextService.defaultDuration);
    setSelectedAddOns((current) =>
      current.filter((slug) => addOnsForService(next).some((addOn) => addOn.slug === slug)),
    );
  };

  const bookingHref = useMemo(() => {
    const params = new URLSearchParams({ service: serviceSlug, pets: String(petCount) });
    if (duration) params.set("duration", String(duration));
    if (selectedAddOns.length) params.set("addons", selectedAddOns.join(","));
    return `/book?${params.toString()}`;
  }, [serviceSlug, duration, petCount, selectedAddOns]);

  return (
    <Section id="build-your-visit" tone="muted">
      <SectionHeading
        eyebrow="Build your visit"
        title="Build the perfect visit."
        description="Mix and match until it matches your pet's day. Prices update as you go — no account needed to look."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:gap-8">
        <Card className="p-6 sm:p-8">
          <OptionChips
            name="estimator-service"
            legend="Type of service"
            value={serviceSlug}
            onChange={handleServiceChange}
            columns={4}
            options={ESTIMATOR_SERVICES.map((slug) => {
              const entry = services.find((item) => item.slug === slug)!;
              return { value: slug, label: entry.name };
            })}
          />

          <div className="mt-8">
            {isOvernight ? (
              <div className="rounded-card border border-sand-800/8 bg-canvas p-4">
                <p className="flex items-center gap-2 text-[0.8125rem] font-medium text-navy-900">
                  <Info className="h-4 w-4 text-mint-600" strokeWidth={1.75} aria-hidden="true" />
                  Overnight care is priced per night
                </p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-sand-700">
                  Includes 12 hours of coverage — evening walk, dinner, medication, overnight
                  company, and a morning walk.
                </p>
              </div>
            ) : (
              <OptionChips
                name="estimator-duration"
                legend="Duration"
                value={duration}
                onChange={(value) => setDuration(value)}
                columns={4}
                options={servicePricing.durations.map((entry) => ({
                  value: entry.minutes,
                  label: entry.label,
                  detail: formatPrice(entry.price),
                  note: entry.note,
                }))}
              />
            )}
          </div>

          <div className="mt-8">
            <OptionChips
              name="estimator-pets"
              legend="Number of pets"
              value={petCount}
              onChange={setPetCount}
              columns={3}
              options={[
                { value: 1, label: "1 pet", detail: "Included" },
                {
                  value: 2,
                  label: "2 pets",
                  detail: `+${formatPrice(servicePricing.additionalPetFee)}`,
                },
                {
                  value: 3,
                  label: "3+ pets",
                  detail: `+${formatPrice(servicePricing.additionalPetFee * 2)}`,
                },
              ]}
            />
          </div>

          <div className="mt-8">
            <p className="mb-3 text-[0.8125rem] font-medium text-navy-800">
              Add-ons{" "}
              <span className="font-normal text-sand-500">
                — optional, and only what applies to {service.name.toLowerCase()}
              </span>
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {availableAddOns.map((addOn) => (
                <ToggleChip
                  key={addOn.slug}
                  checked={selectedAddOns.includes(addOn.slug)}
                  onChange={(checked) =>
                    setSelectedAddOns((current) =>
                      checked
                        ? [...current, addOn.slug]
                        : current.filter((slug) => slug !== addOn.slug),
                    )
                  }
                  label={addOn.name}
                  detail={addOn.description}
                  price={`+${formatPrice(addOn.price)}`}
                  icon={addOn.icon}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Live estimate ------------------------------------------------- */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Card tone="inverse" className="overflow-hidden p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <p className="text-[0.6875rem] font-semibold uppercase text-mint-400">
                Estimated total
              </p>
              <Badge tone="inverse">Sample pricing</Badge>
            </div>

            <div className="mt-4 flex items-end gap-2">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={quote.total}
                  className="font-display text-display-md font-semibold leading-none text-white tabular"
                  initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10, position: "absolute" }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  {formatPrice(quote.total)}
                </motion.span>
              </AnimatePresence>
              <span className="pb-1 text-sm text-navy-100/60">
                per {isOvernight ? "night" : "visit"}
              </span>
            </div>

            <ul className="mt-6 flex flex-col gap-2.5 border-t border-white/10 pt-5">
              {quote.lines.map((line) => (
                <li key={line.id} className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="text-navy-100/75">
                    {line.label}
                    {line.detail ? (
                      <span className="block text-xs text-navy-100/45">{line.detail}</span>
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-medium tabular",
                      line.amount < 0 ? "text-mint-300" : "text-white",
                    )}
                  >
                    {line.amount < 0 ? "−" : ""}
                    {formatPrice(Math.abs(line.amount))}
                  </span>
                </li>
              ))}
            </ul>

            {quote.potentialMembershipSavings > 0 ? (
              <div className="mt-5 rounded-card bg-white/8 p-4 ring-1 ring-inset ring-white/12">
                <p className="flex items-center gap-2 text-[0.8125rem] font-semibold text-mint-300">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  Pawside+ would save {formatPrice(quote.potentialMembershipSavings)} on this visit
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-navy-100/60">
                  Booking two or more visits a week? The membership usually pays for itself.
                </p>
              </div>
            ) : null}

            <ButtonLink href={bookingHref} variant="inverse" size="lg" fullWidth withArrow className="mt-6">
              Continue to Booking
            </ButtonLink>

            <p className="mt-4 text-center text-xs leading-relaxed text-navy-100/50">
              Estimate only — nothing is charged until you review and confirm.
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
}
