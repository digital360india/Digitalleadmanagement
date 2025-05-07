import { NextResponse } from "next/server";
import { base } from "../airtable";
export async function GET(req, res) {
  await NextCors(req, {
    methods: ['GET', 'OPTIONS'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
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

    return NextResponse.json({ success: true, records });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
