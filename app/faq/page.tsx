import type { Metadata } from "next";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { faqCategories, faqs } from "@/data/faqs";
import { site } from "@/data/site";
import { breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about booking, pet care routines, medication, keys and entry, weather policies, cancellations, and insurance.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Everything people ask before booking."
        description="Including the awkward ones. If your question isn't here, ask it directly — we'd rather answer twice than have you guess."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
      >
        <nav aria-label="FAQ categories" className="mt-9 flex flex-wrap gap-2.5">
          {faqCategories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="inline-flex rounded-full border border-sand-800/10 bg-white px-4 py-2 text-[0.875rem] text-navy-800 transition-colors hover:border-mint-500/50 hover:bg-mint-50"
            >
              {category.label}
            </a>
          ))}
        </nav>
      </PageHero>

      {faqCategories.map((category, index) => {
        const items = faqs.filter((faq) => faq.category === category.id);
        if (!items.length) return null;

        return (
          <Section
            key={category.id}
            id={category.id}
            tone={index % 2 === 0 ? "default" : "muted"}
            compact
          >
            <div className="grid gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
              <h2 className="font-display text-2xl font-semibold text-navy-900 lg:sticky lg:top-28 lg:self-start">
                {category.label}
              </h2>
              <Accordion
                items={items.map(({ id, question, answer }) => ({ id, question, answer }))}
              />
            </div>
          </Section>
        );
      })}

      <Section tone="default">
        <div className="rounded-panel border border-sand-800/8 bg-canvas p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-semibold text-navy-900">
            Didn&apos;t find your answer?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-sand-700">
            Ask about your specific pet, your specific street, or your specific weird schedule.{" "}
            {site.contact.responseTime}.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="lg" withArrow>
              Ask a question
            </ButtonLink>
            <ButtonLink href={site.contact.phoneHref} variant="secondary" size="lg">
              Call {site.contact.phone}
            </ButtonLink>
          </div>
        </div>
      </Section>

      <CtaSection
        eyebrow="Ready?"
        title={
          <>
            Questions answered.
            <br />
            Let&apos;s get them covered.
          </>
        }
        description="Book a first visit or a free meet & greet — whichever you'd rather start with."
        primaryLabel="Book Pet Care"
        secondaryLabel="View Services"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "FAQ", path: "/faq" },
            ]),
          ),
        }}
      />
    </>
  );
}
