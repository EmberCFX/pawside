export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

/** Primary desktop + mobile navigation. */
export const primaryNav: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Services",
    links: [
      { label: "Dog Walking", href: "/services/dog-walking" },
      { label: "Pet Sitting", href: "/services/pet-sitting" },
      { label: "Drop-In Visits", href: "/services/drop-in-visits" },
      { label: "Overnight Care", href: "/services/overnight-care" },
      { label: "Puppy Care", href: "/services/puppy-care" },
      { label: "Cat Care", href: "/services/cat-care" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Reviews", href: "/reviews" },
      { label: "Service Area", href: "/locations" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Policies", href: "/policies" },
      { label: "Cancellation", href: "/policies/cancellation" },
      { label: "Pet Safety", href: "/policies/pet-safety" },
      { label: "Pawside+", href: "/pricing#membership" },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Terms", href: "/policies/terms" },
];

/** Signed-in dashboard navigation. */
export const accountNav: NavLink[] = [
  { label: "Dashboard", href: "/account" },
  { label: "Visits", href: "/account/visits" },
  { label: "Pets", href: "/account/pets" },
  { label: "Messages", href: "/account/messages" },
  { label: "Membership", href: "/account/membership" },
  { label: "Billing", href: "/account/billing" },
  { label: "Profile", href: "/account/profile" },
];
