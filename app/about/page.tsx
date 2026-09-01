import type { Metadata } from "next";
import { Check, Quote } from "lucide-react";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { Card, IconTile } from "@/components/ui/Card";
import { Hairline, Section, SectionHeading } from "@/components/ui/Layout";
import { Photo } from "@/components/ui/Photo";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { safetyCommitments, team, values } from "@/data/team";
import { site } from "@/data/site";
import { trustStats } from "@/data/stats";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Pawside",
  description:
    "Why Pawside exists: people shouldn't have to choose between living their lives and giving their pets the care they deserve. Meet the person behind the service.",
  path: "/about",
});

export default function AboutPage() {
  const lead = team[0];

  return (
    <>
      <PageHero
        eyebrow="About Pawside"
        title="People shouldn't have to choose between their life and their pet's care."
        description="That's the whole idea. Everything else — the services, the schedules, the visit reports — exists to make that true for the households we work with."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />

      {/* Origin story -------------------------------------------------- */}
      <Section tone="default">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-16">
          <div className="max-w-prose">
            <SectionHeading
              align="left"
              eyebrow="Why we started"
              title="Pawside was created around a simple idea."
            />

            <div className="mt-7 flex flex-col gap-5 text-[1.0625rem] leading-relaxed text-sand-700">
              <p>
                Every pet owner has had the same afternoon. A meeting runs long, traffic doesn&apos;t
                move, and you&apos;re doing math in your head about how long it&apos;s been since
                anyone let the dog out. You&apos;re not a bad owner. You&apos;re just a person with a
                job.
              </p>
              <p>
                Pawside started because the options for that afternoon weren&apos;t great. Ask a
                neighbor for the fourth time, or open an app and hope the stranger who accepts your
                request reads the notes about the back gate. Neither one is the same as having
                someone who already knows your pet.
              </p>
              <p>
                So the whole service is built the other way around. A limited number of households.
                The same caregiver whenever the calendar allows. Written routines instead of generic
                checklists. And a real summary after every visit, because &ldquo;it went fine&rdquo;
                isn&apos;t information.
              </p>
            </div>

            <blockquote className="mt-10 border-l-2 border-mint-500 pl-6">
              <Quote className="h-5 w-5 text-mint-500" strokeWidth={2} aria-hidden="true" />
              <p className="mt-3 font-display text-xl font-medium leading-relaxed text-navy-900">
                Pets have personalities, routines, preferences, fears, favorite toys, favorite
                walking routes, feeding habits, and quirks. The care should adapt around the animal —
                not treat every booking as another appointment.
              </p>
            </blockquote>
          </div>

          <Reveal delay={0.08} className="lg:sticky lg:top-28">
            <Photo
              slot="about-portrait"
              aspect="aspect-[4/5]"
              rounded="rounded-feature"
              sizes="(max-width: 1024px) 100vw, 520px"
              className="shadow-card"
            />
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { value: `${trustStats.yearsExperience}+`, label: "Years with dogs & cats" },
                { value: `${trustStats.onTimeRate}%`, label: "On-time arrival" },
                { value: `${trustStats.responseMinutes}m`, label: "Typical reply" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-semibold text-navy-900 tabular">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-sand-600">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-sand-500">Placeholder figures pending real data.</p>
          </Reveal>
        </div>
      </Section>

      {/* Mission ------------------------------------------------------- */}
      <Section tone="inverse">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow eyebrow-rule eyebrow-on-dark justify-center">Our mission</p>
          <h2 className="mt-6 text-display-sm font-semibold text-white sm:text-display-md">
            Make it easy to be a good pet owner on a busy week.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-navy-100/75">
            Not a marketplace. Not a franchise. A local service where the person walking your dog
            recognizes your dog — and where you never have to feel guilty about having a full day.
          </p>
        </div>

        <Hairline className="mx-auto mt-14 max-w-md opacity-70" />

        <RevealGroup className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {values.map((value) => (
            <RevealItem key={value.title}>
              <h3 className="font-display text-xl font-semibold text-white">{value.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-navy-100/70">
                {value.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Care philosophy ---------------------------------------------- */}
      <Section tone="default">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Photo
            slot="about-detail"
            aspect="aspect-[4/3]"
            rounded="rounded-feature"
            sizes="(max-width: 1024px) 100vw, 560px"
          />

          <div>
            <SectionHeading
              align="left"
              eyebrow="Care philosophy"
              title="We follow the routine you already built."
              description="You've spent years learning what your pet needs. Our job isn't to improve on that — it's to keep it going while you're not there."
            />

            <ul className="mt-8 flex flex-col gap-4">
              {[
                {
                  title: "Same food, same times, same bowl",
                  body: "Consistency prevents more problems than anything else we do.",
                },
                {
                  title: "Their pace on walks",
                  body: "Sniffing is enrichment. A slow walk isn't a wasted one.",
                },
                {
                  title: "No forcing interaction",
                  body: "Shy pets get space. Trust is earned across visits, not demanded on visit one.",
                },
                {
                  title: "Honest reporting",
                  body: "If they didn't eat, didn't poop, or seemed off, you hear it that day.",
                },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-mint-600" strokeWidth={2.5} aria-hidden="true" />
                  <div>
                    <p className="font-display text-[1.0625rem] font-semibold text-navy-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-sand-700">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Safety ------------------------------------------------------- */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Safety"
          title="The unglamorous part, taken seriously."
          description="Nobody books a pet sitter because of their insurance policy. It still matters on the day something goes wrong."
        />

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {safetyCommitments.map((item) => (
            <RevealItem key={item.title} className="h-full">
              <Card className="h-full p-6">
                <h3 className="font-display text-[1.0625rem] font-semibold text-navy-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-sand-700">
                  {item.description}
                </p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Team --------------------------------------------------------- */}
      <Section tone="default">
        <SectionHeading
          eyebrow="Who you'll meet"
          title={team.length > 1 ? "The Pawside team" : "The person behind Pawside"}
          description="You'll know exactly who is coming to your home, and it won't be a different name every week."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {team.map((member) => (
            <Card key={member.name} className="flex flex-col gap-6 p-7 sm:flex-row sm:p-8">
              <Photo
                slot={member.mediaKey ?? "about-portrait"}
                aspect="aspect-square"
                rounded="rounded-card"
                sizes="200px"
                className="w-full shrink-0 sm:w-44"
              />
              <div>
                <h3 className="font-display text-xl font-semibold text-navy-900">{member.name}</h3>
                <p className="mt-0.5 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-mint-700">
                  {member.role}
                </p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-sand-700">{member.bio}</p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {member.credentials.map((credential) => (
                    <li
                      key={credential}
                      className="rounded-full bg-navy-50 px-2.5 py-1 text-[0.75rem] text-navy-800 ring-1 ring-inset ring-navy-900/8"
                    >
                      {credential}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 border-t border-navy-900/8 pt-4 text-[0.875rem] italic leading-relaxed text-sand-700">
                  &ldquo;{member.favoritePart}&rdquo;
                </p>
              </div>
            </Card>
          ))}

          <Card tone="outline" className="flex flex-col justify-center p-7 sm:p-8">
            <IconTile icon={Check} tone="mint" />
            <h3 className="mt-5 font-display text-xl font-semibold text-navy-900">
              Growing carefully
            </h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-sand-700">
              As Pawside adds caregivers, every one of them will be background-checked, pet first aid
              certified, and trained on your pet&apos;s written profile before their first visit. We
              would rather turn down work than send someone your pet doesn&apos;t know.
            </p>
            <p className="mt-5 text-[0.875rem] text-sand-600">
              Interested in working with us?{" "}
              <a href="/careers" className="link-underline font-medium text-navy-900">
                See open roles
              </a>
            </p>
          </Card>
        </div>
      </Section>

      <CtaSection
        eyebrow="Say hello"
        title={
          <>
            Let&apos;s meet your pet
            <br />
            before anything else.
          </>
        }
        description={`${site.policies.meetAndGreet} — about twenty minutes at your home, no obligation, and the fastest way to know if we're the right fit.`}
        primaryLabel="Book Pet Care"
        secondaryLabel="Ask a question"
        secondaryHref="/contact"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]),
          ),
        }}
      />
    </>
  );
}
