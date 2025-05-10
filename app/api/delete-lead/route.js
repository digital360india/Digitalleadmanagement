// pages/api/delete-lead/route.js

import { base } from "../airtable";

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing record ID" }), {
        status: 400,
      });
    }

    const deletedRecord = await base("Leads").destroy(id);

    return new Response(
      JSON.stringify({ success: true, id: deletedRecord.id }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Airtable delete error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete Airtable record" }),
      { status: 500 }
    );
  }
}
