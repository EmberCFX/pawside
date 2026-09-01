import {
  AlertCircle,
  CalendarDays,
  Cat,
  Dog,
  Heart,
  Key,
  Pill,
  Stethoscope,
  UtensilsCrossed,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Layout";
import { PetAvatar } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { petProfiles } from "@/data/account";

/**
 * Pet profile preview.
 *
 * Renders the real PetProfile type from mock data — the same shape the dashboard
 * and the future database use — so this marketing preview stays honest as the
 * product gets built.
 */
const profileFields = [
  { label: "Feeding routine", key: "feedingRoutine", icon: UtensilsCrossed },
  { label: "Walk routine", key: "walkRoutine", icon: Dog },
  { label: "Medication", key: "medication", icon: Pill },
  { label: "Allergies", key: "allergies", icon: AlertCircle },
  { label: "Behavior notes", key: "behaviorNotes", icon: Heart },
  { label: "Veterinarian", key: "veterinarian", icon: Stethoscope },
  { label: "Entry instructions", key: "entryInstructions", icon: Key },
] as const;

export function PetProfilePreview() {
  const pet = petProfiles[0];
  const secondPet = petProfiles[1];

  return (
    <Section tone="muted">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Pet profiles"
            title="You know their routine. We'll stick to it."
            description="Write it down once. Every visit after that follows the same instructions — no re-explaining the feeding schedule to a new person every time."
          />

          <ul className="mt-8 flex flex-col gap-3">
            {[
              "Routines, medication, allergies, and vet info in one place",
              "Multiple pets per household, each with their own plan",
              "Entry instructions stored securely with your booking",
              "Update anything and the next visit reflects it",
            ].map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-[0.9375rem] text-sand-700">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500"
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/book" size="lg" withArrow>
              Create a pet profile
            </ButtonLink>
            <ButtonLink href="/account" variant="secondary" size="lg">
              View dashboard
            </ButtonLink>
          </div>
        </div>

        <Reveal delay={0.08}>
          {/* Mock dashboard chrome. */}
          <div className="rounded-feature border border-navy-900/10 bg-white p-3 shadow-lift sm:p-4">
            <div className="flex items-center justify-between px-2 pb-3">
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-sand-300" />
                <span className="h-2 w-2 rounded-full bg-sand-300" />
                <span className="h-2 w-2 rounded-full bg-sand-300" />
              </div>
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-sand-500">
                Pawside · Pet Profile
              </p>
              <Badge tone="mint">Preview</Badge>
            </div>

            <Card tone="muted" className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <PetAvatar slot={pet.mediaKey} name={pet.name} size={56} />
                  <div>
                    <h3 className="font-display text-xl font-semibold text-navy-900">{pet.name}</h3>
                    <p className="mt-0.5 text-[0.8125rem] text-sand-600">
                      {pet.breed} · {pet.age} · {pet.weight}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-medium text-navy-700 ring-1 ring-inset ring-navy-900/8">
                    <CalendarDays className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                    Birthday Apr 2
                  </span>
                  {secondPet ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-medium text-navy-700 ring-1 ring-inset ring-navy-900/8">
                      <Cat className="h-3 w-3" strokeWidth={2} aria-hidden="true" />+1 more pet
                    </span>
                  ) : null}
                </div>
              </div>

              <dl className="mt-6 grid gap-x-6 gap-y-5 border-t border-navy-900/8 pt-6 sm:grid-cols-2">
                {profileFields.map((field) => (
                  <div key={field.key}>
                    <dt className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-sand-500">
                      <field.icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                      {field.label}
                    </dt>
                    <dd className="mt-1.5 text-[0.875rem] leading-relaxed text-navy-800">
                      {pet[field.key]}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-navy-900/8 pt-5">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-sand-500">
                  Favorites
                </span>
                {[pet.favoriteToys, pet.favoriteTreats].map((favorite) => (
                  <span
                    key={favorite}
                    className="rounded-full bg-mint-50 px-2.5 py-1 text-[0.75rem] text-mint-800 ring-1 ring-inset ring-mint-500/20"
                  >
                    {favorite}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
