import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { Container } from "@/components/ui/Layout";
import { getSessionUser } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sign in",
  description: "Sign in to manage your Pawside visits and pets.",
  path: "/login",
  noIndex: true,
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = (Array.isArray(params.next) ? params.next[0] : params.next) || "/account";
  if (await getSessionUser()) redirect(next.startsWith("/") ? next : "/account");

  return (
    <div className="bg-canvas py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-md rounded-panel border border-sand-800/8 bg-white p-8 shadow-soft">
          <p className="eyebrow">Account</p>
          <h1 className="mt-3 font-display text-display-xs font-semibold text-navy-900">Welcome back</h1>
          <p className="mt-2 text-[0.9375rem] text-sand-700">
            Sign in to view bookings, pets, and receipts.
          </p>
          <div className="mt-8">
            <AuthForm mode="login" next={next} />
          </div>
        </div>
      </Container>
    </div>
  );
}
