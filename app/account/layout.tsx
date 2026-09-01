import type { Metadata } from "next";
import { AccountShell } from "@/components/dashboard/AccountShell";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Your Account",
  description: "Manage visits, pets, membership, and billing.",
  path: "/account",
  noIndex: true,
});

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
