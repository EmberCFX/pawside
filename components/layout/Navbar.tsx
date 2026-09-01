"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { primaryNav } from "@/data/navigation";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Sticky navigation that condenses into a floating, blurred bar once the page
 * scrolls — the premium-SaaS pattern, done subtly: the shell narrows, gains a
 * hairline and a soft shadow, and the height drops by a few pixels.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock scroll behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-button focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-brand",
          scrolled
            ? "bg-transparent py-2.5"
            : "border-b border-sand-800/6 bg-white/95 py-0 backdrop-blur-sm",
        )}
      >
        <div
          className={cn(
            "mx-auto flex items-center justify-between gap-4 transition-all duration-500 ease-brand",
            scrolled
              ? "max-w-[1200px] overflow-hidden rounded-[18px] border border-sand-800/8 bg-white/85 px-4 py-2.5 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 sm:px-5"
              : "w-full max-w-none px-6 py-4 sm:px-8 lg:px-12 xl:px-16",
          )}
        >
          <Link
            href="/"
            aria-label="Pawside Pet Services — home"
            className="shrink-0 rounded-lg transition-opacity hover:opacity-85"
          >
            <Logo size={scrolled ? 30 : 32} priority className="transition-all duration-500" />
          </Link>

          <nav aria-label="Main" className="hidden min-w-0 items-center gap-1 lg:flex">
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative whitespace-nowrap rounded-lg px-3.5 py-2 text-[0.9375rem] transition-colors duration-200",
                  isActive(link.href)
                    ? "text-navy-900"
                    : "text-sand-700 hover:text-navy-900",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-mint-500 transition-transform duration-300 ease-brand",
                    isActive(link.href) ? "scale-x-100" : "scale-x-0",
                  )}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={site.contact.phoneHref}
              className="hidden items-center gap-2 whitespace-nowrap rounded-lg px-2 py-2 text-[0.9375rem] text-sand-700 transition-colors hover:text-navy-900 xl:inline-flex"
            >
              <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              {site.contact.phone}
            </Link>
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-[0.9375rem] text-sand-700 transition-colors hover:text-navy-900 lg:inline-flex"
            >
              Sign In
            </Link>
            <ButtonLink href="/book" size={scrolled ? "sm" : "md"} className="hidden sm:inline-flex">
              Book Pet Care
            </ButtonLink>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-button bg-sand-100 text-navy-900 transition-colors hover:bg-sand-200 lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-[55] lg:hidden"
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="absolute inset-x-0 top-0 max-h-[92vh] overflow-y-auto rounded-b-panel bg-white px-5 pb-8 pt-5 shadow-lift"
              initial={reduceMotion ? undefined : { y: -24, opacity: 0 }}
              animate={reduceMotion ? undefined : { y: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { y: -24, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <Logo size={30} />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-button bg-sand-100 text-navy-900 transition-colors hover:bg-sand-200"
                >
                  <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Mobile" className="mt-7 flex flex-col">
                {primaryNav.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between border-b border-sand-800/8 py-4 font-display text-xl font-medium text-navy-900"
                  >
                    {link.label}
                    <span className="text-mint-500" aria-hidden="true">
                      →
                    </span>
                  </Link>
                ))}
                <Link
                  href="/login"
                  className="flex items-center justify-between border-b border-sand-800/8 py-4 font-display text-xl font-medium text-navy-900"
                >
                  Sign In
                  <span className="text-mint-500" aria-hidden="true">
                    →
                  </span>
                </Link>
              </nav>

              <div className="mt-7 flex flex-col gap-3">
                <ButtonLink href="/book" size="lg" fullWidth withArrow>
                  Book Pet Care
                </ButtonLink>
                <ButtonLink href={site.contact.phoneHref} variant="secondary" size="lg" fullWidth>
                  <Phone className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  {site.contact.phone}
                </ButtonLink>
              </div>

              <p className="mt-6 text-center text-xs text-sand-600">
                {site.policies.meetAndGreet} · Same familiar caregiver
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
