"use client";

import { Cat, Dog, Plus, Rabbit, Trash2 } from "lucide-react";
import { SelectField, TextField } from "@/components/ui/Field";
import { createPetDraft } from "@/lib/booking";
import { cn, createId } from "@/lib/utils";
import type { PetDraft, PetType } from "@/types";

/** Step 2 — who are we caring for. */
const petTypes: { value: PetType; label: string; icon: typeof Dog }[] = [
  { value: "dog", label: "Dog", icon: Dog },
  { value: "cat", label: "Cat", icon: Cat },
  { value: "other", label: "Other", icon: Rabbit },
];

export function PetSelector({
  pets,
  onChange,
}: {
  pets: PetDraft[];
  onChange: (pets: PetDraft[]) => void;
}) {
  const updatePet = (id: string, patch: Partial<PetDraft>) =>
    onChange(pets.map((pet) => (pet.id === id ? { ...pet, ...patch } : pet)));

  const addPet = () => onChange([...pets, createPetDraft(createId("pet"))]);

  const removePet = (id: string) => onChange(pets.filter((pet) => pet.id !== id));

  return (
    <div className="flex flex-col gap-5">
      {pets.map((pet, index) => (
        <fieldset
          key={pet.id}
          className="rounded-card border border-sand-800/10 bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <legend className="font-display text-[1.0625rem] font-semibold text-navy-900">
              {pet.name.trim() || `Pet ${index + 1}`}
            </legend>
            {pets.length > 1 ? (
              <button
                type="button"
                onClick={() => removePet(pet.id)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[0.8125rem] text-sand-600 transition-colors hover:bg-sand-100 hover:text-navy-900"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                Remove
                <span className="sr-only"> {pet.name.trim() || `pet ${index + 1}`}</span>
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <TextField
              label="Pet name"
              required
              value={pet.name}
              placeholder="Bella"
              autoComplete="off"
              onChange={(event) => updatePet(pet.id, { name: event.target.value })}
            />

            <div>
              <span className="mb-1.5 block text-[0.8125rem] font-medium text-navy-800">
                Type of pet
              </span>
              <div className="flex gap-2">
                {petTypes.map((type) => {
                  const isSelected = pet.type === type.value;
                  return (
                    <label
                      key={type.value}
                      className={cn(
                        "group relative inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-button px-3 py-2.5 text-[0.875rem] font-medium transition-all duration-200 ring-1 ring-inset",
                        isSelected
                          ? "bg-navy-900 text-white ring-navy-900"
                          : "bg-white text-navy-800 ring-sand-800/12 hover:ring-sand-800/28",
                      )}
                    >
                      <input
                        type="radio"
                        name={`pet-type-${pet.id}`}
                        value={type.value}
                        checked={isSelected}
                        onChange={() => updatePet(pet.id, { type: type.value })}
                        className="peer sr-only"
                      />
                      <type.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                      {type.label}
                      <span className="pointer-events-none absolute inset-0 rounded-button ring-2 ring-mint-600 opacity-0 peer-focus-visible:opacity-100" />
                    </label>
                  );
                })}
              </div>
            </div>

            <TextField
              label="Breed"
              optional
              value={pet.breed}
              placeholder="Golden Retriever"
              onChange={(event) => updatePet(pet.id, { breed: event.target.value })}
            />

            <SelectField
              label="Age"
              value={pet.age}
              onChange={(event) => updatePet(pet.id, { age: event.target.value })}
              options={[
                { value: "", label: "Select an age range" },
                { value: "puppy-kitten", label: "Under 1 year" },
                { value: "young", label: "1 – 3 years" },
                { value: "adult", label: "4 – 8 years" },
                { value: "senior", label: "9+ years" },
              ]}
            />
          </div>
        </fieldset>
      ))}

      <button
        type="button"
        onClick={addPet}
        className="inline-flex items-center justify-center gap-2 rounded-card border border-dashed border-sand-800/20 bg-canvas px-5 py-4 text-[0.9375rem] font-medium text-navy-900 transition-colors hover:border-mint-500/60 hover:bg-mint-50"
      >
        <Plus className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        Add another pet
      </button>

      <p className="text-[0.8125rem] leading-relaxed text-sand-600">
        The first pet is included in the visit rate. Additional pets in the same household are a
        small per-visit fee — you&apos;ll see it in the summary before you confirm.
      </p>
    </div>
  );
}
