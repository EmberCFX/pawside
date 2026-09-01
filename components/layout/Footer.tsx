import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Layout";
import { footerNav, legalNav } from "@/data/navigation";
import { serviceAreas } from "@/data/serviceAreas";
import { site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();
  const coreAreas = serviceAreas.filter((area) => area.status !== "waitlist").slice(0, 6);

  return (
    <footer className="surface-inverse border-t border-white/8 text-navy-100">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          <div className="max-w-sm">
            <Logo variant="horizontal" theme="dark" size={34} withTagline />
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-navy-100/70">
              Pet sitting, dog walking, and drop-in visits across {site.homeBase.region}. Same
              caregiver, real updates, care built around your pet&apos;s routine.
            </p>

            <div className="mt-7 flex flex-col gap-2.5 text-[0.9375rem]">
              <a
                href={site.contact.phoneHref}
                className="link-underline inline-flex w-fit items-center gap-2.5 text-navy-100/85 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-mint-400" strokeWidth={1.75} aria-hidden="true" />
                {site.contact.phone}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="link-underline inline-flex w-fit items-center gap-2.5 text-navy-100/85 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-mint-400" strokeWidth={1.75} aria-hidden="true" />
                {site.contact.email}
              </a>
              <p className="inline-flex items-center gap-2.5 text-navy-100/70">
                <MapPin className="h-4 w-4 text-mint-400" strokeWidth={1.75} aria-hidden="true" />
                {site.homeBase.city}, {site.homeBase.state} · {site.homeBase.serviceRadiusMiles}-mile
                radius
              </p>
            </div>

            {site.social.length > 0 ? (
              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                {site.social.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      className="link-underline text-sm text-navy-100/70 transition-colors hover:text-mint-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.name} {social.handle}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <h2 className="text-[0.6875rem] font-semibold uppercase text-mint-400">
                  {group.heading}
                </h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.9375rem] text-navy-100/75 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <h2 className="text-[0.6875rem] font-semibold uppercase text-mint-400">
            Service Area
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
            {coreAreas.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/locations/${area.slug}`}
                  className="inline-flex rounded-full border border-white/12 px-3 py-1.5 text-[0.8125rem] text-navy-100/75 transition-colors hover:border-mint-400/50 hover:text-white"
                >
                  {area.name}, {area.state}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/locations"
                className="inline-flex rounded-full border border-mint-400/30 px-3 py-1.5 text-[0.8125rem] text-mint-300 transition-colors hover:border-mint-400/60"
              >
                View all areas
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-[0.8125rem] text-navy-100/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>Same familiar caregiver</li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
