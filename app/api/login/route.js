// import { NextResponse } from "next/server";
// import { base } from "../airtable";

// export async function POST(req) {
//   const { email, password } = await req.json();

//   try {
//     const records = await base("Users")
//       .select({
//         filterByFormula: `AND({email}="${email}", {password}="${password}")`,
//       })
//       .firstPage();

//     if (!records.length) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     const record = records[0];

//     return NextResponse.json(
//       {
//         user: {
//           id: record.id,
//           email: record.fields.email,
//           status: record.fields.status,
//           passwordVersion: record.fields.passwordVersion || 1,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Login failed" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { base } from "../airtable";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const records = await base("Users")
      .select({
        filterByFormula: `AND({email}="${email}", {password}="${password}")`,
      })
      .firstPage();

    if (!records.length) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const record = records[0];

    const user = {
      id: record.id,
      email: record.fields.email,
      status: record.fields.status,
      passwordVersion: record.fields.passwordVersion || 1,
    };

    // ✅ Create response
    const response = NextResponse.json(
      { user },
      { status: 200 }
    );

    // ✅ Set cookie for 1 day (24 hours)
    response.cookies.set("user", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 🔥 1 day
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
