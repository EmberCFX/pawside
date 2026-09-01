"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Clock, PawPrint, Tag } from "lucide-react";
import { Badge } from "@/components/ui/Card";
import { getMembership } from "@/data/memberships";
import { getService } from "@/data/services";
import { findPromoCode } from "@/data/promoCodes";
import { describeSchedule } from "@/lib/booking";
import { cn, formatDate, formatDuration, formatPrice, listToSentence, pluralize } from "@/lib/utils";
import type { BookingDraft, Quote } from "@/types";

/**
 * Live order summary.
 *
 * Sticky on desktop, collapsible on mobile. Every line comes from the quote
 * engine, so this panel and the final charge are always the same math.
 */
export function OrderSummary({
  draft,
  quote,
  onPromoChange,
  className,
  collapsibleOnMobile = true,
}: {
  draft: BookingDraft;
  quote: Quote;
  onPromoChange?: (code: string) => void;
  className?: string;
  collapsibleOnMobile?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [promoInput, setPromoInput] = useState(draft.promoCode);
  const [promoStatus, setPromoStatus] = useState<"idle" | "applied" | "invalid">("idle");
  const reduceMotion = useReducedMotion();

  const service = draft.serviceSlug ? getService(draft.serviceSlug) : undefined;
  const membership = getMembership(draft.membership);
  const petNames = draft.pets.map((pet) => pet.name.trim()).filter(Boolean);
  const isRecurring = draft.frequency !== "one-time";

  const applyPromo = () => {
    if (!onPromoChange) return;
    const promo = findPromoCode(promoInput);
    if (promo) {
      setPromoStatus("applied");
      onPromoChange(promo.code);
    } else {
      setPromoStatus("invalid");
      onPromoChange("");
    }
  };

  return (
    <aside
      className={cn(
        "rounded-panel border border-navy-900/10 bg-white p-6 shadow-soft",
        className,
      )}
      aria-label="Booking summary"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[1.0625rem] font-semibold text-navy-900">Your booking</h2>
        {isRecurring ? <Badge tone="mint">Recurring</Badge> : null}
      </div>

      {/* Snapshot ------------------------------------------------------- */}
      <dl className="mt-5 flex flex-col gap-3 text-[0.875rem]">
        <div className="flex items-start gap-2.5">
          <dt className="sr-only">Service</dt>
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sand-500" strokeWidth={1.75} aria-hidden="true" />
          <dd className="text-navy-800">
            {service ? service.name : "No service selected"}
            {service && service.pricingUnit !== "night" && draft.durationMinutes ? (
              <span className="text-sand-600"> · {formatDuration(draft.durationMinutes)}</span>
            ) : null}
          </dd>
        </div>

        <div className="flex items-start gap-2.5">
          <dt className="sr-only">Pets</dt>
          <PawPrint className="mt-0.5 h-4 w-4 shrink-0 text-sand-500" strokeWidth={1.75} aria-hidden="true" />
          <dd className="text-navy-800">
            {petNames.length
              ? listToSentence(petNames)
              : `${draft.pets.length} ${pluralize(draft.pets.length, "pet")}`}
          </dd>
        </div>

        <div className="flex items-start gap-2.5">
          <dt className="sr-only">Schedule</dt>
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-sand-500" strokeWidth={1.75} aria-hidden="true" />
          <dd className="text-navy-800">
            {draft.date ? formatDate(draft.date, { month: "long", day: "numeric" }) : "Date TBD"}
            {draft.time ? <span className="text-sand-600"> · {draft.time}</span> : null}
            {isRecurring ? (
              <span className="block text-[0.8125rem] text-sand-600">{describeSchedule(draft)}</span>
            ) : null}
          </dd>
        </div>
      </dl>

      {/* Line items ----------------------------------------------------- */}
      <div className="mt-5 border-t border-navy-900/8 pt-5">
        {collapsibleOnMobile ? (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            aria-expanded={expanded}
            className="mb-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-navy-800 lg:hidden"
          >
            {expanded ? "Hide" : "Show"} price breakdown
            <span aria-hidden="true">{expanded ? "−" : "+"}</span>
          </button>
        ) : null}

        <ul
          className={cn(
            "flex flex-col gap-2.5",
            collapsibleOnMobile && !expanded && "hidden lg:flex",
          )}
        >
          {quote.lines.map((line) => (
            <li key={line.id} className="flex items-baseline justify-between gap-4 text-[0.875rem]">
              <span className="text-sand-700">
                {line.label}
                {line.detail ? (
                  <span className="block text-xs text-sand-500">{line.detail}</span>
                ) : null}
              </span>
              <span
                className={cn(
                  "shrink-0 font-medium tabular",
                  line.amount < 0 ? "text-mint-700" : "text-navy-900",
                )}
              >
                {line.amount < 0 ? "−" : ""}
                {formatPrice(Math.abs(line.amount))}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Promo code ----------------------------------------------------- */}
      {onPromoChange ? (
        <div className="mt-5 border-t border-navy-900/8 pt-5">
          <label
            htmlFor="promo-code"
            className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-navy-800"
          >
            <Tag className="h-3.5 w-3.5 text-sand-500" strokeWidth={1.75} aria-hidden="true" />
            Promo code
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="promo-code"
              value={promoInput}
              onChange={(event) => {
                setPromoInput(event.target.value.toUpperCase());
                setPromoStatus("idle");
              }}
              placeholder="WELCOME10"
              className="min-w-0 flex-1 rounded-button bg-white px-3 py-2 text-[0.875rem] uppercase tracking-wide ring-1 ring-inset ring-navy-900/12 placeholder:normal-case placeholder:tracking-normal placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-mint-600"
            />
            <button
              type="button"
              onClick={applyPromo}
              className="shrink-0 rounded-button bg-navy-50 px-3.5 py-2 text-[0.875rem] font-medium text-navy-900 transition-colors hover:bg-navy-100"
            >
              Apply
            </button>
          </div>
          {promoStatus === "applied" ? (
            <p className="mt-2 text-xs font-medium text-mint-700" role="status">
              Code applied.
            </p>
          ) : null}
          {promoStatus === "invalid" ? (
            <p className="mt-2 text-xs font-medium text-red-600" role="status">
              That code isn&apos;t active. Double-check the spelling?
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Total ---------------------------------------------------------- */}
      <div className="mt-5 border-t border-navy-900/8 pt-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.8125rem] text-sand-600">
              {isRecurring ? "Per visit" : "Estimated total"}
            </p>
            {quote.membershipSavings > 0 ? (
              <p className="mt-0.5 text-[0.75rem] font-medium text-mint-700">
                {membership.name} saved {formatPrice(quote.membershipSavings)}
              </p>
            ) : null}
          </div>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={quote.total}
              className="font-display text-3xl font-semibold leading-none text-navy-900 tabular"
              initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8, position: "absolute" }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {formatPrice(quote.total)}
            </motion.p>
          </AnimatePresence>
        </div>

        {isRecurring ? (
          <p className="mt-3 rounded-button bg-canvas px-3 py-2 text-[0.8125rem] text-sand-700">
            About {formatPrice(quote.total * quote.visitsPerMonth)} a month at{" "}
            {quote.visitsPerMonth} {pluralize(quote.visitsPerMonth, "visit")}. Skip any week free.
          </p>
        ) : null}

        <p className="mt-3 text-xs leading-relaxed text-sand-500">
          Nothing is charged today. We confirm availability first, then send a payment link.
        </p>
      </div>
    </aside>
  );
}
