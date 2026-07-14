import nodemailer from "nodemailer";

// POST /api/send-leads-email
// Body: { email: string, leads: Array<{ ...all lead fields } > }
export async function POST(req) {
  try {
    const { email, leads } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }
    if (!leads || leads.length === 0) {
      return Response.json({ error: "No leads selected" }, { status: 400 });
    }

    // Escape helper to avoid broken HTML if a field contains special chars
    const esc = (val) =>
      val === null || val === undefined || val === ""
        ? "-"
        : String(val)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    const formatDate = (d) => {
      if (!d) return "-";
      try {
        return new Date(d).toLocaleString();
      } catch {
        return esc(d);
      }
    };

    // All columns, matching the order/labels used in LeadsTable.jsx
    const columns = [
      { key: "assignedTo", label: "Assigned To" },
      { key: "date", label: "Date", isDate: true },
      { key: "disposition", label: "Disposition" },
      { key: "remark", label: "Remark" },
      { key: "phoneNumber", label: "Phone / Alt-Number" },
      { key: "name", label: "Parent Name" },
      { key: "parentName", label: "Student Name" },
      { key: "email", label: "Email" },
      { key: "seekingClass", label: "Seeking Class" },
      { key: "board", label: "Board" },
      { key: "schoolType", label: "School Type" },
      { key: "budget", label: "Budget" },
      { key: "location", label: "Location" },
      { key: "school", label: "Suggested School" },
      { key: "Session", label: "Session" },
      { key: "source", label: "Source" },
      { key: "assignedBy", label: "Assigned By" },
      { key: "url", label: "URL" },
    ];

    const headerRow = columns
      .map(
        (c) =>
          `<th style="padding:8px;border:1px solid #ddd;text-align:left;white-space:nowrap;">${c.label}</th>`
      )
      .join("");

    const rows = leads
      .map((l) => {
        const cells = columns
          .map((c) => {
            const raw = l[c.key];
            const value = c.isDate ? formatDate(raw) : esc(raw);
            return `<td style="padding:8px;border:1px solid #ddd;white-space:nowrap;">${value}</td>`;
          })
          .join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;">
        <h2>New Student Leads</h2>
        <p>You have ${leads.length} new lead(s):</p>
        <div style="overflow-x:auto;">
          <table style="border-collapse:collapse;width:100%;">
            <thead>
              <tr style="background:#f4f4f4;">${headerRow}</tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Lead Dashboard" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `New Leads Assigned - ${leads.length} student(s)`,
      html,
    });

    return Response.json({ success: true, sentTo: email });
  } catch (err) {
    console.error("Error sending leads email:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}