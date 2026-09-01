import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

export function CtaSection({
  eyebrow = "Get started",
  title = (
    <>
      Your day can be busy.
      <br />
      Their care doesn&apos;t have to be.
    </>
  ),
  description = "Tell us about your pet and we'll help create a care plan that fits their routine.",
  primaryLabel = "Book Pet Care",
  primaryHref = "/book",
  secondaryLabel = "View Services",
  secondaryHref = "/services",
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="bg-white pb-section pt-4">
      <Container>
        <Reveal>
          <div className="surface-inverse relative overflow-hidden rounded-feature px-6 py-16 text-center sm:px-12 sm:py-20 lg:py-24">
            {/* Heart-line motif, oversized and barely visible. */}
            <svg
              viewBox="0 0 200 180"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-[420px] text-mint-400/10"
            >
              <path
                d="M100 158C100 158 22 108 22 62C22 36 42 18 64 18C80 18 92 26 100 40C108 26 120 18 136 18C158 18 178 36 178 62C178 108 100 158 100 158Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            <div className="relative mx-auto max-w-2xl">
              <Eyebrow onDark withRules className="justify-center">
                {eyebrow}
              </Eyebrow>
              <h2 className="mt-6 text-display-sm font-semibold text-white sm:text-display-md lg:text-display-lg">
                {title}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-navy-100/75">
                {description}
              </p>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <ButtonLink href={primaryHref} variant="inverse" size="lg" withArrow>
                  {primaryLabel}
                </ButtonLink>
                <ButtonLink href={secondaryHref} variant="outline-inverse" size="lg">
                  {secondaryLabel}
                </ButtonLink>
              </div>

              <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
                {site.trustPoints.map((point) => (
                  <li
                    key={point}
                    className="inline-flex items-center gap-2 text-[0.8125rem] text-navy-100/70"
                  >
                    <Check className="h-3.5 w-3.5 text-mint-400" strokeWidth={2.5} aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
