import { Clock3 } from "lucide-react";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { services, upcomingServices } from "@/data/services";

export function ServicesGrid({
  showUpcoming = true,
  compact,
}: {
  showUpcoming?: boolean;
  compact?: boolean;
}) {
  const featured = services.filter((service) => service.featured);

  return (
    <Section id="services" tone="default" compact={compact}>
      <SectionHeading
        eyebrow="Services"
        title="Everything they need while you're away."
        description="Six ways to cover the gaps in a busy week — each one built around your pet's normal routine, not a rigid package."
      />

      <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((service) => (
          <RevealItem key={service.slug} className="h-full">
            <ServiceCard service={service} className="h-full" />
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <ButtonLink href="/services" variant="secondary" size="lg" withArrow>
          Compare all services
        </ButtonLink>
        <ButtonLink href="/book" size="lg">
          Book Pet Care
        </ButtonLink>
      </div>

      {showUpcoming ? (
        <div className="mt-16 rounded-panel border border-navy-900/8 bg-canvas p-7 sm:p-9">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-eyebrow text-mint-700">
                <Clock3 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                On the way
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-navy-900 sm:text-2xl">
                Coming to Pawside next
              </h3>
            </div>
            <p className="max-w-sm text-[0.9375rem] leading-relaxed text-sand-700">
              Not available yet — but tell us what you need and we&apos;ll let you know the moment it
              opens up.
            </p>
          </div>

          <ul className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingServices.map((service) => (
              <li key={service.name} className="flex items-start gap-3">
                <service.icon
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 text-navy-400"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-[0.9375rem] font-medium text-navy-900">
                    {service.name}
                    {service.status === "waitlist" ? (
                      <span className="ml-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-mint-700">
                        Waitlist open
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-sand-600">
                    {service.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}
