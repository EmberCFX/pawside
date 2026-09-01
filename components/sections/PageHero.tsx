import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  path: string;
}

/**
 * Interior page hero. One component keeps every page below the homepage on the
 * same vertical rhythm, with optional breadcrumbs for the nested SEO pages.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  primaryCta,
  secondaryCta,
  tone = "cream",
  children,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs?: Crumb[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  tone?: "cream" | "white" | "inverse";
  children?: React.ReactNode;
  align?: "left" | "center";
}) {
  const onDark = tone === "inverse";

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b",
        onDark ? "surface-inverse border-white/10" : "border-navy-900/8",
        tone === "cream" && "bg-cream",
        tone === "white" && "bg-white",
      )}
    >
      {!onDark ? (
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_88%_0%,rgba(54,206,193,0.09),transparent_70%)]"
          aria-hidden="true"
        />
      ) : null}

      <Container className="relative py-14 sm:py-20 lg:py-24">
        {crumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem]">
              {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;
                return (
                  <li key={crumb.path} className="flex items-center gap-1.5">
                    {isLast ? (
                      <span
                        aria-current="page"
                        className={onDark ? "text-navy-100/60" : "text-sand-600"}
                      >
                        {crumb.name}
                      </span>
                    ) : (
                      <Link
                        href={crumb.path}
                        className={cn(
                          "transition-colors",
                          onDark
                            ? "text-navy-100/70 hover:text-white"
                            : "text-sand-600 hover:text-navy-900",
                        )}
                      >
                        {crumb.name}
                      </Link>
                    )}
                    {!isLast ? (
                      <ChevronRight
                        className={cn("h-3 w-3", onDark ? "text-white/30" : "text-sand-400")}
                        aria-hidden="true"
                      />
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}

        <div
          className={cn(
            align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
          )}
        >
          {eyebrow ? (
            <Eyebrow onDark={onDark} withRules={align === "center"}>
              {eyebrow}
            </Eyebrow>
          ) : null}

          <h1
            className={cn(
              "mt-5 text-display-sm font-semibold sm:text-display-md lg:text-display-lg",
              onDark ? "text-white" : "text-navy-900",
            )}
          >
            {title}
          </h1>

          {description ? (
            <div
              className={cn(
                "mt-5 max-w-2xl text-lg leading-relaxed",
                align === "center" && "mx-auto",
                onDark ? "text-navy-100/75" : "text-sand-700",
              )}
            >
              {description}
            </div>
          ) : null}

          {primaryCta || secondaryCta ? (
            <div
              className={cn(
                "mt-9 flex flex-col gap-3 sm:flex-row",
                align === "center" && "sm:justify-center",
              )}
            >
              {primaryCta ? (
                <ButtonLink
                  href={primaryCta.href}
                  size="lg"
                  variant={onDark ? "inverse" : "primary"}
                  withArrow
                >
                  {primaryCta.label}
                </ButtonLink>
              ) : null}
              {secondaryCta ? (
                <ButtonLink
                  href={secondaryCta.href}
                  size="lg"
                  variant={onDark ? "outline-inverse" : "secondary"}
                >
                  {secondaryCta.label}
                </ButtonLink>
              ) : null}
            </div>
          ) : null}

          {children}
        </div>
      </Container>
    </section>
  );
}
