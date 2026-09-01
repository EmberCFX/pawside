"use client";

import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Card";
import { site } from "@/data/site";
import { cn, formatPrice } from "@/lib/utils";
import type { Quote } from "@/types";

/**
 * Payment step — Stripe integration point.
 *
 * The card fields are deliberately inert. Wiring this up means:
 *   1. npm i @stripe/stripe-js @stripe/react-stripe-js stripe
 *   2. Set STRIPE_SECRET_KEY (server) and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
 *   3. app/api/checkout/route.ts creates a PaymentIntent, re-pricing the booking
 *      server-side with buildQuote() — never trusting the client's total — and
 *      returns only the client secret.
 *   4. Replace the block below with <Elements><PaymentElement /></Elements> and
 *      confirm the intent with that client secret.
 *
 * Until then, "hold my spot" is the honest path: no card, no charge, and a
 * payment link once the visit is confirmed. See lib/api.ts.
 */
export type PaymentChoice = "hold" | "card";

export function CheckoutForm({
  quote,
  choice,
  onChoiceChange,
}: {
  quote: Quote;
  choice: PaymentChoice;
  onChoiceChange: (choice: PaymentChoice) => void;
}) {
  return (
    <div>
      <fieldset>
        <legend className="text-[0.9375rem] font-medium text-navy-900">How would you like to pay?</legend>

        <div className="mt-4 flex flex-col gap-3">
          <label
            className={cn(
              "group relative flex cursor-pointer items-start gap-3.5 rounded-card p-5 transition-all duration-200 ring-1 ring-inset",
              choice === "hold"
                ? "bg-mint-50 ring-mint-500/60"
                : "bg-white ring-navy-900/10 hover:ring-navy-900/25",
            )}
          >
            <input
              type="radio"
              name="payment-choice"
              checked={choice === "hold"}
              onChange={() => onChoiceChange("hold")}
              className="peer sr-only"
            />
            <span
              className={cn(
                "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1 ring-inset",
                choice === "hold" ? "bg-mint-600 ring-mint-600" : "bg-white ring-navy-900/20",
              )}
              aria-hidden="true"
            >
              {choice === "hold" ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-[0.9375rem] font-medium text-navy-900">
                  Request the visit, pay after we confirm
                </span>
                <Badge tone="mint">Recommended</Badge>
              </span>
              <span className="mt-1.5 block text-[0.875rem] leading-relaxed text-sand-700">
                We check availability, confirm by text or email, then send a secure payment link.
                Nothing is charged now.
              </span>
            </span>
            <span className="pointer-events-none absolute inset-0 rounded-card ring-2 ring-mint-600 opacity-0 peer-focus-visible:opacity-100" />
          </label>

          <label
            className={cn(
              "group relative flex cursor-pointer items-start gap-3.5 rounded-card p-5 transition-all duration-200 ring-1 ring-inset",
              choice === "card"
                ? "bg-white ring-navy-900/30"
                : "bg-white ring-navy-900/10 hover:ring-navy-900/25",
            )}
          >
            <input
              type="radio"
              name="payment-choice"
              checked={choice === "card"}
              onChange={() => onChoiceChange("card")}
              className="peer sr-only"
            />
            <span
              className={cn(
                "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1 ring-inset",
                choice === "card" ? "bg-navy-900 ring-navy-900" : "bg-white ring-navy-900/20",
              )}
              aria-hidden="true"
            >
              {choice === "card" ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-[0.9375rem] font-medium text-navy-900">
                  Save a card for later
                </span>
                <Badge tone="neutral">Coming soon</Badge>
              </span>
              <span className="mt-1.5 block text-[0.875rem] leading-relaxed text-sand-700">
                Card payments arrive with the Pawside client portal. Until then we invoice after
                each visit or bill monthly.
              </span>
            </span>
            <span className="pointer-events-none absolute inset-0 rounded-card ring-2 ring-mint-600 opacity-0 peer-focus-visible:opacity-100" />
          </label>
        </div>
      </fieldset>

      {choice === "card" ? (
        <div
          className="mt-5 rounded-card border border-dashed border-navy-900/18 bg-canvas p-5"
          aria-live="polite"
        >
          <p className="flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-sand-500">
            <CreditCard className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            Stripe Payment Element mounts here
          </p>
          <div className="mt-4 flex flex-col gap-2.5" aria-hidden="true">
            <div className="h-11 rounded-button bg-white ring-1 ring-inset ring-navy-900/8" />
            <div className="flex gap-2.5">
              <div className="h-11 flex-1 rounded-button bg-white ring-1 ring-inset ring-navy-900/8" />
              <div className="h-11 w-28 rounded-button bg-white ring-1 ring-inset ring-navy-900/8" />
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-sand-600">
            Integration point documented in <code className="text-navy-800">lib/api.ts</code> and{" "}
            <code className="text-navy-800">app/api/checkout/route.ts</code>. Keys are read from
            environment variables — the secret key never reaches the browser.
          </p>
        </div>
      ) : null}

      <div className="mt-7 flex flex-col gap-4 rounded-card bg-canvas p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.8125rem] text-sand-600">
            {quote.visitsPerMonth > 1 ? "Per visit" : "Estimated total"}
          </p>
          <p className="mt-0.5 font-display text-2xl font-semibold text-navy-900 tabular">
            {formatPrice(quote.total)}
          </p>
        </div>
        <ul className="flex flex-col gap-1.5 text-[0.8125rem] text-sand-700">
          <li className="inline-flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-mint-600" strokeWidth={2} aria-hidden="true" />
            No card required to request a visit
          </li>
          <li className="inline-flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-mint-600" strokeWidth={2} aria-hidden="true" />
            Free cancellation up to {site.policies.cancellationWindowHours} hours ahead
          </li>
        </ul>
      </div>
    </div>
  );
}
