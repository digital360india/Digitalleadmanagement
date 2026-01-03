import { NextResponse } from "next/server";
import { base } from "../airtable";

export async function GET(req) {
  const userId = req.headers.get("x-user-id");
  const version = Number(req.headers.get("x-password-version"));

  if (!userId) {
    return NextResponse.json({ error: "No user" }, { status: 401 });
  }

  try {
    const record = await base("Users").find(userId);
    const currentVersion = record.fields.passwordVersion || 1;

    if (currentVersion !== version) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "User not found" },
      { status: 401 }
    );
  }
}
