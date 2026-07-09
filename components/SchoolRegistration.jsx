"use client";

import { useState, useEffect } from "react";
import FilterSidebar from "./FilterSidebar";
import { useAuth } from "@/providers/AuthProvider";

/* ---------- small inline icons ---------- */
const Icon = {
  Pin: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  ),
  Globe: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-6-3.8-9s1.3-6.4 3.8-9Z" />
    </svg>
  ),
  Search: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  ),
  User: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M16 16a8 8 0 0 0-16 0" />
    </svg>
  ),
};

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

export default function LeadDashboardTable({ apiUrl = "/api/register-schools" }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sites] = useState(["Registered Leads"]);
  const [selectedSite, setSelectedSite] = useState(sites[0]);

  useEffect(() => {
    let ignore = false;

    async function fetchLeads() {
      try {
        setLoading(true);
        const res = await fetch(apiUrl, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch leads");
        const data = await res.json();
        if (!ignore) setLeads(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchLeads();
    return () => { ignore = true; };
  }, [apiUrl]);

  const filtered = leads.filter((lead) =>
    lead.schoolName?.toLowerCase().includes(query.toLowerCase()) ||
    lead.location?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 ml-20 px-4 sm:py-14 sm:px-6 lg:px-8">
      <div
        className={`lg:w-[20%] w-full transition-all duration-300 ${
          isSidebarOpen ? "block" : "hidden lg:block"
        }`}
      >
        <FilterSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          sites={sites}
          selectedSite={selectedSite}
          setSelectedSite={setSelectedSite}
          user={user}
          logout={logout}
        />
      </div>

      <div className="lg:w-[80%] p-10 ml-60 border border-gray-200 rounded-2xl mx-auto bg-gray-50">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-[#B08946] font-semibold mb-1">
              LEAD DIRECTORY
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#02618F]">
              Registered Leads
            </h1>
            <p className="text-sm text-[#8A8266] mt-1">
              {filtered.length} of {leads.length} leads shown
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Icon.Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A79E8A]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by school name or location..."
              className="w-full rounded-xl border border-[#DDD6C3] bg-white pl-10 pr-4 py-2.5 text-sm text-[#02618F] placeholder-[#A79E8A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#02618F]/30 focus:border-[#02618F]"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#EDE7D6] bg-white shadow-xl shadow-[#02618F]/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[1320px] w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#02618F] text-white">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    School / Lead Name
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    Images
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    Year Est.
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    Type
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    Curriculum
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    Gender
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    Grades
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    Fee Structure
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    USP's
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    Location
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    Website
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={11} className="px-5 py-10 text-center text-sm text-[#A79E8A]">
                      Loading leads...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={11} className="px-5 py-10 text-center text-sm text-red-500">
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && filtered.map((lead, i) => (
                  <tr
                    key={lead.id ?? i}
                    className={`border-t border-[#EDE7D6] transition-colors hover:bg-[#02618F]/5 ${
                      i % 2 === 1 ? "bg-[#FAF7EF]/60" : "bg-white"
                    }`}
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-[#02618F] whitespace-nowrap">
                      {lead.schoolName}
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap">
                      {lead.images && lead.images.length > 0 ? (
                        <div className="flex items-center -space-x-2">
                          {lead.images.slice(0, 3).map((src, idx) => (
                            <img
                              key={idx}
                              src={src}
                              alt={`${lead.schoolName} ${idx + 1}`}
                              className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm"
                            />
                          ))}
                          {lead.images.length > 3 && (
                            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#02618F]/10 text-[10px] font-semibold text-[#02618F]">
                              +{lead.images.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#A79E8A]">—</span>
                      )}
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
                    <td className="px-5 py-4 text-sm text-[#4A4636] max-w-[220px]">
                      <span className="line-clamp-2">{lead.feeStructure}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4A4636] max-w-[240px]">
                      <span className="line-clamp-2">{lead.usps}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4A4636] whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon.Pin className="h-3.5 w-3.5 text-[#B08946]" />
                        {lead.location}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm whitespace-nowrap">
                      {lead.websiteLink ? (
                        <a
                          href={lead.websiteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#02618F] font-medium hover:underline"
                        >
                          <Icon.Globe className="h-3.5 w-3.5" />
                          Visit
                        </a>
                      ) : (
                        <span className="text-[#A79E8A]">—</span>
                      )}
                    </td>
                  </tr>
                ))}

                {!loading && !error && filtered.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-5 py-10 text-center text-sm text-[#A79E8A]">
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}