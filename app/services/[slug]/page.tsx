import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock, Users } from "lucide-react";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { Testimonials } from "@/components/sections/Testimonials";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card, IconTile } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { Photo } from "@/components/ui/Photo";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { addOnsForService } from "@/data/addOns";
import { getServicePricing } from "@/data/pricing";
import { bookableServiceAreas } from "@/data/serviceAreas";
import { getService, services } from "@/data/services";
import { site } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import { breadcrumbSchema, buildMetadata, faqSchema, serviceSchema } from "@/lib/seo";
import { formatDuration, formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return buildMetadata({
      title: "Service not found",
      description: "That service doesn't exist.",
      path: "/services",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const servicePricing = getServicePricing(service.slug);
  const addOns = addOnsForService(service.slug);
  const related = services.filter((entry) => entry.slug !== service.slug).slice(0, 3);
  const serviceTestimonials = testimonials.filter(
    (testimonial) => testimonial.serviceSlug === service.slug,
  );

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${service.slug}` },
  ];

  return (
    <>
      <PageHero
        eyebrow={service.tagline}
        title={service.seo.h1}
        description={service.description}
        crumbs={crumbs}
        primaryCta={{ label: "Book Pet Care", href: `/book?service=${service.slug}` }}
        secondaryCta={{ label: "Check Availability", href: "/contact" }}
      >
        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
          <div>
            <dt className="text-[0.6875rem] font-semibold uppercase text-sand-500">
              Starting at
            </dt>
            <dd className="mt-1.5 font-display text-2xl font-semibold text-navy-900 tabular">
              {formatPrice(servicePricing.startingAt)}
              <span className="text-sm font-medium text-sand-600">/{service.pricingUnit}</span>
            </dd>
          </div>
          <div>
            <dt className="text-[0.6875rem] font-semibold uppercase text-sand-500">
              Visit length
            </dt>
            <dd className="mt-1.5 font-display text-2xl font-semibold text-navy-900">
              {service.durations.length
                ? `${service.durations[0]}–${service.durations[service.durations.length - 1]} min`
                : "12 hours"}
            </dd>
          </div>
          <div>
            <dt className="text-[0.6875rem] font-semibold uppercase text-sand-500">
              Additional pet
            </dt>
            <dd className="mt-1.5 font-display text-2xl font-semibold text-navy-900 tabular">
              +{formatPrice(servicePricing.additionalPetFee)}
            </dd>
          </div>
        </dl>
      </PageHero>

      {/* What's included ---------------------------------------------- */}
      <Section tone="default">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              headingLevel={2}
              eyebrow="What's included"
              title={`Every ${service.name.toLowerCase()} visit covers this.`}
            />

            <ul className="mt-8 flex flex-col gap-3.5">
              {service.included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-sand-700">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-mint-600"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-panel border border-sand-800/8 bg-canvas p-6">
              <p className="flex items-center gap-2 font-display text-[1.0625rem] font-semibold text-navy-900">
                <Users className="h-4 w-4 text-mint-600" strokeWidth={1.75} aria-hidden="true" />
                Ideal for
              </p>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {service.idealFor.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[0.875rem] leading-relaxed text-sand-700"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            <Photo
              slot={service.mediaKey}
              aspect="aspect-[4/3]"
              rounded="rounded-feature"
              sizes="(max-width: 1024px) 100vw, 560px"
              className="shadow-card"
            />

            {/* Durations & pricing */}
            <Card className="mt-6 p-6">
              <h3 className="flex items-center gap-2 font-display text-[1.0625rem] font-semibold text-navy-900">
                <Clock className="h-4 w-4 text-mint-600" strokeWidth={1.75} aria-hidden="true" />
                {service.pricingUnit === "night" ? "Overnight rate" : "Available durations"}
              </h3>

              {service.pricingUnit === "night" ? (
                <div className="mt-4 flex items-baseline justify-between border-t border-sand-800/8 pt-4">
                  <p className="text-[0.9375rem] text-sand-700">Per night · 12 hours</p>
                  <p className="font-display text-lg font-semibold text-navy-900 tabular">
                    {formatPrice(servicePricing.startingAt)}
                  </p>
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-sand-800/8 border-t border-sand-800/8">
                  {servicePricing.durations.map((entry) => (
                    <li key={entry.minutes} className="flex items-center justify-between gap-4 py-3">
                      <span className="flex items-center gap-2.5 text-[0.9375rem] text-navy-800">
                        {formatDuration(entry.minutes)}
                        {entry.note ? <Badge tone="mint">{entry.note}</Badge> : null}
                      </span>
                      <span className="font-display text-[1.0625rem] font-semibold text-navy-900 tabular">
                        {formatPrice(entry.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-4 text-xs leading-relaxed text-sand-600">
                Placeholder pricing. First pet included; additional pets{" "}
                {formatPrice(servicePricing.additionalPetFee)} each per {service.pricingUnit}.
              </p>

              <ButtonLink
                href={`/book?service=${service.slug}`}
                size="lg"
                fullWidth
                withArrow
                className="mt-5"
              >
                Book {service.name}
              </ButtonLink>
            </Card>
          </div>
        </div>
      </Section>

      {/* Add-ons ------------------------------------------------------ */}
      {addOns.length ? (
        <Section tone="muted">
          <SectionHeading
            eyebrow="Add-ons"
            title={`Pairs well with ${service.name.toLowerCase()}.`}
            description="Optional, priced per visit, and easy to add or drop later."
          />

          <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {addOns.map((addOn) => (
              <RevealItem key={addOn.slug} className="h-full">
                <Card className="flex h-full gap-4 p-5">
                  <IconTile icon={addOn.icon} size="sm" tone="mint" />
                  <div className="min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-display text-[1rem] font-semibold text-navy-900">
                        {addOn.name}
                      </p>
                      <p className="shrink-0 text-[0.875rem] font-semibold text-navy-800 tabular">
                        +{formatPrice(addOn.price)}
                      </p>
                    </div>
                    <p className="mt-1.5 text-[0.875rem] leading-relaxed text-sand-700">
                      {addOn.description}
                    </p>
                  </div>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      {/* Service FAQs ------------------------------------------------- */}
      <Section tone="default">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title={`${service.name} questions`}
              description={`Specific to ${service.name.toLowerCase()}. General questions are answered on the main FAQ.`}
            />
            <Link
              href="/faq"
              className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-navy-900"
            >
              <span className="link-underline">All frequently asked questions</span>
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>

          <Accordion
            items={service.faqs.map((faq, index) => ({
              id: `${service.slug}-faq-${index}`,
              question: faq.question,
              answer: faq.answer,
            }))}
          />
        </div>
      </Section>

      {serviceTestimonials.length ? (
        <Testimonials
          items={serviceTestimonials}
          eyebrow="Reviews"
          heading={`What owners say about ${service.name.toLowerCase()}`}
          description="Sample reviews shown until we've collected permission to publish real ones."
        />
      ) : null}

      {/* Service area + related -------------------------------------- */}
      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy-900">
              {service.name} near you
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-sand-700">
              Available across {site.homeBase.region}, within about{" "}
              {site.homeBase.serviceRadiusMiles} miles of {site.homeBase.city}.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {bookableServiceAreas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/locations/${area.slug}`}
                    className="inline-flex rounded-full border border-sand-800/10 bg-white px-3.5 py-2 text-[0.875rem] text-navy-800 transition-colors hover:border-mint-500/50 hover:bg-mint-50"
                  >
                    {service.name} in {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-navy-900">
              Other services
            </h2>
            <ul className="mt-6 flex flex-col divide-y divide-sand-800/8 border-y border-sand-800/8">
              {related.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/services/${entry.slug}`}
                    className="group flex items-center gap-4 py-4"
                  >
                    <IconTile icon={entry.icon} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[1.0625rem] font-semibold text-navy-900">
                        {entry.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[0.875rem] text-sand-600">
                        {entry.summary}
                      </span>
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-sand-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-navy-900"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaSection
        eyebrow="Book it"
        title={
          <>
            Ready to get {service.name.toLowerCase()}
            <br />
            on the calendar?
          </>
        }
        description={`Tell us about your pet and we'll confirm the details. ${site.policies.meetAndGreet}.`}
        primaryLabel="Book Pet Care"
        primaryHref={`/book?service=${service.slug}`}
        secondaryLabel="View all services"
        secondaryHref="/services"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema(service)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqSchema(
              service.faqs.map((faq, index) => ({
                id: `${service.slug}-faq-${index}`,
                question: faq.question,
                answer: faq.answer,
                category: "care" as const,
              })),
            ),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />
    </>
  );
}
