import { CalendarCheck, HeartHandshake, MessageSquareHeart, PawPrint } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card, IconTile } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { Photo } from "@/components/ui/Photo";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

const steps = [
  {
    number: "01",
    title: "Tell us about your pet",
    description:
      "Routines, personality, feeding instructions, medication, the neighbor's dog they hate. We'd rather know too much than too little.",
    icon: PawPrint,
    points: ["Free meet & greet", "Pet profile saved for next time"],
  },
  {
    number: "02",
    title: "Choose your care",
    description:
      "A walk, a drop-in, a sitting session, or a recurring schedule that holds your slot each week.",
    icon: CalendarCheck,
    points: ["One-time or recurring", "Change or skip any week"],
  },
  {
    number: "03",
    title: "We take care of the rest",
    description:
      "Same caregiver whenever possible, following the routine you wrote down — not a generic checklist.",
    icon: HeartHandshake,
    points: ["Consistent caregiver", "Your rules for your home"],
  },
  {
    number: "04",
    title: "Stay updated",
    description:
      "A summary after every visit: what they ate, how long the walk was, how they seemed. Plus photos.",
    icon: MessageSquareHeart,
    points: ["Photo updates included", "Walk time and distance logged"],
  },
];

export function HowItWorks({ compact }: { compact?: boolean }) {
  return (
    <Section id="how-it-works" tone="default" compact={compact}>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            eyebrow="How it works"
            title="Pet care without the hassle."
            description="Four steps from “I need someone” to “they're taken care of.” No app download, no bidding, no strangers messaging you."
          />
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/book" size="lg" withArrow>
              Get Started
            </ButtonLink>
            <ButtonLink href="/about" variant="secondary" size="lg">
              Meet Pawside
            </ButtonLink>
          </div>

          <Reveal delay={0.1} className="mt-10">
            <Photo
              slot="how-it-works"
              aspect="aspect-[4/3]"
              className="lg:aspect-[5/4]"
              sizes="(max-width: 1024px) 100vw, 480px"
            />
          </Reveal>
        </div>

        <RevealGroup className="flex flex-col gap-4">
          {steps.map((step) => (
            <RevealItem key={step.number}>
              <Card interactive className="group flex gap-5 p-6 sm:p-7">
                <div className="flex flex-col items-center">
                  <IconTile
                    icon={step.icon}
                    className="transition-colors duration-300 group-hover:bg-mint-50 group-hover:text-mint-700 group-hover:ring-mint-500/25"
                  />
                  <span
                    className="mt-3 font-display text-[0.6875rem] font-semibold tracking-[0.14em] text-sand-400"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold text-navy-900 sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-sand-700">
                    {step.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                    {step.points.map((point) => (
                      <li
                        key={point}
                        className="inline-flex items-center gap-1.5 text-[0.8125rem] text-sand-600"
                      >
                        <span className="h-1 w-1 rounded-full bg-mint-500" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
