import { base } from "../airtable";

const TABLE_NAME = "Register-School";

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

// Map frontend data → Exact Airtable field names
function toAirtableFields(body) {
  return {
    "School Name": body.schoolName,
    "Year Established": body.yearEstablished ? Number(body.yearEstablished) : null,
    "Type": body.type,
    "Curriculum": body.curriculum || [],           // Multi-select / array
    "Gender": body.gender,
    "Operational Grades": body.operationalGrades || [],
    "Accepts International": !!body.acceptsInternational,
    "Domestic Fees": JSON.stringify(body.domesticFees || {}),
    "Domestic One-Time Fees": JSON.stringify(body.domesticOneTimeFees || []),
    "International Fees": JSON.stringify(body.internationalFees || {}),
    "International One-Time Fees": JSON.stringify(body.internationalOneTimeFees || []),
    "USPs": body.usps,
    "Location": body.location,
    "Website Link": body.websiteLink,
    // Add more fields here if you have them (e.g. "Associated School", "Lead Reference")
  };
}

// Map Airtable record → frontend shape
function fromAirtableRecord(record) {
  const f = record.fields || {};

  const safeParse = (val, fallback) => {
    if (!val) return fallback;
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  };

  return {
    id: record.id,
    schoolName: f["School Name"] || "",
    yearEstablished: f["Year Established"] || "",
    type: f["Type"] || "",
    curriculum: f["Curriculum"] || [],
    gender: f["Gender"] || "",
    operationalGrades: f["Operational Grades"] || [],
    acceptsInternational: !!f["Accepts International"],
    domesticFees: safeParse(f["Domestic Fees"], {}),
    domesticOneTimeFees: safeParse(f["Domestic One-Time Fees"], []),
    internationalFees: safeParse(f["International Fees"], {}),
    internationalOneTimeFees: safeParse(f["International One-Time Fees"], []),
    usps: f["USPs"] || "",
    location: f["Location"] || "",
    websiteLink: f["Website Link"] || "",
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: setCorsHeaders() });
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.schoolName || !body.type) {
      return withCors({ error: "Missing required fields: schoolName and type" }, 400);
    }

    const created = await base(TABLE_NAME).create([{ fields: toAirtableFields(body) }]);
    return withCors(fromAirtableRecord(created[0]), 201);
  } catch (error) {
    console.error("Airtable POST Error:", error);
    return withCors({ 
      error: "Failed to create record", 
      details: error.message 
    }, 500);
  }
}

export async function GET() {
  try {
    const records = await base(TABLE_NAME).select({}).all();
    const result = records.map(fromAirtableRecord);
    return withCors(result, 200);
  } catch (error) {
    console.error("Airtable GET Error:", error);
    return withCors({ error: "Failed to fetch records", details: error.message }, 500);
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...lead } = body;
    if (!id) return withCors({ error: "Missing record ID" }, 400);

    const updated = await base(TABLE_NAME).update([{ id, fields: toAirtableFields(lead) }]);
    return withCors(fromAirtableRecord(updated[0]), 200);
  } catch (error) {
    console.error("Airtable PUT Error:", error);
    return withCors({ error: "Failed to update record", details: error.message }, 500);
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) return withCors({ error: "Missing record ID" }, 400);

    await base(TABLE_NAME).destroy([id]);
    return withCors({ success: true }, 200);
  } catch (error) {
    console.error("Airtable DELETE Error:", error);
    return withCors({ error: "Failed to delete record", details: error.message }, 500);
  }
}