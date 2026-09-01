"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { AddOnSelector } from "@/components/booking/AddOnSelector";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { CheckoutForm, type PaymentChoice } from "@/components/booking/CheckoutForm";
import { ContactForm } from "@/components/booking/ContactForm";
import { DatePicker } from "@/components/booking/DatePicker";
import { OrderSummary } from "@/components/booking/OrderSummary";
import { PetSelector } from "@/components/booking/PetSelector";
import { RecurringSelector } from "@/components/booking/RecurringSelector";
import { ReviewStep } from "@/components/booking/ReviewStep";
import { ServiceSelector } from "@/components/booking/ServiceSelector";
import { TimePicker } from "@/components/booking/TimePicker";
import { VisitDetailsForm } from "@/components/booking/VisitDetailsForm";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { getService } from "@/data/services";
import { submitBooking } from "@/lib/api";
import { BOOKING_STEPS, stepIssues, type BookingStepId } from "@/lib/booking";
import { buildQuote } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { BookingDraft, DurationMinutes } from "@/types";

/**
 * The booking flow.
 *
 * Eight steps over a single client-side draft. State lives here (not in the URL)
 * so a mid-flow refresh can't leave a half-filled server record, and the whole
 * draft is handed to lib/api.ts in one submit at the end.
 *
 * Pricing is never computed in this component — buildQuote() is the only source,
 * shared with the homepage estimator.
 */
export function BookingFlow({ initialDraft }: { initialDraft: BookingDraft }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  const [stepIndex, setStepIndex] = useState(initialDraft.serviceSlug ? 1 : 0);
  const [furthestStepIndex, setFurthestStepIndex] = useState(
    initialDraft.serviceSlug ? 1 : 0,
  );
  const [showErrors, setShowErrors] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState<PaymentChoice>("hold");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const step = BOOKING_STEPS[stepIndex];
  const service = draft.serviceSlug ? getService(draft.serviceSlug) : undefined;
  const isOvernight = service?.pricingUnit === "night";

  const quote = useMemo(
    () =>
      buildQuote({
        serviceSlug: draft.serviceSlug,
        durationMinutes: draft.durationMinutes,
        petCount: draft.pets.length,
        addOnSlugs: draft.addOnSlugs,
        frequency: draft.frequency,
        weekdays: draft.weekdays,
        membership: draft.membership,
        date: draft.date,
        promoCode: draft.promoCode,
      }),
    [draft],
  );

  const issues = stepIssues(step.id, draft);
  const patch = (next: Partial<BookingDraft>) => setDraft((current) => ({ ...current, ...next }));

  const goToStep = (index: number) => {
    const clamped = Math.max(0, Math.min(BOOKING_STEPS.length - 1, index));
    setStepIndex(clamped);
    setFurthestStepIndex((current) => Math.max(current, clamped));
    setShowErrors(false);
    // Bring the form back into view on mobile, where the panel is tall.
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  const handleContinue = () => {
    if (issues.length) {
      setShowErrors(true);
      return;
    }
    goToStep(stepIndex + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await submitBooking({
        draft,
        quote,
        payNow: paymentChoice === "card",
      });
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
        return;
      }
      const params = new URLSearchParams({ booking: response.bookingNumber });
      router.push(`/book/confirmation?${params.toString()}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong submitting that booking.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-canvas pb-20 pt-10 sm:pt-14">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Book pet care</p>
          <h1 className="mt-5 text-display-sm font-semibold text-navy-900 sm:text-display-md">
            Let&apos;s set up their care.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-sand-700">
            Eight quick steps. Nothing is charged until we confirm we can cover it.
          </p>
        </div>

        <div className="mt-10 rounded-panel border border-sand-800/8 bg-white p-5 shadow-soft sm:p-6">
          <BookingStepper
            currentStep={step.id}
            furthestStepIndex={furthestStepIndex}
            onStepSelect={(id) =>
              goToStep(BOOKING_STEPS.findIndex((entry) => entry.id === id))
            }
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
          <div className="rounded-panel border border-sand-800/8 bg-white p-6 shadow-soft sm:p-8">
            <div className="mb-7">
              <h2 className="font-display text-2xl font-semibold text-navy-900">
                {stepHeading(step.id)}
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-sand-700">
                {stepDescription(step.id)}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={reduceMotion ? undefined : { opacity: 0, x: 12 }}
                animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -12 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {step.id === "service" ? (
                  <ServiceSelector
                    value={draft.serviceSlug}
                    duration={draft.durationMinutes}
                    onServiceChange={(slug) => patch({ serviceSlug: slug })}
                    onDurationChange={(minutes) => patch({ durationMinutes: minutes })}
                  />
                ) : null}

                {step.id === "pets" ? (
                  <PetSelector pets={draft.pets} onChange={(pets) => patch({ pets })} />
                ) : null}

                {step.id === "schedule" ? (
                  <div className="flex flex-col gap-8">
                    <DatePicker value={draft.date} onChange={(date) => patch({ date })} />
                    <TimePicker
                      value={draft.time}
                      onChange={(time) => patch({ time })}
                      overnight={isOvernight}
                    />
                    <div className="border-t border-sand-800/8 pt-8">
                      <RecurringSelector
                        frequency={draft.frequency}
                        weekdays={draft.weekdays}
                        onFrequencyChange={(frequency) => patch({ frequency })}
                        onWeekdaysChange={(weekdays) => patch({ weekdays })}
                      />
                    </div>
                  </div>
                ) : null}

                {step.id === "details" ? (
                  <VisitDetailsForm draft={draft} onChange={patch} />
                ) : null}

                {step.id === "addons" && draft.serviceSlug ? (
                  <AddOnSelector
                    serviceSlug={draft.serviceSlug}
                    durationMinutes={draft.durationMinutes}
                    pets={draft.pets}
                    selected={draft.addOnSlugs}
                    onChange={(addOnSlugs) => patch({ addOnSlugs })}
                    onDurationChange={(minutes: DurationMinutes) =>
                      patch({ durationMinutes: minutes })
                    }
                    isRecurring={draft.frequency !== "one-time"}
                    onMakeRecurring={() => {
                      patch({ frequency: "weekly" });
                      goToStep(BOOKING_STEPS.findIndex((entry) => entry.id === "schedule"));
                    }}
                  />
                ) : null}

                {step.id === "contact" ? (
                  <ContactForm draft={draft} onChange={patch} showErrors={showErrors} />
                ) : null}

                {step.id === "review" ? (
                  <ReviewStep
                    draft={draft}
                    quote={quote}
                    onEditStep={(id) =>
                      goToStep(BOOKING_STEPS.findIndex((entry) => entry.id === id))
                    }
                    onMembershipChange={(membership) => patch({ membership })}
                  />
                ) : null}

                {step.id === "payment" ? (
                  <CheckoutForm
                    quote={quote}
                    choice={paymentChoice}
                    onChoiceChange={setPaymentChoice}
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>

            {showErrors && issues.length ? (
              <div
                className="mt-7 flex items-start gap-3 rounded-card bg-red-50 p-4 ring-1 ring-inset ring-red-500/20"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" strokeWidth={2} aria-hidden="true" />
                <div>
                  <p className="text-[0.875rem] font-medium text-red-800">
                    A couple of things to finish first
                  </p>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {issues.map((issue) => (
                      <li key={issue} className="text-[0.8125rem] text-red-700">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            {submitError ? (
              <p className="mt-5 text-[0.875rem] text-red-700" role="alert">
                {submitError}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-sand-800/8 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="ghost"
                onClick={() => goToStep(stepIndex - 1)}
                disabled={stepIndex === 0}
                className={cn(stepIndex === 0 && "invisible")}
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                Back
              </Button>

              {step.id === "payment" ? (
                <Button size="lg" onClick={handleSubmit} disabled={submitting} withArrow={!submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending
                    </>
                  ) : (
                    paymentChoice === "card" ? "Pay with Stripe" : "Confirm booking request"
                  )}
                </Button>
              ) : (
                <Button size="lg" onClick={handleContinue} withArrow>
                  {step.id === "review" ? "Continue to payment" : "Continue"}
                </Button>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <OrderSummary
              draft={draft}
              quote={quote}
              onPromoChange={(promoCode) => patch({ promoCode })}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

function stepHeading(step: BookingStepId): string {
  switch (step) {
    case "service":
      return "What kind of care do they need?";
    case "pets":
      return "Tell us about your pets";
    case "schedule":
      return "When should we come?";
    case "details":
      return "Where are we going?";
    case "addons":
      return "Anything else while we're there?";
    case "contact":
      return "How do we reach you?";
    case "review":
      return "Does this look right?";
    case "payment":
      return "Last step";
    default:
      return "";
  }
}

function stepDescription(step: BookingStepId): string {
  switch (step) {
    case "service":
      return "Pick the closest fit — we can adjust the details together at the meet & greet.";
    case "pets":
      return "Names and types are enough for now. You'll add full routines to their profile later.";
    case "schedule":
      return "Choose your first date, an arrival window, and whether this repeats.";
    case "details":
      return "Address, how we get in, and anything we should know about the house.";
    case "addons":
      return "Optional extras. Everything here is opt-in, and you can add things later.";
    case "contact":
      return "So we can confirm the visit and text you when we're on the way.";
    case "review":
      return "One last look before anything is submitted.";
    case "payment":
      return "Request the visit, or pay now through Stripe.";
    default:
      return "";
  }
}
