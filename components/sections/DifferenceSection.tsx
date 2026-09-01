import { CalendarRange, Camera, ClipboardList, MapPin, Repeat, ShieldCheck } from "lucide-react";
import { IconTile } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * The Pawside difference — differentiation without naming competitors.
 * The framing is what Pawside *is* (a relationship), not what others aren't.
 */
const points = [
  {
    title: "Consistent care",
    description:
      "Whenever possible, your pet sees the same familiar caregiver. Familiarity is what lets an animal actually relax.",
    icon: Repeat,
  },
  {
    title: "Personalized routines",
    description:
      "Meals, walks, medication, play, and bedtime follow your instructions — down to which door you use and which toy is the good one.",
    icon: ClipboardList,
  },
  {
    title: "Real updates",
    description:
      "Photos and a plain-language summary after every visit, including the parts that didn't go perfectly.",
    icon: Camera,
  },
  {
    title: "Local & personal",
    description:
      "Pawside is built around a limited number of local households, so we know your pet's name before we know your address.",
    icon: MapPin,
  },
  {
    title: "Flexible care",
    description:
      "Every household runs differently. Split shifts, three visits a day, travel weeks — the schedule adapts to the pet.",
    icon: CalendarRange,
  },
  {
    title: "Prepared for the unexpected",
    description:
      "Pet first aid certified, insured and bonded, with your vet and emergency contacts on file before the first visit.",
    icon: ShieldCheck,
  },
];

export function DifferenceSection() {
  return (
    <Section tone="inverse" className="overflow-hidden">
      <SectionHeading
        onDark
        eyebrow="The Pawside difference"
        title={
          <>
            Not just someone available.
            <br />
            Someone you trust.
          </>
        }
        description="Booking a stranger is easy. Building a relationship with someone who knows your pet takes a little more — and it's worth it every time you leave the house."
      />

      <RevealGroup className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {points.map((point) => (
          <RevealItem key={point.title}>
            <div className="flex flex-col">
              <IconTile icon={point.icon} tone="inverse" />
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{point.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-navy-100/70">
                {point.description}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
