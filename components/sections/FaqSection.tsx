import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { faqs, homepageFaqIds } from "@/data/faqs";
import { site } from "@/data/site";
import type { Faq } from "@/types";

export function FaqSection({
  items,
  heading = "Questions, answered honestly.",
  eyebrow = "FAQ",
  description,
  showContact = true,
}: {
  items?: Faq[];
  heading?: string;
  eyebrow?: string;
  description?: string;
  showContact?: boolean;
}) {
  const visible =
    items ??
    homepageFaqIds
      .map((id) => faqs.find((faq) => faq.id === id))
      .filter((faq): faq is Faq => Boolean(faq));

  return (
    <Section id="faq" tone="default">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading align="left" eyebrow={eyebrow} title={heading} description={description} />

          {showContact ? (
            <div className="mt-8 rounded-panel border border-navy-900/8 bg-canvas p-6">
              <p className="font-display text-[1.0625rem] font-semibold text-navy-900">
                Still deciding?
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-sand-700">
                Ask anything — including the awkward questions about keys, cameras, or a dog who
                doesn&apos;t love strangers. {site.contact.responseTime}.
              </p>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <ButtonLink href="/contact" variant="secondary" size="md" withArrow>
                  Ask a question
                </ButtonLink>
                <ButtonLink href={site.contact.phoneHref} variant="ghost" size="md">
                  {site.contact.phone}
                </ButtonLink>
              </div>
            </div>
          ) : null}
        </div>

        <Accordion items={visible.map(({ id, question, answer }) => ({ id, question, answer }))} />
      </div>
    </Section>
  );
}
