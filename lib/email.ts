import { Resend } from "resend";
import { opsEmail, siteUrl } from "@/lib/env";

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
