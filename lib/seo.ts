import type { Metadata } from "next";
import { faqs } from "@/data/faqs";
import { pricing } from "@/data/pricing";
import { serviceAreas } from "@/data/serviceAreas";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { trustStats } from "@/data/stats";
import type { Faq, Service, ServiceArea } from "@/types";

const TITLE_SUFFIX = `${site.name} · ${site.tagline}`;

/** Builds page metadata with canonical URL and OG/Twitter cards. */
export function buildMetadata({
  title,
  description,
  path = "/",
  noIndex,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  const fullTitle = path === "/" ? title : `${title} | ${TITLE_SUFFIX}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.legalName,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

/* ------------------------------------------------------------------ *
 * Structured data
 * ------------------------------------------------------------------ */

const BUSINESS_ID = `${site.url}/#business`;

/**
 * LocalBusiness for a mobile, in-home service. `areaServed` is generated from
 * data/serviceAreas.ts, so expanding to a new town updates the schema too.
 */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "PetStore"],
    "@id": BUSINESS_ID,
    name: site.legalName,
    alternateName: site.name,
    description: site.description,
    url: site.url,
    telephone: site.contact.phoneHref.replace(/^tel:/, ""),
    email: site.contact.email,
    image: `${site.url}/brand/pawside-logo.png`,
    logo: `${site.url}/brand/pawside-logo.png`,
    priceRange: "$$",
    currenciesAccepted: pricing.currency,
    paymentAccepted: "Credit Card, Debit Card",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.homeBase.city,
      addressRegion: site.homeBase.state,
      postalCode: site.homeBase.postalCode,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.homeBase.latitude,
      longitude: site.homeBase.longitude,
    },
    areaServed: serviceAreas
      .filter((area) => area.status !== "waitlist")
      .map((area) => ({
        "@type": "City",
        name: `${area.name}, ${area.state}`,
      })),
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: site.homeBase.latitude,
        longitude: site.homeBase.longitude,
      },
      geoRadius: site.homeBase.serviceRadiusMiles * 1609,
    },
    openingHoursSpecification: site.openingHoursSpec.map((spec) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: spec.days.map((day) => `https://schema.org/${day}`),
      opens: spec.opens,
      closes: spec.closes,
    })),
    sameAs: site.social.map((social) => social.href).filter(Boolean),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Pet care services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.longName,
          url: `${site.url}/services/${service.slug}`,
        },
      })),
    },
    /**
     * PLACEHOLDER RATING — remove or replace with verified review data before
     * launch. Publishing unearned aggregate ratings violates Google's policy.
     */
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: trustStats.averageRating,
      reviewCount: trustStats.reviewCount,
      bestRating: 5,
    },
  };
}

export function serviceSchema(service: Service) {
  const servicePricing = pricing.services.find((entry) => entry.slug === service.slug);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.longName,
    description: service.seo.description,
    serviceType: service.longName,
    url: `${site.url}/services/${service.slug}`,
    provider: { "@id": BUSINESS_ID },
    areaServed: serviceAreas
      .filter((area) => area.status !== "waitlist")
      .map((area) => ({ "@type": "City", name: `${area.name}, ${area.state}` })),
    audience: { "@type": "Audience", audienceType: "Pet owners" },
    offers: {
      "@type": "Offer",
      priceCurrency: pricing.currency,
      price: ((servicePricing?.startingAt ?? 0) / 100).toFixed(2),
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: ((servicePricing?.startingAt ?? 0) / 100).toFixed(2),
        priceCurrency: pricing.currency,
        valueAddedTaxIncluded: false,
      },
      availability: "https://schema.org/InStock",
      url: `${site.url}/book?service=${service.slug}`,
    },
  };
}

export function faqSchema(items: Faq[] = faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path === "/" ? "" : crumb.path}`,
    })),
  };
}

export function areaServedSchema(area: ServiceArea) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Pet Care in ${area.name}, ${area.state}`,
    description: area.blurb,
    provider: { "@id": BUSINESS_ID },
    areaServed: {
      "@type": "City",
      name: `${area.name}, ${area.state}`,
      containsPlace: area.neighborhoods.map((neighborhood) => ({
        "@type": "Place",
        name: neighborhood,
      })),
    },
    url: `${site.url}/locations/${area.slug}`,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.legalName,
    url: site.url,
    publisher: { "@id": BUSINESS_ID },
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/book`,
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      result: { "@type": "Reservation", name: "Pet care booking" },
    },
  };
}
