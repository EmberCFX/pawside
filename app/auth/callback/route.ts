import { NextResponse } from "next/server";
import { sendSignupConfirmedEmailOnce } from "@/lib/email";
import { postAuthPath } from "@/lib/env";
import { createUserSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  let email: string | undefined;

  if (code) {
    const supabase = await createUserSupabase();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
      const { data } = await supabase.auth.getUser();
      email = data.user?.email;
      if (data.user) {
        const createdAt = new Date(data.user.created_at).getTime();
        const isNewAccount = !Number.isNaN(createdAt) && Date.now() - createdAt < 24 * 60 * 60 * 1000;
        if (isNewAccount) {
          try {
            await sendSignupConfirmedEmailOnce(data.user);
          } catch (err) {
            console.warn("[email] signup welcome failed", err);
          }
        }
      }
    }
  }

  return NextResponse.redirect(new URL(postAuthPath(email, next), origin));
}
