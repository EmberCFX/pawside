"use client";

import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Card";
import { site } from "@/data/site";
import { cn, formatPrice } from "@/lib/utils";
import type { Quote } from "@/types";

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
                We’ll email hello@pawside.co and confirm by text or email. Nothing is charged now.
              </span>
            </span>
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
                <CreditCard className="h-4 w-4 text-navy-700" strokeWidth={1.75} aria-hidden="true" />
                <span className="text-[0.9375rem] font-medium text-navy-900">Pay now with Stripe</span>
              </span>
              <span className="mt-1.5 block text-[0.875rem] leading-relaxed text-sand-700">
                Secure checkout on Stripe. You’ll come back here with a paid confirmation.
              </span>
            </span>
          </label>
        </div>
      </fieldset>

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
            Card details never touch our servers
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
