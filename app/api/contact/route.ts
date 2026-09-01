import { NextResponse } from "next/server";

/**
 * POST /api/contact — contact form intake.
 *
 * MOCK IMPLEMENTATION: validates and returns success without sending anything.
 *
 * To go live, inside the marked block: send the email (Resend, Postmark, SES),
 * push a lead to the CRM, and consider adding rate limiting plus a spam check
 * before anything is sent.
 */
export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, message: "Name, email, and message are required." },
      { status: 422 },
    );
  }

  /* INTEGRATION POINT — send the email / create the lead here. */

  return NextResponse.json({ ok: true });
}
