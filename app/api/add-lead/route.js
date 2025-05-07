import { NextResponse } from "next/server";
import { base } from "../airtable";

export async function POST(req) {
  await NextCors(req, {
    methods: ['POST', 'OPTIONS'],
    origin: '*',
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
