"use client";

import { cn } from "@/lib/utils";
import { overnightSlots, timeSlots } from "@/lib/booking";

/**
 * Arrival windows rather than exact times — honest for a service that drives
 * between homes, and it keeps the schedule flexible enough to stay reliable.
 */
export function TimePicker({
  value,
  onChange,
  overnight,
}: {
  value: string | null;
  onChange: (label: string) => void;
  overnight?: boolean;
}) {
  const slots = overnight ? overnightSlots : timeSlots;

  return (
    <fieldset>
      <legend className="text-[0.9375rem] font-medium text-navy-900">
        {overnight ? "Overnight window" : "Arrival window"}
      </legend>
      <p className="mt-1 text-[0.8125rem] text-sand-600">
        {overnight
          ? "We'll arrive in the evening and stay through the night."
          : "We'll text when we're on the way, and the report tells you exactly when we arrived."}
      </p>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {slots.map((slot) => {
          const isSelected = value === slot.label;
          return (
            <label
              key={slot.id}
              className={cn(
                "group relative flex cursor-pointer items-center justify-between gap-3 rounded-button px-4 py-3 transition-all duration-200 ring-1 ring-inset",
                isSelected
                  ? "bg-navy-900 text-white ring-navy-900"
                  : "bg-white text-navy-800 ring-sand-800/12 hover:ring-sand-800/28",
              )}
            >
              <input
                type="radio"
                name="time-slot"
                value={slot.label}
                checked={isSelected}
                onChange={() => onChange(slot.label)}
                className="peer sr-only"
              />
              <span className="text-[0.9375rem] font-medium tabular">{slot.label}</span>
              <span
                className={cn(
                  "shrink-0 text-[0.75rem]",
                  isSelected ? "text-mint-300" : "text-sand-600",
                )}
              >
                {slot.detail}
              </span>
              <span className="pointer-events-none absolute inset-0 rounded-button ring-2 ring-mint-600 opacity-0 peer-focus-visible:opacity-100" />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
