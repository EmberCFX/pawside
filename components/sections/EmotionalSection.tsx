import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The emotional center of the homepage.
 *
 * Large photograph, one idea, almost no chrome. The copy names the guilt busy
 * owners actually feel and resolves it, without tipping into sentimentality.
 */
export function EmotionalSection() {
  return (
    <section className="relative bg-white py-section">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-feature">
            <Photo
              slot="emotional-wide"
              aspect="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/8]"
              rounded="rounded-feature"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />

            {/* Scrim tuned for text on the left third. */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-navy-950/88 via-navy-950/60 to-navy-950/20 sm:from-navy-950/85 sm:via-navy-950/45 sm:to-transparent"
              aria-hidden="true"
            />

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-xl px-6 py-10 sm:px-10 lg:px-14">
                <Eyebrow onDark>They&apos;re family</Eyebrow>
                <h2 className="mt-5 text-display-sm font-semibold text-white sm:text-display-md lg:text-display-lg">
                  They&apos;re family.
                  <br />
                  We treat them that way.
                </h2>
                <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-navy-100/80 sm:text-lg">
                  Whether you&apos;re working late, heading out of town, or simply have a packed day,
                  Pawside makes sure your pet still gets the attention, exercise, routine, and
                  companionship they deserve.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/book" variant="inverse" size="lg" withArrow>
                    Book Pet Care
                  </ButtonLink>
                  <ButtonLink href="/about" variant="outline-inverse" size="lg">
                    Meet Pawside
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-12 max-w-2xl text-center font-display text-xl font-medium leading-relaxed text-navy-900 sm:text-2xl">
            Life gets busy. Their care shouldn&apos;t.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-center text-[0.9375rem] leading-relaxed text-sand-700">
            You shouldn&apos;t have to choose between a full day and a well-cared-for pet. That&apos;s
            the entire reason Pawside exists.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
