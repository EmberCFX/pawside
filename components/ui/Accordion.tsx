"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Accessible accordion.
 *
 * Native <button> headers with aria-expanded/aria-controls, so screen readers and
 * keyboard users get the expected behavior. Multiple panels may be open at once —
 * people comparing FAQ answers shouldn't have one close as another opens.
 */
export function Accordion({
  items,
  className,
  defaultOpenId,
}: {
  items: AccordionItem[];
  className?: string;
  defaultOpenId?: string;
}) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);
  const baseId = useId();
  const reduceMotion = useReducedMotion();

  const toggle = (id: string) =>
    setOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  return (
    <div className={cn("divide-y divide-sand-800/8 border-y border-sand-800/8", className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;

        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:text-navy-700"
              >
                <span className="font-display text-lg font-medium text-navy-900 sm:text-xl">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-all duration-300 ease-brand",
                    isOpen
                      ? "bg-navy-900 text-white ring-navy-900"
                      : "bg-white text-navy-700 ring-sand-800/12 group-hover:ring-mint-500/60",
                  )}
                  aria-hidden="true"
                >
                  <Plus
                    className={cn(
                      "h-4 w-4 transition-transform duration-300 ease-brand",
                      isOpen && "rotate-45",
                    )}
                    strokeWidth={2}
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  key="panel"
                  initial={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-prose pb-7 pr-10 text-[0.9375rem] leading-relaxed text-sand-700">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
