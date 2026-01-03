import { NextResponse } from "next/server";
import { base } from "../airtable";

export async function POST(req) {
  const { userId, newPassword } = await req.json();

  const record = await base("Users").find(userId);
  const currentVersion = record.fields.passwordVersion || 1;

  await base("Users").update(userId, {
    password: newPassword,
    passwordVersion: currentVersion + 1,
  });

  return NextResponse.json({ success: true });
}
