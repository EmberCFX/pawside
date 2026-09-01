"use client";

import { Check, Info } from "lucide-react";
import { getServicePricing } from "@/data/pricing";
import { services } from "@/data/services";
import { cn, formatPrice } from "@/lib/utils";
import type { DurationMinutes, ServiceSlug } from "@/types";

/** Step 1 — choose a service, then a duration. */
export function ServiceSelector({
  value,
  duration,
  onServiceChange,
  onDurationChange,
}: {
  value: ServiceSlug | null;
  duration: DurationMinutes | null;
  onServiceChange: (slug: ServiceSlug) => void;
  onDurationChange: (minutes: DurationMinutes | null) => void;
}) {
  const selected = services.find((service) => service.slug === value);
  const selectedPricing = value ? getServicePricing(value) : null;

  return (
    <div>
      <fieldset>
        <legend className="sr-only">Choose a service</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((service) => {
            const isSelected = value === service.slug;
            const price = getServicePricing(service.slug).startingAt;

            return (
              <label
                key={service.slug}
                className={cn(
                  "group relative flex cursor-pointer gap-4 rounded-card p-5 text-left transition-all duration-200 ease-brand ring-1 ring-inset",
                  isSelected
                    ? "bg-navy-900 ring-navy-900 shadow-soft"
                    : "bg-white ring-navy-900/10 hover:ring-navy-900/25 hover:shadow-soft",
                )}
              >
                <input
                  type="radio"
                  name="service"
                  value={service.slug}
                  checked={isSelected}
                  onChange={() => {
                    onServiceChange(service.slug);
                    onDurationChange(service.defaultDuration);
                  }}
                  className="peer sr-only"
                />

                <span
                  className={cn(
                    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ring-1 ring-inset transition-colors",
                    isSelected
                      ? "bg-white/10 text-mint-300 ring-white/15"
                      : "bg-navy-50 text-navy-900 ring-navy-900/8",
                  )}
                  aria-hidden="true"
                >
                  <service.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span
                      className={cn(
                        "font-display text-[1.0625rem] font-semibold",
                        isSelected ? "text-white" : "text-navy-900",
                      )}
                    >
                      {service.name}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 text-[0.8125rem] font-semibold tabular",
                        isSelected ? "text-mint-300" : "text-navy-800",
                      )}
                    >
                      from {formatPrice(price)}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 block text-[0.875rem] leading-relaxed",
                      isSelected ? "text-navy-100/70" : "text-sand-600",
                    )}
                  >
                    {service.summary}
                  </span>
                </span>

                {isSelected ? (
                  <span
                    className="absolute right-4 top-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-mint-500 text-white"
                    aria-hidden="true"
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                ) : null}

                <span className="pointer-events-none absolute inset-0 rounded-card ring-2 ring-mint-600 opacity-0 peer-focus-visible:opacity-100" />
              </label>
            );
          })}
        </div>
      </fieldset>

      {selected ? (
        <div className="mt-8 border-t border-navy-900/8 pt-8">
          {selected.pricingUnit === "night" ? (
            <div className="flex items-start gap-3 rounded-card bg-canvas p-5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-mint-600" strokeWidth={1.75} aria-hidden="true" />
              <div>
                <p className="text-[0.9375rem] font-medium text-navy-900">
                  Overnight care is priced per night
                </p>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-sand-700">
                  {formatPrice(selectedPricing!.startingAt)} per night covers 12 hours — evening
                  walk, dinner, medication, overnight company, and a morning walk. We&apos;ll confirm
                  the exact window with you.
                </p>
              </div>
            </div>
          ) : (
            <fieldset>
              <legend className="text-[0.9375rem] font-medium text-navy-900">
                How long should each visit be?
              </legend>
              <p className="mt-1 text-[0.8125rem] text-sand-600">
                Not sure? {formatPrice(selectedPricing!.durations[1]?.price ?? 0)} for{" "}
                {selectedPricing!.durations[1]?.label} is what most people start with.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {selectedPricing!.durations.map((entry) => {
                  const isSelected = duration === entry.minutes;
                  return (
                    <label
                      key={entry.minutes}
                      className={cn(
                        "group relative flex cursor-pointer flex-col rounded-button px-4 py-3.5 transition-all duration-200 ring-1 ring-inset",
                        isSelected
                          ? "bg-navy-900 text-white ring-navy-900"
                          : "bg-white ring-navy-900/12 hover:ring-navy-900/28",
                      )}
                    >
                      <input
                        type="radio"
                        name="duration"
                        value={entry.minutes}
                        checked={isSelected}
                        onChange={() => onDurationChange(entry.minutes)}
                        className="peer sr-only"
                      />
                      <span className="font-display text-[1.0625rem] font-semibold leading-none">
                        {entry.label}
                      </span>
                      <span
                        className={cn(
                          "mt-1.5 text-[0.8125rem] tabular",
                          isSelected ? "text-navy-100/70" : "text-sand-600",
                        )}
                      >
                        {formatPrice(entry.price)}
                      </span>
                      {entry.note ? (
                        <span
                          className={cn(
                            "mt-2 text-[0.625rem] font-semibold uppercase tracking-[0.08em]",
                            isSelected ? "text-mint-300" : "text-mint-700",
                          )}
                        >
                          {entry.note}
                        </span>
                      ) : null}
                      <span className="pointer-events-none absolute inset-0 rounded-button ring-2 ring-mint-600 opacity-0 peer-focus-visible:opacity-100" />
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}
        </div>
      ) : null}
    </div>
  );
}
