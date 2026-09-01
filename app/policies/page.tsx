import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Layout";
import { policies } from "@/data/policies";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Policies",
  description:
    "Cancellation, pet safety, privacy, and terms — written plainly, with no surprises buried in the fine print.",
  path: "/policies",
});

export default function PoliciesPage() {
  return (
    <>
      <PageHero
        eyebrow="Policies"
        title="No surprises, on purpose."
        description="Everything that governs a Pawside visit, in plain language. If something here is unclear, ask us — we would rather explain it now than argue about it later."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Policies", path: "/policies" },
        ]}
      />

      <Section tone="default">
        <div className="grid gap-5 sm:grid-cols-2">
          {policies.map((policy) => (
            <Card key={policy.slug} interactive className="group p-6 sm:p-7">
              <Link href={`/policies/${policy.slug}`} className="flex h-full flex-col">
                <span className="absolute inset-0" aria-hidden="true" />
                <h2 className="font-display text-xl font-semibold text-navy-900">
                  {policy.title}
                </h2>
                <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-sand-700">
                  {policy.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-navy-900">
                  Read policy
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <CtaSection
        eyebrow="Still unsure?"
        title={<>Ask before you book.</>}
        description="We would rather answer a question now than have you wondering while you are away."
        primaryLabel="Contact us"
        primaryHref="/contact"
        secondaryLabel="Read the FAQ"
        secondaryHref="/faq"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Policies", path: "/policies" },
            ]),
          ),
        }}
      />
    </>
  );
}
