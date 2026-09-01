import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PetAvatar } from "@/components/ui/Photo";
import { petProfiles } from "@/data/account";

const fields = [
  { label: "Feeding routine", key: "feedingRoutine" },
  { label: "Walk routine", key: "walkRoutine" },
  { label: "Medication", key: "medication" },
  { label: "Allergies", key: "allergies" },
  { label: "Behavior notes", key: "behaviorNotes" },
  { label: "Favorite toys", key: "favoriteToys" },
  { label: "Favorite treats", key: "favoriteTreats" },
  { label: "Veterinarian", key: "veterinarian" },
  { label: "Emergency contact", key: "emergencyContact" },
  { label: "Special instructions", key: "specialInstructions" },
  { label: "Entry instructions", key: "entryInstructions" },
] as const;

export default function AccountPetsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-navy-900">Pet profiles</h2>
          <p className="mt-1.5 text-[0.9375rem] text-sand-700">
            Keep these current and every visit follows the same instructions.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-button bg-navy-900 px-4 py-2.5 text-[0.875rem] font-medium text-white transition-colors hover:bg-navy-800"
        >
          <Plus className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          Add a pet
        </button>
      </div>

      {petProfiles.map((pet) => (
        <Card key={pet.id} className="p-6 sm:p-7">
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
            <button
              type="button"
              className="rounded-button bg-white px-3.5 py-2 text-[0.8125rem] font-medium text-navy-900 ring-1 ring-inset ring-navy-900/10 transition-all hover:ring-navy-900/25"
            >
              Edit profile
            </button>
          </div>

          <dl className="mt-6 grid gap-x-8 gap-y-5 border-t border-navy-900/8 pt-6 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key}>
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-sand-500">
                  {field.label}
                </dt>
                <dd className="mt-1.5 text-[0.875rem] leading-relaxed text-navy-800">
                  {pet[field.key] || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      ))}
    </div>
  );
}
