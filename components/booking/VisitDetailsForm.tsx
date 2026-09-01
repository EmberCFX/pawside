"use client";

import { KeyRound, ShieldCheck } from "lucide-react";
import { TextArea, TextField } from "@/components/ui/Field";
import { bookableServiceAreas } from "@/data/serviceAreas";
import type { BookingDraft } from "@/types";

/** Step 4 — where we're going and how we get in. */
export function VisitDetailsForm({
  draft,
  onChange,
}: {
  draft: BookingDraft;
  onChange: (patch: Partial<BookingDraft>) => void;
}) {
  const updateAddress = (patch: Partial<BookingDraft["address"]>) =>
    onChange({ address: { ...draft.address, ...patch } });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-display text-[1.0625rem] font-semibold text-navy-900">Address</h3>
        <p className="mt-1 text-[0.8125rem] text-sand-600">
          We currently serve{" "}
          {bookableServiceAreas
            .slice(0, 4)
            .map((area) => area.name)
            .join(", ")}
          , and nearby towns.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            label="Street address"
            required
            className="sm:col-span-2"
            autoComplete="address-line1"
            placeholder="18 Pleasant Street"
            value={draft.address.line1}
            onChange={(event) => updateAddress({ line1: event.target.value })}
          />
          <TextField
            label="Apartment, unit, or floor"
            optional
            className="sm:col-span-2"
            autoComplete="address-line2"
            value={draft.address.line2}
            onChange={(event) => updateAddress({ line2: event.target.value })}
          />
          <TextField
            label="City or town"
            required
            autoComplete="address-level2"
            placeholder="Easthampton"
            value={draft.address.city}
            onChange={(event) => updateAddress({ city: event.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="State"
              required
              autoComplete="address-level1"
              value={draft.address.state}
              onChange={(event) => updateAddress({ state: event.target.value })}
            />
            <TextField
              label="ZIP"
              required
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="01027"
              value={draft.address.postalCode}
              onChange={(event) => updateAddress({ postalCode: event.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-sand-800/8 pt-8">
        <h3 className="flex items-center gap-2 font-display text-[1.0625rem] font-semibold text-navy-900">
          <KeyRound className="h-4 w-4 text-mint-600" strokeWidth={1.75} aria-hidden="true" />
          Getting in
        </h3>
        <TextArea
          label="Entry instructions"
          className="mt-4"
          rows={3}
          placeholder="Keypad on the side door, code 1-2-3-4. Please re-lock and leave the porch light on."
          hint="Lockbox, keypad code, hidden key, or a spare we keep on file — whatever you prefer. Shared only with your assigned caregiver."
          value={draft.entryInstructions}
          onChange={(event) => onChange({ entryInstructions: event.target.value })}
        />

        <TextArea
          label="Care instructions"
          className="mt-5"
          rows={5}
          placeholder="Feeding amounts and times, medication, which door you use for walks, the neighbor's dog to avoid, anything that helps."
          hint="Tell us too much rather than too little. This gets saved to your pet's profile for next time."
          value={draft.careInstructions}
          onChange={(event) => onChange({ careInstructions: event.target.value })}
        />
      </div>

      <div className="flex items-start gap-3 rounded-card bg-canvas p-5">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-mint-600" strokeWidth={1.75} aria-hidden="true" />
        <p className="text-[0.8125rem] leading-relaxed text-sand-700">
          Entry codes are stored with your booking without your name or address attached, and
          they&apos;re visible only to the caregiver assigned to your visits. You can change or
          remove them any time.
        </p>
      </div>
    </div>
  );
}
