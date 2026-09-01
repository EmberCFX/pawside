import { NextResponse } from "next/server";
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
    }
  }

  return NextResponse.redirect(new URL(postAuthPath(email, next), origin));
}
