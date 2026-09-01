"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { accountNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

/** Signed-in account chrome — greeting and subnav come from the session. */
export function AccountShell({
  children,
  firstName,
  email,
  isAdmin = false,
}: {
  children: React.ReactNode;
  firstName: string;
  email: string;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-[70vh] bg-canvas pb-20 pt-10 sm:pt-14">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="eyebrow">Your account</p>
            <h1 className="mt-3 font-display text-display-xs font-semibold text-navy-900 sm:text-display-sm">
              Hi, {firstName}
            </h1>
            <p className="mt-2 text-[0.9375rem] text-sand-700">{email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin ? (
              <ButtonLink href="/admin" variant="secondary" size="md">
                Operations
              </ButtonLink>
            ) : null}
            <ButtonLink href="/book" size="md" withArrow>
              Book a visit
            </ButtonLink>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-button px-3 py-2 text-[0.875rem] text-sand-700 transition-colors hover:bg-white hover:text-navy-900"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                Sign out
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-10">
          <nav aria-label="Account" className="lg:sticky lg:top-28 lg:self-start">
            <ul className="flex gap-1.5 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible">
              {accountNav.map((link) => {
                const isActive =
                  link.href === "/account"
                    ? pathname === "/account"
                    : pathname.startsWith(link.href);

                return (
                  <li key={link.href} className="shrink-0 lg:shrink">
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "inline-flex w-full items-center rounded-button px-3.5 py-2.5 text-[0.9375rem] transition-colors duration-200",
                        isActive
                          ? "bg-navy-900 font-medium text-white"
                          : "text-sand-700 hover:bg-white hover:text-navy-900",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 hidden rounded-card border border-sand-800/8 bg-white p-4 text-xs leading-relaxed text-sand-600 lg:block">
              Bookings, pets, and your profile come from your Pawside account.
            </p>
          </nav>

          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </div>
  );
}
