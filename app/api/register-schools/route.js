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
    headers: {
      ...setCorsHeaders(),
      "Content-Type": "application/json",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: setCorsHeaders(),
  });
}

/* ===========================
   CREATE SCHOOL
=========================== */

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      schoolName,
      images,
      yearEstablished,
      type,
      curriculum,
      gender,
      operationalGrades,
      feeStructure,
      usps,
      location,
      websiteLink,
    } = body;

    if (!schoolName || !type || !location) {
      return withCors(
        {
          error: "Missing required fields",
          details: "School Name, Type and Location are required.",
        },
        400
      );
    }

    const createdRecord = await base("RegisterSchools").create([
      {
        fields: {
          "School Name": schoolName,
          Images: images || [],
          "Year Established": yearEstablished,
          Type: type,
          Curriculum: curriculum || [],
          Gender: gender,
          "Operational Grades": operationalGrades || [],
          "Fee Structure": feeStructure,
          "USP's": usps,
          Location: location,
          "Website Link": websiteLink,
        },
      },
    ]);

    return withCors(createdRecord[0], 201);
  } catch (error) {
    console.error("POST Error:", error);

    return withCors(
      {
        error: "Failed to create school",
        details: error.message,
      },
      500
    );
  }
}

/* ===========================
   GET ALL SCHOOLS
=========================== */

export async function GET() {
  try {
    const records = await base("RegisterSchools")
      .select({
        sort: [{ field: "School Name", direction: "asc" }],
      })
      .all();

    const schools = records.map((record) => ({
      id: record.id,
      schoolName: record.fields["School Name"],
      images:
        record.fields.Images?.map((img) => img.url) || [],
      yearEstablished: record.fields["Year Established"],
      type: record.fields.Type,
      curriculum: record.fields.Curriculum || [],
      gender: record.fields.Gender,
      operationalGrades:
        record.fields["Operational Grades"] || [],
      feeStructure: record.fields["Fee Structure"],
      usps: record.fields["USP's"],
      location: record.fields.Location,
      websiteLink: record.fields["Website Link"],
    }));

    return withCors(schools);
  } catch (error) {
    console.error("GET Error:", error);

    return withCors(
      {
        error: "Failed to fetch schools",
        details: error.message,
      },
      500
    );
  }
}

/* ===========================
   UPDATE SCHOOL
=========================== */

export async function PUT(request) {
  try {
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return withCors(
        {
          error: "Record ID is required",
        },
        400
      );
    }

    const updatedRecord = await base("RegisterSchools").update([
      {
        id,
        fields: {
          "School Name": body.schoolName,
          Images: body.images || [],
          "Year Established": body.yearEstablished,
          Type: body.type,
          Curriculum: body.curriculum || [],
          Gender: body.gender,
          "Operational Grades": body.operationalGrades || [],
          "Fee Structure": body.feeStructure,
          "USP's": body.usps,
          Location: body.location,
          "Website Link": body.websiteLink,
        },
      },
    ]);

    return withCors(updatedRecord[0]);
  } catch (error) {
    console.error("PUT Error:", error);

    return withCors(
      {
        error: "Failed to update school",
        details: error.message,
      },
      500
    );
  }
}

/* ===========================
   DELETE SCHOOL
=========================== */

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return withCors(
        {
          error: "Record ID is required",
        },
        400
      );
    }

    const deletedRecord = await base("RegisterSchools").destroy([id]);

    return withCors({
      success: true,
      deleted: deletedRecord[0],
    });
  } catch (error) {
    console.error("DELETE Error:", error);

    return withCors(
      {
        error: "Failed to delete school",
        details: error.message,
      },
      500
    );
  }
}