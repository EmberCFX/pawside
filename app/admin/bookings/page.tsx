import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getAdminBookings } from "@/lib/admin";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AdminBookingsPage() {
  const { rows: bookings, error } = await getAdminBookings();

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-sand-800/8 px-6 py-5">
        <h2 className="font-display text-lg font-semibold text-navy-900">Bookings</h2>
        {error ? <p className="mt-2 text-[0.875rem] text-red-700">{error}</p> : null}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[0.875rem]">
          <thead className="bg-sand-50 text-[0.75rem] uppercase text-sand-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Ref</th>
              <th className="px-6 py-3 font-semibold">Customer</th>
              <th className="px-6 py-3 font-semibold">Service</th>
              <th className="px-6 py-3 font-semibold">When</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Total</th>
              <th className="px-6 py-3 font-semibold">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((row) => (
              <tr key={row.id} className="border-t border-sand-800/8">
                <td className="px-6 py-3">
                  <Link
                    href={`/admin/bookings/${row.booking_number}`}
                    className="font-medium text-navy-900 underline-offset-2 hover:underline"
                  >
                    {row.booking_number}
                  </Link>
                </td>
                <td className="px-6 py-3 text-sand-700">
                  {row.contact_name || "—"}
                  <div className="text-[0.75rem]">{row.contact_email}</div>
                  {row.contact_phone ? (
                    <div className="text-[0.75rem]">{row.contact_phone}</div>
                  ) : null}
                </td>
                <td className="px-6 py-3 text-sand-700">{row.service_name || row.service_slug}</td>
                <td className="px-6 py-3 text-sand-700">
                  {row.visit_date
                    ? formatDate(row.visit_date, { weekday: "short", month: "short", day: "numeric" })
                    : "—"}
                  {row.visit_time ? ` · ${row.visit_time}` : ""}
                </td>
                <td className="px-6 py-3 text-sand-700">
                  {row.status} / {row.payment_status}
                </td>
                <td className="px-6 py-3 tabular text-navy-900">{formatPrice(row.total)}</td>
                <td className="px-6 py-3 text-right">
                  <Link
                    href={`/admin/bookings/${row.booking_number}`}
                    className="inline-flex rounded-button bg-white px-3 py-1.5 text-[0.8125rem] font-medium text-navy-900 ring-1 ring-inset ring-sand-800/10 hover:bg-navy-50"
                  >
                    View details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {bookings.length === 0 && !error ? (
        <p className="px-6 py-10 text-[0.9375rem] text-sand-600">No bookings yet.</p>
      ) : null}
    </Card>
  );
}
