"use client";

import { Pencil, Sparkles } from "lucide-react";
import { getAddOns } from "@/data/addOns";
import { getMembership, memberships } from "@/data/memberships";
import { getService } from "@/data/services";
import { describeSchedule, type BookingStepId } from "@/lib/booking";
import { cn, formatDate, formatDuration, formatPrice, listToSentence } from "@/lib/utils";
import type { BookingDraft, MembershipSlug, Quote } from "@/types";

/** Step 7 — everything in one place, with a way to fix anything. */
export function ReviewStep({
  draft,
  quote,
  onEditStep,
  onMembershipChange,
}: {
  draft: BookingDraft;
  quote: Quote;
  onEditStep: (step: BookingStepId) => void;
  onMembershipChange: (slug: MembershipSlug) => void;
}) {
  const service = draft.serviceSlug ? getService(draft.serviceSlug) : undefined;
  const addOns = getAddOns(draft.addOnSlugs);
  const petNames = draft.pets.map((pet) => pet.name.trim()).filter(Boolean);
  const plus = memberships.find((tier) => tier.slug === "pawside-plus")!;
  const currentMembership = getMembership(draft.membership);

  const rows: { label: string; value: React.ReactNode; step: BookingStepId }[] = [
    {
      label: "Service",
      step: "service",
      value: (
        <>
          {service?.longName ?? "—"}
          {service && service.pricingUnit !== "night" && draft.durationMinutes
            ? ` · ${formatDuration(draft.durationMinutes)}`
            : null}
        </>
      ),
    },
    {
      label: "Pets",
      step: "pets",
      value: draft.pets.length
        ? draft.pets
            .map((pet) => {
              const name = pet.name.trim() || "Unnamed pet";
              return pet.breed ? `${name} (${pet.breed})` : name;
            })
            .join(", ")
        : "—",
    },
    {
      label: "Date",
      step: "schedule",
      value: draft.date ? formatDate(draft.date) : "—",
    },
    {
      label: "Arrival window",
      step: "schedule",
      value: draft.time ?? "—",
    },
    {
      label: "Schedule",
      step: "schedule",
      value: describeSchedule(draft),
    },
    {
      label: "Address",
      step: "details",
      value: draft.address.line1
        ? `${draft.address.line1}${draft.address.line2 ? `, ${draft.address.line2}` : ""}, ${
            draft.address.city
          }, ${draft.address.state} ${draft.address.postalCode}`
        : "—",
    },
    {
      label: "Entry",
      step: "details",
      value: draft.entryInstructions || "We'll sort this out at the meet & greet",
    },
    {
      label: "Care notes",
      step: "details",
      value: draft.careInstructions || "None added yet",
    },
    {
      label: "Add-ons",
      step: "addons",
      value: addOns.length ? addOns.map((addOn) => addOn.name).join(", ") : "None",
    },
    {
      label: "Contact",
      step: "contact",
      value:
        draft.contact.firstName || draft.contact.email
          ? `${draft.contact.firstName} ${draft.contact.lastName} · ${draft.contact.email} · ${draft.contact.phone}`
          : "—",
    },
  ];

  return (
    <div>
      <dl className="divide-y divide-sand-800/8 border-y border-sand-800/8">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-4 py-4">
            <dt className="w-28 shrink-0 text-[0.8125rem] font-medium text-sand-600 sm:w-36">
              {row.label}
            </dt>
            <dd className="min-w-0 flex-1 text-[0.9375rem] leading-relaxed text-navy-900">
              {row.value}
            </dd>
            <button
              type="button"
              onClick={() => onEditStep(row.step)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-[0.8125rem] text-sand-600 transition-colors hover:bg-sand-100 hover:text-navy-900"
            >
              <Pencil className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
              Edit
              <span className="sr-only"> {row.label}</span>
            </button>
          </div>
        ))}
      </dl>

      {/* Membership upsell — honest math, and easy to decline. */}
      {draft.membership === "none" && quote.potentialMembershipSavings > 0 ? (
        <div className="mt-8 rounded-panel border border-mint-500/30 bg-mint-50/60 p-6">
          <p className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase text-mint-700">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            One thing worth checking
          </p>
          <p className="mt-3 font-display text-lg font-semibold text-navy-900">
            {plus.name} would save {formatPrice(quote.potentialMembershipSavings)} on this booking
          </p>
          <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-sand-700">
            {formatPrice(plus.monthlyPrice ?? 0)}/month for {Math.round(plus.visitDiscount * 100)}% off
            every visit, priority scheduling, no booking fees, and half-price holiday surcharges.
            Cancel any time.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onMembershipChange("pawside-plus")}
              className="rounded-button bg-navy-900 px-4 py-2.5 text-[0.875rem] font-medium text-white transition-colors hover:bg-navy-800"
            >
              Add {plus.name}
            </button>
            <button
              type="button"
              onClick={() => onMembershipChange("none")}
              className="rounded-button bg-white px-4 py-2.5 text-[0.875rem] font-medium text-navy-900 ring-1 ring-inset ring-sand-800/10 transition-all hover:ring-sand-800/25"
            >
              No thanks
            </button>
          </div>
        </div>
      ) : null}

      {draft.membership !== "none" ? (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-panel border border-sand-800/8 bg-canvas p-5">
          <p className="text-[0.9375rem] text-navy-900">
            <span className="font-semibold">{currentMembership.name}</span> included ·{" "}
            {formatPrice(currentMembership.monthlyPrice ?? 0)}/month
          </p>
          <button
            type="button"
            onClick={() => onMembershipChange("none")}
            className="text-[0.8125rem] font-medium text-sand-600 underline-offset-4 transition-colors hover:text-navy-900 hover:underline"
          >
            Remove membership
          </button>
        </div>
      ) : null}

      <div className={cn("mt-8 rounded-panel bg-navy-900 p-6 text-navy-50")}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.8125rem] text-navy-100/70">
              {draft.frequency === "one-time" ? "Estimated total" : "Estimated per visit"}
            </p>
            <p className="mt-1 font-display text-display-xs font-semibold text-white tabular">
              {formatPrice(quote.total)}
            </p>
          </div>
          <div className="text-right text-[0.8125rem] text-navy-100/70">
            <p>Subtotal {formatPrice(quote.subtotal)}</p>
            {quote.discountTotal > 0 ? (
              <p className="text-mint-300">Savings −{formatPrice(quote.discountTotal)}</p>
            ) : null}
            {quote.feeTotal > 0 ? <p>Fees {formatPrice(quote.feeTotal)}</p> : null}
          </div>
        </div>
        <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-navy-100/60">
          Submitting this request doesn&apos;t charge anything. We&apos;ll confirm availability, then
          send a payment link{petNames.length ? ` for ${listToSentence(petNames)}'s visits` : ""}.
        </p>
      </div>
    </div>
  );
}
