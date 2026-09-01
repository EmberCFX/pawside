"use client";

import { TextField } from "@/components/ui/Field";
import { isValidEmail, isValidPhone } from "@/lib/booking";
import { site } from "@/data/site";
import type { BookingDraft } from "@/types";

/** Step 6 — how we reach you. */
export function ContactForm({
  draft,
  onChange,
  showErrors,
}: {
  draft: BookingDraft;
  onChange: (patch: Partial<BookingDraft>) => void;
  /** Errors appear only after an attempt to continue, not while typing. */
  showErrors: boolean;
}) {
  const update = (patch: Partial<BookingDraft["contact"]>) =>
    onChange({ contact: { ...draft.contact, ...patch } });

  const emailError =
    showErrors && !isValidEmail(draft.contact.email)
      ? "Enter an email we can send the confirmation to."
      : undefined;
  const phoneError =
    showErrors && !isValidPhone(draft.contact.phone)
      ? "Enter a phone number we can text from the driveway."
      : undefined;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="First name"
          required
          autoComplete="given-name"
          value={draft.contact.firstName}
          error={showErrors && !draft.contact.firstName.trim() ? "Add your first name." : undefined}
          onChange={(event) => update({ firstName: event.target.value })}
        />
        <TextField
          label="Last name"
          optional
          autoComplete="family-name"
          value={draft.contact.lastName}
          onChange={(event) => update({ lastName: event.target.value })}
        />
        <TextField
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          value={draft.contact.email}
          error={emailError}
          onChange={(event) => update({ email: event.target.value })}
        />
        <TextField
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="(413) 323-3953"
          value={draft.contact.phone}
          error={phoneError}
          hint="Used for arrival texts and anything urgent during a visit."
          onChange={(event) => update({ phone: event.target.value })}
        />
      </div>

      <div className="mt-8 rounded-card bg-canvas p-5">
        <p className="text-[0.9375rem] font-medium text-navy-900">What happens next</p>
        <ol className="mt-3 flex flex-col gap-2.5">
          {[
            "We confirm your request — usually within a few hours.",
            `We schedule a free meet & greet before the first visit.`,
            "You get a summary with photos after every visit from then on.",
          ].map((item, index) => (
            <li key={item} className="flex items-start gap-3 text-[0.875rem] text-sand-700">
              <span
                className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-900 text-[0.6875rem] font-semibold text-white"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs leading-relaxed text-sand-600">
          Prefer to talk it through? Call {site.contact.phone} — {site.contact.responseTime.toLowerCase()}.
        </p>
      </div>
    </div>
  );
}
