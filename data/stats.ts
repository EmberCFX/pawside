/**
 * PLACEHOLDER METRICS — do not publish as real figures.
 *
 * Every number the site displays as social proof lives here so it can be updated
 * in one place (or wired to a backend query) without hunting through JSX.
 */
export interface Stat {
  id: string;
  /** Numeric value used by the animated counter. */
  value: number;
  /** Rendered before the number, e.g. "$". */
  prefix?: string;
  /** Rendered after the number, e.g. "%" or "+". */
  suffix?: string;
  /** Decimal places for the counter. */
  decimals?: number;
  label: string;
  detail?: string;
}

export const socialProofStats: Stat[] = [
  {
    id: "rating",
    value: 5,
    decimals: 1,
    suffix: "",
    label: "Average rating",
    detail: "Across every review we've received",
  },
  {
    id: "pets",
    value: 180,
    suffix: "+",
    label: "Pets cared for",
    detail: "Dogs, cats, and a few rabbits",
  },
  {
    id: "walks",
    value: 2400,
    suffix: "+",
    label: "Walks & visits completed",
    detail: "Every one with a summary sent home",
  },
  {
    id: "repeat",
    value: 94,
    suffix: "%",
    label: "Repeat clients",
    detail: "Families who book us again",
  },
];

export const trustStats = {
  reviewCount: 127,
  averageRating: 5,
  yearsExperience: 8,
  responseMinutes: 45,
  onTimeRate: 99,
};
