import { Card } from "@/components/ui/Card";
import { getAdminMessages } from "@/lib/admin";

export default async function AdminMessagesPage() {
  const { rows: messages, error } = await getAdminMessages();

  return (
    <div className="flex flex-col gap-4">
      {error ? (
        <Card className="p-6">
          <p className="font-medium text-navy-900">Couldn’t load messages.</p>
          <p className="mt-2 text-[0.9375rem] text-sand-700">{error}</p>
        </Card>
      ) : null}
      {messages.length === 0 && !error ? (
        <Card className="p-8 text-[0.9375rem] text-sand-600">No messages yet.</Card>
      ) : null}
      {messages.map((row) => (
        <Card key={row.id} className="p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-navy-900">{row.name}</h2>
            <p className="text-[0.8125rem] text-sand-500">
              {new Date(row.created_at).toLocaleString()}
            </p>
          </div>
          <p className="mt-1 text-[0.875rem] text-sand-700">
            {row.email}
            {row.phone ? ` · ${row.phone}` : ""}
            {row.service ? ` · ${row.service}` : ""}
          </p>
          <p className="mt-4 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-navy-800">
            {row.message}
          </p>
        </Card>
      ))}
    </div>
  );
}
