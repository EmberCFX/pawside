"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";

export function ProfileDetailsForm({
  firstName,
  lastName,
  phone,
  onCancel,
}: {
  firstName: string;
  lastName: string;
  phone: string;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [first, setFirst] = useState(firstName);
  const [last, setLast] = useState(lastName);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: first, lastName: last, phone: phoneValue }),
      });
      const payload = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "Could not save those details.");
      }
      router.refresh();
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save those details.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <TextField
        label="First name"
        name="firstName"
        autoComplete="given-name"
        required
        value={first}
        onChange={(event) => setFirst(event.target.value)}
      />
      <TextField
        label="Last name"
        name="lastName"
        autoComplete="family-name"
        value={last}
        onChange={(event) => setLast(event.target.value)}
      />
      <TextField
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        className="sm:col-span-2"
        value={phoneValue}
        onChange={(event) => setPhoneValue(event.target.value)}
      />
      {error ? (
        <p className="sm:col-span-2 text-[0.875rem] text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <div className="sm:col-span-2 flex flex-wrap gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Saving
            </>
          ) : (
            "Save details"
          )}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
