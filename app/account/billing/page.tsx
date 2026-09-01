import { Badge, Card } from "@/components/ui/Card";
import { getAccountVisits } from "@/lib/account";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AccountBillingPage() {
  const { bookings } = await getAccountVisits();

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="invoices-heading">
        <h2 id="invoices-heading" className="font-display text-xl font-semibold text-navy-900">
          Bookings & charges
        </h2>

        {bookings.length ? (
          <Card className="mt-4 overflow-hidden p-0">
            <table className="w-full text-left text-[0.875rem]">
              <caption className="sr-only">Your Pawside bookings</caption>
              <thead>
                <tr className="border-b border-sand-800/8 bg-sand-50/70">
                  <th scope="col" className="px-5 py-3 font-medium text-sand-600">
                    Date
                  </th>
                  <th scope="col" className="hidden px-5 py-3 font-medium text-sand-600 sm:table-cell">
                    Description
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium text-sand-600">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-800/8">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-5 py-4 align-top">
                      <span className="block text-navy-900">
                        {formatDate(booking.visit_date || booking.created_at.slice(0, 10))}
                      </span>
                      <span className="block text-[0.75rem] text-sand-500">
                        {booking.booking_number}
                      </span>
                      <span className="mt-1.5 block sm:hidden">
                        <span className="text-[0.8125rem] text-sand-700">
                          {booking.service_name || booking.service_slug}
                        </span>
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 align-top text-sand-700 sm:table-cell">
                      {booking.service_name || booking.service_slug}
                    </td>
                    <td className="px-5 py-4 text-right align-top">
                      <span className="block font-medium text-navy-900 tabular">
                        {formatPrice(booking.total)}
                      </span>
                      <Badge
                        tone={booking.payment_status === "paid" ? "mint" : "warn"}
                        className="mt-1.5"
                      >
                        {booking.payment_status === "paid" ? "Paid" : "Unpaid"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <Card className="mt-4 p-8 text-center text-[0.9375rem] text-sand-700">
            No charges yet. They’ll appear here after you book.
          </Card>
        )}
      </section>
    </div>
  );
}
