import { NextResponse } from "next/server";
import { base } from "../airtable";

export async function GET(req) {
  try {
    const users = [];
    await base("Users")
      .select({ view: "Grid view" })
      .eachPage((fetchedRecords, fetchNextPage) => {
        fetchedRecords.forEach((record) => {
          users.push({ id: record.id, ...record.fields });
        });
        fetchNextPage();
      });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}