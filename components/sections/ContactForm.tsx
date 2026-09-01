"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SelectField, TextArea, TextField } from "@/components/ui/Field";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { submitContact } from "@/lib/api";
import { isValidEmail } from "@/lib/booking";

/**
 * Contact form.
 *
 * Posts to /api/contact (mock today — see the route for the integration point).
 * Validation happens on submit rather than while typing, and the success state
 * replaces the form instead of showing a toast that can be missed.
 */
export function ContactSection({
  heading = "Send a message",
  description = "Tell us about your pet and what you need. No form-letter replies.",
  submitLabel = "Send message",
  successMessage = "Thanks — we'll get back to you shortly. If it's urgent, calling is always faster than email.",
  /** Careers swaps the pet/service questions for role and availability. */
  intent = "general",
}: {
  heading?: string;
  description?: string;
  submitLabel?: string;
  successMessage?: string;
  intent?: "general" | "careers";
} = {}) {
  const isCareers = intent === "careers";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [showErrors, setShowErrors] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    petType: "dog",
    service: "",
    message: "",
  });

  const update = (patch: Partial<typeof form>) => setForm((current) => ({ ...current, ...patch }));

  const nameError = showErrors && !form.name.trim() ? "Add your name." : undefined;
  const emailError =
    showErrors && !isValidEmail(form.email) ? "Add an email we can reply to." : undefined;
  const messageError =
    showErrors && !form.message.trim()
      ? isCareers
        ? "Tell us about your experience with animals."
        : "Tell us a little about your pet."
      : undefined;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (nameError || emailError || messageError || !form.name.trim() || !isValidEmail(form.email) || !form.message.trim()) {
      setShowErrors(true);
      return;
    }

    setStatus("sending");

    try {
      await submitContact(form);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-panel border border-mint-500/30 bg-mint-50/60 p-8 text-center">
        <span
          className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-mint-500 text-white"
          aria-hidden="true"
        >
          <Check className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <h2 className="mt-5 font-display text-xl font-semibold text-navy-900">
          {isCareers ? "Application sent." : "Message sent."}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-sand-700">
          {successMessage}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-panel border border-sand-800/8 bg-white p-6 shadow-soft sm:p-8"
    >
      <h2 className="font-display text-xl font-semibold text-navy-900">{heading}</h2>
      <p className="mt-1.5 text-[0.9375rem] text-sand-700">{description}</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <TextField
          label="Name"
          required
          autoComplete="name"
          value={form.name}
          error={nameError}
          onChange={(event) => update({ name: event.target.value })}
        />
        <TextField
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          error={emailError}
          onChange={(event) => update({ email: event.target.value })}
        />
        <TextField
          label="Phone"
          type="tel"
          optional
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => update({ phone: event.target.value })}
        />
        {isCareers ? (
          <>
            <SelectField
              label="Availability"
              value={form.petType}
              onChange={(event) => update({ petType: event.target.value })}
              options={[
                { value: "weekdays", label: "Weekday middays" },
                { value: "weekends", label: "Weekends" },
                { value: "overnights", label: "Overnights" },
                { value: "flexible", label: "Flexible" },
              ]}
            />
            <SelectField
              label="Which role?"
              className="sm:col-span-2"
              value={form.service}
              onChange={(event) => update({ service: event.target.value })}
              options={[
                { value: "caregiver", label: "Pet Caregiver — Part Time" },
                { value: "sitter", label: "Overnight & Weekend Sitter" },
                { value: "open", label: "Neither exactly — but hear me out" },
              ]}
            />
          </>
        ) : (
          <>
            <SelectField
              label="Pet type"
              value={form.petType}
              onChange={(event) => update({ petType: event.target.value })}
              options={[
                { value: "dog", label: "Dog" },
                { value: "cat", label: "Cat" },
                { value: "both", label: "Dogs and cats" },
                { value: "other", label: "Something else" },
              ]}
            />
            <SelectField
              label="What service are you interested in?"
              className="sm:col-span-2"
              value={form.service}
              onChange={(event) => update({ service: event.target.value })}
              options={[
                { value: "", label: "Not sure yet — help me choose" },
                ...services.map((service) => ({ value: service.slug, label: service.longName })),
                { value: "other", label: "Something not listed" },
              ]}
            />
          </>
        )}
        <TextArea
          label={isCareers ? "Tell us about your experience" : "Message"}
          required
          className="sm:col-span-2"
          rows={5}
          placeholder={
            isCareers
              ? "I've had dogs my whole life and walked for a shelter for two years. I'm free most middays and every other weekend."
              : "Two dogs, both good with strangers. I'm back at the office three days a week and need midday walks."
          }
          value={form.message}
          error={messageError}
          onChange={(event) => update({ message: event.target.value })}
        />
      </div>

      {status === "error" ? (
        <p className="mt-5 text-[0.875rem] text-red-700" role="alert">
          That didn&apos;t send. Please try again, or email{" "}
          <a href={`mailto:${site.contact.email}`} className="link-underline font-medium text-navy-900">
            {site.contact.email}
          </a>
          .
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={status === "sending"} withArrow={status !== "sending"}>
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            submitLabel
          )}
        </Button>
        <p className="text-xs leading-relaxed text-sand-600">
          We don&apos;t share your information or add you to a mailing list.
        </p>
      </div>
    </form>
  );
}
