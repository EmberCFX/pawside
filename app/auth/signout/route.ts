import { NextResponse } from "next/server";
import { createUserSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createUserSupabase();
  if (supabase) {
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
