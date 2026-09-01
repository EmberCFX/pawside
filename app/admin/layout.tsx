import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Admin",
  description: "Pawside operations",
  path: "/admin",
  noIndex: true,
});

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/promos", label: "Promos" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin();

  return (
    <div className="min-h-[70vh] bg-canvas pb-20 pt-10 sm:pt-14">
      <div className="mx-auto max-w-shell px-5 sm:px-7 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Operations</p>
            <h1 className="mt-3 font-display text-display-xs font-semibold text-navy-900">
              Admin
            </h1>
            <p className="mt-2 text-[0.9375rem] text-sand-700">Signed in as {profile.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-button px-3 py-2 text-[0.875rem] text-sand-700 hover:bg-white hover:text-navy-900"
            >
              Sign out
            </button>
          </form>
        </div>

        <nav className="mt-8 flex gap-2" aria-label="Admin">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-button bg-white px-3.5 py-2 text-[0.875rem] font-medium text-navy-900 ring-1 ring-inset ring-sand-800/10 hover:bg-navy-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
