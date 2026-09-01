import { Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { messages } from "@/data/account";
import { cn } from "@/lib/utils";

export default function AccountMessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-navy-900">Messages</h2>
        <p className="mt-1.5 text-[0.9375rem] text-sand-700">
          Schedule changes and anything about a visit in progress are still fastest by text.
        </p>
      </div>

      <Card className="divide-y divide-sand-800/8 p-0">
        {messages.map((message) => (
          <article key={message.id} className="flex gap-4 p-5 sm:p-6">
            <span
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 text-[0.875rem] font-semibold text-white"
              aria-hidden="true"
            >
              {message.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <h3
                  className={cn(
                    "text-[0.9375rem] text-navy-900",
                    message.unread ? "font-semibold" : "font-medium",
                  )}
                >
                  {message.from}
                  {message.unread ? (
                    <span className="ml-2 inline-flex h-1.5 w-1.5 rounded-full bg-mint-500 align-middle">
                      <span className="sr-only">Unread</span>
                    </span>
                  ) : null}
                </h3>
                <time className="shrink-0 text-[0.75rem] text-sand-500">{message.date}</time>
              </div>
              <p className="mt-1.5 text-[0.875rem] leading-relaxed text-sand-700">
                {message.preview}
              </p>
            </div>
          </article>
        ))}
      </Card>

      <Card className="p-5 sm:p-6">
        <label htmlFor="message-reply" className="text-[0.8125rem] font-medium text-navy-800">
          Send a message
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <textarea
            id="message-reply"
            rows={3}
            placeholder="Quick question about Thursday's walk…"
            className="min-w-0 flex-1 rounded-button bg-white px-3.5 py-2.5 text-[0.9375rem] ring-1 ring-inset ring-sand-800/12 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-mint-600"
          />
          <button
            type="button"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-end rounded-button bg-navy-900 px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-navy-800"
          >
            <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Send
          </button>
        </div>
        <p className="mt-3 text-xs text-sand-600">
          Messaging is a UI preview — connect it to your messaging provider in{" "}
          <span className="font-medium text-navy-800">lib/api.ts</span>.
        </p>
      </Card>
    </div>
  );
}
