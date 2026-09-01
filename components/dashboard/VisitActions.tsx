"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DatePicker } from "@/components/booking/DatePicker";
import { TimePicker } from "@/components/booking/TimePicker";

export function VisitActions({
  bookingId,
  bookingNumber,
  date,
  time,
  overnight = false,
}: {
  bookingId: string;
  bookingNumber?: string;
  date: string;
  time: string;
  overnight?: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "cancel" | "reschedule">("idle");
  const [nextDate, setNextDate] = useState(date);
  const [nextTime, setNextTime] = useState(time);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setMode("idle");
    setNextDate(date);
    setNextTime(time);
    setError(null);
  };

  const patchVisit = async (body: Record<string, string | undefined>) => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/account/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, bookingNumber, ...body }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.message || "Couldn’t update that visit.");
      }
      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t update that visit.");
    } finally {
      setBusy(false);
    }
  };

  if (mode === "cancel") {
    return (
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-[0.8125rem] text-navy-800">Cancel this visit?</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void patchVisit({ action: "cancel" })}
            className="rounded-button bg-navy-900 px-3.5 py-2 text-[0.8125rem] font-medium text-white transition-colors hover:bg-navy-800 disabled:opacity-45"
          >
            {busy ? "Cancelling…" : "Yes, cancel"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={reset}
            className="rounded-button px-3.5 py-2 text-[0.8125rem] font-medium text-sand-600 transition-colors hover:bg-sand-100 hover:text-navy-900"
          >
            Keep it
          </button>
        </div>
        {error ? (
          <p className="text-[0.8125rem] text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  if (mode === "reschedule") {
    const canSave = Boolean(nextDate && nextTime) && !busy;

    return (
      <div className="flex min-w-0 w-full flex-col gap-4">
        <p className="text-[0.8125rem] text-navy-800">Pick a new date and arrival window.</p>
        <DatePicker value={nextDate} onChange={setNextDate} />
        <TimePicker
          value={nextTime || null}
          onChange={setNextTime}
          overnight={overnight}
          name={`reschedule-${bookingId}`}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!canSave}
            onClick={() =>
              void patchVisit({ action: "reschedule", date: nextDate, time: nextTime })
            }
            className="rounded-button bg-navy-900 px-3.5 py-2 text-[0.8125rem] font-medium text-white transition-colors hover:bg-navy-800 disabled:opacity-45"
          >
            {busy ? "Saving…" : "Save new time"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={reset}
            className="rounded-button px-3.5 py-2 text-[0.8125rem] font-medium text-sand-600 transition-colors hover:bg-sand-100 hover:text-navy-900"
          >
            Never mind
          </button>
        </div>
        {error ? (
          <p className="text-[0.8125rem] text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setNextDate(date);
          setNextTime(time);
          setError(null);
          setMode("reschedule");
        }}
        className="rounded-button bg-white px-3.5 py-2 text-[0.8125rem] font-medium text-navy-900 ring-1 ring-inset ring-sand-800/10 transition-all hover:ring-sand-800/25"
      >
        Reschedule
      </button>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setMode("cancel");
        }}
        className="rounded-button px-3.5 py-2 text-[0.8125rem] font-medium text-sand-600 transition-colors hover:bg-sand-100 hover:text-navy-900"
      >
        Cancel visit
      </button>
    </>
  );
}
