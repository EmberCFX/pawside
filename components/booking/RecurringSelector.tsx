"use client";

import { Repeat } from "lucide-react";
import { frequencyOptions } from "@/lib/booking";
import { pricing } from "@/data/pricing";
import { WEEKDAYS, cn } from "@/lib/utils";
import type { RecurringFrequency } from "@/types";

/**
 * Recurring schedule.
 *
 * The recurring discount is surfaced on the option itself — the upsell here is
 * just telling people that the thing they probably want is also cheaper.
 */
export function RecurringSelector({
  frequency,
  weekdays,
  onFrequencyChange,
  onWeekdaysChange,
}: {
  frequency: RecurringFrequency;
  weekdays: number[];
  onFrequencyChange: (frequency: RecurringFrequency) => void;
  onWeekdaysChange: (weekdays: number[]) => void;
}) {
  const showWeekdays = frequency === "multi-weekly" || frequency === "custom";

  const toggleWeekday = (index: number) =>
    onWeekdaysChange(
      weekdays.includes(index)
        ? weekdays.filter((day) => day !== index)
        : [...weekdays, index].sort((a, b) => a - b),
    );

  return (
    <fieldset>
      <legend className="text-[0.9375rem] font-medium text-navy-900">How often?</legend>
      <p className="mt-1 text-[0.8125rem] text-sand-600">
        Recurring visits hold your slot each week — and cost less per visit.
      </p>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {frequencyOptions.map((option) => {
          const isSelected = frequency === option.id;
          const discount = pricing.recurringDiscounts[option.id];

          return (
            <label
              key={option.id}
              className={cn(
                "group relative flex cursor-pointer flex-col rounded-card p-4 transition-all duration-200 ring-1 ring-inset",
                isSelected
                  ? "bg-navy-900 ring-navy-900"
                  : "bg-white ring-sand-800/12 hover:ring-sand-800/28",
              )}
            >
              <input
                type="radio"
                name="frequency"
                value={option.id}
                checked={isSelected}
                onChange={() => onFrequencyChange(option.id)}
                className="peer sr-only"
              />
              <span className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "text-[0.9375rem] font-medium",
                    isSelected ? "text-white" : "text-navy-900",
                  )}
                >
                  {option.label}
                </span>
                {discount > 0 ? (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold uppercase",
                      isSelected ? "bg-white/15 text-mint-300" : "bg-mint-50 text-mint-700",
                    )}
                  >
                    Save {Math.round(discount * 100)}%
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "mt-1 text-[0.8125rem] leading-relaxed",
                  isSelected ? "text-navy-100/70" : "text-sand-600",
                )}
              >
                {option.description}
              </span>
              <span className="pointer-events-none absolute inset-0 rounded-card ring-2 ring-mint-600 opacity-0 peer-focus-visible:opacity-100" />
            </label>
          );
        })}
      </div>

      {showWeekdays ? (
        <div className="mt-5 rounded-card bg-canvas p-5">
          <p className="flex items-center gap-2 text-[0.875rem] font-medium text-navy-900">
            <Repeat className="h-4 w-4 text-mint-600" strokeWidth={1.75} aria-hidden="true" />
            Which days do you need?
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {WEEKDAYS.map((day) => {
              const isSelected = weekdays.includes(day.index);
              return (
                <button
                  key={day.index}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleWeekday(day.index)}
                  className={cn(
                    "h-10 w-12 rounded-button text-[0.8125rem] font-medium transition-all duration-200 ring-1 ring-inset",
                    isSelected
                      ? "bg-navy-900 text-white ring-navy-900"
                      : "bg-white text-navy-800 ring-sand-800/12 hover:ring-sand-800/28",
                  )}
                >
                  {day.short}
                  <span className="sr-only"> {day.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </fieldset>
  );
}
