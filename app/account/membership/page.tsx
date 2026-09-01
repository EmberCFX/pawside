import { Check, Gift } from "lucide-react";
import { Badge, Card } from "@/components/ui/Card";
import { currentCustomer, pastVisits } from "@/data/account";
import { getMembership, memberships, referralProgram } from "@/data/memberships";
import { cn, formatPrice } from "@/lib/utils";

export default function AccountMembershipPage() {
  const current = getMembership(currentCustomer.membershipSlug);
  const savedThisYear = pastVisits.reduce(
    (sum, visit) => sum + Math.round(visit.total * current.visitDiscount),
    0,
  );

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

        <dl className="mt-7 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-3">
          <div>
            <dt className="text-[0.75rem] uppercase text-navy-100/50">
              Saved so far
            </dt>
            <dd className="mt-1.5 font-display text-xl font-semibold text-mint-300 tabular">
              {formatPrice(savedThisYear)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.75rem] uppercase text-navy-100/50">
              Next renewal
            </dt>
            <dd className="mt-1.5 font-display text-xl font-semibold text-white">Sep 1, 2026</dd>
          </div>
          <div>
            <dt className="text-[0.75rem] uppercase text-navy-100/50">
              Care credit
            </dt>
            <dd className="mt-1.5 font-display text-xl font-semibold text-white tabular">
              {formatPrice(currentCustomer.credit)}
            </dd>
          </div>
        </dl>

        <div className="mt-7 flex flex-wrap gap-3 border-t border-white/10 pt-6">
          <button
            type="button"
            className="rounded-button bg-white px-4 py-2.5 text-[0.875rem] font-medium text-navy-900 transition-colors hover:bg-mint-300"
          >
            Change plan
          </button>
          <button
            type="button"
            className="rounded-button px-4 py-2.5 text-[0.875rem] font-medium text-navy-100/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Pause membership
          </button>
        </div>
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
                  <button
                    type="button"
                    className="mt-5 w-full rounded-button bg-navy-900 px-4 py-2.5 text-[0.875rem] font-medium text-white transition-colors hover:bg-navy-800"
                  >
                    Switch to {tier.name}
                  </button>
                ) : null}
              </Card>
            );
          })}
        </div>
      </section>

      <Card tone="mint" className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-start gap-4">
          <span
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-navy-900"
            aria-hidden="true"
          >
            <Gift className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="font-display text-[1.0625rem] font-semibold text-navy-900">
              Give {formatPrice(referralProgram.friendCredit)}, get{" "}
              {formatPrice(referralProgram.referrerCredit)}
            </h2>
            <p className="mt-1 text-[0.875rem] text-navy-800/75">
              Share your code — they save on their first visit, you get credit on your next one.
            </p>
          </div>
        </div>
        <code className="rounded-button bg-white px-4 py-2.5 font-mono text-[0.875rem] font-semibold tracking-wide text-navy-900">
          {referralProgram.code}
        </code>
      </Card>
    </div>
  );
}
