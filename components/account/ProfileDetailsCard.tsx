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
  emergencyContactName,
  emergencyContactPhone,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  entryInstructions: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}) {
  const [editing, setEditing] = useState(false);

  const details = [
    { label: "First name", value: firstName, empty: "Not added yet" },
    { label: "Last name", value: lastName, empty: "Not added yet" },
    { label: "Email", value: email, empty: "—" },
    { label: "Phone", value: phone, empty: "Not added yet" },
    { label: "Service address", value: address, empty: "Fills in from your next booking" },
    { label: "Entry instructions", value: entryInstructions, empty: "Fills in from your next booking" },
    { label: "Emergency contact", value: emergencyContactName, empty: "Not added yet" },
    { label: "Emergency phone", value: emergencyContactPhone, empty: "Not added yet" },
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
            emergencyContactName={emergencyContactName}
            emergencyContactPhone={emergencyContactPhone}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {details.map((detail) => (
              <div key={detail.label}>
                <dt className="text-[0.6875rem] font-semibold uppercase text-sand-500">
                  {detail.label}
                </dt>
                <Value value={detail.value} empty={detail.empty} />
              </div>
            ))}
          </dl>
        )}
      </Card>
    </section>
  );
}
