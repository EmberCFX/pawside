import type { Metadata } from "next";
import { AccountShell } from "@/components/dashboard/AccountShell";
import { getProfile, requireUser } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Your Account",
  description: "Manage visits, pets, membership, and billing.",
  path: "/account",
  noIndex: true,
});

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireUser("/account");
  const profile = await getProfile();
  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <AccountShell
      firstName={firstName}
      email={profile?.email ?? ""}
      isAdmin={profile?.role === "admin"}
    >
      {children}
    </AccountShell>
  );
}
