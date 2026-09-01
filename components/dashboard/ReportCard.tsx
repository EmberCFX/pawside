import { Camera, Check, Clock, MapPin, Minus } from "lucide-react";
import { Badge, Card } from "@/components/ui/Card";
import { Photo } from "@/components/ui/Photo";
import { cn, formatDuration } from "@/lib/utils";
import type { VisitReport } from "@/types";

/**
 * The Pawside Report.
 *
 * Used on the homepage as proof and in the dashboard as the real artifact — one
 * component, so the marketing promise and the product can't diverge.
 */
export function ReportCard({
  report,
  className,
  showPhotos = true,
}: {
  report: VisitReport;
  className?: string;
  showPhotos?: boolean;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sand-800/8 p-6 sm:p-7">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase text-mint-700">
            Pawside Report
          </p>
          <h3 className="mt-2.5 font-display text-2xl font-semibold text-navy-900">
            {report.petName}&apos;s Visit
          </h3>
          <p className="mt-1.5 text-[0.875rem] text-sand-600">
            {report.date} · {report.time} · {report.serviceName}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge tone="mint">Completed</Badge>
          <div className="flex items-center gap-3 text-[0.8125rem] text-sand-600">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              {formatDuration(report.durationMinutes)}
            </span>
            {report.distanceMiles ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                {report.distanceMiles} mi
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 p-6 sm:grid-cols-3 sm:p-7">
        {report.tasks.map((task) => {
          const done = task.status === "done";
          return (
            <div key={task.label} className="min-w-0">
              <dt className="text-[0.6875rem] font-semibold uppercase text-sand-500">
                {task.label}
              </dt>
              <dd className="mt-1.5 flex items-start gap-2">
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                    done ? "bg-mint-500 text-white" : "bg-sand-200 text-sand-600",
                  )}
                  aria-hidden="true"
                >
                  {done ? (
                    <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                  ) : (
                    <Minus className="h-2.5 w-2.5" strokeWidth={3.5} />
                  )}
                </span>
                <span className="min-w-0 text-[0.875rem] leading-snug text-navy-800">
                  {task.detail ?? (done ? "Done" : "Not required")}
                  <span className="sr-only">
                    {done ? " — completed" : " — not required this visit"}
                  </span>
                </span>
              </dd>
            </div>
          );
        })}
      </dl>

      <figure className="mx-6 mb-6 rounded-card bg-canvas p-5 sm:mx-7 sm:mb-7">
        <blockquote className="text-[0.9375rem] leading-relaxed text-navy-800">
          &ldquo;{report.note}&rdquo;
        </blockquote>
        <figcaption className="mt-4 flex items-center gap-2.5 text-[0.8125rem] text-sand-600">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-[0.6875rem] font-semibold text-white">
            {report.caregiverName.charAt(0)}
          </span>
          {report.caregiverName} · caregiver note
        </figcaption>
      </figure>

      {showPhotos && report.mediaKeys.length ? (
        <div className="px-6 pb-6 sm:px-7 sm:pb-7">
          <p className="mb-3 inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase text-sand-500">
            <Camera className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            {report.photoCount} photos from this visit
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {report.mediaKeys.map((key) => (
              <Photo
                key={key}
                slot={key}
                aspect="aspect-square"
                rounded="rounded-[14px]"
                sizes="(max-width: 640px) 30vw, 180px"
                className="transition-transform duration-500 ease-brand hover:scale-[1.02]"
              />
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
