import type { Metadata } from "next";
import { AddOnsSection } from "@/components/sections/AddOnsSection";
import { BookingEstimator } from "@/components/sections/BookingEstimator";
import { CtaSection } from "@/components/sections/CtaSection";
import { DifferenceSection } from "@/components/sections/DifferenceSection";
import { EmotionalSection } from "@/components/sections/EmotionalSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { MembershipPricing } from "@/components/sections/MembershipPricing";
import { PetProfilePreview } from "@/components/sections/PetProfilePreview";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { SocialProof } from "@/components/sections/SocialProof";
import { Testimonials } from "@/components/sections/Testimonials";
import { VisitReportSection } from "@/components/sections/VisitReportSection";
import { faqs, homepageFaqIds } from "@/data/faqs";
import { site } from "@/data/site";
import { buildMetadata, faqSchema } from "@/lib/seo";
import type { Faq } from "@/types";

export const metadata: Metadata = buildMetadata({
  title: `${site.name} — Care for them, even when you can't be there`,
  description:
    "Trusted pet sitting, dog walking, drop-in visits, and overnight care in the Pioneer Valley. Same caregiver, photo updates every visit, care built around your pet's routine.",
  path: "/",
});

export default function HomePage() {
  const homepageFaqs = homepageFaqIds
    .map((id) => faqs.find((faq) => faq.id === id))
    .filter((faq): faq is Faq => Boolean(faq));

  return (
    <>
      <Hero />
      <SocialProof />
      <ServicesGrid />
      <BookingEstimator />
      <HowItWorks />
      <DifferenceSection />
      <EmotionalSection />
      <MembershipPricing />
      <AddOnsSection />
      <PetProfilePreview />
      <VisitReportSection />
      <Testimonials limit={6} />
      <ServiceAreaSection />
      <FaqSection
        description="The things people ask before their first booking. If yours isn't here, just ask."
        items={homepageFaqs}
      />
      <CtaSection />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(homepageFaqs)) }}
      />
    </>
  );
}
