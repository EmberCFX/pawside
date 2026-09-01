"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function BookingStatusForm({
  bookingNumber,
  status,
  paymentStatus,
}: {
  bookingNumber: string;
  status: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState(status);
  const [nextPayment, setNextPayment] = useState(paymentStatus);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async () => {
    setBusy(true);
    setMessage(null);
    const response = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingNumber,
        status: nextStatus,
        payment_status: nextPayment,
      }),
    });
    setBusy(false);
    if (!response.ok) {
      setMessage("Couldn’t save. Try again.");
      return;
    }
    setMessage("Saved.");
    router.refresh();
  };

  return (
    <div className="mt-4 flex flex-col gap-3">
      <label className="text-[0.8125rem] font-medium text-navy-800">
        Visit status
        <select
          className="mt-1.5 w-full rounded-button bg-white px-3 py-2.5 ring-1 ring-inset ring-navy-900/12"
          value={nextStatus}
          onChange={(event) => setNextStatus(event.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </label>
      <label className="text-[0.8125rem] font-medium text-navy-800">
        Payment
        <select
          className="mt-1.5 w-full rounded-button bg-white px-3 py-2.5 ring-1 ring-inset ring-navy-900/12"
          value={nextPayment}
          onChange={(event) => setNextPayment(event.target.value)}
        >
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>
      </label>
      <Button type="button" onClick={save} disabled={busy}>
        {busy ? "Saving…" : "Save"}
      </Button>
      {message ? <p className="text-[0.8125rem] text-sand-700">{message}</p> : null}
    </div>
  );
}
