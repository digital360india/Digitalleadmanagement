import { base } from "../airtable";

function setCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function withCors(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: setCorsHeaders(),
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: setCorsHeaders(),
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const createdRecord = await base("ClaimSchoolsEnquires").create([
      { fields: body },
    ]);
    return withCors(createdRecord[0], 201);
  } catch (error) {
    console.error(error);
    return withCors({ error: "Failed to create record" }, 500);
  }
}

export async function GET() {
  try {
    const records = await base("ClaimSchoolsEnquires").select({}).all();
    const result = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));
    return withCors(result, 200);
  } catch (error) {
    console.error(error);
    return withCors({ error: "Failed to fetch records" }, 500);
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;
    if (!id) return withCors({ error: "Missing record ID" }, 400);

    const updatedRecord = await base("ClaimSchoolsEnquires").update([
      { id, fields },
    ]);
    return withCors(updatedRecord[0], 200);
  } catch (error) {
    console.error(error);
    return withCors({ error: "Failed to update record" }, 500);
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return withCors({ error: "Missing record ID" }, 400);

    const deletedRecord = await base("ClaimSchoolsEnquires").destroy([id]);
    return withCors(deletedRecord[0], 200);
  } catch (error) {
    console.error(error);
    return withCors({ error: "Failed to delete record" }, 500);
  }
}
