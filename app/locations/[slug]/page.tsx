import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { Badge, Card } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { serviceAreas, getServiceArea } from "@/data/serviceAreas";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { areaServedSchema, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getServiceArea(slug);

  if (!area) {
    return buildMetadata({
      title: "Area not found",
      description: "That service area doesn't exist.",
      path: "/locations",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `Pet Care in ${area.name}, ${area.state}`,
    description: `Dog walking, pet sitting, drop-in visits, and overnight care in ${area.name}, ${
      area.state
    } — including ${area.neighborhoods.slice(0, 3).join(", ")}.`,
    path: `/locations/${area.slug}`,
  });
}

/**
 * Local landing page.
 *
 * Generated per entry in data/serviceAreas.ts with its own H1, neighborhood
 * list, and Service schema scoped to the city. Adding a town creates a new
 * indexable page with no code changes.
 */
export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = getServiceArea(slug);

  if (!area) notFound();

  const isWaitlist = area.status === "waitlist";
  const otherAreas = serviceAreas.filter((entry) => entry.slug !== area.slug).slice(0, 6);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Service Area", path: "/locations" },
    { name: area.name, path: `/locations/${area.slug}` },
  ];

  return (
    <>
      <PageHero
        eyebrow={`${area.name}, ${area.state}`}
        title={`Pet care in ${area.name}`}
        description={area.blurb}
        crumbs={crumbs}
        primaryCta={
          isWaitlist
            ? { label: "Join the waitlist", href: "/contact" }
            : { label: "Book Pet Care", href: "/book" }
        }
        secondaryCta={{ label: "Check Availability", href: "/contact" }}
      >
        <div className="mt-9 flex flex-wrap items-center gap-4">
          {area.travelTime ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-900/10 bg-white px-3.5 py-2 text-[0.875rem] text-navy-800">
              <Clock className="h-3.5 w-3.5 text-mint-600" strokeWidth={2} aria-hidden="true" />
              About {area.travelTime} from {site.homeBase.city}
            </span>
          ) : null}
          <Badge tone={isWaitlist ? "neutral" : "mint"}>
            {isWaitlist ? "Waitlist area" : "Currently serving"}
          </Badge>
        </div>
      </PageHero>

      {/* Neighborhoods -------------------------------------------------- */}
      <Section tone="default">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Neighborhoods"
              title={`Where we go in ${area.name}`}
              description={`If your street isn't listed, ask — these are the areas we're in most often, not a boundary.`}
            />
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {area.neighborhoods.map((neighborhood) => (
              <li
                key={neighborhood}
                className="flex items-center gap-2.5 rounded-card border border-navy-900/8 bg-white px-4 py-3.5 text-[0.9375rem] text-navy-800"
              >
                <MapPin className="h-4 w-4 shrink-0 text-mint-600" strokeWidth={1.75} aria-hidden="true" />
                {neighborhood}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Services in this area ------------------------------------------ */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Services"
          title={`What we offer in ${area.name}`}
          description={`Every Pawside service is available here${
            isWaitlist ? " once we open the area" : ""
          }, at the same rates as everywhere else. No travel surcharge.`}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} className="h-full" />
          ))}
        </div>
      </Section>

      {/* Local context --------------------------------------------------- */}
      <Section tone="default">
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="p-7">
            <h2 className="font-display text-xl font-semibold text-navy-900">
              Why local matters here
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-sand-700">
              A caregiver who lives nearby can be at your door quickly when something changes — a
              flight delay, a late meeting, a dog who needs an extra trip out. That&apos;s not
              possible from thirty minutes away.
            </p>
          </Card>

          <Card className="p-7">
            <h2 className="font-display text-xl font-semibold text-navy-900">
              Booking in {area.name}
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-sand-700">
              Book online any time. Routine visits usually need a few days&apos; notice; holidays and
              school vacation weeks fill two to four weeks out.
            </p>
            <Link
              href="/book"
              className="link-underline mt-4 inline-flex text-[0.9375rem] font-medium text-navy-900"
            >
              Start a booking
            </Link>
          </Card>

          <Card className="p-7">
            <h2 className="font-display text-xl font-semibold text-navy-900">Nearby towns</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {otherAreas.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/locations/${entry.slug}`}
                    className="inline-flex rounded-full bg-navy-50 px-3 py-1.5 text-[0.8125rem] text-navy-800 transition-colors hover:bg-mint-50"
                  >
                    {entry.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/locations"
              className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-navy-900"
            >
              <span className="link-underline">All service areas</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </Link>
          </Card>
        </div>
      </Section>

      <FaqSection
        heading={`Common questions from ${area.name} clients`}
        description="Same answers everywhere we work — consistency is the point."
      />

      <CtaSection
        eyebrow={area.name}
        title={
          isWaitlist ? (
            <>
              We&apos;re not in {area.name} yet.
              <br />
              Tell us you want us there.
            </>
          ) : (
            <>
              Pet care in {area.name},
              <br />
              from someone nearby.
            </>
          )
        }
        description={
          isWaitlist
            ? "Waitlist requests are how we decide which town to open next. It takes a minute and there's no obligation."
            : `Book a first visit or a free meet & greet. We'll come to you in ${area.name}.`
        }
        primaryLabel={isWaitlist ? "Join the waitlist" : "Book Pet Care"}
        primaryHref={isWaitlist ? "/contact" : "/book"}
        secondaryLabel="View Services"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(areaServedSchema(area)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />
    </>
  );
}
