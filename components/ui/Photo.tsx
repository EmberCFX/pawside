"use client";

import { useState } from "react";
import Image from "next/image";
import { getMedia, type MediaSlot, type MediaTone } from "@/data/media";
import { cn } from "@/lib/utils";

/**
 * Every photograph on the site renders through this component.
 *
 * When a slot in data/media.ts has a `src`, it renders an optimized next/image.
 * Until then it renders an on-brand placeholder built from the logo's own
 * language — a soft tonal wash plus the heart-line motif at low opacity. No
 * network request, no stock-photo cliché, and unmistakably a placeholder.
 *
 * Swapping in real photography is a data edit, never a component edit.
 */
const toneClasses: Record<MediaTone, string> = {
  cream: "bg-gradient-to-br from-cream via-sand-100 to-navy-50",
  sand: "bg-gradient-to-br from-sand-100 via-sand-200 to-navy-100",
  mint: "bg-gradient-to-br from-mint-50 via-mint-100 to-navy-50",
  navy: "bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950",
};

interface PhotoProps {
  /** Key from data/media.ts. */
  slot: string;
  className?: string;
  /** Tailwind aspect utility, e.g. "aspect-[4/5]". Omit when the parent sets height. */
  aspect?: string;
  priority?: boolean;
  sizes?: string;
  /** Overlay a soft navy scrim so overlaid text stays legible. */
  scrim?: boolean;
  rounded?: string;
}

export function Photo({
  slot,
  className,
  aspect,
  priority,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px",
  scrim,
  rounded = "rounded-panel",
}: PhotoProps) {
  const media = getMedia(slot);
  const [failed, setFailed] = useState(false);

  if (!media) {
    // A missing key is a content bug, not a runtime error — fail visibly but quietly.
    return (
      <div
        className={cn("bg-sand-100", rounded, aspect, className)}
        role="presentation"
        data-missing-media-slot={slot}
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden", rounded, aspect, className)}>
      {media.src && !failed ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <PhotoPlaceholder media={media} />
      )}
      {scrim ? (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/12 to-transparent"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}

function PhotoPlaceholder({ media }: { media: MediaSlot }) {
  const onNavy = media.tone === "navy";

  return (
    <div
      className={cn("absolute inset-0", toneClasses[media.tone])}
      role="img"
      aria-label={media.alt}
    >
      {/* Soft light bloom, so large placeholders don't read as flat blocks. */}
      <div
        className={cn(
          "absolute inset-0",
          onNavy
            ? "bg-[radial-gradient(70%_60%_at_25%_15%,rgba(54,206,193,0.22),transparent_70%)]"
            : "bg-[radial-gradient(70%_60%_at_25%_15%,rgba(255,255,255,0.85),transparent_70%)]",
        )}
        aria-hidden="true"
      />

      {media.motif === "duo" ? (
        <Image
          src={onNavy ? "/brand/pawside-mark-on-dark.png" : "/brand/pawside-mark.png"}
          alt=""
          width={492}
          height={393}
          aria-hidden="true"
          className={cn(
            "absolute left-1/2 top-1/2 w-[52%] max-w-[280px] -translate-x-1/2 -translate-y-1/2",
            onNavy ? "opacity-[0.14]" : "opacity-[0.10]",
          )}
        />
      ) : null}

      {media.motif === "heart" ? <HeartMotif onNavy={onNavy} /> : null}

      {/* Hairline frame keeps the placeholder feeling composed. */}
      <div
        className={cn(
          "absolute inset-0 ring-1 ring-inset",
          onNavy ? "ring-white/10" : "ring-navy-900/8",
        )}
        aria-hidden="true"
      />
    </div>
  );
}

/** The logo's heart arc, abstracted into a large background line. */
function HeartMotif({ onNavy }: { onNavy: boolean }) {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      aria-hidden="true"
      className={cn(
        "absolute left-1/2 top-1/2 h-[70%] -translate-x-1/2 -translate-y-1/2",
        onNavy ? "text-mint-400/25" : "text-mint-600/20",
      )}
    >
      <path
        d="M100 158C100 158 22 108 22 62C22 36 42 18 64 18C80 18 92 26 100 40C108 26 120 18 136 18C158 18 178 36 178 62C178 108 100 158 100 158Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Circular pet avatar built on the same media registry. */
export function PetAvatar({
  slot,
  name,
  size = 44,
  className,
}: {
  slot?: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const media = slot ? getMedia(slot) : undefined;
  const initial = name.trim().charAt(0).toUpperCase();
  const [failed, setFailed] = useState(false);

  if (media?.src && !failed) {
    return (
      <Image
        src={media.src}
        alt={media.alt}
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full object-cover ring-1 ring-navy-900/8", className)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-navy-50 font-display font-semibold text-navy-800 ring-1 ring-navy-900/8",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
