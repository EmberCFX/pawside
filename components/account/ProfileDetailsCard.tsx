"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ProfileDetailsForm } from "@/components/account/ProfileDetailsForm";

function Value({ value, empty }: { value: string; empty: string }) {
  if (value.trim()) {
    return <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-navy-800">{value}</dd>;
  }
  return <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-sand-500">{empty}</dd>;
}

export function ProfileDetailsCard({
  firstName,
  lastName,
  email,
  phone,
  address,
  entryInstructions,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  entryInstructions: string;
}) {
  const [editing, setEditing] = useState(false);

  const details = [
    { label: "First name", value: firstName },
    { label: "Last name", value: lastName },
    { label: "Email", value: email },
    { label: "Phone", value: phone },
    { label: "Service address", value: address },
    { label: "Entry instructions", value: entryInstructions },
  ];

  return (
    <section aria-labelledby="details-heading">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="details-heading" className="font-display text-xl font-semibold text-navy-900">
          Your details
        </h2>
        {editing ? null : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-button bg-white px-3.5 py-2 text-[0.8125rem] font-medium text-navy-900 ring-1 ring-inset ring-sand-800/10 transition-all hover:ring-sand-800/25"
          >
            Edit details
          </button>
        )}
      </div>

      <Card className="mt-4 p-6 sm:p-7">
        {editing ? (
          <ProfileDetailsForm
            firstName={firstName}
            lastName={lastName}
            phone={phone}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {details.map((detail) => (
              <div key={detail.label}>
                <dt className="text-[0.6875rem] font-semibold uppercase text-sand-500">
                  {detail.label}
                </dt>
                <Value
                  value={detail.value}
                  empty={
                    detail.label === "Email"
                      ? "—"
                      : detail.label === "Service address" || detail.label === "Entry instructions"
                        ? "Fills in from your next booking"
                        : "Not added yet"
                  }
                />
              </div>
            ))}
          </dl>
        )}
      </Card>
    </section>
  );
}
