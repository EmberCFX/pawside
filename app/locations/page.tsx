import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { Badge, Card } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { ServiceAreaMap } from "@/components/ui/ServiceAreaMap";
import { serviceAreas } from "@/data/serviceAreas";
import { site } from "@/data/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Service Area",
  description: `Pawside covers ${site.homeBase.city} and nearby towns across ${site.homeBase.region} — see every neighborhood we serve.`,
  path: "/locations",
});

const statusCopy = {
  core: { label: "Core area", tone: "mint" as const },
  nearby: { label: "Nearby", tone: "navy" as const },
  waitlist: { label: "Waitlist", tone: "neutral" as const },
};

export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Service area"
        title={`Pet care across ${site.homeBase.region}.`}
        description={`Based in ${site.homeBase.city} and covering roughly ${site.homeBase.serviceRadiusMiles} miles in every direction. Each town below has its own page with the neighborhoods we cover.`}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Service Area", path: "/locations" },
        ]}
        primaryCta={{ label: "Book Pet Care", href: "/book" }}
        secondaryCta={{ label: "Ask about your street", href: "/contact" }}
      />

      <Section tone="default">
        <ServiceAreaMap className="aspect-[16/9] rounded-feature shadow-card sm:aspect-[21/9]" />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceAreas.map((area) => {
            const status = statusCopy[area.status];

            return (
              <Card key={area.slug} interactive className="group flex flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl font-semibold text-navy-900">
                    <Link href={`/locations/${area.slug}`}>
                      <span className="absolute inset-0" aria-hidden="true" />
                      {area.name}, {area.state}
                    </Link>
                  </h2>
                  <Badge tone={status.tone}>{status.label}</Badge>
                </div>

                {area.travelTime ? (
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-[0.8125rem] text-sand-600">
                    <MapPin className="h-3.5 w-3.5 text-mint-600" strokeWidth={2} aria-hidden="true" />
                    About {area.travelTime} from home base
                  </p>
                ) : null}

                <p className="mt-3.5 flex-1 text-[0.9375rem] leading-relaxed text-sand-700">
                  {area.blurb}
                </p>

                <p className="mt-5 border-t border-sand-800/8 pt-4 text-[0.8125rem] leading-relaxed text-sand-600">
                  {area.neighborhoods.slice(0, 4).join(" · ")}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-navy-900">
                  Pet care in {area.name}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Expanding"
          title="Not on the list yet?"
          description="We add towns when there's enough demand to keep visits reliable. Tell us where you are and we'll be honest about the timeline."
        />
        <div className="mt-8 flex justify-center">
          <Link
            href="/contact"
            className="link-underline font-display text-lg font-medium text-navy-900"
          >
            Ask about your neighborhood
          </Link>
        </div>
      </Section>

      <CtaSection
        eyebrow="Local care"
        title={
          <>
            Close enough to be there
            <br />
            when it matters.
          </>
        }
        description="Most visits are within twenty minutes of the door — which is how same-day requests stay possible."
        primaryLabel="Book Pet Care"
        secondaryLabel="View Services"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Service Area", path: "/locations" },
            ]),
          ),
        }}
      />
    </>
  );
}
