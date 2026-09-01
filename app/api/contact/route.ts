import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { createServiceSupabase } from "@/lib/supabase/server";

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
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  const petType = typeof payload.petType === "string" ? payload.petType.trim() : "";
  const service = typeof payload.service === "string" ? payload.service.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, message: "Name, email, and message are required." },
      { status: 422 },
    );
  }

  const db = createServiceSupabase();
  if (db) {
    await db.from("contact_messages").insert({
      name,
      email,
      phone,
      pet_type: petType,
      service,
      message,
    });
  }

  await sendContactEmail({ name, email, phone, petType, service, message });

  return NextResponse.json({ ok: true });
}
