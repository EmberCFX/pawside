import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { createServiceSupabase } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export default async function AdminHomePage() {
  const db = createServiceSupabase();
  const bookings = db
    ? ((await db.from("bookings").select("*").order("created_at", { ascending: false })).data ?? [])
    : [];
  const messages = db
    ? ((await db.from("contact_messages").select("id").order("created_at", { ascending: false })).data ??
      [])
    : [];

  const pending = bookings.filter((row) => row.status === "pending").length;
  const paid = bookings.filter((row) => row.payment_status === "paid");
  const revenue = paid.reduce((sum, row) => sum + (row.total ?? 0), 0);

  const stats = [
    { label: "Bookings", value: String(bookings.length) },
    { label: "Pending", value: String(pending) },
    { label: "Paid", value: formatPrice(revenue) },
    { label: "Messages", value: String(messages.length) },
  ];

  return (
    <div className="flex flex-col gap-6">
      {!db ? (
        <Card className="p-6">
          <p className="font-medium text-navy-900">Connect Supabase to see live data.</p>
          <p className="mt-2 text-[0.9375rem] text-sand-700">
            Add the keys from SETUP.md, run <code>supabase/schema.sql</code>, and refresh.
          </p>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-[0.75rem] font-semibold uppercase text-sand-500">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-navy-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-navy-900">Latest bookings</h2>
          <Link href="/admin/bookings" className="text-[0.875rem] font-medium text-navy-900">
            View all
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-sand-800/8">
          {bookings.slice(0, 8).map((row) => (
            <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <Link
                  href={`/admin/bookings/${row.booking_number}`}
                  className="font-medium text-navy-900"
                >
                  {row.booking_number}
                </Link>
                <p className="text-[0.8125rem] text-sand-600">
                  {row.contact_name} · {row.service_name}
                </p>
              </div>
              <p className="text-[0.8125rem] text-sand-700">
                {row.status} · {row.payment_status} · {formatPrice(row.total)}
              </p>
            </li>
          ))}
          {bookings.length === 0 ? (
            <li className="py-6 text-[0.9375rem] text-sand-600">No bookings yet.</li>
          ) : null}
        </ul>
      </Card>
    </div>
  );
}
