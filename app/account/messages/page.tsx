import { Card } from "@/components/ui/Card";
import { site } from "@/data/site";

export default function AccountMessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-navy-900">Messages</h2>
        <p className="mt-1.5 text-[0.9375rem] text-sand-700">
          Schedule changes and anything about a visit in progress are still fastest by text or email.
        </p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-[0.9375rem] text-sand-700">No messages yet.</p>
        <p className="mt-3 text-[0.875rem] text-sand-600">
          Reach us at{" "}
          <a href={site.contact.phoneHref} className="font-medium text-navy-900">
            {site.contact.phone}
          </a>{" "}
          or{" "}
          <a href={`mailto:${site.contact.email}`} className="font-medium text-navy-900">
            {site.contact.email}
          </a>
          .
        </p>
      </Card>
    </div>
  );
}
