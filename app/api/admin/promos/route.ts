import { NextResponse } from "next/server";
import { getAdminProfile } from "@/lib/auth";
import { createStripePromo, deactivateStripePromo, listStripePromos } from "@/lib/promos";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminProfile();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const promos = await listStripePromos();
    return NextResponse.json({ ok: true, promos });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Couldn’t load promo codes." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const admin = await getAdminProfile();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  let body: {
    code?: string;
    label?: string;
    type?: "percentage" | "fixed";
    value?: number;
    maxRedemptions?: number;
    expiresAt?: string;
    firstTimeOnly?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const promo = await createStripePromo({
      code: body.code ?? "",
      label: body.label ?? "",
      type: body.type === "fixed" ? "fixed" : "percentage",
      value: Number(body.value),
      maxRedemptions: body.maxRedemptions ? Number(body.maxRedemptions) : undefined,
      expiresAt: body.expiresAt || undefined,
      firstTimeOnly: Boolean(body.firstTimeOnly),
    });
    return NextResponse.json({ ok: true, promo });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Couldn’t create that promo." },
      { status: 422 },
    );
  }
}

export async function PATCH(request: Request) {
  const admin = await getAdminProfile();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ ok: false, message: "Which promo should we turn off?" }, { status: 400 });
  }

  try {
    await deactivateStripePromo(body.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Couldn’t update that promo." },
      { status: 500 },
    );
  }
}
