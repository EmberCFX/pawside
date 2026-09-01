import { NextResponse } from "next/server";
import { resolvePromoCode } from "@/lib/promos";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  const promo = await resolvePromoCode(code);
  if (!promo) {
    return NextResponse.json({ ok: false, message: "That code isn’t active." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, promo });
}
