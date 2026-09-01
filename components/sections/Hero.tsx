"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Camera, Check, MapPin, Timer } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Photo } from "@/components/ui/Photo";
import { Rating } from "@/components/ui/Rating";
import { site } from "@/data/site";
import { trustStats } from "@/data/stats";
import { cn } from "@/lib/utils";

/**
 * Hero.
 *
 * The floating cards over the photograph are the point: they show the product
 * (a walk that gets logged, a visit that gets summarized, photos that arrive)
 * instead of describing it. Values are illustrative sample data.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();

  const float = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18, scale: 0.97 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative overflow-hidden bg-white pt-10 sm:pt-14 lg:pt-20">
      {/* Barely-there brand wash. Keeps the hero warm without a gradient blowout. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_-5%,rgba(54,206,193,0.10),transparent_70%),radial-gradient(50%_40%_at_10%_0%,rgba(1,28,53,0.045),transparent_70%)]"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="grid items-center gap-14 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24">
          <div className="max-w-xl">
            <motion.div {...(reduceMotion ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } })}>
              <Eyebrow withRules>Local pet care you can trust</Eyebrow>
            </motion.div>

            <motion.h1
              className="mt-6 text-display-md font-semibold text-navy-900 sm:text-display-lg lg:text-display-xl"
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] },
                  })}
            >
              Care for them,
              <br />
              even when you
              <br className="hidden sm:block" /> can&apos;t be there.
            </motion.h1>

            <motion.p
              className="mt-6 max-w-lg text-lg leading-relaxed text-sand-700"
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 16 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.7, delay: 0.14, ease: [0.22, 1, 0.36, 1] },
                  })}
            >
              Dog walks, pet sitting, drop-ins, and personalized care from someone who treats your
              pets like their own.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 16 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
                  })}
            >
              <ButtonLink href="/book" size="lg" withArrow>
                Book Pet Care
              </ButtonLink>
              <ButtonLink href="/services" size="lg" variant="secondary">
                Explore Services
              </ButtonLink>
            </motion.div>

            <motion.ul
              className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { duration: 0.6, delay: 0.32 },
                  })}
            >
              {site.trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-2 text-[0.875rem] text-sand-700">
                  <Check className="h-4 w-4 shrink-0 text-mint-600" strokeWidth={2.5} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </motion.ul>

            <motion.div
              className="mt-8 flex items-center gap-3 border-t border-sand-800/8 pt-6"
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { duration: 0.6, delay: 0.4 },
                  })}
            >
              <Rating value={5} label={`Rated ${trustStats.averageRating} out of 5`} />
              <p className="text-sm text-sand-700">
                <span className="font-semibold text-navy-900">{trustStats.averageRating}.0</span> from{" "}
                {trustStats.reviewCount} local reviews
              </p>
            </motion.div>
          </div>

          {/* Photograph + product proof ----------------------------------- */}
          <div className="relative">
            <motion.div
              className="relative"
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0, scale: 0.97 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  })}
            >
              <Photo
                slot="hero-primary"
                aspect="aspect-[4/5]"
                rounded="rounded-feature"
                priority
                className="shadow-lift"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </motion.div>

            {/* Walk completed */}
            <motion.div
              className="absolute left-3 top-4 w-[min(18.75rem,calc(100%-1.5rem))] rounded-card border border-sand-800/8 bg-white/95 p-5 shadow-float backdrop-blur-md sm:-left-8 sm:top-8 sm:w-[250px] sm:p-4"
              {...float(0.5)}
            >
              <div className="flex items-center gap-2">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-mint-500" />
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-mint-500" />
                </span>
                <p className="text-[0.875rem] font-semibold text-navy-900 sm:text-[0.8125rem]">Walk completed</p>
              </div>
              <div className="mt-4 flex items-end justify-between gap-6 sm:mt-3 sm:justify-start sm:gap-5">
                <div>
                  <p className="flex items-center gap-1.5 text-[0.6875rem] uppercase text-sand-500">
                    <Timer className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                    Time
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold leading-none text-navy-900 tabular">
                    32<span className="ml-1 text-sm font-medium text-sand-600">min</span>
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-[0.6875rem] uppercase text-sand-500">
                    <MapPin className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                    Distance
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold leading-none text-navy-900 tabular">
                    1.4<span className="ml-1 text-sm font-medium text-sand-600">mi</span>
                  </p>
                </div>
              </div>
              {/* Sparkline standing in for the walk's GPS route. */}
              <svg viewBox="0 0 200 32" className="mt-3 h-6 w-full text-mint-500" fill="none" aria-hidden="true">
                <path
                  d="M2 26C18 26 26 8 44 8s24 16 42 16 24-18 42-18 26 14 44 14 26-6 26-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Visit update */}
            <motion.div
              className="absolute left-3 right-3 top-[48%] -translate-y-1/2 rounded-card border border-sand-800/8 bg-white/95 p-5 shadow-float backdrop-blur-md sm:left-auto sm:-right-6 sm:top-1/2 sm:w-[268px] sm:-translate-y-8 sm:p-4"
              {...float(0.68)}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.875rem] font-semibold text-navy-900 sm:text-[0.8125rem]">Visit Update</p>
                <span className="shrink-0 text-[0.6875rem] font-medium text-sand-500">5:42 PM</span>
              </div>
              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-sand-700 sm:mt-2 sm:text-[0.8125rem]">
                Luna ate dinner and had some playtime. Fresh water, litter scooped, blinds closed.
              </p>
              <div className="mt-4 flex items-center gap-2.5 border-t border-sand-800/8 pt-3.5 sm:mt-3 sm:pt-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-[0.625rem] font-semibold text-white">
                  C
                </span>
                <p className="text-xs text-sand-600">Case · your caregiver</p>
              </div>
            </motion.div>

            {/* Photo update */}
            <motion.div
              className="absolute bottom-4 left-3 flex items-center gap-3.5 rounded-card border border-sand-800/8 bg-white/95 px-4 py-3.5 shadow-float backdrop-blur-md sm:bottom-6 sm:left-2 sm:gap-3 sm:py-3 sm:pl-3 sm:pr-4"
              {...float(0.86)}
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-mint-50 text-mint-700 ring-1 ring-inset ring-mint-500/20 sm:h-9 sm:w-9">
                <Camera className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[0.875rem] font-semibold leading-tight text-navy-900 sm:text-[0.8125rem]">
                  Photo Update
                </p>
                <p className="mt-0.5 text-xs leading-tight text-mint-700">Delivered · 3 photos</p>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Mint hairline closing the hero, echoing the logo's tagline rules. */}
      <div className={cn("mx-auto h-px max-w-shell", "hairline-mint")} aria-hidden="true" />
    </section>
  );
}
