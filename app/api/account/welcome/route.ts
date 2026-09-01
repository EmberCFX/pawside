import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { sendSignupConfirmedEmailOnce } from "@/lib/email";
import { createServiceSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (user?.email) {
    try {
      await sendSignupConfirmedEmailOnce(user);
    } catch (err) {
      console.warn("[email] signup welcome failed", err);
      return NextResponse.json({ ok: false, message: "Couldn’t send the welcome email." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  let body: { email?: string; name?: string } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ ok: false, message: "Sign in to finish signup." }, { status: 401 });
  }

  const db = createServiceSupabase();
  if (!db) {
    return NextResponse.json({ ok: false, message: "Accounts aren’t connected yet." }, { status: 503 });
  }

  const { data: profile } = await db
    .from("profiles")
    .select("id, email, full_name, created_at")
    .eq("email", email)
    .maybeSingle();

  if (!profile?.id) {
    return NextResponse.json({ ok: false, message: "Sign in to finish signup." }, { status: 401 });
  }

  const ageMs = Date.now() - new Date(profile.created_at).getTime();
  if (Number.isNaN(ageMs) || ageMs > 15 * 60 * 1000) {
    return NextResponse.json({ ok: false, message: "Sign in to finish signup." }, { status: 401 });
  }

  try {
    await sendSignupConfirmedEmailOnce({
      id: profile.id,
      email: profile.email,
      user_metadata: { full_name: body.name?.trim() || profile.full_name || "" },
    });
  } catch (err) {
    console.warn("[email] signup welcome failed", err);
    return NextResponse.json({ ok: false, message: "Couldn’t send the welcome email." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
