"use client";

import { useMemo, useState } from "react";
import { Check, Sparkles, TrendingUp } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { memberships } from "@/data/memberships";
import { getServicePricing } from "@/data/pricing";
import { compareMemberships } from "@/lib/pricing";
import { cn, formatPrice, pluralize } from "@/lib/utils";

/**
 * Pawside+ membership.
 *
 * Tiers, prices, and benefits all come from data/memberships.ts, and the
 * break-even calculator runs on the same compareMemberships() helper the booking
 * flow uses — so the promise here is arithmetic, not marketing.
 */
export function MembershipPricing({ compact }: { compact?: boolean }) {
  const [visitsPerWeek, setVisitsPerWeek] = useState(2);

  // Anchored to a 30-minute walk, the most commonly booked visit.
  const referenceVisitPrice = useMemo(() => {
    const walk = getServicePricing("dog-walking");
    return walk.durations.find((entry) => entry.minutes === 30)?.price ?? walk.startingAt;
  }, []);

  const visitsPerMonth = Math.round(visitsPerWeek * 4.333);
  const comparisons = useMemo(
    () => compareMemberships(referenceVisitPrice, visitsPerMonth),
    [referenceVisitPrice, visitsPerMonth],
  );
  const bestTier = comparisons.reduce((best, tier) =>
    tier.netMonthlySavings > best.netMonthlySavings ? tier : best,
  );

  return (
    <Section id="membership" tone="muted" compact={compact}>
      <SectionHeading
        eyebrow="Pawside+"
        title="For pets who need us regularly."
        description="If we're already part of your week, membership makes it cheaper and easier — priority scheduling, member pricing, and a wider window to change plans."
      />

      <div className="mt-14 grid items-start gap-5 lg:grid-cols-3 lg:gap-6">
        {memberships.map((tier) => {
          const isFeatured = Boolean(tier.featured);
          return (
            <Card
              key={tier.slug}
              tone={isFeatured ? "inverse" : "default"}
              className={cn(
                "flex h-full flex-col p-7 sm:p-8",
                isFeatured && "shadow-lift lg:-mt-4 lg:pb-10",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3
                  className={cn(
                    "font-display text-xl font-semibold",
                    isFeatured ? "text-white" : "text-navy-900",
                  )}
                >
                  {tier.name}
                </h3>
                {tier.badge ? (
                  <Badge tone={isFeatured ? "inverse" : "mint"}>{tier.badge}</Badge>
                ) : null}
              </div>

              <p
                className={cn(
                  "mt-2 text-[0.9375rem]",
                  isFeatured ? "text-navy-100/70" : "text-sand-600",
                )}
              >
                {tier.tagline}
              </p>

              <div className="mt-7 flex items-end gap-1.5">
                <span
                  className={cn(
                    "font-display text-display-sm font-semibold leading-none tabular",
                    isFeatured ? "text-white" : "text-navy-900",
                  )}
                >
                  {tier.monthlyPrice === null ? "Free" : formatPrice(tier.monthlyPrice)}
                </span>
                {tier.monthlyPrice !== null ? (
                  <span
                    className={cn(
                      "pb-1 text-sm",
                      isFeatured ? "text-navy-100/60" : "text-sand-600",
                    )}
                  >
                    /month
                  </span>
                ) : null}
              </div>

              <ul
                className={cn(
                  "mt-7 flex flex-1 flex-col gap-3 border-t pt-6",
                  isFeatured ? "border-white/12" : "border-sand-800/8",
                )}
              >
                {tier.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5">
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        isFeatured ? "text-mint-400" : "text-mint-600",
                      )}
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        "text-[0.9375rem] leading-relaxed",
                        isFeatured ? "text-navy-100/85" : "text-sand-700",
                      )}
                    >
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>

              <ButtonLink
                href={tier.slug === "none" ? "/book" : `/book?membership=${tier.slug}`}
                variant={isFeatured ? "inverse" : "secondary"}
                size="lg"
                fullWidth
                className="mt-8"
                withArrow={isFeatured}
              >
                {tier.slug === "none" ? "Book a single visit" : `Join ${tier.name}`}
              </ButtonLink>
            </Card>
          );
        })}
      </div>

      {/* Break-even calculator ------------------------------------------- */}
      <Reveal className="mt-8">
        <Card className="p-7 sm:p-9">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <div>
              <p className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase text-mint-700">
                <TrendingUp className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                Does it pay for itself?
              </p>
              <h3 className="mt-4 font-display text-2xl font-semibold text-navy-900">
                Book two or more visits a week and Pawside+ usually pays for itself.
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-sand-700">
                Slide to your normal week. Math is based on a 30-minute walk at{" "}
                {formatPrice(referenceVisitPrice)} and includes waived booking fees.
              </p>

              <div className="mt-8">
                <label
                  htmlFor="visits-per-week"
                  className="flex items-baseline justify-between text-[0.8125rem] font-medium text-navy-800"
                >
                  Visits per week
                  <span className="font-display text-lg font-semibold text-navy-900 tabular">
                    {visitsPerWeek}
                  </span>
                </label>
                <input
                  id="visits-per-week"
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={visitsPerWeek}
                  onChange={(event) => setVisitsPerWeek(Number(event.target.value))}
                  aria-describedby="visits-per-week-hint"
                  className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-navy-100 accent-mint-600"
                />
                <p id="visits-per-week-hint" className="mt-2 text-xs text-sand-600">
                  About {visitsPerMonth} {pluralize(visitsPerMonth, "visit")} a month
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {comparisons.map((tier) => (
                <div
                  key={tier.slug}
                  className={cn(
                    "rounded-card p-5 ring-1 ring-inset transition-colors",
                    tier.worthIt
                      ? "bg-mint-50 ring-mint-500/40"
                      : "bg-canvas ring-sand-800/8",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-display text-[0.9375rem] font-semibold text-navy-900">
                      {tier.name}
                      <span className="ml-2 font-sans text-xs font-normal text-sand-600">
                        {formatPrice(tier.monthlyPrice)}/mo
                      </span>
                    </p>
                    <p
                      className={cn(
                        "shrink-0 font-display text-lg font-semibold tabular",
                        tier.worthIt ? "text-mint-800" : "text-sand-600",
                      )}
                    >
                      {tier.netMonthlySavings >= 0 ? "+" : "−"}
                      {formatPrice(Math.abs(tier.netMonthlySavings))}
                    </p>
                  </div>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-sand-700">
                    {tier.worthIt
                      ? `Saves about ${formatPrice(tier.netMonthlySavings)} a month at this pace.`
                      : `Breaks even at ${tier.breakEvenVisits} ${pluralize(
                          tier.breakEvenVisits ?? 0,
                          "visit",
                        )} a month — you're at ${visitsPerMonth}.`}
                  </p>
                </div>
              ))}

              {bestTier.worthIt ? (
                <p className="mt-1 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-mint-800">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  {bestTier.name} is the better deal at your pace.
                </p>
              ) : (
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-sand-600">
                  At this pace, paying per visit is genuinely cheaper. We&apos;ll tell you when that
                  changes.
                </p>
              )}
            </div>
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}
