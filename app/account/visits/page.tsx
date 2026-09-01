import { ReportCard } from "@/components/dashboard/ReportCard";
import { VisitCard } from "@/components/dashboard/VisitCard";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { pastVisits, upcomingVisits, visitReports } from "@/data/account";

export default function AccountVisitsPage() {
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
          {upcomingVisits.length ? (
            upcomingVisits.map((visit) => <VisitCard key={visit.id} visit={visit} />)
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
          {pastVisits.map((visit) => (
            <VisitCard key={visit.id} visit={visit} />
          ))}
        </div>
      </section>

      <section aria-labelledby="reports-heading">
        <h2 id="reports-heading" className="font-display text-xl font-semibold text-navy-900">
          Visit reports
        </h2>
        <p className="mt-1.5 text-[0.9375rem] text-sand-700">
          Every completed visit, with photos and the caregiver&apos;s notes.
        </p>
        <div className="mt-5 flex flex-col gap-6">
          {visitReports.map((report) => (
            <div key={report.id} id={report.id} className="scroll-mt-32">
              <ReportCard report={report} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
