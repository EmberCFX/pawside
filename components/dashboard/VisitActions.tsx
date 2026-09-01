"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function VisitActions({
  bookingId,
  bookingNumber,
}: {
  bookingId: string;
  bookingNumber?: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelVisit = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/account/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, bookingNumber }),
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.message || "Couldn’t cancel that visit.");
      }
      setConfirming(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t cancel that visit.");
    } finally {
      setBusy(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-[0.8125rem] text-navy-800">Cancel this visit?</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void cancelVisit()}
            className="rounded-button bg-navy-900 px-3.5 py-2 text-[0.8125rem] font-medium text-white transition-colors hover:bg-navy-800 disabled:opacity-45"
          >
            {busy ? "Cancelling…" : "Yes, cancel"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setConfirming(false);
              setError(null);
            }}
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

  return (
    <>
      <button
        type="button"
        className="rounded-button bg-white px-3.5 py-2 text-[0.8125rem] font-medium text-navy-900 ring-1 ring-inset ring-sand-800/10 transition-all hover:ring-sand-800/25"
      >
        Reschedule
      </button>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-button px-3.5 py-2 text-[0.8125rem] font-medium text-sand-600 transition-colors hover:bg-sand-100 hover:text-navy-900"
      >
        Cancel visit
      </button>
    </>
  );
}
