"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";

export function PromoForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [firstTimeOnly, setFirstTimeOnly] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          label,
          type,
          value: Number(value),
          maxRedemptions: maxRedemptions ? Number(maxRedemptions) : undefined,
          expiresAt: expiresAt || undefined,
          firstTimeOnly,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "Couldn’t create that promo.");
      }
      setCode("");
      setLabel("");
      setValue("");
      setMaxRedemptions("");
      setExpiresAt("");
      setFirstTimeOnly(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t create that promo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <TextField
        label="Code"
        name="code"
        required
        value={code}
        onChange={(event) => setCode(event.target.value.toUpperCase())}
        placeholder="SPRING15"
        hint="Customers type this at checkout. Letters and numbers only."
      />
      <TextField
        label="Label"
        name="label"
        required
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        placeholder="15% off spring walks"
      />
      <SelectField
        label="Discount type"
        name="type"
        required
        value={type}
        onChange={(event) => setType(event.target.value as "percentage" | "fixed")}
        options={[
          { value: "percentage", label: "Percent off" },
          { value: "fixed", label: "Fixed amount off" },
        ]}
      />
      <TextField
        label={type === "percentage" ? "Percent off" : "Amount off"}
        name="value"
        type="number"
        required
        min={type === "percentage" ? 1 : 1}
        max={type === "percentage" ? 100 : undefined}
        step={type === "percentage" ? 1 : 0.01}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={type === "percentage" ? "15" : "25"}
        hint={type === "percentage" ? "1–100" : "Dollars, like 25 for $25 off"}
      />
      <TextField
        label="Max uses"
        name="maxRedemptions"
        type="number"
        min={1}
        optional
        value={maxRedemptions}
        onChange={(event) => setMaxRedemptions(event.target.value)}
        placeholder="Unlimited"
      />
      <TextField
        label="Expires"
        name="expiresAt"
        type="date"
        optional
        value={expiresAt}
        onChange={(event) => setExpiresAt(event.target.value)}
      />
      <label className="sm:col-span-2 flex items-center gap-2.5 text-[0.875rem] text-navy-800">
        <input
          type="checkbox"
          checked={firstTimeOnly}
          onChange={(event) => setFirstTimeOnly(event.target.checked)}
          className="h-4 w-4 rounded border-sand-300 text-navy-900 focus:ring-mint-600"
        />
        First Stripe payment only
      </label>
      {error ? (
        <p className="sm:col-span-2 text-[0.875rem] text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Creating in Stripe
            </>
          ) : (
            "Add promo code"
          )}
        </Button>
      </div>
    </form>
  );
}
