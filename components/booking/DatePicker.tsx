"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { holidayDates } from "@/data/pricing";
import { MONTH_NAMES, buildCalendar } from "@/lib/booking";
import { cn, formatDate } from "@/lib/utils";

/**
 * Calendar.
 *
 * Real <button> cells with aria-pressed, arrow-key friendly tab order, and
 * holiday dates flagged up front so a surcharge is never a surprise.
 * PLACEHOLDER AVAILABILITY: every future date is offered. Wire
 * /api/availability to disable genuinely full days.
 */
export function DatePicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (iso: string) => void;
}) {
  const today = useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));

  const days = useMemo(
    () => buildCalendar(viewMonth.year, viewMonth.month, today),
    [viewMonth, today],
  );

  const shiftMonth = (delta: number) =>
    setViewMonth((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });

  const atFirstMonth =
    viewMonth.year === today.getFullYear() && viewMonth.month === today.getMonth();

  return (
    <div className="rounded-card border border-sand-800/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-[1.0625rem] font-semibold text-navy-900" aria-live="polite">
          {MONTH_NAMES[viewMonth.month]} {viewMonth.year}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            disabled={atFirstMonth}
            aria-label="Previous month"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-navy-800 transition-colors hover:bg-navy-50 disabled:opacity-35 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-navy-800 transition-colors hover:bg-navy-50"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1" aria-hidden="true">
        {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
          <div
            key={`${label}-${index}`}
            className="pb-1 text-center text-[0.6875rem] font-semibold uppercase text-sand-500"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" role="group" aria-label="Choose a date">
        {days.map((day) => {
          const isSelected = value === day.iso;
          const isHoliday = holidayDates.includes(day.iso);
          const disabled = day.isPast;

          return (
            <button
              key={day.iso}
              type="button"
              disabled={disabled}
              aria-pressed={isSelected}
              aria-label={`${formatDate(day.iso, { weekday: "long", month: "long", day: "numeric" })}${
                isHoliday ? " — holiday surcharge applies" : ""
              }`}
              onClick={() => onChange(day.iso)}
              className={cn(
                "relative flex h-10 items-center justify-center rounded-[10px] text-[0.875rem] transition-all duration-150 tabular",
                !day.isCurrentMonth && "text-sand-400",
                day.isCurrentMonth && !isSelected && "text-navy-800 hover:bg-navy-50",
                isSelected && "bg-navy-900 font-semibold text-white shadow-soft",
                day.isToday && !isSelected && "ring-1 ring-inset ring-mint-500/60",
                disabled && "cursor-not-allowed text-sand-300 hover:bg-transparent",
              )}
            >
              {day.day}
              {isHoliday && !disabled ? (
                <span
                  className={cn(
                    "absolute bottom-1.5 h-1 w-1 rounded-full",
                    isSelected ? "bg-mint-300" : "bg-mint-500",
                  )}
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="mt-4 flex items-center gap-2 border-t border-sand-800/8 pt-4 text-xs text-sand-600">
        <span className="h-1.5 w-1.5 rounded-full bg-mint-500" aria-hidden="true" />
        Holiday — a surcharge applies, reduced or waived for members
      </p>
    </div>
  );
}
