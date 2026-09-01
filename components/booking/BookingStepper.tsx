"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { BOOKING_STEPS, type BookingStepId } from "@/lib/booking";
import { cn } from "@/lib/utils";

/**
 * Booking progress.
 *
 * Desktop shows the full trail; mobile collapses to a progress bar plus
 * "Step 3 of 8" so the header never eats the viewport. Completed steps are
 * clickable so people can go back and change an answer without losing the rest.
 */
export function BookingStepper({
  currentStep,
  furthestStepIndex,
  onStepSelect,
}: {
  currentStep: BookingStepId;
  furthestStepIndex: number;
  onStepSelect: (step: BookingStepId) => void;
}) {
  const currentIndex = BOOKING_STEPS.findIndex((step) => step.id === currentStep);
  const progress = ((currentIndex + 1) / BOOKING_STEPS.length) * 100;
  const reduceMotion = useReducedMotion();

  return (
    <div>
      {/* Mobile */}
      <div className="lg:hidden">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-[0.9375rem] font-semibold text-navy-900">
            {BOOKING_STEPS[currentIndex]?.label}
          </p>
          <p className="text-[0.8125rem] text-sand-600 tabular">
            Step {currentIndex + 1} of {BOOKING_STEPS.length}
          </p>
        </div>
        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-navy-100">
          <motion.div
            className="h-full rounded-full bg-mint-500"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Desktop */}
      <ol className="hidden items-center gap-1 lg:flex" aria-label="Booking progress">
        {BOOKING_STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isReachable = index <= furthestStepIndex;

          return (
            <li key={step.id} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => isReachable && onStepSelect(step.id)}
                disabled={!isReachable}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.8125rem] transition-colors duration-200",
                  isCurrent && "bg-navy-900 text-white",
                  !isCurrent && isReachable && "text-navy-800 hover:bg-navy-50",
                  !isReachable && "cursor-default text-sand-400",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-semibold ring-1 ring-inset transition-colors",
                    isCurrent && "bg-white text-navy-900 ring-white",
                    isComplete && "bg-mint-500 text-white ring-mint-500",
                    !isCurrent && !isComplete && "ring-sand-800/15 text-sand-500",
                  )}
                  aria-hidden="true"
                >
                  {isComplete ? <Check className="h-3 w-3" strokeWidth={3} /> : index + 1}
                </span>
                {step.shortLabel}
              </button>

              {index < BOOKING_STEPS.length - 1 ? (
                <span
                  className={cn(
                    "h-px w-3 transition-colors",
                    index < currentIndex ? "bg-mint-500" : "bg-navy-900/12",
                  )}
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
