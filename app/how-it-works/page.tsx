import type { Metadata } from "next";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PageHero } from "@/components/sections/PageHero";
import { PetProfilePreview } from "@/components/sections/PetProfilePreview";
import { VisitReportSection } from "@/components/sections/VisitReportSection";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { faqs } from "@/data/faqs";
import { site } from "@/data/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import type { Faq } from "@/types";

export const metadata: Metadata = buildMetadata({
  title: "How It Works",
  description:
    "From meet & greet to visit report: how Pawside sets up pet care, follows your pet's routine, and keeps you updated after every visit.",
  path: "/how-it-works",
});

const timeline = [
  {
    when: "Before your first visit",
    items: [
      "Free 20-minute meet & greet at your home",
      "We write down routines, medication, and house rules",
      "Keys, codes, or lockbox sorted out in person",
      "Vet and emergency contacts saved to your pet's profile",
    ],
  },
  {
    when: "The day of a visit",
    items: [
      "Text when we're on the way",
      "Care follows your written instructions",
      "Photos taken during the visit",
      "Doors, lights, and alarm handled as you asked",
    ],
  },
  {
    when: "Right after",
    items: [
      "Visit report with tasks, times, and a note",
      "Walk length and distance logged",
      "Anything unusual flagged directly to you",
      "Invoice or membership charge, nothing hidden",
    ],
  },
];

export default function HowItWorksPage() {
  const logisticsFaqs = faqs.filter((faq) => faq.category === "logistics") as Faq[];

  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Pet care without the hassle."
        description="No bidding, no messaging strangers, no wondering whether someone showed up. Here's exactly what happens, start to finish."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "How It Works", path: "/how-it-works" },
        ]}
        primaryCta={{ label: "Get Started", href: "/book" }}
        secondaryCta={{ label: "Meet Pawside", href: "/about" }}
      />

      <HowItWorks compact />

      <Section tone="muted">
        <SectionHeading
          eyebrow="Timeline"
          title="What happens, and when."
          description="The parts that matter most happen before the first visit — that's what makes every visit after it uneventful."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {timeline.map((phase, index) => (
            <Card key={phase.when} className="p-7">
              <p className="font-display text-[0.6875rem] font-semibold uppercase text-mint-700">
                Step {index + 1}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-navy-900">
                {phase.when}
              </h3>
              <ul className="mt-5 flex flex-col gap-3 border-t border-sand-800/8 pt-5">
                {phase.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-sand-700"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-[0.9375rem] text-sand-700">
          {site.policies.meetAndGreet} — and it&apos;s genuinely free, with no obligation to book
          afterward.
        </p>
      </Section>

      <PetProfilePreview />

      <VisitReportSection />

      <FaqSection
        heading="Logistics questions"
        description="Keys, weather, and the practical details of letting someone into your home."
        items={logisticsFaqs}
      />

      <CtaSection
        eyebrow="Start here"
        title={
          <>
            The first step is
            <br />
            just saying hello.
          </>
        }
        description="Book a meet & greet or a first visit — whichever feels easier. We'll take it from there."
        primaryLabel="Book Pet Care"
        secondaryLabel="View Services"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "How It Works", path: "/how-it-works" },
            ]),
          ),
        }}
      />
    </>
  );
}
