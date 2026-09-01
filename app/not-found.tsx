import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { primaryNav } from "@/data/navigation";

export default function NotFound() {
  return (
    <div className="bg-canvas py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <svg
            viewBox="0 0 120 108"
            fill="none"
            aria-hidden="true"
            className="mx-auto h-20 text-mint-500"
          >
            <path
              d="M60 98C60 98 8 68 8 36.5 8 20 21 8 36 8c10 0 19 5.5 24 14 5-8.5 14-14 24-14 15 0 28 12 28 28.5C112 68 60 98 60 98Z"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <Eyebrow className="mt-8 justify-center">404</Eyebrow>
          <h1 className="mt-5 font-display text-display-sm font-semibold text-navy-900 sm:text-display-md">
            This page went for a walk.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-sand-700">
            The link is broken or the page moved. Here&apos;s the way back — or head straight to
            booking, which is probably what you were after.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/book" size="lg" withArrow>
              Book Pet Care
            </ButtonLink>
            <ButtonLink href="/" variant="secondary" size="lg">
              Back home
            </ButtonLink>
          </div>

          <nav aria-label="Popular pages" className="mt-12 border-t border-sand-800/8 pt-8">
            <p className="text-[0.8125rem] text-sand-600">Or try one of these:</p>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2.5">
              {primaryNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-[0.9375rem] font-medium text-navy-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </div>
  );
}
