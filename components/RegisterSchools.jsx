"use client";

import { useschoolLead } from "@/providers/SchoolLeadProvider";
import { useState } from "react";

function Badge({ children, tone = "navy" }) {
  const tones = {
    navy: "bg-[#02618F]/10 text-[#02618F] border-[#02618F]/20",
    gold: "bg-[#B08946]/10 text-[#8A6A2F] border-[#B08946]/25",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

// domesticFees / internationalFees: { "Grade 1": 50000, ... }
// domesticOneTimeFees / internationalOneTimeFees: [{ label, amount }, ...]
function summarizeFees(feesObj, oneTimeFees) {
  const entries = feesObj ? Object.entries(feesObj) : [];
  if (entries.length === 0 && (!oneTimeFees || oneTimeFees.length === 0)) return null;

  const amounts = entries.map(([, v]) => Number(v)).filter((n) => !isNaN(n));
  let rangeLabel = null;
  if (amounts.length > 0) {
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    rangeLabel =
      min === max
        ? `₹${min.toLocaleString("en-IN")}/yr`
        : `₹${min.toLocaleString("en-IN")}–${max.toLocaleString("en-IN")}/yr`;
  }

  const oneTimeTotal =
    oneTimeFees && oneTimeFees.length > 0
      ? oneTimeFees.reduce((sum, f) => sum + (Number(f.amount) || 0), 0)
      : 0;

  return { rangeLabel, oneTimeTotal, oneTimeCount: oneTimeFees?.length || 0 };
}

export default function RegisterSchools() {
  const { leads, loading, deleteLead } = useschoolLead();
  const [query, setQuery] = useState("");

  const filtered = (leads || []).filter(
    (lead) =>
      lead.schoolName?.toLowerCase().includes(query.toLowerCase()) ||
      lead.location?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#B08946] font-semibold mb-1">
            LEAD DIRECTORY
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#02618F]">
            Registered Leads
          </h1>
          <p className="text-sm text-[#8A8266] mt-1">
            {filtered.length} of {(leads || []).length} leads shown
          </p>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by school name or location..."
          className="w-full sm:w-72 rounded-xl border border-[#DDD6C3] bg-white px-4 py-2.5 text-sm text-[#02618F] placeholder-[#A79E8A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#02618F]/30 focus:border-[#02618F]"
        />
      </div>

      <div className="rounded-2xl border border-[#EDE7D6] bg-white shadow-xl shadow-[#02618F]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1400px] w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#02618F] text-white">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">School Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Year Est.</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Type</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Curriculum</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Gender</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Grades</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Int'l Students</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Domestic Fees</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">International Fees</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">USP's</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Location</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Website</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={13} className="px-5 py-10 text-center text-sm text-[#A79E8A]">
                    Loading leads...
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((lead, i) => {
                  const domestic = summarizeFees(lead.domesticFees, lead.domesticOneTimeFees);
                  const international = summarizeFees(lead.internationalFees, lead.internationalOneTimeFees);

                  return (
                    <tr
                      key={lead.id ?? i}
                      className={`border-t border-[#EDE7D6] transition-colors hover:bg-[#02618F]/5 ${
                        i % 2 === 1 ? "bg-[#FAF7EF]/60" : "bg-white"
                      }`}
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-[#02618F] whitespace-nowrap">
                        {lead.schoolName}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4A4636] whitespace-nowrap">
                        {lead.yearEstablished}
                      </td>
                      <td className="px-5 py-4 text-sm whitespace-nowrap">
                        <Badge tone="gold">{lead.type}</Badge>
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                          {(lead.curriculum || []).map((c) => (
                            <Badge key={c}>{c}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4A4636] whitespace-nowrap">
                        {lead.gender}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                          {(lead.operationalGrades || []).map((g) => (
                            <Badge key={g}>{g.split(" (")[0]}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm whitespace-nowrap">
                        {lead.acceptsInternational ? (
                          <Badge tone="green">Accepted</Badge>
                        ) : (
                          <span className="text-[#A79E8A]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4A4636] max-w-[200px]">
                        {domestic ? (
                          <div className="flex flex-col gap-0.5">
                            {domestic.rangeLabel && <span>{domestic.rangeLabel}</span>}
                            {domestic.oneTimeCount > 0 && (
                              <span className="text-xs text-[#A79E8A]">
                                +₹{domestic.oneTimeTotal.toLocaleString("en-IN")} one-time
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#A79E8A]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4A4636] max-w-[200px]">
                        {international ? (
                          <div className="flex flex-col gap-0.5">
                            {international.rangeLabel && <span>{international.rangeLabel}</span>}
                            {international.oneTimeCount > 0 && (
                              <span className="text-xs text-[#A79E8A]">
                                +₹{international.oneTimeTotal.toLocaleString("en-IN")} one-time
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#A79E8A]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4A4636] max-w-[240px]">
                        <span className="line-clamp-2">{lead.usps}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4A4636] whitespace-nowrap">
                        {lead.location}
                      </td>
                      <td className="px-5 py-4 text-sm whitespace-nowrap">
                        {lead.websiteLink ? (
                          <a
                            href={lead.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#02618F] font-medium hover:underline"
                          >
                            Visit
                          </a>
                        ) : (
                          <span className="text-[#A79E8A]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm whitespace-nowrap">
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="text-red-600 hover:underline text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={13} className="px-5 py-10 text-center text-sm text-[#A79E8A]">
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}