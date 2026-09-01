"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Mobile sticky booking bar.
 *
 * Appears after the hero has scrolled past so it never competes with the hero's
 * own CTA, and hides on the booking flow and dashboard where it would be noise.
 */
export function MobileCta() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const suppressed = pathname.startsWith("/book") || pathname.startsWith("/account");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (suppressed) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className={cn(
            "fixed inset-x-0 bottom-0 z-40 border-t border-navy-900/8 bg-white/92 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden",
          )}
          initial={reduceMotion ? undefined : { y: 80 }}
          animate={reduceMotion ? undefined : { y: 0 }}
          exit={reduceMotion ? undefined : { y: 80 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[0.9375rem] font-semibold text-navy-900">
                Ready when you are
              </p>
              <p className="truncate text-xs text-sand-600">{site.policies.meetAndGreet}</p>
            </div>
            <ButtonLink href="/book" size="md" className="shrink-0">
              Book Pet Care
            </ButtonLink>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
