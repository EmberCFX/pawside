import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createServiceSupabase, createUserSupabase } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Sign in to update your profile." }, { status: 401 });
  }

  let body: { firstName?: string; lastName?: string; phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const firstName = (body.firstName ?? "").trim();
  const lastName = (body.lastName ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  if (!firstName) {
    return NextResponse.json({ ok: false, message: "Add your first name." }, { status: 422 });
  }

  const db = createServiceSupabase();
  if (!db) {
    return NextResponse.json({ ok: false, message: "Accounts aren’t connected yet." }, { status: 503 });
  }

  const { error } = await db.from("profiles").update({ full_name: fullName, phone }).eq("id", user.id);
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  const supabase = await createUserSupabase();
  await supabase?.auth.updateUser({ data: { full_name: fullName } });

  return NextResponse.json({ ok: true });
}
