import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { getAddOn } from "@/data/addOns";
import { memberships } from "@/data/memberships";
import { getAdminBooking } from "@/lib/admin";
import { describeFrequency } from "@/lib/booking";
import { formatBookingAddress } from "@/lib/bookings";
import { formatDate, formatDuration, formatPrice } from "@/lib/utils";
import { BookingStatusForm } from "@/components/admin/BookingStatusForm";
import type { AddOnSlug } from "@/types";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const { row: booking, error } = await getAdminBooking(number);
  if (error) {
    return (
      <Card className="p-6">
        <p className="font-medium text-navy-900">Couldn’t load this booking.</p>
        <p className="mt-2 text-[0.9375rem] text-sand-700">{error}</p>
      </Card>
    );
  }
  if (!booking) notFound();

  const pets = Array.isArray(booking.pets_json)
    ? (booking.pets_json as Array<{ name?: string; type?: string; breed?: string; age?: string; notes?: string }>)
    : [];
  const addOnNames = (booking.add_on_slugs ?? [])
    .map((slug) => getAddOn(slug as AddOnSlug)?.name ?? slug)
    .filter(Boolean);
  const membership =
    memberships.find((tier) => tier.slug === booking.membership)?.name ?? "Pay as you go";
  const address = formatBookingAddress(booking);

  const fields: Array<[string, string]> = [
    ["Customer", booking.contact_name || "—"],
    ["Email", booking.contact_email],
    ["Phone", booking.contact_phone || "—"],
    [
      "When",
      [
        booking.visit_date
          ? formatDate(booking.visit_date, { weekday: "long", month: "long", day: "numeric" })
          : "TBD",
        booking.visit_time,
      ]
        .filter(Boolean)
        .join(" · "),
    ],
    ["Duration", formatDuration(booking.duration_minutes)],
    ["Frequency", describeFrequency(booking.frequency, booking.weekdays)],
    ["Add-ons", addOnNames.join(", ") || "None"],
    ["Membership", membership],
    ["Promo", booking.promo_code || "—"],
    ["Address", address || "—"],
    ["Subtotal", formatPrice(booking.subtotal)],
    ["Total", formatPrice(booking.total)],
    ["Visit status", booking.status],
    ["Payment", booking.payment_status],
    [
      "Requested",
      booking.created_at
        ? new Date(booking.created_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })
        : "—",
    ],
  ];

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/bookings" className="text-[0.875rem] font-medium text-sand-700 hover:text-navy-900">
        ← Bookings
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="p-6 sm:p-8">
          <p className="eyebrow">{booking.booking_number}</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-navy-900">
            {booking.service_name || booking.service_slug}
          </h2>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[0.75rem] font-semibold uppercase text-sand-500">{label}</dt>
                <dd className="mt-1 text-[0.9375rem] text-navy-900">
                  {label === "Email" && booking.contact_email ? (
                    <a href={`mailto:${booking.contact_email}`} className="hover:underline">
                      {value}
                    </a>
                  ) : label === "Phone" && booking.contact_phone ? (
                    <a href={`tel:${booking.contact_phone.replace(/\D/g, "")}`} className="hover:underline">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {pets.length ? (
            <div className="mt-6">
              <p className="text-[0.75rem] font-semibold uppercase text-sand-500">Pets</p>
              <ul className="mt-2 flex flex-col gap-2">
                {pets.map((pet, index) => (
                  <li key={`${pet.name ?? "pet"}-${index}`} className="text-[0.9375rem] text-navy-900">
                    {[pet.name, pet.type, pet.breed, pet.age].filter(Boolean).join(" · ") || "Pet"}
                    {pet.notes ? (
                      <span className="mt-0.5 block text-[0.8125rem] text-sand-600">{pet.notes}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-[0.75rem] font-semibold uppercase text-sand-500">Pets</p>
              <p className="mt-1 text-[0.9375rem] text-navy-900">{booking.pet_count} pet(s)</p>
            </div>
          )}

          {booking.care_instructions ? (
            <div className="mt-6">
              <p className="text-[0.75rem] font-semibold uppercase text-sand-500">Care notes</p>
              <p className="mt-1 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-navy-800">
                {booking.care_instructions}
              </p>
            </div>
          ) : null}
          {booking.entry_instructions ? (
            <div className="mt-4">
              <p className="text-[0.75rem] font-semibold uppercase text-sand-500">Entry</p>
              <p className="mt-1 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-navy-800">
                {booking.entry_instructions}
              </p>
            </div>
          ) : null}
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold text-navy-900">Update status</h3>
          <p className="mt-1 text-[0.8125rem] text-sand-600">
            Use Payment → Paid for cash, Venmo, or anything outside Stripe.
          </p>
          <BookingStatusForm
            bookingNumber={booking.booking_number}
            status={booking.status}
            paymentStatus={booking.payment_status}
          />
        </Card>
      </div>
    </div>
  );
}
