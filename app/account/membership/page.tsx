import Link from "next/link";
import { Check } from "lucide-react";
import { Badge, Card } from "@/components/ui/Card";
import { getMembership, memberships } from "@/data/memberships";
import { getAccountVisits } from "@/lib/account";
import { cn, formatPrice } from "@/lib/utils";

export default async function AccountMembershipPage() {
  const { membership: membershipSlug } = await getAccountVisits();
  const current = getMembership(membershipSlug);

  return (
    <div className="flex flex-col gap-6">
      <Card tone="inverse" className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-mint-400">Current plan</p>
            <h2 className="mt-3 font-display text-display-xs font-semibold text-white">
              {current.name}
            </h2>
            <p className="mt-2 text-[0.9375rem] text-navy-100/70">{current.tagline}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-semibold text-white tabular">
              {current.monthlyPrice ? formatPrice(current.monthlyPrice) : "Free"}
            </p>
            {current.monthlyPrice ? (
              <p className="text-[0.8125rem] text-navy-100/60">per month</p>
            ) : null}
          </div>
        </div>

        <Link
          href="/pricing#membership"
          className="mt-7 inline-flex rounded-button bg-white px-4 py-2.5 text-[0.875rem] font-medium text-navy-900 transition-colors hover:bg-mint-300"
        >
          Compare plans
        </Link>
      </Card>

      <section aria-labelledby="plans-heading">
        <h2 id="plans-heading" className="font-display text-xl font-semibold text-navy-900">
          All plans
        </h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {memberships.map((tier) => {
            const isCurrent = tier.slug === current.slug;
            return (
              <Card
                key={tier.slug}
                className={cn("flex flex-col p-5", isCurrent && "ring-2 ring-mint-500")}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-[1.0625rem] font-semibold text-navy-900">
                    {tier.name}
                  </h3>
                  {isCurrent ? <Badge tone="mint">Current</Badge> : null}
                </div>
                <p className="mt-2 font-display text-xl font-semibold text-navy-900 tabular">
                  {tier.monthlyPrice ? `${formatPrice(tier.monthlyPrice)}/mo` : "Free"}
                </p>
                <ul className="mt-4 flex flex-1 flex-col gap-2">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2 text-[0.8125rem] text-sand-700">
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint-600"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
                {!isCurrent ? (
                  <Link
                    href="/book"
                    className="mt-5 block w-full rounded-button bg-navy-900 px-4 py-2.5 text-center text-[0.875rem] font-medium text-white transition-colors hover:bg-navy-800"
                  >
                    Book with {tier.name}
                  </Link>
                ) : null}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
