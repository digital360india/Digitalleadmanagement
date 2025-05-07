import { NextResponse } from "next/server";
import { base } from "../airtable";

export async function GET(req) {
  try {
    const records = [];
    await base("Leads")
      .select({ view: "Grid view" })
      .eachPage((fetchedRecords, fetchNextPage) => {
        fetchedRecords.forEach((record) => {
          records.push({ id: record.id, ...record.fields });
        });
        fetchNextPage();
      });

    const response = NextResponse.json({ success: true, records });

    // Set CORS headers manually
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return response;
  } catch (error) {
    console.error(error);
    const response = NextResponse.json({ error: error.message }, { status: 500 });

    // Also set CORS headers on error response
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return response;
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Max-Age", "86400"); // cache preflight 24h

  return response;
}
