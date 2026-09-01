export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://pawside.co";
}

export function opsEmail() {
  return process.env.OPS_EMAIL ?? "hello@pawside.co";
}

export function adminEmails() {
  const raw = process.env.ADMIN_EMAILS ?? "hello@pawside.co";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}

export function safeNextPath(next?: string | null) {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/account";
}

/** After login, send the ops inbox to /admin unless they asked for another in-app page. */
export function postAuthPath(email: string | null | undefined, next?: string | null) {
  const dest = safeNextPath(next);
  if (dest === "/account" && isAdminEmail(email)) return "/admin";
  return dest;
}

export function hasSupabase() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function hasStripe() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function hasResend() {
  return Boolean(process.env.RESEND_API_KEY);
}
