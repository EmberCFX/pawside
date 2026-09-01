import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceAreaMap } from "@/components/ui/ServiceAreaMap";
import { serviceAreas } from "@/data/serviceAreas";
import { site } from "@/data/site";

/**
 * Service area.
 *
 * Generated from data/serviceAreas.ts, which also generates the local landing
 * pages at /locations/[slug] — the foundation for local SEO as Pawside adds
 * towns or expands to another city.
 */
export function ServiceAreaSection() {
  return (
    <Section id="service-area" tone="default">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Service area"
            title="Pet care around your neighborhood."
            description={`Based in ${site.homeBase.city} and covering roughly ${site.homeBase.serviceRadiusMiles} miles of ${site.homeBase.region}. Close enough to be there quickly, small enough to know the streets.`}
          />

          <ul className="mt-9 flex flex-wrap gap-2.5">
            {serviceAreas.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/locations/${area.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-navy-900/10 bg-white px-3.5 py-2 text-[0.875rem] text-navy-800 transition-all duration-200 hover:border-mint-500/50 hover:bg-mint-50"
                >
                  <MapPin
                    className="h-3.5 w-3.5 text-mint-600"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {area.name}
                  {area.status === "waitlist" ? (
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-sand-500">
                      Waitlist
                    </span>
                  ) : null}
                  <ArrowUpRight
                    className="h-3 w-3 text-sand-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/locations" variant="secondary" size="lg" withArrow>
              See all areas
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost" size="lg">
              Not on the list? Ask us
            </ButtonLink>
          </div>
        </div>

        <Reveal delay={0.08}>
          <div className="relative">
            <ServiceAreaMap className="aspect-[7/5] rounded-feature shadow-card" />
            <Card className="absolute bottom-5 left-5 right-5 p-5 backdrop-blur-md sm:right-auto sm:max-w-[280px]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-eyebrow text-mint-700">
                  Home base
                </p>
                <Badge tone="navy">
                  {site.homeBase.serviceRadiusMiles} mi
                </Badge>
              </div>
              <p className="mt-2.5 font-display text-lg font-semibold text-navy-900">
                {site.homeBase.city}, {site.homeBase.state}
              </p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-sand-600">
                Most visits are within 20 minutes of the door, which is how same-day requests stay
                possible.
              </p>
            </Card>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
