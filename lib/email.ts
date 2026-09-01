import { Resend } from "resend";
import { opsEmail, siteUrl } from "@/lib/env";
import { createServiceSupabase } from "@/lib/supabase/server";

function resend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const from = process.env.RESEND_FROM ?? "Pawside <hello@pawside.co>";

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

export async function sendBookingEmails(input: BookingEmailInput) {
  const client = resend();
  if (!client) {
    console.warn("[email] RESEND_API_KEY missing — booking emails were not sent.");
    return { sent: false };
  }

  const details = [
    `Booking: ${input.bookingNumber}`,
    `Name: ${input.contactName}`,
    `Email: ${input.contactEmail}`,
    `Phone: ${input.contactPhone}`,
    `Service: ${input.serviceName}`,
    `When: ${input.date ?? "TBD"} ${input.time ?? ""}`.trim(),
    `Pets: ${input.pets}`,
    `Address: ${input.address}`,
    `Total: ${input.totalLabel}`,
    `Payment: ${input.paymentStatus}`,
    input.careInstructions ? `Care notes: ${input.careInstructions}` : "",
    `Admin: ${siteUrl()}/admin/bookings/${input.bookingNumber}`,
  ]
    .filter(Boolean)
    .join("\n");

  await client.emails.send({
    from,
    to: opsEmail(),
    replyTo: input.contactEmail,
    subject: `New Pawside booking ${input.bookingNumber} — ${input.serviceName}`,
    text: `A new booking just came in.\n\n${details}`,
  });

  await client.emails.send({
    from,
    to: input.contactEmail,
    replyTo: opsEmail(),
    subject: `You're booked — ${input.bookingNumber}`,
    text: `Hi ${input.contactName.split(" ")[0] || "there"},\n\nWe have your request.\n\n${details}\n\nWe'll confirm shortly. Reply to this email or call (413) 323-3953 if you need to change anything.\n\n— Pawside`,
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

  const firstName = (input.name ?? "").trim().split(/\s+/)[0] || "there";
  const accountUrl = `${siteUrl()}/account`;
  const bookUrl = `${siteUrl()}/book`;

  await client.emails.send({
    from,
    to: input.email,
    replyTo: opsEmail(),
    subject: "Your Pawside account is ready",
    text: `Hi ${firstName},\n\nYour Pawside account is confirmed. You can sign in anytime to book visits, keep pet notes, and see upcoming care.\n\nAccount: ${accountUrl}\nBook a visit: ${bookUrl}\n\nQuestions? Reply to this email or call (413) 323-3953.\n\n— Aliya\nPawside Pet Services`,
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
    text: `Hi ${input.contactName.split(" ")[0] || "there"},\n\nYour ${input.serviceName} visit${when ? ` on ${when}` : ""} is cancelled. Booking ${input.bookingNumber}.\n\nNeed to rebook? pawside.co/book or call (413) 323-3953.\n\n— Pawside`,
  });

  return { sent: true };
}

export async function sendPaymentNotice(input: BookingEmailInput) {
  const client = resend();
  if (!client) return { sent: false };

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
    text: `Hi ${input.contactName.split(" ")[0] || "there"},\n\nWe received your payment of ${input.totalLabel} for ${input.serviceName}. Booking ${input.bookingNumber}.\n\n— Pawside`,
  });

  return { sent: true };
}
