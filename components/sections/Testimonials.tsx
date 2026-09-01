import { Card } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { PetAvatar } from "@/components/ui/Photo";
import { Rating } from "@/components/ui/Rating";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { getService } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { trustStats } from "@/data/stats";
import type { Testimonial } from "@/types";

export function Testimonials({
  items = testimonials,
  limit,
  heading = "What owners actually say.",
  eyebrow = "Reviews",
  description = "Sample reviews shown while we collect permission to publish real ones. Every future review here will be from a verified Pawside client.",
}: {
  items?: Testimonial[];
  limit?: number;
  heading?: string;
  eyebrow?: string;
  description?: string;
}) {
  const visible = limit ? items.slice(0, limit) : items;

  return (
    <Section id="reviews" tone="muted">
      <SectionHeading eyebrow={eyebrow} title={heading} description={description}>
        <div className="mt-7 flex items-center gap-3">
          <Rating value={trustStats.averageRating} />
          <p className="text-[0.9375rem] text-sand-700">
            <span className="font-semibold text-navy-900">{trustStats.averageRating}.0</span> average
            · {trustStats.reviewCount} reviews · {trustStats.onTimeRate}% on time
          </p>
        </div>
      </SectionHeading>

      <RevealGroup
        as="ul"
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 [column-fill:_balance]"
      >
        {visible.map((testimonial) => {
          const service = testimonial.serviceSlug ? getService(testimonial.serviceSlug) : undefined;

          return (
            <RevealItem key={testimonial.id} as="li" className="h-full">
              <Card interactive className="flex h-full flex-col p-6 sm:p-7">
                <Rating value={testimonial.rating} size="sm" />

                <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-navy-800">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="mt-6 flex items-center gap-3 border-t border-sand-800/8 pt-5">
                  <PetAvatar slot={testimonial.mediaKey} name={testimonial.petName} size={40} />
                  <div className="min-w-0">
                    <p className="text-[0.875rem] font-semibold text-navy-900">
                      {testimonial.ownerName}
                      <span className="font-normal text-sand-600"> &amp; {testimonial.petName}</span>
                    </p>
                    <p className="truncate text-xs text-sand-600">
                      {testimonial.location}
                      {service ? ` · ${service.name}` : null}
                    </p>
                  </div>
                </div>
              </Card>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
