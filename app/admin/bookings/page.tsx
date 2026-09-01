import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { createServiceSupabase } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export default async function AdminBookingsPage() {
  const db = createServiceSupabase();
  const bookings = db
    ? ((await db.from("bookings").select("*").order("created_at", { ascending: false })).data ?? [])
    : [];

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-sand-800/8 px-6 py-5">
        <h2 className="font-display text-lg font-semibold text-navy-900">Bookings</h2>
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
            </tr>
          </thead>
          <tbody>
            {bookings.map((row) => (
              <tr key={row.id} className="border-t border-sand-800/8">
                <td className="px-6 py-3">
                  <Link href={`/admin/bookings/${row.booking_number}`} className="font-medium text-navy-900">
                    {row.booking_number}
                  </Link>
                </td>
                <td className="px-6 py-3 text-sand-700">
                  {row.contact_name}
                  <div className="text-[0.75rem]">{row.contact_email}</div>
                </td>
                <td className="px-6 py-3 text-sand-700">{row.service_name}</td>
                <td className="px-6 py-3 text-sand-700">
                  {row.visit_date ?? "—"} {row.visit_time ?? ""}
                </td>
                <td className="px-6 py-3 text-sand-700">
                  {row.status} / {row.payment_status}
                </td>
                <td className="px-6 py-3 tabular text-navy-900">{formatPrice(row.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {bookings.length === 0 ? (
        <p className="px-6 py-10 text-[0.9375rem] text-sand-600">No bookings yet.</p>
      ) : null}
    </Card>
  );
}
