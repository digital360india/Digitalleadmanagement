// app/api/register-schools/route.js
//
// GET  /api/register-schools        -> list all leads (for the dashboard table)
// POST /api/register-schools        -> create a new lead from your form's initialFormData shape
//
// Requires these env vars (e.g. in .env.local):
//   AIRTABLE_API_KEY   = personal access token (starts with "pat...")
//   AIRTABLE_BASE_ID   = the base id (starts with "app...")
//   AIRTABLE_TABLE_NAME = "Leads"  (or whatever you named the table)

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Leads";

const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
  AIRTABLE_TABLE_NAME
)}`;

function airtableHeaders() {
  return {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };
}

// Airtable stores nested objects/arrays (fees, one-time fees) as JSON strings
// in Long Text fields, since Airtable has no native "object" field type.
// These helpers convert between the app's shape and Airtable's flat record shape.

function recordToLead(record) {
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
    images: (f["Images"] || []).map((att) => att.url),
  };
}

function leadToFields(lead) {
  return {
    "School Name": lead.schoolName,
    "Year Established": lead.yearEstablished ? Number(lead.yearEstablished) : null,
    "Type": lead.type,
    "Curriculum": lead.curriculum || [],
    "Gender": lead.gender,
    "Operational Grades": lead.operationalGrades || [],
    "Accepts International": !!lead.acceptsInternational,
    "Domestic Fees": JSON.stringify(lead.domesticFees || {}),
    "Domestic One-Time Fees": JSON.stringify(lead.domesticOneTimeFees || []),
    "International Fees": JSON.stringify(lead.internationalFees || {}),
    "International One-Time Fees": JSON.stringify(lead.internationalOneTimeFees || []),
    "USPs": lead.usps,
    "Location": lead.location,
    "Website Link": lead.websiteLink,
  };
}

export async function GET() {
  try {
    let allRecords = [];
    let offset;

    do {
      const url = new URL(AIRTABLE_URL);
      if (offset) url.searchParams.set("offset", offset);

      const res = await fetch(url.toString(), {
        headers: airtableHeaders(),
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Airtable fetch failed (${res.status}): ${text}`);
      }

      const data = await res.json();
      allRecords = allRecords.concat(data.records);
      offset = data.offset;
    } while (offset);

    const leads = allRecords.map(recordToLead);

    return Response.json(leads);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const res = await fetch(AIRTABLE_URL, {
      method: "POST",
      headers: airtableHeaders(),
      body: JSON.stringify({
        fields: leadToFields(body),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Airtable create failed (${res.status}): ${text}`);
    }

    const record = await res.json();
    return Response.json(recordToLead(record), { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}