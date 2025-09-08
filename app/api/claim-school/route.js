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
    console.log("Received POST body:", JSON.stringify(body, null, 2));
    if (!body.Name || !body.SchoolName || !body.PhoneNumber || !body.email || !body.Designation) {
      return withCors({ error: "Missing required fields", details: "All fields (Name, SchoolName, PhoneNumber, email, Designation) are required" }, 400);
    }
    const createdRecord = await base("ClaimSchoolsEnquires").create([
      { fields: body },
    ]);
    console.log("Created record:", JSON.stringify(createdRecord[0], null, 2));
    return withCors(createdRecord[0], 201);
  } catch (error) {
    console.error("Airtable POST Error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
    });
    return withCors(
      { error: "Failed to create record", details: error.message || "Unknown error" },
      500
    );
  }
}

export async function GET() {
  try {
    const records = await base("ClaimSchoolsEnquires").select({}).all();
    const result = records.map((record) => ({
      id: record.id,
      name: record.fields.Name,
      schoolName: record.fields.SchoolName,
      phoneNumber: record.fields.PhoneNumber,
      email: record.fields.email,
      designation: record.fields.Designation,
    }));
    return withCors(result, 200);
  } catch (error) {
    console.error("Airtable GET Error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
    });
    return withCors(
      { error: "Failed to fetch records", details: error.message || "Unknown error" },
      500
    );
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
    console.log("Updated record:", JSON.stringify(updatedRecord[0], null, 2));
    return withCors(updatedRecord[0], 200);
  } catch (error) {
    console.error("Airtable PUT Error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
    });
    return withCors(
      { error: "Failed to update record", details: error.message || "Unknown error" },
      500
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return withCors({ error: "Missing record ID" }, 400);
    const deletedRecord = await base("ClaimSchoolsEnquires").destroy([id]);
    console.log("Deleted record:", JSON.stringify(deletedRecord[0], null, 2));
    return withCors(deletedRecord[0], 200);
  } catch (error) {
    console.error("Airtable DELETE Error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
    });
    return withCors(
      { error: "Failed to delete record", details: error.message || "Unknown error" },
      500
    );
  }
}

export async function GET_TEST() {
  try {
    const tables = await base.getTables();
    console.log("Available tables:", tables.map(t => t.name));
    return withCors({ tables: tables.map(t => t.name) }, 200);
  } catch (error) {
    console.error("Airtable Test Error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
    });
    return withCors({ error: "Failed to fetch tables", details: error.message }, 500);
  }
}