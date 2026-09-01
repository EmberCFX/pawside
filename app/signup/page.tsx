import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { Container } from "@/components/ui/Layout";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Create account",
  description: "Create a Pawside account to book and manage pet care.",
  path: "/signup",
  noIndex: true,
});

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = (Array.isArray(params.next) ? params.next[0] : params.next) || "/account";

  return (
    <div className="bg-canvas py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-md rounded-panel border border-navy-900/8 bg-white p-8 shadow-soft">
          <p className="eyebrow">Account</p>
          <h1 className="mt-3 font-display text-display-xs font-semibold text-navy-900">
            Create your account
          </h1>
          <p className="mt-2 text-[0.9375rem] text-sand-700">
            Save pet profiles, book visits, and see photo updates in one place.
          </p>
          <div className="mt-8">
            <AuthForm mode="signup" next={next} />
          </div>
        </div>
      </Container>
    </div>
  );
}
