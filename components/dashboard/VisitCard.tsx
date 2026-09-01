import Link from "next/link";
import { CalendarDays, Clock, Repeat, User } from "lucide-react";
import { Badge, Card } from "@/components/ui/Card";
import { cn, formatDate, formatDuration, formatPrice, listToSentence } from "@/lib/utils";
import type { Visit } from "@/types";

const statusTone = {
  scheduled: "navy",
  confirmed: "mint",
  "in-progress": "mint",
  completed: "neutral",
  cancelled: "warn",
} as const;

const statusLabel = {
  scheduled: "Requested",
  confirmed: "Confirmed",
  "in-progress": "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
} as const;

export function VisitCard({ visit, className }: { visit: Visit; className?: string }) {
  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="font-display text-[1.0625rem] font-semibold text-navy-900">
              {visit.serviceName}
            </h3>
            <Badge tone={statusTone[visit.status]}>{statusLabel[visit.status]}</Badge>
            {visit.recurring ? (
              <span className="inline-flex items-center gap-1 text-[0.75rem] text-sand-600">
                <Repeat className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                Recurring
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 text-[0.875rem] text-sand-600">
            {listToSentence(visit.petNames)}
          </p>
        </div>

        <p className="font-display text-lg font-semibold text-navy-900 tabular">
          {formatPrice(visit.total)}
        </p>
      </div>

      <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5 border-t border-navy-900/8 pt-4 text-[0.875rem]">
        <div className="flex items-center gap-2">
          <dt className="sr-only">Date</dt>
          <CalendarDays className="h-4 w-4 text-sand-500" strokeWidth={1.75} aria-hidden="true" />
          <dd className="text-navy-800">{formatDate(visit.date)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Time</dt>
          <Clock className="h-4 w-4 text-sand-500" strokeWidth={1.75} aria-hidden="true" />
          <dd className="text-navy-800">
            {visit.time}
            {visit.durationMinutes ? ` · ${formatDuration(visit.durationMinutes)}` : null}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Caregiver</dt>
          <User className="h-4 w-4 text-sand-500" strokeWidth={1.75} aria-hidden="true" />
          <dd className="text-navy-800">{visit.caregiverName}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-2.5 border-t border-navy-900/8 pt-4">
        {visit.status === "completed" && visit.reportId ? (
          <Link
            href={`/account/visits#${visit.reportId}`}
            className="rounded-button bg-navy-900 px-3.5 py-2 text-[0.8125rem] font-medium text-white transition-colors hover:bg-navy-800"
          >
            View report
          </Link>
        ) : (
          <>
            <button
              type="button"
              className="rounded-button bg-white px-3.5 py-2 text-[0.8125rem] font-medium text-navy-900 ring-1 ring-inset ring-navy-900/10 transition-all hover:ring-navy-900/25"
            >
              Reschedule
            </button>
            <button
              type="button"
              className="rounded-button px-3.5 py-2 text-[0.8125rem] font-medium text-sand-600 transition-colors hover:bg-sand-100 hover:text-navy-900"
            >
              Cancel visit
            </button>
          </>
        )}
        <Link
          href="/account/messages"
          className="rounded-button px-3.5 py-2 text-[0.8125rem] font-medium text-sand-600 transition-colors hover:bg-sand-100 hover:text-navy-900"
        >
          Message caregiver
        </Link>
      </div>
    </Card>
  );
}
