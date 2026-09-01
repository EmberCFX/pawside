import { Card } from "@/components/ui/Card";
import { ProfileDetailsCard } from "@/components/account/ProfileDetailsCard";
import { getAccountDetails } from "@/lib/account";
import { site } from "@/data/site";

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

export default async function AccountProfilePage() {
  const details = await getAccountDetails();

  return (
    <div className="flex flex-col gap-6">
      {details ? (
        <ProfileDetailsCard
          firstName={details.firstName}
          lastName={details.lastName}
          email={details.email}
          phone={details.phone}
          address={details.address}
          entryInstructions={details.entryInstructions}
          emergencyContactName={details.emergencyContactName}
          emergencyContactPhone={details.emergencyContactPhone}
        />
      ) : (
        <Card className="p-6 text-[0.9375rem] text-sand-700">
          Sign in to see your details.
        </Card>
      )}

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
            <p className="mt-1 text-[0.875rem] text-sand-600">
              Need a reset? Email {site.contact.email} and we&apos;ll send a new one.
            </p>
          </div>
          <a
            href={`mailto:${site.contact.email}?subject=Password%20reset`}
            className="rounded-button bg-white px-3.5 py-2 text-[0.8125rem] font-medium text-navy-900 ring-1 ring-inset ring-sand-800/10 transition-all hover:ring-sand-800/25"
          >
            Request reset
          </a>
        </Card>
      </section>
    </div>
  );
}
