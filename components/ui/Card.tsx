import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CardTone = "default" | "muted" | "cream" | "mint" | "inverse" | "outline";

const toneClasses: Record<CardTone, string> = {
  default: "bg-white ring-1 ring-sand-800/8 shadow-soft",
  muted: "bg-canvas ring-1 ring-sand-800/6",
  cream: "bg-cream ring-1 ring-sand-800/6",
  mint: "bg-mint-50 ring-1 ring-mint-500/20",
  inverse: "bg-navy-900 text-navy-50 ring-1 ring-white/10",
  outline: "bg-transparent ring-1 ring-sand-800/12",
};

export function Card({
  tone = "default",
  interactive,
  className,
  children,
  as: Tag = "div",
}: {
  tone?: CardTone;
  /** Adds the shared hover lift used by service and add-on cards. */
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
  as?: "div" | "article" | "li" | "label";
}) {
  return (
    <Tag
      className={cn(
        "relative rounded-card",
        toneClasses[tone],
        interactive &&
          "transition-all duration-300 ease-brand hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Badge({
  children,
  tone = "mint",
  className,
}: {
  children: React.ReactNode;
  tone?: "mint" | "navy" | "neutral" | "inverse" | "warn";
  className?: string;
}) {
  const tones = {
    mint: "bg-mint-50 text-mint-800 ring-mint-500/25",
    navy: "bg-navy-50 text-navy-800 ring-sand-800/10",
    neutral: "bg-sand-100 text-sand-700 ring-sand-900/8",
    inverse: "bg-white/10 text-white ring-white/20",
    warn: "bg-amber-50 text-amber-800 ring-amber-500/25",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Small icon tile used at the top of feature and service cards. */
export function IconTile({
  icon: Icon,
  tone = "navy",
  className,
  size = "md",
}: {
  icon: LucideIcon;
  tone?: "navy" | "mint" | "inverse";
  className?: string;
  size?: "sm" | "md";
}) {
  const tones = {
    navy: "bg-navy-50 text-navy-900 ring-sand-800/8",
    mint: "bg-mint-50 text-mint-700 ring-mint-500/20",
    inverse: "bg-white/10 text-mint-300 ring-white/15",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[14px] ring-1 ring-inset",
        size === "sm" ? "h-9 w-9" : "h-11 w-11",
        tones[tone],
        className,
      )}
    >
      <Icon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={1.75} aria-hidden="true" />
    </span>
  );
}
