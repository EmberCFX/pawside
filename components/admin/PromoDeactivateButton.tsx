"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PromoDeactivateButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/promos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const payload = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "Couldn’t turn that off.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t turn that off.");
      setBusy(false);
    }
  };

  return (
    <div className="text-right">
      <button
        type="button"
        disabled={busy}
        onClick={() => void onClick()}
        className="rounded-button px-3 py-1.5 text-[0.8125rem] font-medium text-sand-600 transition-colors hover:bg-sand-100 hover:text-navy-900 disabled:opacity-45"
      >
        {busy ? "Turning off…" : "Turn off"}
      </button>
      {error ? (
        <p className="mt-1 text-[0.75rem] text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
