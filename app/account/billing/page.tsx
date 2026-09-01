import { CreditCard, Download } from "lucide-react";
import { Badge, Card } from "@/components/ui/Card";
import { invoices } from "@/data/account";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AccountBillingPage() {
  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="payment-heading">
        <h2 id="payment-heading" className="font-display text-xl font-semibold text-navy-900">
          Payment method
        </h2>
        <Card className="mt-4 flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <span
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-white"
              aria-hidden="true"
            >
              <CreditCard className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-display text-[0.9375rem] font-semibold text-navy-900">
                Visa ending 4242
              </p>
              <p className="text-[0.8125rem] text-sand-600">Expires 08 / 2029</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-button bg-white px-3.5 py-2 text-[0.8125rem] font-medium text-navy-900 ring-1 ring-inset ring-navy-900/10 transition-all hover:ring-navy-900/25"
          >
            Update card
          </button>
        </Card>
        <p className="mt-3 text-xs text-sand-600">
          Cards are a UI preview here. In production, render Stripe&apos;s payment element and store
          only the customer ID — see <span className="font-medium text-navy-800">lib/api.ts</span>.
        </p>
      </section>

      <section aria-labelledby="invoices-heading">
        <h2 id="invoices-heading" className="font-display text-xl font-semibold text-navy-900">
          Invoices
        </h2>

        <Card className="mt-4 overflow-hidden p-0">
          <table className="w-full text-left text-[0.875rem]">
            <caption className="sr-only">Your Pawside invoices</caption>
            <thead>
              <tr className="border-b border-navy-900/8 bg-sand-50/70">
                <th scope="col" className="px-5 py-3 font-medium text-sand-600">
                  Date
                </th>
                <th scope="col" className="hidden px-5 py-3 font-medium text-sand-600 sm:table-cell">
                  Description
                </th>
                <th scope="col" className="px-5 py-3 text-right font-medium text-sand-600">
                  Amount
                </th>
                <th scope="col" className="px-5 py-3 text-right font-medium text-sand-600">
                  <span className="sr-only">Receipt</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-900/8">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-5 py-4 align-top">
                    <span className="block text-navy-900">{formatDate(invoice.date)}</span>
                    <span className="block text-[0.75rem] text-sand-500">{invoice.number}</span>
                    <span className="mt-1.5 block sm:hidden">
                      <span className="text-[0.8125rem] text-sand-700">{invoice.description}</span>
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 align-top text-sand-700 sm:table-cell">
                    {invoice.description}
                  </td>
                  <td className="px-5 py-4 text-right align-top">
                    <span className="block font-medium text-navy-900 tabular">
                      {formatPrice(invoice.amount)}
                    </span>
                    <Badge
                      tone={invoice.status === "paid" ? "mint" : "warn"}
                      className="mt-1.5"
                    >
                      {invoice.status === "paid" ? "Paid" : "Due"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right align-top">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-button px-2.5 py-1.5 text-[0.8125rem] font-medium text-navy-900 transition-colors hover:bg-sand-100"
                    >
                      <Download className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                      <span className="hidden sm:inline">Receipt</span>
                      <span className="sr-only">
                        Download receipt for invoice {invoice.number}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
