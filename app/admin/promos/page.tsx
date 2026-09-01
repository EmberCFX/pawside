import { Card } from "@/components/ui/Card";
import { PromoDeactivateButton } from "@/components/admin/PromoDeactivateButton";
import { PromoForm } from "@/components/admin/PromoForm";
import { listStripePromos } from "@/lib/promos";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

function discountLabel(promo: { type: string; value: number }) {
  return promo.type === "percentage"
    ? `${Math.round(promo.value * 100)}% off`
    : `${formatPrice(promo.value)} off`;
}

export default async function AdminPromosPage() {
  let promos: Awaited<ReturnType<typeof listStripePromos>> = [];
  let error: string | null = null;
  try {
    promos = await listStripePromos();
  } catch (err) {
    error = err instanceof Error ? err.message : "Couldn’t load promo codes.";
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6 sm:p-7">
        <h2 className="font-display text-lg font-semibold text-navy-900">Add promo code</h2>
        <p className="mt-1.5 text-[0.875rem] text-sand-600">
          Creates a coupon and promotion code in Stripe. Customers can enter it on booking, and Pay
          now applies it at checkout.
        </p>
        <div className="mt-5">
          <PromoForm />
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-sand-800/8 px-6 py-5">
          <h2 className="font-display text-lg font-semibold text-navy-900">Promo codes</h2>
          {error ? <p className="mt-2 text-[0.875rem] text-red-700">{error}</p> : null}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[0.875rem]">
            <thead className="bg-sand-50 text-[0.75rem] uppercase text-sand-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Code</th>
                <th className="px-6 py-3 font-semibold">Offer</th>
                <th className="px-6 py-3 font-semibold">Uses</th>
                <th className="px-6 py-3 font-semibold">Expires</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => (
                <tr key={promo.stripePromotionCodeId ?? promo.code} className="border-t border-sand-800/8">
                  <td className="px-6 py-3">
                    <p className="font-medium text-navy-900">{promo.code}</p>
                    <p className="text-[0.75rem] text-sand-600">{promo.label}</p>
                  </td>
                  <td className="px-6 py-3 text-sand-700">{discountLabel(promo)}</td>
                  <td className="px-6 py-3 text-sand-700">
                    {promo.timesRedeemed ?? 0}
                    {promo.maxRedemptions ? ` / ${promo.maxRedemptions}` : ""}
                  </td>
                  <td className="px-6 py-3 text-sand-700">{promo.expiresAt || "—"}</td>
                  <td className="px-6 py-3 text-sand-700">
                    {promo.active ? "Active" : "Off"}
                    {promo.source === "built-in" ? " · built-in" : " · Stripe"}
                    {promo.firstTimeOnly ? " · first payment" : ""}
                  </td>
                  <td className="px-6 py-3 text-right">
                    {promo.source === "stripe" && promo.active && promo.stripePromotionCodeId ? (
                      <PromoDeactivateButton id={promo.stripePromotionCodeId} />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {promos.length === 0 && !error ? (
          <p className="px-6 py-10 text-[0.9375rem] text-sand-600">No promo codes yet.</p>
        ) : null}
      </Card>
    </div>
  );
}
