import { base } from "../airtable";

const TABLE_NAME = "Leads"; // change to match your Airtable table name

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

// initialFormData shape -> Airtable field names.
// Fee objects/arrays have no native Airtable field type, so they're
// JSON-stringified into Long Text fields.
function toAirtableFields(body) {
  return {
    "School Name": body.schoolName,
    "Year Established": body.yearEstablished ? Number(body.yearEstablished) : null,
    "Type": body.type,
    "Curriculum": body.curriculum || [],
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
  };
}

// Airtable record -> initialFormData shape (plus id)
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
  return new Response(null, {
    status: 204,
    headers: setCorsHeaders(),
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received POST body:", JSON.stringify(body, null, 2));

    if (!body.schoolName || !body.type || !body.location) {
      return withCors(
        { error: "Missing required fields", details: "schoolName, type, and location are required" },
        400
      );
    }

    const createdRecord = await base(TABLE_NAME).create([
      { fields: toAirtableFields(body) },
    ]);

    console.log("Created record:", JSON.stringify(createdRecord[0], null, 2));
    return withCors(fromAirtableRecord(createdRecord[0]), 201);
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
    const records = await base(TABLE_NAME).select({}).all();
    const result = records.map(fromAirtableRecord);
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
    const { id, ...lead } = body;
    if (!id) return withCors({ error: "Missing record ID" }, 400);

    const updatedRecord = await base(TABLE_NAME).update([
      { id, fields: toAirtableFields(lead) },
    ]);

    console.log("Updated record:", JSON.stringify(updatedRecord[0], null, 2));
    return withCors(fromAirtableRecord(updatedRecord[0]), 200);
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

    const deletedRecord = await base(TABLE_NAME).destroy([id]);
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
    console.log("Available tables:", tables.map((t) => t.name));
    return withCors({ tables: tables.map((t) => t.name) }, 200);
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