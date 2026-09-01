import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, IconTile } from "@/components/ui/Card";
import { startingPrice } from "@/data/pricing";
import { cn, formatPrice } from "@/lib/utils";
import type { Service } from "@/types";

/**
 * Service card.
 *
 * Two actions on purpose: "Learn more" for the researcher, "Book" for the
 * decided. The whole card is a link surface for the former, with the Book button
 * layered above it.
 */
export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  const price = startingPrice(service.slug);
  const unit = service.pricingUnit === "night" ? "night" : "visit";

  return (
    <Card
      as="article"
      interactive
      className={cn("group flex flex-col overflow-hidden p-6 sm:p-7", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <IconTile
          icon={service.icon}
          className="transition-colors duration-300 group-hover:bg-mint-50 group-hover:text-mint-700 group-hover:ring-mint-500/25"
        />
        <div className="text-right">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-sand-500">
            From
          </p>
          <p className="font-display text-xl font-semibold leading-tight text-navy-900 tabular">
            {formatPrice(price)}
            <span className="text-[0.8125rem] font-medium text-sand-600">/{unit}</span>
          </p>
        </div>
      </div>

      <h3 className="mt-6 font-display text-xl font-semibold text-navy-900">
        <Link href={`/services/${service.slug}`} className="outline-none">
          {/* Card-wide hit area; the Book button sits above it via z-index. */}
          <span className="absolute inset-0 z-0" aria-hidden="true" />
          {service.name}
        </Link>
      </h3>

      <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-sand-700">
        {service.summary}
      </p>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-navy-900/8 pt-5">
        <span className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-navy-900">
          Learn more
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-300 ease-brand group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
        <Link
          href={`/book?service=${service.slug}`}
          className="relative z-10 inline-flex h-9 items-center rounded-button bg-navy-900 px-4 text-[0.8125rem] font-medium text-white transition-colors duration-200 hover:bg-navy-800"
        >
          Book
          <span className="sr-only"> {service.name}</span>
        </Link>
      </div>
    </Card>
  );
}
