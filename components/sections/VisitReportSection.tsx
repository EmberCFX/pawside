import { BellRing, FileText, ImageIcon, MapPinned } from "lucide-react";
import { ReportCard } from "@/components/dashboard/ReportCard";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { visitReports } from "@/data/account";

const highlights = [
  {
    title: "Every task, logged",
    description: "Walk, potty, food, water, medication — with times, not vague reassurance.",
    icon: FileText,
  },
  {
    title: "Photos every visit",
    description: "Real phone photos from the visit, not staged shots.",
    icon: ImageIcon,
  },
  {
    title: "Walk time and distance",
    description: "You can see they actually got the walk you paid for.",
    icon: MapPinned,
  },
  {
    title: "A note in plain words",
    description: "How they seemed, what changed, anything you should know about the house.",
    icon: BellRing,
  },
];

export function VisitReportSection() {
  const report = visitReports[0];

  return (
    <Section id="visit-report" tone="default">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            align="left"
            eyebrow="Visit reports"
            title="Photos included. Peace of mind included too."
            description="After every single visit you get a report like this one. It's the difference between hoping someone showed up and knowing exactly how your pet's afternoon went."
          />

          <ul className="mt-9 grid gap-6 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <li key={highlight.title}>
                <highlight.icon
                  className="h-5 w-5 text-mint-600"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <p className="mt-3 font-display text-[1.0625rem] font-semibold text-navy-900">
                  {highlight.title}
                </p>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-sand-700">
                  {highlight.description}
                </p>
              </li>
            ))}
          </ul>

          <ButtonLink href="/book" size="lg" withArrow className="mt-9">
            Book Pet Care
          </ButtonLink>
        </div>

        <Reveal delay={0.06}>
          <ReportCard report={report} className="shadow-card" />
          <p className="mt-4 text-center text-xs text-sand-500">
            Sample report shown with example data.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
