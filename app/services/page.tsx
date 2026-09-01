import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { Card, IconTile } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { Photo } from "@/components/ui/Photo";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { getServicePricing } from "@/data/pricing";
import { services, upcomingServices } from "@/data/services";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { formatDuration, formatPrice } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Pet Care Services",
  description:
    "Dog walking, pet sitting, drop-ins, overnight care, puppy and cat care, in-home grooming, pet transportation, and adventure outings — with durations, pricing, and what's included.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Care that fits the day you're actually having."
        description="Follow the routine your pet already knows — from a midday walk to a trail outing or a ride to the vet. Compare them below, or tell us what your week looks like and we'll suggest a plan."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
        primaryCta={{ label: "Book Pet Care", href: "/book" }}
        secondaryCta={{ label: "Check Availability", href: "/contact" }}
      />

      <Section tone="default">
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <RevealItem key={service.slug} className="h-full">
              <ServiceCard service={service} className="h-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Comparison ---------------------------------------------------- */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Compare"
          title="Which one do you need?"
          description="A quick side-by-side. If you're between two, book the shorter one — upgrading later is easy."
        />

        <div className="mt-12 overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
            <caption className="sr-only">
              Pawside services compared by starting price, visit length, and best fit
            </caption>
            <thead>
              <tr>
                {["Service", "Starting at", "Visit length", "Best for"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="border-b border-sand-800/10 pb-4 text-[0.6875rem] font-semibold uppercase text-sand-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((service) => {
                const servicePricing = getServicePricing(service.slug);
                return (
                  <tr key={service.slug} className="group">
                    <th scope="row" className="border-b border-sand-800/8 py-5 pr-6 align-top">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-3 font-display text-[1.0625rem] font-semibold text-navy-900"
                      >
                        <IconTile icon={service.icon} size="sm" />
                        <span className="link-underline">{service.name}</span>
                      </Link>
                    </th>
                    <td className="border-b border-sand-800/8 py-5 pr-6 align-top text-[0.9375rem] text-navy-800 tabular">
                      {formatPrice(servicePricing.startingAt)}
                      <span className="text-sand-600">
                        /{service.pricingUnit}
                      </span>
                    </td>
                    <td className="border-b border-sand-800/8 py-5 pr-6 align-top text-[0.9375rem] text-sand-700">
                      {service.durations.length
                        ? service.durations.map((minutes) => formatDuration(minutes)).join(" · ")
                        : "12 hours overnight"}
                    </td>
                    <td className="border-b border-sand-800/8 py-5 align-top text-[0.9375rem] text-sand-700">
                      {service.idealFor[0]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* What's always included ---------------------------------------- */}
      <Section tone="default">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Always included"
              title="Some things aren't add-ons."
              description="No matter which service you book, these come standard. We'd rather build them into the price than nickel-and-dime a visit."
            />

            <ul className="mt-8 grid gap-3.5 sm:grid-cols-2">
              {[
                "Photo updates every visit",
                "Written visit summary",
                "Fresh water and bowl check",
                "Paw wipe-down after walks",
                "Doors, lights, and alarm as instructed",
                "Text if anything seems off",
                "Free meet & greet before visit one",
                "The same familiar caregiver whenever we can",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] text-sand-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-600" strokeWidth={2.5} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Photo
            slot="service-pet-sitting"
            aspect="aspect-[5/4]"
            rounded="rounded-feature"
            sizes="(max-width: 1024px) 100vw, 600px"
          />
        </div>
      </Section>

      {/* Roadmap ------------------------------------------------------- */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Roadmap"
          title="What we're building next."
          description="Pawside is growing carefully — a service only launches when we can do it as well as the ones we already offer."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingServices.map((service) => (
            <Card key={service.name} tone="outline" className="flex gap-4 p-6">
              <IconTile icon={service.icon} tone="mint" size="sm" />
              <div>
                <p className="font-display text-[1.0625rem] font-semibold text-navy-900">
                  {service.name}
                </p>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-sand-700">
                  {service.description}
                </p>
                <p className="mt-3 text-[0.6875rem] font-semibold uppercase text-mint-700">
                  {service.status === "waitlist" ? "Waitlist open" : "In planning"}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <Link
          href="/contact"
          className="mt-10 inline-flex items-center gap-2 font-display text-[1.0625rem] font-medium text-navy-900"
        >
          <span className="link-underline">Tell us which one you need first</span>
          <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </Link>
      </Section>

      <FaqSection
        heading="Questions about services"
        description="More detail lives on each service page — these are the ones that come up across all of them."
      />

      <CtaSection
        eyebrow="Ready when you are"
        title={
          <>
            Not sure which service fits?
            <br />
            Tell us about your week.
          </>
        }
        description="Send a quick message with your schedule and your pet's routine. We'll suggest the simplest plan that actually covers it."
        primaryLabel="Book Pet Care"
        secondaryLabel="Ask a question"
        secondaryHref="/contact"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
            ]),
          ),
        }}
      />
    </>
  );
}
