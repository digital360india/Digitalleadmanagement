// pages/api/edit-lead/route.js

import { base } from "../airtable";

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing record ID' }), {
        status: 400,
      });
    }

    const updatedRecord = await base('Leads').update([
      {
        id,
        fields,
      },
    ]);

    return new Response(JSON.stringify(updatedRecord[0]), {
      status: 200,
    });
  } catch (error) {
    console.error('Airtable update error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update Airtable record' }),
      { status: 500 }
    );
  }
}
