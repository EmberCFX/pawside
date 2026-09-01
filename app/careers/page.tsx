import type { Metadata } from "next";
import { Check, Clock, HeartHandshake, MapPin, Sparkles } from "lucide-react";
import { ContactSection } from "@/components/sections/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { Badge, Card, IconTile } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { Photo } from "@/components/ui/Photo";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description: `Care for pets in ${site.homeBase.region} with a small team that pays fairly, schedules honestly, and keeps caregivers with the same families.`,
  path: "/careers",
});

const openRoles = [
  {
    title: "Pet Caregiver — Part Time",
    type: "Part time",
    location: `${site.homeBase.city} & nearby towns`,
    pay: "$22–$28 / visit hour",
    summary:
      "Midday walks and drop-in visits, Monday through Friday. Build a steady route of the same households week over week.",
    requirements: [
      "Reliable vehicle and a clean driving record",
      "Comfortable handling dogs of every size",
      "Available for at least three weekday middays",
      "Willing to complete a background check and pet first-aid training",
    ],
  },
  {
    title: "Overnight & Weekend Sitter",
    type: "Flexible",
    location: `Within ${site.homeBase.serviceRadiusMiles} miles of ${site.homeBase.city}`,
    pay: "$95–$135 / night",
    summary:
      "Stay with pets in their own homes over weekends and holiday stretches. Best for someone who likes quiet nights and other people's dogs.",
    requirements: [
      "Experience with overnight or in-home pet care",
      "Comfortable staying over in a client's home",
      "Available some holidays and school breaks",
      "Steady, honest communication with owners",
    ],
  },
];

const benefits = [
  {
    icon: Clock,
    title: "Schedules we actually honor",
    description:
      "You tell us your availability and we build routes around it. No 6 AM texts asking you to cover across the valley.",
  },
  {
    icon: HeartHandshake,
    title: "The same pets, week after week",
    description:
      "We assign caregivers to households, not to shifts. You learn their routines, and they learn you.",
  },
  {
    icon: Sparkles,
    title: "Paid training and gear",
    description:
      "Pet first aid and CPR certification on us, plus leashes, waste bags, and a stocked first-aid kit.",
  },
  {
    icon: MapPin,
    title: "Mileage covered",
    description: "Travel between visits is reimbursed. Your car shouldn't fund your job.",
  },
];

export default function CareersPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Do this work for people who take it seriously."
        description={`We hire slowly, pay fairly, and cap how many households we take on so caregivers aren't sprinting between visits. If that sounds like the job you wanted pet care to be, we'd like to meet you.`}
        crumbs={crumbs}
        primaryCta={{ label: "Apply below", href: "#apply" }}
        secondaryCta={{ label: "Meet Pawside", href: "/about" }}
      />

      <Section tone="default">
        <Photo
          slot="careers-team"
          aspect="aspect-[16/9] sm:aspect-[21/9]"
          rounded="rounded-feature"
          sizes="100vw"
        />
      </Section>

      <Section tone="muted" id="roles">
        <SectionHeading
          eyebrow="Open roles"
          title="Who we're looking for right now"
          description="Two roles are open. If neither fits but you'd be great here, apply anyway and tell us why."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {openRoles.map((role) => (
            <Reveal key={role.title}>
              <Card className="flex h-full flex-col p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-navy-900 sm:text-2xl">
                    {role.title}
                  </h3>
                  <Badge tone="mint">{role.type}</Badge>
                </div>

                <p className="mt-3 text-[1.0625rem] leading-relaxed text-sand-700">
                  {role.summary}
                </p>

                <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-y border-navy-900/8 py-4 text-[0.875rem]">
                  <div>
                    <dt className="text-[0.6875rem] uppercase tracking-[0.1em] text-sand-500">
                      Pay
                    </dt>
                    <dd className="mt-1 font-medium text-navy-900">{role.pay}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.6875rem] uppercase tracking-[0.1em] text-sand-500">
                      Area
                    </dt>
                    <dd className="mt-1 font-medium text-navy-900">{role.location}</dd>
                  </div>
                </dl>

                <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                  {role.requirements.map((requirement) => (
                    <li key={requirement} className="flex gap-3 text-[0.9375rem] text-sand-700">
                      <Check
                        className="mt-1 h-4 w-4 shrink-0 text-mint-600"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      {requirement}
                    </li>
                  ))}
                </ul>

                <a
                  href="#apply"
                  className="mt-7 inline-flex w-fit items-center justify-center rounded-button bg-navy-900 px-5 py-3 text-[0.9375rem] font-medium text-white transition-colors hover:bg-navy-800"
                >
                  Apply for this role
                </a>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="default">
        <SectionHeading
          eyebrow="Why here"
          title="What we actually offer"
          description="Pet care burns people out when the schedule is chaos and the pay doesn't cover the driving. We built this around not doing that."
        />

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <RevealItem key={benefit.title}>
              <Card className="h-full p-6 sm:p-7">
                <IconTile icon={benefit.icon} />
                <h3 className="mt-5 font-display text-lg font-semibold text-navy-900">
                  {benefit.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-sand-700">
                  {benefit.description}
                </p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="cream" id="apply">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Apply"
              title="Tell us about yourself"
              description="No cover letter template, please. Tell us about the animals you've cared for and what your week looks like."
            />
            <ul className="mt-8 flex flex-col gap-4">
              {[
                "We read every application ourselves — usually within a few days.",
                "A short call comes first, then a meet & greet with a couple of dogs.",
                "Paid shadow visits before you ever work alone.",
              ].map((step) => (
                <li key={step} className="flex gap-3 text-[0.9375rem] text-sand-700">
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-mint-600"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <ContactSection
            intent="careers"
            heading="Apply to join Pawside"
            description="A few basics and a short note about the animals you've cared for."
            submitLabel="Send application"
            successMessage="Thanks — we've got your application and read every one ourselves. Expect a note within a few days."
          />
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />
    </>
  );
}
