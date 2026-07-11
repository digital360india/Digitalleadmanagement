import * as XLSX from "xlsx";
import { base } from "../../airtable"; // same airtable.js used by register-schools/route.js

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

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: setCorsHeaders() });
}

// ---------- helpers: cleaning + mapping ----------

function norm(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function splitList(v) {
  const s = norm(v);
  if (!s) return [];
  return s
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
}

function normalizeGender(v) {
  const g = norm(v);
  const gl = g.toLowerCase();
  if (gl === "boys" || gl === "boy") return "Boys";
  if (gl === "girls" || gl === "girl") return "Girls";
  if (gl.includes("co-ed") || gl.includes("coed")) return "Co-Ed";
  return g;
}

// Parses free-text fee strings like "9 lacs/ 8-12 lacs" or "5.5lacs" into
// a { Min, Max } or { Annual } object, matching the shape your dashboard
// (domesticFees / internationalFees) already expects.
function parseFee(feeStr) {
  const s = norm(feeStr).toLowerCase();
  if (!s) return {};
  const nums = [...s.matchAll(/(\d+(?:\.\d+)?)/g)].map((m) => parseFloat(m[1]));
  if (nums.length === 0) return {};
  const hasLacs = s.includes("lac") || s.includes("lakh");
  const vals = [...new Set(nums.map((n) => (hasLacs ? Math.round(n * 100000) : Math.round(n))))].sort(
    (a, b) => a - b
  );
  if (vals.length === 1) return { Annual: vals[0] };
  return { Min: vals[0], Max: vals[vals.length - 1] };
}

function toAirtableFields(rec) {
  return {
    "School Name": rec.schoolName,
    "Year Established": rec.yearEstablished || null,
    Type: rec.type,
    Curriculum: rec.curriculum || [],
    Gender: rec.gender,
    "Operational Grades": rec.operationalGrades || [],
    "Accepts International": !!rec.acceptsInternational,
    "Domestic Fees": JSON.stringify(rec.domesticFees || {}),
    "Domestic One-Time Fees": JSON.stringify(rec.domesticOneTimeFees || []),
    "International Fees": JSON.stringify(rec.internationalFees || {}),
    "International One-Time Fees": JSON.stringify(rec.internationalOneTimeFees || []),
    USPs: rec.usps,
    Location: rec.location,
    "Website Link": rec.websiteLink,
  };
}

// Reads every sheet in the workbook and maps only the columns that match
// your dashboard's fields. Columns like GAMES, phone numbers, agent names
// etc. that don't exist in the dashboard schema are ignored.
function parseWorkbook(buffer) {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const records = [];
  const seen = new Set();

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: null });

    for (const row of rows) {
      // Column headers vary slightly in whitespace/case across sheets in
      // real-world exports, so look them up case-insensitively.
      const get = (name) => {
        const key = Object.keys(row).find(
          (k) => k.trim().toLowerCase() === name.toLowerCase()
        );
        return key ? row[key] : null;
      };

      const schoolName = norm(get("School Name"));
      if (!schoolName) continue;

      const location = norm(get("Location"));
      const dedupeKey = `${schoolName.toLowerCase()}|${location.toLowerCase()}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      const yearRaw = get("Year of Establishment");
      const year = yearRaw ? parseInt(yearRaw, 10) : null;

      const gradesRaw = norm(get("Operational Grades"));

      records.push({
        schoolName,
        yearEstablished: Number.isFinite(year) ? year : null,
        type: norm(get("Type")),
        curriculum: splitList(get("Curriculum")),
        gender: normalizeGender(get("Gender")),
        operationalGrades: gradesRaw ? [gradesRaw] : [],
        acceptsInternational: false,
        domesticFees: parseFee(get("Fee Structure")),
        domesticOneTimeFees: [],
        internationalFees: {},
        internationalOneTimeFees: [],
        usps: norm(get("USP'S")),
        location,
        websiteLink: norm(get("LINK")),
      });
    }
  }

  return records;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ---------- route ----------

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return withCors({ error: "No file uploaded. Send it as form field 'file'." }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const records = parseWorkbook(buffer);
    if (records.length === 0) {
      return withCors({ error: "No valid rows found (each row needs at least a School Name)." }, 400);
    }

    // Airtable's create endpoint accepts a max of 10 records per call.
    const batches = chunk(records, 10);
    let created = 0;
    const failures = [];

    for (const batch of batches) {
      try {
        const payload = batch.map((rec) => ({ fields: toAirtableFields(rec) }));
        // typecast: true lets Airtable auto-create new Single/Multi-select
        // options (e.g. new Type, Gender, Curriculum values from the sheet)
        // instead of rejecting the whole batch when it sees a value that
        // isn't already a predefined option.
        const result = await base(TABLE_NAME).create(payload, { typecast: true });
        created += result.length;
      } catch (err) {
        const message = err.message || String(err);
        console.error("Airtable batch create failed:", message, err);
        batch.forEach((rec) =>
          failures.push({ schoolName: rec.schoolName, error: message })
        );
      }
    }

    return withCors(
      {
        totalRowsFound: records.length,
        created,
        failed: failures.length,
        failures,
      },
      200
    );
  } catch (error) {
    console.error("Excel import error:", error);
    return withCors({ error: "Failed to import file", details: error.message }, 500);
  }
}