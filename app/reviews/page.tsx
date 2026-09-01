import type { Metadata } from "next";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { Testimonials } from "@/components/sections/Testimonials";
import { Card } from "@/components/ui/Card";
import { Counter } from "@/components/ui/Counter";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { Rating } from "@/components/ui/Rating";
import { socialProofStats, trustStats } from "@/data/stats";
import { testimonials } from "@/data/testimonials";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Reviews",
  description:
    "What local pet owners say about Pawside's dog walking, pet sitting, drop-in visits, and overnight care.",
  path: "/reviews",
});

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="Same caregiver. Same routine. That's what people mention."
        description="The reviews below are sample content while we collect written permission to publish real ones — we'd rather show placeholder text than fake a testimonial."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Reviews", path: "/reviews" },
        ]}
      >
        <div className="mt-9 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <Rating value={trustStats.averageRating} />
            <p className="text-[0.9375rem] text-sand-700">
              <span className="font-semibold text-navy-900">{trustStats.averageRating}.0</span> from{" "}
              {trustStats.reviewCount} reviews
            </p>
          </div>
        </div>
      </PageHero>

      <Section tone="muted" compact>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {socialProofStats.map((stat) => (
            <div key={stat.id} className="text-center">
              <dd className="font-display text-display-xs font-semibold text-navy-900 sm:text-display-sm">
                <Counter
                  value={stat.value}
                  decimals={stat.decimals}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </dd>
              <dt className="mt-2 text-[0.9375rem] font-medium text-navy-800">{stat.label}</dt>
              {stat.detail ? (
                <p className="mx-auto mt-1 max-w-[22ch] text-xs leading-relaxed text-sand-600">
                  {stat.detail}
                </p>
              ) : null}
            </div>
          ))}
        </dl>
        <p className="mt-10 text-center text-xs text-sand-500">
          Placeholder metrics — replace in data/stats.ts before launch.
        </p>
      </Section>

      <Testimonials
        items={testimonials}
        eyebrow="Every review"
        heading="What owners actually say."
        description="Grouped by nothing in particular — just read a few."
      />

      <Section tone="default">
        <SectionHeading
          eyebrow="Leave a review"
          title="Already a Pawside client?"
          description="If a visit went well — or didn't — we want to hear it. Reviews are how a local service like this gets found by the next household."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Card className="p-7">
            <h3 className="font-display text-xl font-semibold text-navy-900">Share your experience</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-sand-700">
              Email us a few sentences and let us know whether we can use your first name and your
              pet&apos;s name. We never publish anything without asking first.
            </p>
          </Card>
          <Card tone="muted" className="p-7">
            <h3 className="font-display text-xl font-semibold text-navy-900">
              Something go wrong?
            </h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-sand-700">
              Tell us directly and we&apos;ll make it right before it becomes a review. That&apos;s
              not a deflection — it&apos;s how a two-person business survives.
            </p>
          </Card>
        </div>
      </Section>

      <CtaSection
        eyebrow="Join them"
        title={
          <>
            The best review is
            <br />
            a pet who&apos;s excited to see us.
          </>
        }
        description="Book a first visit and see whether we live up to the page you're reading."
        primaryLabel="Book Pet Care"
        secondaryLabel="View Services"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Reviews", path: "/reviews" },
            ]),
          ),
        }}
      />
    </>
  );
}
