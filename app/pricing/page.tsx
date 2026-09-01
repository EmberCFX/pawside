import type { Metadata } from "next";
import { Gift, Package, Users } from "lucide-react";
import { AddOnsSection } from "@/components/sections/AddOnsSection";
import { BookingEstimator } from "@/components/sections/BookingEstimator";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { MembershipPricing } from "@/components/sections/MembershipPricing";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Card, IconTile } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { faqs } from "@/data/faqs";
import { giftCardAmounts, referralProgram, visitBundles } from "@/data/memberships";
import { pricing } from "@/data/pricing";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { formatDuration, formatPrice } from "@/lib/utils";
import type { Faq } from "@/types";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description:
    "Transparent pet care pricing: visit rates by duration, additional pet fees, add-ons, recurring discounts, and Pawside+ membership tiers.",
  path: "/pricing",
});

export default function PricingPage() {
  const pricingFaqs = faqs.filter(
    (faq) => faq.category === "policies" || faq.id === "recurring" || faq.id === "multiple-pets",
  ) as Faq[];

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Clear rates. No surprise line items."
        description="You pay per visit, the first pet is included, and add-ons are always optional. Rates sit with other professional Pioneer Valley sitters — not the gig-app floor."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ]}
        primaryCta={{ label: "Build Your Visit", href: "/book" }}
        secondaryCta={{ label: "Compare services", href: "/services" }}
      />

      {/* Rate table --------------------------------------------------- */}
      <Section tone="default">
        <SectionHeading
          eyebrow="Visit rates"
          title="What each visit costs."
          description="Pick the length that matches your pet's needs. Longer visits cost less per minute."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const servicePricing = pricing.services.find((entry) => entry.slug === service.slug)!;

            return (
              <Card key={service.slug} className="flex flex-col p-6">
                <div className="flex items-start gap-3">
                  <IconTile icon={service.icon} size="sm" />
                  <div>
                    <h3 className="font-display text-[1.0625rem] font-semibold text-navy-900">
                      {service.name}
                    </h3>
                    <p className="text-[0.8125rem] text-sand-600">
                      from {formatPrice(servicePricing.startingAt)}/{service.pricingUnit}
                    </p>
                  </div>
                </div>

                {servicePricing.durations.length ? (
                  <ul className="mt-5 flex flex-1 flex-col divide-y divide-sand-800/8 border-t border-sand-800/8">
                    {servicePricing.durations.map((entry) => (
                      <li
                        key={entry.minutes}
                        className="flex items-baseline justify-between gap-3 py-2.5 text-[0.9375rem]"
                      >
                        <span className="text-sand-700">{formatDuration(entry.minutes)}</span>
                        <span className="font-semibold text-navy-900 tabular">
                          {formatPrice(entry.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-5 flex flex-1 items-baseline justify-between border-t border-sand-800/8 pt-4 text-[0.9375rem]">
                    <span className="text-sand-700">Per night · 12 hours</span>
                    <span className="font-semibold text-navy-900 tabular">
                      {formatPrice(servicePricing.startingAt)}
                    </span>
                  </div>
                )}

                <p className="mt-4 border-t border-sand-800/8 pt-3 text-xs text-sand-600">
                  Additional pet +{formatPrice(servicePricing.additionalPetFee)} per{" "}
                  {service.pricingUnit}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Fees */}
        <div className="mt-10 rounded-panel border border-sand-800/8 bg-canvas p-7 sm:p-8">
          <h3 className="font-display text-xl font-semibold text-navy-900">
            The only other charges
          </h3>
          <dl className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Booking fee",
                value: formatPrice(pricing.fees.bookingFee),
                detail: "One-time visits only. Waived for members.",
              },
              {
                label: "Holiday surcharge",
                value: formatPrice(pricing.fees.holidaySurcharge),
                detail: "Major holidays. Reduced or waived for members.",
              },
              {
                label: "Short notice",
                value: `${Math.round(pricing.fees.lastMinuteRate * 100)}%`,
                detail: `Requests inside ${site.policies.lastMinuteNoticeHours} hours.`,
              },
              {
                label: "Recurring discount",
                value: `−${Math.round(pricing.recurringDiscounts["multi-weekly"] * 100)}%`,
                detail: "Multiple days a week, applied automatically.",
              },
            ].map((fee) => (
              <div key={fee.label}>
                <dt className="text-[0.6875rem] font-semibold uppercase text-sand-500">
                  {fee.label}
                </dt>
                <dd className="mt-1.5 font-display text-xl font-semibold text-navy-900 tabular">
                  {fee.value}
                </dd>
                <p className="mt-1 text-xs leading-relaxed text-sand-600">{fee.detail}</p>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <BookingEstimator />

      <MembershipPricing />

      {/* Bundles, gift cards, referrals -------------------------------- */}
      <Section tone="default">
        <SectionHeading
          eyebrow="Other ways to pay"
          title="Prepay, gift it, or share it."
          description="Alternatives to a monthly membership, for people who'd rather not subscribe to anything."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <Card className="flex flex-col p-7">
            <IconTile icon={Package} tone="mint" />
            <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">
              Prepaid bundles
            </h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-sand-700">
              Buy visits up front at a lower rate and use them whenever you need.
            </p>
            <ul className="mt-5 flex flex-1 flex-col gap-3 border-t border-sand-800/8 pt-5">
              {visitBundles.map((bundle) => (
                <li key={bundle.slug}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[0.9375rem] font-medium text-navy-900">{bundle.name}</p>
                    <p className="shrink-0 font-semibold text-navy-900 tabular">
                      {formatPrice(bundle.price)}
                    </p>
                  </div>
                  <p className="mt-0.5 text-[0.8125rem] text-sand-600">
                    {bundle.description} Expires in {bundle.expiresInMonths} months.
                  </p>
                </li>
              ))}
            </ul>
            <ButtonLink href="/contact" variant="secondary" size="md" className="mt-6">
              Ask about bundles
            </ButtonLink>
          </Card>

          <Card className="flex flex-col p-7">
            <IconTile icon={Gift} tone="mint" />
            <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">Gift cards</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-sand-700">
              A genuinely useful gift for a new puppy owner, a new parent, or anyone with a full
              calendar.
            </p>
            <ul className="mt-5 flex flex-1 flex-wrap gap-2 border-t border-sand-800/8 pt-5">
              {giftCardAmounts.map((amount) => (
                <li
                  key={amount}
                  className="rounded-full bg-navy-50 px-3 py-1.5 text-[0.875rem] font-medium text-navy-900 ring-1 ring-inset ring-sand-800/8 tabular"
                >
                  {formatPrice(amount)}
                </li>
              ))}
            </ul>
            <ButtonLink href="/contact" variant="secondary" size="md" className="mt-6">
              Request a gift card
            </ButtonLink>
          </Card>

          <Card className="flex flex-col p-7">
            <IconTile icon={Users} tone="mint" />
            <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">Referrals</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-sand-700">
              Most of our clients come from a neighbor mentioning us. That deserves something back.
            </p>
            <div className="mt-5 flex flex-1 flex-col gap-3 border-t border-sand-800/8 pt-5 text-[0.9375rem]">
              <p className="text-sand-700">
                You get{" "}
                <span className="font-semibold text-navy-900">
                  {formatPrice(referralProgram.referrerCredit)}
                </span>{" "}
                in credit.
              </p>
              <p className="text-sand-700">
                They get{" "}
                <span className="font-semibold text-navy-900">
                  {formatPrice(referralProgram.friendCredit)}
                </span>{" "}
                off their first booking.
              </p>
              <p className="mt-1 text-[0.8125rem] text-sand-600">
                Code <span className="font-semibold text-navy-900">{referralProgram.code}</span> at
                checkout.
              </p>
            </div>
            <ButtonLink href="/book" variant="secondary" size="md" className="mt-6">
              Share Pawside
            </ButtonLink>
          </Card>
        </div>
      </Section>

      <AddOnsSection />

      <FaqSection
        heading="Pricing questions"
        description="Cancellations, extra pets, and recurring schedules — the things that actually affect what you pay."
        items={pricingFaqs}
      />

      <CtaSection
        eyebrow="No commitment"
        title={
          <>
            Try one visit.
            <br />
            Decide after that.
          </>
        }
        description="There's no contract and no minimum. Book a single walk, see the visit report, and go from there."
        primaryLabel="Book Pet Care"
        secondaryLabel="Meet Pawside"
        secondaryHref="/about"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Pricing", path: "/pricing" },
            ]),
          ),
        }}
      />
    </>
  );
}
