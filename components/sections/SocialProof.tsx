import { Quote } from "lucide-react";
import { Counter } from "@/components/ui/Counter";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { PetAvatar } from "@/components/ui/Photo";
import { Rating } from "@/components/ui/Rating";
import { Reveal } from "@/components/ui/Reveal";
import { socialProofStats } from "@/data/stats";
import { testimonials } from "@/data/testimonials";

/**
 * Social proof band.
 *
 * Numbers come from data/stats.ts (placeholders today) and the marquee reads
 * from data/testimonials.ts, so nothing here needs editing when real figures and
 * reviews land.
 */
export function SocialProof() {
  // Duplicated once so the CSS marquee can loop seamlessly at -50%.
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <section className="border-b border-navy-900/8 bg-canvas py-16 lg:py-20" aria-labelledby="social-proof-heading">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow withRules>Why owners stay</Eyebrow>
          <h2
            id="social-proof-heading"
            className="mt-5 text-display-xs font-semibold text-navy-900 sm:text-display-sm"
          >
            Trusted by pet owners who want more than a sitter.
          </h2>
        </Reveal>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-4">
          {socialProofStats.map((stat, index) => (
            <Reveal key={stat.id} delay={index * 0.06} className="text-center">
              <dd className="font-display text-display-sm font-semibold text-navy-900 sm:text-display-md">
                <Counter
                  value={stat.value}
                  decimals={stat.decimals}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </dd>
              <dt className="mt-2 text-[0.9375rem] font-medium text-navy-800">{stat.label}</dt>
              {stat.detail ? (
                <p className="mx-auto mt-1 max-w-[22ch] text-xs leading-relaxed text-sand-600">
                  {stat.detail}
                </p>
              ) : null}
            </Reveal>
          ))}
        </dl>
      </Container>

      {/* Testimonial marquee. Paused on hover, and static for reduced-motion users. */}
      <div className="mt-14 overflow-hidden mask-fade-x">
        <ul
          className="flex w-max gap-4 animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none"
          aria-label="Recent reviews"
        >
          {marqueeItems.map((testimonial, index) => (
            <li
              key={`${testimonial.id}-${index}`}
              className="flex w-[320px] shrink-0 flex-col justify-between rounded-card border border-navy-900/8 bg-white p-5 sm:w-[368px]"
              aria-hidden={index >= testimonials.length}
            >
              <div>
                <div className="flex items-center justify-between">
                  <Rating value={testimonial.rating} size="sm" />
                  <Quote className="h-4 w-4 text-mint-500/60" strokeWidth={2} aria-hidden="true" />
                </div>
                <p className="mt-3.5 text-[0.9375rem] leading-relaxed text-navy-800">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>
              <div className="mt-5 flex items-center gap-3 border-t border-navy-900/8 pt-4">
                <PetAvatar slot={testimonial.mediaKey} name={testimonial.petName} size={36} />
                <p className="text-[0.8125rem] text-sand-600">
                  <span className="font-semibold text-navy-900">{testimonial.ownerName}</span>
                  {" · "}
                  {testimonial.petName}
                  {" · "}
                  {testimonial.location}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
