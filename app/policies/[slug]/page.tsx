import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Layout";
import { getPolicy, policies } from "@/data/policies";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) {
    return buildMetadata({
      title: "Policy not found",
      description: "This policy page could not be found.",
      path: "/policies",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: policy.title,
    description: policy.summary,
    path: `/policies/${policy.slug}`,
  });
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Policies", path: "/policies" },
    { name: policy.title, path: `/policies/${policy.slug}` },
  ];

  return (
    <>
      <PageHero
        eyebrow="Policy"
        title={policy.title}
        description={policy.summary}
        crumbs={crumbs}
      />

      <Section tone="default">
        <div className="mx-auto max-w-3xl">
          <p className="text-[0.8125rem] text-sand-500">
            Last updated {formatDate(policy.updated)}
          </p>

          <div className="mt-8 flex flex-col gap-10">
            {policy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-xl font-semibold text-navy-900 sm:text-2xl">
                  {section.heading}
                </h2>
                <div className="hairline-mint mt-4" />
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mt-4 text-[1.0625rem] leading-relaxed text-sand-700"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.list ? (
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {section.list.map((item) => (
                      <li key={item} className="flex gap-3 text-[1.0625rem] text-sand-700">
                        <Check
                          className="mt-1.5 h-4 w-4 shrink-0 text-mint-600"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-navy-900/8 pt-6">
            <Link
              href="/policies"
              className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-navy-900"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              All policies
            </Link>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {policies
                .filter((other) => other.slug !== policy.slug)
                .map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/policies/${other.slug}`}
                      className="link-underline text-[0.875rem] text-sand-700"
                    >
                      {other.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaSection
        eyebrow="Questions"
        title={<>Ask us anything.</>}
        description="Policies exist so nobody is guessing. If yours is an edge case, tell us and we will figure it out."
        primaryLabel="Contact us"
        primaryHref="/contact"
        secondaryLabel="Read the FAQ"
        secondaryHref="/faq"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />
    </>
  );
}
