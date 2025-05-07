import { NextResponse } from "next/server";
import { base } from "../airtable";
import NextCors from "nextjs-cors";

export async function POST(req) {
  await NextCors(req, {
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    optionsSuccessStatus: 200,
  });
  try {
    const body = await req.json();

    const record = await base("Leads").create([
      {
        fields: body, // pass the body as fields
      },
    ]);

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error("Failed to add lead:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add lead" },
      { status: 500 }
    );
  }
}
