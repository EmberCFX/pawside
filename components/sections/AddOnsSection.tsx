import { Lightbulb } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { addOnCategories, addOns } from "@/data/addOns";
import { formatPrice } from "@/lib/utils";

/**
 * Add-ons.
 *
 * Presented as a menu, not a pitch. The contextual-recommendation example is
 * shown honestly so owners know what to expect at checkout — suggestions tied to
 * what they've already chosen, never pre-checked.
 */
export function AddOnsSection() {
  return (
    <Section id="add-ons" tone="default">
      <SectionHeading
        eyebrow="Add-ons"
        title="Make their visit even better."
        description="Small upgrades that make a real difference on a specific day. Add them while booking, or ask us mid-trip."
      />

      <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {addOnCategories.map((category) => {
          const items = addOns.filter((addOn) => addOn.category === category.id);

          return (
            <RevealItem key={category.id} className="h-full">
              <Card className="flex h-full flex-col p-6">
                <h3 className="font-display text-lg font-semibold text-navy-900">
                  {category.label}
                </h3>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-sand-600">
                  {category.description}
                </p>

                <ul className="mt-5 flex flex-1 flex-col gap-3.5 border-t border-navy-900/8 pt-5">
                  {items.map((addOn) => (
                    <li key={addOn.slug} className="flex items-start gap-3">
                      <addOn.icon
                        className="mt-0.5 h-4 w-4 shrink-0 text-navy-500"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-[0.875rem] font-medium text-navy-900">{addOn.name}</p>
                          <p className="shrink-0 text-[0.8125rem] font-semibold text-navy-800 tabular">
                            {addOn.comingSoon ? "Soon" : `+${formatPrice(addOn.price)}`}
                          </p>
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-sand-600">
                          {addOn.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </RevealItem>
          );
        })}
      </RevealGroup>

      <div className="mt-10 flex flex-col items-start gap-6 rounded-panel border border-navy-900/8 bg-canvas p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-mint-50 text-mint-700 ring-1 ring-inset ring-mint-500/20">
            <Lightbulb className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-[1.0625rem] font-semibold text-navy-900">
              Suggestions, not pressure
            </p>
            <p className="mt-1.5 max-w-xl text-[0.9375rem] leading-relaxed text-sand-700">
              At checkout you might see something like{" "}
              <span className="text-navy-900">
                &ldquo;Max has a 60-minute visit — add a 15-minute walk for{" "}
                {formatPrice(1200)}?&rdquo;
              </span>{" "}
              Relevant to what you picked, never pre-selected, and always one tap to ignore.
            </p>
          </div>
        </div>
        <ButtonLink href="/book" variant="secondary" size="md" withArrow className="shrink-0">
          Build Your Visit
        </ButtonLink>
      </div>
    </Section>
  );
}
