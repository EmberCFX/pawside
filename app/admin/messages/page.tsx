import { Card } from "@/components/ui/Card";
import { createServiceSupabase } from "@/lib/supabase/server";

export default async function AdminMessagesPage() {
  const db = createServiceSupabase();
  const messages = db
    ? ((
        await db.from("contact_messages").select("*").order("created_at", { ascending: false })
      ).data ?? [])
    : [];

  return (
    <div className="flex flex-col gap-4">
      {messages.length === 0 ? (
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
