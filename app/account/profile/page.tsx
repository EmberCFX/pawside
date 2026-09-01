import { Card } from "@/components/ui/Card";
import { currentCustomer } from "@/data/account";

const details = [
  { label: "First name", value: currentCustomer.firstName },
  { label: "Last name", value: currentCustomer.lastName },
  { label: "Email", value: currentCustomer.email },
  { label: "Phone", value: currentCustomer.phone },
  { label: "Service address", value: currentCustomer.address },
  { label: "Entry instructions", value: currentCustomer.entryInstructions },
];

const preferences = [
  {
    label: "Visit updates",
    description: "Text me when a caregiver arrives and when the visit report is ready.",
    enabled: true,
  },
  {
    label: "Schedule reminders",
    description: "Remind me the evening before each scheduled visit.",
    enabled: true,
  },
  {
    label: "Occasional news",
    description: "New services, seasonal availability, and the odd holiday note.",
    enabled: false,
  },
];

export default function AccountProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="details-heading">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="details-heading" className="font-display text-xl font-semibold text-navy-900">
            Your details
          </h2>
          <button
            type="button"
            className="rounded-button bg-white px-3.5 py-2 text-[0.8125rem] font-medium text-navy-900 ring-1 ring-inset ring-sand-800/10 transition-all hover:ring-sand-800/25"
          >
            Edit details
          </button>
        </div>

        <Card className="mt-4 p-6 sm:p-7">
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {details.map((detail) => (
              <div key={detail.label}>
                <dt className="text-[0.6875rem] font-semibold uppercase text-sand-500">
                  {detail.label}
                </dt>
                <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-navy-800">
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </section>

      <section aria-labelledby="notifications-heading">
        <h2
          id="notifications-heading"
          className="font-display text-xl font-semibold text-navy-900"
        >
          Notifications
        </h2>
        <Card className="mt-4 divide-y divide-sand-800/8 p-0">
          {preferences.map((preference) => (
            <div
              key={preference.label}
              className="flex items-start justify-between gap-5 p-5 sm:p-6"
            >
              <div>
                <p className="text-[0.9375rem] font-medium text-navy-900">{preference.label}</p>
                <p className="mt-1 text-[0.875rem] text-sand-600">{preference.description}</p>
              </div>
              <span
                role="switch"
                aria-checked={preference.enabled}
                aria-label={preference.label}
                tabIndex={0}
                className={`relative mt-1 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-600 focus-visible:ring-offset-2 ${
                  preference.enabled ? "bg-mint-600" : "bg-sand-300"
                }`}
              >
                <span
                  className={`mt-0.5 inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    preference.enabled ? "translate-x-[1.375rem]" : "translate-x-0.5"
                  }`}
                />
              </span>
            </div>
          ))}
        </Card>
      </section>

      <section aria-labelledby="security-heading">
        <h2 id="security-heading" className="font-display text-xl font-semibold text-navy-900">
          Security
        </h2>
        <Card className="mt-4 flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div>
            <p className="text-[0.9375rem] font-medium text-navy-900">Password</p>
            <p className="mt-1 text-[0.875rem] text-sand-600">Last changed 4 months ago</p>
          </div>
          <button
            type="button"
            className="rounded-button bg-white px-3.5 py-2 text-[0.8125rem] font-medium text-navy-900 ring-1 ring-inset ring-sand-800/10 transition-all hover:ring-sand-800/25"
          >
            Change password
          </button>
        </Card>
      </section>
    </div>
  );
}
