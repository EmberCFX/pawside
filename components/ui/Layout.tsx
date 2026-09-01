import { cn } from "@/lib/utils";

/** Consistent 1280px content shell with responsive gutters. */
export function Container({
  className,
  children,
  wide,
}: {
  className?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-7 lg:px-10",
        wide ? "max-w-wide" : "max-w-shell",
        className,
      )}
    >
      {children}
    </div>
  );
}

type SectionTone = "default" | "muted" | "cream" | "inverse";

const toneClasses: Record<SectionTone, string> = {
  default: "bg-white",
  muted: "bg-canvas",
  cream: "bg-cream",
  inverse: "surface-inverse text-navy-50",
};

/** Vertical rhythm wrapper. Section padding is the site's most important spacing decision. */
export function Section({
  id,
  tone = "default",
  className,
  containerClassName,
  children,
  wide,
  compact,
  as: Tag = "section",
}: {
  id?: string;
  tone?: SectionTone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  wide?: boolean;
  compact?: boolean;
  as?: "section" | "div" | "footer";
}) {
  return (
    <Tag
      id={id}
      className={cn(
        toneClasses[tone],
        compact ? "py-section-sm" : "py-section",
        "relative",
        className,
      )}
    >
      <Container wide={wide} className={containerClassName}>
        {children}
      </Container>
    </Tag>
  );
}

/** Mint eyebrow label mirroring the logo's "— PET SERVICES —" tagline. */
export function Eyebrow({
  children,
  className,
  withRules,
  onDark,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  withRules?: boolean;
  onDark?: boolean;
  as?: "p" | "span" | "div";
}) {
  return (
    <Tag
      className={cn(
        "eyebrow",
        withRules && "eyebrow-rule",
        onDark && "eyebrow-on-dark",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * Section heading block. `align="center"` is the default for full-width sections;
 * editorial sections use the left-aligned variant.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  onDark,
  className,
  headingLevel = 2,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
  headingLevel?: 1 | 2 | 3;
  children?: React.ReactNode;
}) {
  const Heading = `h${headingLevel}` as "h1" | "h2" | "h3";

  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow withRules={align === "center"} onDark={onDark} className="mb-5">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Heading
        className={cn(
          "text-display-sm sm:text-display-md lg:text-display-lg font-semibold",
          onDark ? "text-white" : "text-navy-900",
          align === "center" && "max-w-3xl",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "mt-5 text-lg leading-relaxed",
            onDark ? "text-navy-100/80" : "text-sand-700",
            align === "center" ? "max-w-2xl" : "max-w-xl",
          )}
        >
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}

/** Mint hairline divider echoing the heart-line motif. */
export function Hairline({ className }: { className?: string }) {
  return <div className={cn("hairline-mint w-full", className)} aria-hidden="true" />;
}
