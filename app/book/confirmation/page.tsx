import type { Metadata } from "next";
import Link from "next/link";
import { CalendarPlus, Check, Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { Container, Eyebrow, Hairline } from "@/components/ui/Layout";
import { site } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Booking confirmed",
  description: "Your Pawside booking request is in.",
  path: "/book/confirmation",
  noIndex: true,
});

/**
 * Confirmation.
 *
 * Reads the booking reference from the query string. Once a database is wired,
 * fetch the real booking here by reference (server-side) and render the actual
 * pet, service, date, and care instructions in place of the summary below.
 */
export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const reference = (Array.isArray(params.booking) ? params.booking[0] : params.booking) ?? "PS-PENDING";
  const pending = Boolean(params.pending);
  const paid = Boolean(params.paid);

  const nextSteps = [
    {
      title: "We confirm availability",
      description: `${site.contact.responseTime}. If anything about the timing doesn't work, we'll offer the closest slot we can cover.`,
      icon: Clock,
    },
    {
      title: "We schedule a meet & greet",
      description:
        "Free, about 20 minutes, at your home. We meet your pet, learn the routine, and sort out keys or codes.",
      icon: MessageCircle,
    },
    {
      title: "You get a payment link",
      description:
        "Sent after confirmation — nothing is charged before then. Recurring bookings are billed per visit.",
      icon: Mail,
    },
  ];

  return (
    <div className="bg-canvas pb-24 pt-14 sm:pt-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-mint-500 text-white shadow-mint"
            aria-hidden="true"
          >
            <Check className="h-7 w-7" strokeWidth={2.5} />
          </span>

          <Eyebrow withRules className="mt-7 justify-center">
            {pending ? "Request saved" : "Request received"}
          </Eyebrow>

          <h1 className="mt-5 text-display-sm font-semibold text-navy-900 sm:text-display-md">
            You&apos;re all set.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-sand-700">
            {pending
              ? "We saved your request locally — if you don't hear from us within a few hours, give us a call and we'll pick it up from there."
              : "Your request is in. We'll confirm the details shortly, and you'll get a summary with photos after every visit from then on."}
          </p>

          <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-sand-800/10 bg-white px-4 py-2.5">
            <span className="text-[0.6875rem] font-semibold uppercase text-sand-500">
              Booking number
            </span>
            <span className="font-display text-[0.9375rem] font-semibold text-navy-900 tabular">
              {reference}
            </span>
          </div>
        </div>

        <Hairline className="mx-auto mt-14 max-w-3xl" />

        <div className="mx-auto mt-14 max-w-3xl">
          <Card className="p-7 sm:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-navy-900">What happens next</h2>
              <Badge tone="mint">{paid ? "Paid" : "Request received"}</Badge>
            </div>

            <ol className="mt-7 flex flex-col gap-6">
              {nextSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-navy-50 text-navy-900 ring-1 ring-inset ring-sand-800/8"
                    aria-hidden="true"
                  >
                    <step.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="font-display text-[1.0625rem] font-semibold text-navy-900">
                      <span className="mr-2 text-sand-400 tabular">{index + 1}</span>
                      {step.title}
                    </p>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-sand-700">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-9 flex flex-col gap-3 border-t border-sand-800/8 pt-7 sm:flex-row">
              <ButtonLink href="/account/visits" size="lg" withArrow>
                View Booking
              </ButtonLink>
              <ButtonLink href="/book" variant="secondary" size="lg">
                <CalendarPlus className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                Add Another Visit
              </ButtonLink>
            </div>
          </Card>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card tone="muted" className="p-6">
              <h3 className="font-display text-[1.0625rem] font-semibold text-navy-900">
                Need to change something?
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-sand-700">
                Call or text and we&apos;ll adjust it — no forms, no fees before the{" "}
                {site.policies.cancellationWindowHours}-hour window.
              </p>
              <div className="mt-4 flex flex-col gap-2 text-[0.9375rem]">
                <a
                  href={site.contact.phoneHref}
                  className="link-underline inline-flex w-fit items-center gap-2 font-medium text-navy-900"
                >
                  <Phone className="h-4 w-4 text-mint-600" strokeWidth={1.75} aria-hidden="true" />
                  {site.contact.phone}
                </a>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="link-underline inline-flex w-fit items-center gap-2 font-medium text-navy-900"
                >
                  <Mail className="h-4 w-4 text-mint-600" strokeWidth={1.75} aria-hidden="true" />
                  {site.contact.email}
                </a>
              </div>
            </Card>

            <Card tone="muted" className="p-6">
              <h3 className="font-display text-[1.0625rem] font-semibold text-navy-900">
                While you&apos;re here
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-sand-700">
                Adding your pet&apos;s routine now means the first visit runs like the tenth.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/account/pets"
                  className="link-underline w-fit text-[0.9375rem] font-medium text-navy-900"
                >
                  Complete your pet profile
                </Link>
                <Link
                  href="/pricing#membership"
                  className="link-underline w-fit text-[0.9375rem] font-medium text-navy-900"
                >
                  See if Pawside+ saves you money
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
