import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/env";
import { createServiceSupabase, createUserSupabase } from "@/lib/supabase/server";

export async function getSessionUser() {
  const supabase = await createUserSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function requireUser(next = "/account") {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

export async function getProfile() {
  const user = await getSessionUser();
  if (!user) return null;

  const service = createServiceSupabase();
  const metaName =
    typeof user.user_metadata?.emergency_contact_name === "string"
      ? user.user_metadata.emergency_contact_name
      : "";
  const metaPhone =
    typeof user.user_metadata?.emergency_contact_phone === "string"
      ? user.user_metadata.emergency_contact_phone
      : "";

  if (!service) {
    return {
      id: user.id,
      email: user.email ?? "",
      full_name: (user.user_metadata?.full_name as string) ?? "",
      phone: "",
      emergency_contact_name: metaName,
      emergency_contact_phone: metaPhone,
      role: isAdminEmail(user.email) ? "admin" : "customer",
    };
  }

  const { data } = await service.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const role = data?.role === "admin" || isAdminEmail(user.email) ? "admin" : "customer";
  return {
    id: user.id,
    email: data?.email ?? user.email ?? "",
    full_name: data?.full_name ?? (user.user_metadata?.full_name as string) ?? "",
    phone: data?.phone ?? "",
    emergency_contact_name: data?.emergency_contact_name ?? metaName,
    emergency_contact_phone: data?.emergency_contact_phone ?? metaPhone,
    role,
  };
}

export async function requireAdmin() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/admin");
  if (profile.role !== "admin") redirect("/account");
  return profile;
}

export async function getAdminProfile() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") return null;
  return profile;
}
