import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Buttons.
 *
 * primary   navy fill, white text — the booking CTA everywhere
 * secondary white with a dark hairline border
 * accent    mint, used sparingly for a single emphasis moment per screen
 * inverse   white fill for navy sections
 * ghost     text only, for tertiary actions
 *
 * `withArrow` adds the arrow-nudge microinteraction shared by every CTA.
 */
export type ButtonVariant = "primary" | "secondary" | "accent" | "inverse" | "ghost" | "outline-inverse";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-button font-medium " +
  "transition-all duration-300 ease-brand disabled:pointer-events-none disabled:opacity-45 " +
  "active:translate-y-px select-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-navy-900 text-white shadow-soft hover:bg-navy-800 hover:shadow-lift focus-visible:outline-navy-700",
  secondary:
    "bg-white text-navy-900 ring-1 ring-inset ring-navy-900/14 hover:ring-navy-900/28 hover:bg-sand-50 hover:shadow-soft",
  accent:
    "bg-mint-500 text-navy-950 shadow-mint hover:bg-mint-400 hover:shadow-lift",
  inverse:
    "bg-white text-navy-900 shadow-float hover:bg-navy-50",
  "outline-inverse":
    "text-white ring-1 ring-inset ring-white/25 hover:ring-white/50 hover:bg-white/8",
  ghost: "text-navy-900 hover:bg-navy-900/6",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] px-7 text-base",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  withArrow?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;
type LinkProps = CommonProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children" | "href"
  >;

function content(children: React.ReactNode, withArrow?: boolean) {
  return (
    <>
      <span className="relative">{children}</span>
      {withArrow ? (
        <ArrowRight
          className="relative h-4 w-4 shrink-0 transition-transform duration-300 ease-brand group-hover:translate-x-1"
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  withArrow,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...props}
    >
      {content(children, withArrow)}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  withArrow,
  fullWidth,
  className,
  children,
  href,
  ...props
}: LinkProps) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);

  if (!isInternal) {
    return (
      <a className={classes} href={href} {...props}>
        {content(children, withArrow)}
      </a>
    );
  }

  return (
    <Link className={classes} href={href} {...props}>
      {content(children, withArrow)}
    </Link>
  );
}
