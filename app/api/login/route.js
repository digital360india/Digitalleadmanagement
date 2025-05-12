import { NextResponse } from "next/server";
import { base } from "../airtable";

export async function POST(req) {
  const body = await req.json(); 
  const { email, password } = body;

  try {
    const records = await base("Users")
      .select({
        filterByFormula: `AND({email} = "${email}", {password} = "${password}")`,
      })
      .firstPage();

    if (records.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = records[0].fields;
    return NextResponse.json({ user }, { status: 200 }); 
  } catch (error) {
    return NextResponse.json(
      { error: "Login failed", details: error.message },
      { status: 500 }
    );
  }
}
