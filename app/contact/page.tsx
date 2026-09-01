import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactSection } from "@/components/sections/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Layout";
import { serviceAreas } from "@/data/serviceAreas";
import { site } from "@/data/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Pawside",
  description: `Call, email, or send a message about pet sitting, dog walking, and drop-in visits in ${site.homeBase.city}, ${site.homeBase.state} and nearby towns.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us about your pet."
        description="Questions about scheduling, a pet with specific needs, or just want to know if we cover your street — ask away."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <div className="bg-white py-section">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
            <ContactSection />

            <div className="flex flex-col gap-5">
              <Card className="p-6">
                <h2 className="font-display text-[1.0625rem] font-semibold text-navy-900">
                  Reach us directly
                </h2>
                <div className="mt-5 flex flex-col gap-4">
                  <a
                    href={site.contact.phoneHref}
                    className="group flex items-start gap-3.5"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-navy-50 text-navy-900 ring-1 ring-inset ring-sand-800/8 transition-colors group-hover:bg-mint-50 group-hover:text-mint-700">
                      <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[0.6875rem] font-semibold uppercase text-sand-500">
                        Phone
                      </span>
                      <span className="mt-0.5 block font-medium text-navy-900">
                        {site.contact.phone}
                      </span>
                      <span className="text-[0.8125rem] text-sand-600">Call or text</span>
                    </span>
                  </a>

                  <a href={`mailto:${site.contact.email}`} className="group flex items-start gap-3.5">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-navy-50 text-navy-900 ring-1 ring-inset ring-sand-800/8 transition-colors group-hover:bg-mint-50 group-hover:text-mint-700">
                      <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[0.6875rem] font-semibold uppercase text-sand-500">
                        Email
                      </span>
                      <span className="mt-0.5 block font-medium text-navy-900">
                        {site.contact.email}
                      </span>
                      <span className="text-[0.8125rem] text-sand-600">
                        {site.contact.responseTime}
                      </span>
                    </span>
                  </a>

                  <div className="flex items-start gap-3.5">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-navy-50 text-navy-900 ring-1 ring-inset ring-sand-800/8">
                      <MapPin className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[0.6875rem] font-semibold uppercase text-sand-500">
                        Service area
                      </span>
                      <span className="mt-0.5 block font-medium text-navy-900">
                        {site.homeBase.city}, {site.homeBase.state}
                      </span>
                      <span className="text-[0.8125rem] text-sand-600">
                        Within about {site.homeBase.serviceRadiusMiles} miles
                      </span>
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="flex items-center gap-2 font-display text-[1.0625rem] font-semibold text-navy-900">
                  <Clock className="h-4 w-4 text-mint-600" strokeWidth={1.75} aria-hidden="true" />
                  Hours
                </h2>
                <dl className="mt-4 flex flex-col gap-2.5">
                  {site.hours.map((entry) => (
                    <div
                      key={entry.days}
                      className="flex items-baseline justify-between gap-4 text-[0.875rem]"
                    >
                      <dt className="text-sand-700">{entry.days}</dt>
                      <dd className="shrink-0 font-medium text-navy-900 tabular">{entry.hours}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 border-t border-sand-800/8 pt-4 text-xs leading-relaxed text-sand-600">
                  Visits happen inside these windows. Messages sent after hours get answered the next
                  morning unless it&apos;s about a visit in progress.
                </p>
              </Card>

              <Card tone="muted" className="p-6">
                <h2 className="font-display text-[1.0625rem] font-semibold text-navy-900">
                  Towns we cover
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {serviceAreas.map((area) => (
                    <li key={area.slug}>
                      <Link
                        href={`/locations/${area.slug}`}
                        className="inline-flex rounded-full bg-white px-3 py-1.5 text-[0.8125rem] text-navy-800 ring-1 ring-inset ring-sand-800/8 transition-colors hover:ring-mint-500/50"
                      >
                        {area.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card tone="inverse" className="p-6">
                <h2 className="flex items-center gap-2 font-display text-[1.0625rem] font-semibold text-white">
                  <MessageCircle className="h-4 w-4 text-mint-400" strokeWidth={1.75} aria-hidden="true" />
                  Already a client?
                </h2>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-navy-100/75">
                  Schedule changes, extra visits, and anything about a visit in progress are fastest
                  by text.
                </p>
                {site.social.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.875rem]">
                    {site.social.map((social) => (
                      <li key={social.name}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-underline text-navy-100/80 hover:text-mint-300"
                        >
                          {social.name} {social.handle}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Card>
            </div>
          </div>
        </Container>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]),
          ),
        }}
      />
    </>
  );
}
