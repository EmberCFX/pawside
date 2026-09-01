import { cn } from "@/lib/utils";

/**
 * Pawside logo.
 *
 * The dog-and-cat linework is continuous, hand-drawn line art — a hand-written
 * vector trace would drift from the real artwork, so the mark renders from a
 * transparent PNG generated out of the master file by scripts/process-logo.mjs.
 * Two color variants are pre-rendered (navy ink for light surfaces, off-white
 * ink for navy surfaces) so nothing ever sits in a black box.
 *
 * The wordmark is set as live text in the display face (Poppins), which keeps it
 * crisp at any size, searchable, and accessible.
 *
 *   <Logo />                              horizontal lockup, light surface
 *   <Logo variant="full" theme="dark" />  stacked lockup with tagline
 *   <Logo variant="mark" />               heart + animals only
 *   <Logo variant="wordmark" />           text only
 */
export type LogoVariant = "full" | "horizontal" | "mark" | "wordmark";
export type LogoTheme = "light" | "dark";

interface LogoProps {
  variant?: LogoVariant;
  /** "light" = navy ink for light surfaces. "dark" = off-white ink for navy surfaces. */
  theme?: LogoTheme;
  /** Rendered height of the mark in pixels. The wordmark scales with it. */
  size?: number;
  /** Show the "— PET SERVICES —" tagline on the horizontal lockup. */
  withTagline?: boolean;
  className?: string;
  /** Set when another element already labels the logo (e.g. a home link). */
  "aria-hidden"?: boolean;
  priority?: boolean;
}

const MARK_ASPECT = 492 / 393;
const LOCKUP_ASPECT = 792 / 640;

export function Logo({
  variant = "horizontal",
  theme = "light",
  size = 34,
  withTagline = false,
  className,
  priority,
  ...rest
}: LogoProps) {
  const markSrc =
    theme === "dark" ? "/brand/pawside-mark-on-dark.png" : "/brand/pawside-mark.png";
  const lockupSrc =
    theme === "dark" ? "/brand/pawside-logo-on-dark.png" : "/brand/pawside-logo.png";
  const inkClass = theme === "dark" ? "text-navy-50" : "text-navy-900";

  if (variant === "full") {
    const height = size * 3.2;
    return (
      <img
        src={lockupSrc}
        alt="Pawside Pet Services"
        width={Math.round(height * LOCKUP_ASPECT)}
        height={Math.round(height)}
        className={cn("w-auto shrink-0", className)}
        style={{ height, width: "auto" }}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        {...rest}
      />
    );
  }

  if (variant === "mark") {
    return (
      <img
        src={markSrc}
        alt="Pawside"
        width={Math.round(size * MARK_ASPECT)}
        height={size}
        className={cn("w-auto shrink-0", className)}
        style={{ height: size, width: "auto" }}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        {...rest}
      />
    );
  }

  if (variant === "wordmark") {
    return (
      <span className={cn("inline-flex flex-col", className)} {...rest}>
        <Wordmark size={size} inkClass={inkClass} />
        {withTagline ? <Tagline theme={theme} /> : null}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} {...rest}>
      <img
        src={markSrc}
        alt=""
        width={Math.round(size * MARK_ASPECT)}
        height={size}
        className="w-auto shrink-0"
        style={{ height: size, width: "auto" }}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
      <span className="inline-flex flex-col justify-center">
        <Wordmark size={size} inkClass={inkClass} />
        {withTagline ? <Tagline theme={theme} /> : null}
      </span>
    </span>
  );
}

function Wordmark({ size, inkClass }: { size: number; inkClass: string }) {
  return (
    <span
      className={cn(
        // Lowercase, geometric, and slightly tightened to match the drawn wordmark.
        "font-display font-semibold leading-none tracking-[-0.02em]",
        inkClass,
      )}
      style={{ fontSize: `${size * 0.82}px` }}
    >
      pawside
    </span>
  );
}

function Tagline({ theme }: { theme: LogoTheme }) {
  return (
    <span
      className={cn(
        "mt-1 text-[0.5rem] font-semibold uppercase leading-none tracking-[0.24em]",
        theme === "dark" ? "text-mint-400" : "text-mint-600",
      )}
    >
      Pet Services
    </span>
  );
}
