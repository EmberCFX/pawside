import Link from "next/link";
import { ArrowRight, CalendarPlus, MessageSquare, PawPrint, Sparkles } from "lucide-react";
import { ReportCard } from "@/components/dashboard/ReportCard";
import { VisitCard } from "@/components/dashboard/VisitCard";
import { Badge, Card, IconTile } from "@/components/ui/Card";
import { PetAvatar } from "@/components/ui/Photo";
import {
  currentCustomer,
  messages,
  petProfiles,
  upcomingVisits,
  visitReports,
} from "@/data/account";
import { getMembership } from "@/data/memberships";
import { formatPrice, pluralize } from "@/lib/utils";

export default function AccountDashboardPage() {
  const nextVisit = upcomingVisits[0];
  const latestReport = visitReports[0];
  const membership = getMembership(currentCustomer.membershipSlug);
  const unread = messages.filter((message) => message.unread).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Quick actions -------------------------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Book a visit", href: "/book", icon: CalendarPlus, detail: "One-time or recurring" },
          {
            label: "Messages",
            href: "/account/messages",
            icon: MessageSquare,
            detail: unread ? `${unread} unread` : "All caught up",
          },
          {
            label: "Pet profiles",
            href: "/account/pets",
            icon: PawPrint,
            detail: `${petProfiles.length} ${pluralize(petProfiles.length, "pet")}`,
          },
        ].map((action) => (
          <Card key={action.href} interactive className="group p-5">
            <Link href={action.href} className="flex items-center gap-4">
              <span className="absolute inset-0" aria-hidden="true" />
              <IconTile icon={action.icon} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[0.9375rem] font-semibold text-navy-900">
                  {action.label}
                </span>
                <span className="block truncate text-[0.8125rem] text-sand-600">
                  {action.detail}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-sand-400 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </Card>
        ))}
      </div>

      {/* Next visit ------------------------------------------------------ */}
      <section aria-labelledby="next-visit-heading">
        <div className="flex items-center justify-between gap-4">
          <h2 id="next-visit-heading" className="font-display text-xl font-semibold text-navy-900">
            Next visit
          </h2>
          <Link
            href="/account/visits"
            className="link-underline text-[0.875rem] font-medium text-navy-900"
          >
            All visits
          </Link>
        </div>

        <div className="mt-4">
          {nextVisit ? (
            <VisitCard visit={nextVisit} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-[0.9375rem] text-sand-700">Nothing scheduled right now.</p>
              <Link
                href="/book"
                className="link-underline mt-2 inline-flex font-medium text-navy-900"
              >
                Book a visit
              </Link>
            </Card>
          )}
        </div>
      </section>

      {/* Pets ------------------------------------------------------------ */}
      <section aria-labelledby="pets-heading">
        <div className="flex items-center justify-between gap-4">
          <h2 id="pets-heading" className="font-display text-xl font-semibold text-navy-900">
            Your pets
          </h2>
          <Link
            href="/account/pets"
            className="link-underline text-[0.875rem] font-medium text-navy-900"
          >
            Manage profiles
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {petProfiles.map((pet) => (
            <Card key={pet.id} interactive className="group flex items-center gap-4 p-5">
              <Link href="/account/pets" className="flex flex-1 items-center gap-4">
                <span className="absolute inset-0" aria-hidden="true" />
                <PetAvatar slot={pet.mediaKey} name={pet.name} size={48} />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1.0625rem] font-semibold text-navy-900">
                    {pet.name}
                  </span>
                  <span className="block truncate text-[0.8125rem] text-sand-600">
                    {pet.breed} · {pet.age}
                  </span>
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-sand-400 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Membership ------------------------------------------------------ */}
      <Card tone="inverse" className="p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase text-mint-400">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              Membership
            </p>
            <h2 className="mt-3 font-display text-xl font-semibold text-white">
              {membership.name}
            </h2>
            <p className="mt-1.5 text-[0.9375rem] text-navy-100/70">
              {formatPrice(membership.monthlyPrice ?? 0)}/month ·{" "}
              {Math.round(membership.visitDiscount * 100)}% off every visit
            </p>
          </div>
          <Badge tone="inverse">Active</Badge>
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-5">
          {membership.benefits.slice(0, 4).map((benefit) => (
            <li key={benefit} className="text-[0.8125rem] text-navy-100/70">
              {benefit}
            </li>
          ))}
        </ul>

        <Link
          href="/account/membership"
          className="link-underline mt-5 inline-flex text-[0.875rem] font-medium text-mint-300"
        >
          Manage membership
        </Link>
      </Card>

      {/* Latest report --------------------------------------------------- */}
      <section aria-labelledby="latest-report-heading">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="latest-report-heading"
            className="font-display text-xl font-semibold text-navy-900"
          >
            Latest visit report
          </h2>
          <Link
            href="/account/visits"
            className="link-underline text-[0.875rem] font-medium text-navy-900"
          >
            All reports
          </Link>
        </div>
        <div className="mt-4">
          <ReportCard report={latestReport} />
        </div>
      </section>
    </div>
  );
}
