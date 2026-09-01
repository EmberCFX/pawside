import { NextResponse } from "next/server";
import { getAdminProfile } from "@/lib/auth";
import { wipeTestData } from "@/lib/wipe-test-data";

export const dynamic = "force-dynamic";

function authorized(request: Request, admin: unknown) {
  const expected = process.env.WIPE_TOKEN;
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (admin) return true;
  return Boolean(expected && bearer && bearer === expected);
}

export async function POST(request: Request) {
  const admin = await getAdminProfile();
  if (!authorized(request, admin)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await wipeTestData();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Wipe failed." },
      { status: 500 },
    );
  }
}
