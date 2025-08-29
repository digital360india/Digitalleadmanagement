import { NextResponse } from "next/server";
import { base } from "../airtable";

export async function POST(req) {
  try {
    const body = await req.json();

    const record = await base("Leads").create([
      {
        fields: body,
      },
    ]);

    const response = NextResponse.json({ success: true, record });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  } catch (error) {
    console.error("Failed to add lead:", error);

    const response = NextResponse.json(
      { success: false, message: "Failed to add lead" },
      { status: 500 }
    );

    // Set CORS headers on error response
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Max-Age", "86400"); 

  return response;
}
