import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { getBookingByNumber } from "@/lib/bookings";
import { formatPrice } from "@/lib/utils";
import { BookingStatusForm } from "@/components/admin/BookingStatusForm";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const booking = await getBookingByNumber(number);
  if (!booking) notFound();

  const pets = Array.isArray(booking.pets_json)
    ? (booking.pets_json as Array<{ name?: string; type?: string; breed?: string }>)
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <Card className="p-6 sm:p-8">
        <p className="eyebrow">{booking.booking_number}</p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-navy-900">
          {booking.service_name}
        </h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["Customer", booking.contact_name],
            ["Email", booking.contact_email],
            ["Phone", booking.contact_phone],
            ["When", `${booking.visit_date ?? "TBD"} ${booking.visit_time ?? ""}`.trim()],
            ["Frequency", booking.frequency],
            ["Pets", pets.map((pet) => pet.name).join(", ") || String(booking.pet_count)],
            [
              "Address",
              [booking.address_line1, booking.city, booking.state, booking.postal_code]
                .filter(Boolean)
                .join(", "),
            ],
            ["Total", formatPrice(booking.total)],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[0.75rem] font-semibold uppercase text-sand-500">
                {label}
              </dt>
              <dd className="mt-1 text-[0.9375rem] text-navy-900">{value || "—"}</dd>
            </div>
          ))}
        </dl>
        {booking.care_instructions ? (
          <div className="mt-6">
            <p className="text-[0.75rem] font-semibold uppercase text-sand-500">
              Care notes
            </p>
            <p className="mt-1 text-[0.9375rem] leading-relaxed text-navy-800">
              {booking.care_instructions}
            </p>
          </div>
        ) : null}
        {booking.entry_instructions ? (
          <div className="mt-4">
            <p className="text-[0.75rem] font-semibold uppercase text-sand-500">
              Entry
            </p>
            <p className="mt-1 text-[0.9375rem] leading-relaxed text-navy-800">
              {booking.entry_instructions}
            </p>
          </div>
        ) : null}
      </Card>

      <Card className="p-6">
        <h3 className="font-display text-lg font-semibold text-navy-900">Update status</h3>
        <BookingStatusForm
          bookingNumber={booking.booking_number}
          status={booking.status}
          paymentStatus={booking.payment_status}
        />
      </Card>
    </div>
  );
}
