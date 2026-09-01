import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value = 5,
  size = "md",
  onDark,
  className,
  label,
}: {
  value?: number;
  size?: "sm" | "md";
  onDark?: boolean;
  className?: string;
  /** Accessible label, e.g. "Rated 5 out of 5". */
  label?: string;
}) {
  const dimension = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={label ?? `Rated ${value} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            dimension,
            index < Math.round(value)
              ? onDark
                ? "fill-mint-400 text-mint-400"
                : "fill-mint-500 text-mint-500"
              : onDark
                ? "text-white/25"
                : "text-sand-300",
          )}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
