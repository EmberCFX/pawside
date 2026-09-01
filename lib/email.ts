import { Resend } from "resend";
import { customerEmailHtml, firstNameOf, fromAddress } from "@/lib/email-template";
import { opsEmail, siteUrl } from "@/lib/env";
import { createServiceSupabase } from "@/lib/supabase/server";

function resend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const from = fromAddress();

export interface BookingEmailInput {
  bookingNumber: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  serviceName: string;
  date: string | null;
  time: string | null;
  pets: string;
  address: string;
  totalLabel: string;
  paymentStatus: string;
  careInstructions?: string;
}

function bookingLines(input: BookingEmailInput) {
  return [
    ["Booking", input.bookingNumber],
    ["Service", input.serviceName],
    ["When", [input.date ?? "TBD", input.time ?? ""].filter(Boolean).join(" ").trim()],
    ["Pets", input.pets],
    ["Address", input.address],
    ["Total", input.totalLabel],
    ["Payment", input.paymentStatus],
    input.careInstructions ? ["Care notes", input.careInstructions] : null,
  ].filter((row): row is [string, string] => Boolean(row));
}

function bookingText(input: BookingEmailInput) {
  return bookingLines(input)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

export async function sendBookingEmails(input: BookingEmailInput) {
  const client = resend();
  if (!client) {
    console.warn("[email] RESEND_API_KEY missing — booking emails were not sent.");
    return { sent: false };
  }

  const details = bookingText(input);
  const firstName = firstNameOf(input.contactName);
  const when = [input.date, input.time].filter(Boolean).join(" ");

  await client.emails.send({
    from,
    to: opsEmail(),
    replyTo: input.contactEmail,
    subject: `New Pawside booking ${input.bookingNumber} — ${input.serviceName}`,
    text: `A new booking just came in.\n\n${details}\n\nAdmin: ${siteUrl()}/admin/bookings/${input.bookingNumber}`,
  });

  await client.emails.send({
    from,
    to: input.contactEmail,
    replyTo: opsEmail(),
    subject: `You're booked — ${input.bookingNumber}`,
    text: `Hi ${firstName},\n\nWe have your ${input.serviceName} request${when ? ` for ${when}` : ""}. We'll confirm shortly — nothing is charged until then.\n\n${details}\n\nReply to this email or call (413) 323-3953 if you need to change anything.\n\n— Aliya, Pawside`,
    html: customerEmailHtml({
      preheader: `We have your ${input.serviceName} request. We'll confirm shortly.`,
      eyebrow: input.bookingNumber,
      title: `You're booked, ${firstName}.`,
      intro: `Thanks for trusting us with ${input.pets === "—" ? "your pet" : input.pets}. We have the request and will confirm the time as soon as we check the calendar — usually within a few hours.`,
      details: bookingLines(input).filter(([label]) => label !== "Booking"),
      note: "Nothing is charged until we confirm we can cover the visit. Reply to this email or call (413) 323-3953 if the timing needs to move.",
      cta: { href: `${siteUrl()}/account`, label: "View your account" },
    }),
  });

  return { sent: true };
}

export async function sendSignupConfirmedEmail(input: {
  email: string;
  name?: string | null;
}) {
  const client = resend();
  if (!client) {
    console.warn("[email] RESEND_API_KEY missing — signup email was not sent.");
    return { sent: false };
  }

  const firstName = firstNameOf(input.name);
  const accountUrl = `${siteUrl()}/account`;
  const bookUrl = `${siteUrl()}/book`;

  await client.emails.send({
    from,
    to: input.email,
    replyTo: opsEmail(),
    subject: "Your Pawside account is ready",
    text: `Hi ${firstName},\n\nYour Pawside account is confirmed. You can sign in anytime to book visits, keep pet notes, and see upcoming care.\n\nAccount: ${accountUrl}\nBook a visit: ${bookUrl}\n\nQuestions? Reply to this email or call (413) 323-3953.\n\n— Aliya\nPawside Pet Services`,
    html: customerEmailHtml({
      preheader: "Your Pawside account is ready — book a visit whenever you need us.",
      eyebrow: "Welcome",
      title: `Nice to meet you, ${firstName}.`,
      intro:
        "Your account is confirmed. You can sign in anytime to book visits, save pet notes, and keep upcoming care in one place. When you're ready, we'll learn the routine and keep it going while you're out.",
      cta: { href: bookUrl, label: "Book a visit" },
      note: `You can also open your account anytime at ${accountUrl.replace("https://", "")}.`,
    }),
  });

  return { sent: true };
}

export async function sendSignupConfirmedEmailOnce(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}) {
  if (!user.email || user.user_metadata?.welcome_sent) {
    return { sent: false };
  }

  const name = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
  const result = await sendSignupConfirmedEmail({ email: user.email, name });

  const db = createServiceSupabase();
  if (db && result.sent) {
    await db.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, welcome_sent: true, full_name: name },
    });
  }

  return result;
}

export async function sendContactEmail(input: {
  name: string;
  email: string;
  phone?: string;
  petType?: string;
  service?: string;
  message: string;
}) {
  const client = resend();
  if (!client) {
    console.warn("[email] RESEND_API_KEY missing — contact email was not sent.");
    return { sent: false };
  }

  await client.emails.send({
    from,
    to: opsEmail(),
    replyTo: input.email,
    subject: `Website message from ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone || "—"}`,
      `Pet: ${input.petType || "—"}`,
      `Service: ${input.service || "—"}`,
      "",
      input.message,
    ].join("\n"),
  });

  return { sent: true };
}

export async function sendCancellationNotice(input: BookingEmailInput) {
  const client = resend();
  if (!client) return { sent: false };

  const when = [input.date, input.time].filter(Boolean).join(" ");
  const firstName = firstNameOf(input.contactName);

  await client.emails.send({
    from,
    to: opsEmail(),
    replyTo: input.contactEmail,
    subject: `Visit cancelled — ${input.bookingNumber}`,
    text: `${input.contactName} cancelled ${input.serviceName} (${input.bookingNumber})${when ? ` on ${when}` : ""}.\n\nEmail: ${input.contactEmail}\nPhone: ${input.contactPhone}\nAdmin: ${siteUrl()}/admin/bookings/${input.bookingNumber}`,
  });

  await client.emails.send({
    from,
    to: input.contactEmail,
    replyTo: opsEmail(),
    subject: `Visit cancelled — ${input.bookingNumber}`,
    text: `Hi ${firstName},\n\nYour ${input.serviceName} visit${when ? ` on ${when}` : ""} is cancelled. Booking ${input.bookingNumber}.\n\nNeed to rebook? ${siteUrl()}/book or call (413) 323-3953.\n\n— Aliya, Pawside`,
    html: customerEmailHtml({
      preheader: `Your ${input.serviceName} visit is cancelled.`,
      eyebrow: input.bookingNumber,
      title: "Visit cancelled.",
      intro: `Hi ${firstName} — your ${input.serviceName} visit${when ? ` on ${when}` : ""} is off the calendar. No hard feelings, and we’re here when you need us again.`,
      details: [
        ["Service", input.serviceName],
        ["When", when || "—"],
        ["Booking", input.bookingNumber],
      ],
      cta: { href: `${siteUrl()}/book`, label: "Book another visit" },
    }),
  });

  return { sent: true };
}

export async function sendRescheduleNotice(
  input: BookingEmailInput,
  previous: { previousDate: string | null; previousTime: string | null },
) {
  const client = resend();
  if (!client) return { sent: false };

  const when = [input.date, input.time].filter(Boolean).join(" ");
  const previousWhen = [previous.previousDate, previous.previousTime].filter(Boolean).join(" ");
  const firstName = firstNameOf(input.contactName);

  await client.emails.send({
    from,
    to: opsEmail(),
    replyTo: input.contactEmail,
    subject: `Visit rescheduled — ${input.bookingNumber}`,
    text: `${input.contactName} moved ${input.serviceName} (${input.bookingNumber})${previousWhen ? ` from ${previousWhen}` : ""}${when ? ` to ${when}` : ""}.\n\nEmail: ${input.contactEmail}\nPhone: ${input.contactPhone}\nAdmin: ${siteUrl()}/admin/bookings/${input.bookingNumber}`,
  });

  await client.emails.send({
    from,
    to: input.contactEmail,
    replyTo: opsEmail(),
    subject: `Visit moved — ${input.bookingNumber}`,
    text: `Hi ${firstName},\n\nYour ${input.serviceName} visit is now ${when || "pending confirmation"}${previousWhen ? ` (was ${previousWhen})` : ""}. Booking ${input.bookingNumber}. We'll confirm the new time shortly.\n\n— Aliya, Pawside`,
    html: customerEmailHtml({
      preheader: `Your ${input.serviceName} visit is now ${when || "on a new time"}.`,
      eyebrow: input.bookingNumber,
      title: "Visit moved.",
      intro: `Hi ${firstName} — we moved your ${input.serviceName} visit to the new time below. We’ll confirm as soon as we check the calendar.`,
      details: [
        ["Service", input.serviceName],
        ["New time", when || "—"],
        ...(previousWhen ? ([["Was", previousWhen]] as Array<[string, string]>) : []),
        ["Booking", input.bookingNumber],
      ],
      cta: { href: `${siteUrl()}/account`, label: "View your account" },
    }),
  });

  return { sent: true };
}

export async function sendPaymentNotice(input: BookingEmailInput) {
  const client = resend();
  if (!client) return { sent: false };

  const firstName = firstNameOf(input.contactName);

  await client.emails.send({
    from,
    to: opsEmail(),
    subject: `Payment received — ${input.bookingNumber}`,
    text: `${input.contactName} paid ${input.totalLabel} for ${input.serviceName} (${input.bookingNumber}).`,
  });

  await client.emails.send({
    from,
    to: input.contactEmail,
    replyTo: opsEmail(),
    subject: `Payment received — ${input.bookingNumber}`,
    text: `Hi ${firstName},\n\nWe received your payment of ${input.totalLabel} for ${input.serviceName}. Booking ${input.bookingNumber}.\n\n— Aliya, Pawside`,
    html: customerEmailHtml({
      preheader: `We received your payment of ${input.totalLabel}.`,
      eyebrow: input.bookingNumber,
      title: "Payment received.",
      intro: `Hi ${firstName} — thank you. We received ${input.totalLabel} for ${input.serviceName}. You’re all set on our side.`,
      details: [
        ["Service", input.serviceName],
        ["Amount", input.totalLabel],
        ["Booking", input.bookingNumber],
      ],
      cta: { href: `${siteUrl()}/account`, label: "View your account" },
    }),
  });

  return { sent: true };
}
