import { VisitCard } from "@/components/dashboard/VisitCard";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getAccountVisits } from "@/lib/account";

export default async function AccountVisitsPage() {
  const { upcoming, past } = await getAccountVisits();

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="upcoming-heading">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="upcoming-heading" className="font-display text-xl font-semibold text-navy-900">
            Upcoming visits
          </h2>
          <ButtonLink href="/book" size="sm">
            Book another
          </ButtonLink>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {upcoming.length ? (
            upcoming.map((visit) => <VisitCard key={visit.id} visit={visit} />)
          ) : (
            <Card className="p-8 text-center text-[0.9375rem] text-sand-700">
              Nothing scheduled yet.
            </Card>
          )}
        </div>
      </section>

      <section aria-labelledby="past-heading">
        <h2 id="past-heading" className="font-display text-xl font-semibold text-navy-900">
          Past visits
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          {past.length ? (
            past.map((visit) => <VisitCard key={visit.id} visit={visit} />)
          ) : (
            <Card className="p-8 text-center text-[0.9375rem] text-sand-700">
              No completed visits yet.
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
