"use client";

import { useEffect, useState, useRef } from "react";
import { Inbox, Upload, Loader2 } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import { useschoolLead } from "@/providers/SchoolLeadProvider";
import { useAuth } from "@/providers/AuthProvider";

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

function summarizeFees(feesObj, oneTimeFees) {
  const entries = feesObj ? Object.entries(feesObj) : [];
  if (entries.length === 0 && (!oneTimeFees || oneTimeFees.length === 0)) return null;

  const amounts = entries.map(([, v]) => Number(v)).filter((n) => !isNaN(n));
  let rangeLabel = null;
  if (amounts.length > 0) {
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    rangeLabel = min === max
      ? `₹${min.toLocaleString("en-IN")}/yr`
      : `₹${min.toLocaleString("en-IN")}–${max.toLocaleString("en-IN")}/yr`;
  }

  const oneTimeTotal = oneTimeFees?.reduce((sum, f) => sum + (Number(f.amount) || 0), 0) || 0;
  return { rangeLabel, oneTimeTotal, oneTimeCount: oneTimeFees?.length || 0 };
}

export default function RegisterSchools() {
  const { leads, loading, deleteLead, fetchLeads, importFromExcel, importing } = useschoolLead();

  const [query, setQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sites] = useState(["Registered Schools"]);
  const [selectedSite, setSelectedSite] = useState(sites[0]);
  const [importResult, setImportResult] = useState(null);
  const { user, logout } = useAuth();

  const hasFetched = useRef(false); // ← Prevents duplicate calls
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (fetchLeads && !hasFetched.current) {
      hasFetched.current = true;
      fetchLeads();
    }
  }, [fetchLeads]);

  const filtered = (leads || []).filter(
    (lead) =>
      lead.schoolName?.toLowerCase().includes(query.toLowerCase()) ||
      lead.location?.toLowerCase().includes(query.toLowerCase())
  );

  const paginatedRows = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportResult(null);
    try {
      const result = await importFromExcel(file);
      setImportResult({ ok: true, ...result });
    } catch (err) {
      setImportResult({ ok: false, error: err.response?.data?.error || err.message });
    } finally {
      e.target.value = ""; // allow re-selecting the same file later
    }
  };

  return (
    <div className="flex flex-col lg:flex-row mt-6 gap-6 w-full">
      <div className={`lg:w-[20%] w-full transition-all duration-300 ${isSidebarOpen ? "block" : "hidden lg:block"}`}>
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

      <div className="lg:w-[77%] w-full border border-gray-200 rounded-2xl mx-auto bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-4 sm:p-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase text-[#B08946] font-semibold mb-1">
                LEAD DIRECTORY
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#02618F]">
                Registered Schools
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileSelected}
              />
              <button
                onClick={handleImportClick}
                disabled={importing}
                className="flex items-center gap-2 text-sm font-medium text-[#02618F] bg-white border border-[#02618F]/30 hover:bg-[#02618F]/5 px-4 py-3 rounded-xl transition disabled:opacity-60"
              >
                {importing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Importing...
                  </>
                ) : (
                  <>
                    <Upload size={16} /> Import Excel
                  </>
                )}
              </button>

              <div className="text-[18px] text-white bg-[#02618F] px-4 py-3 rounded-xl font-serif">
                Total Leads: <span className="font-semibold">{filtered.length}</span>
              </div>
            </div>
          </div>

          {importResult && (
            <div
              className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
                importResult.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {importResult.ok ? (
                <>
                  Imported {importResult.created} of {importResult.totalRowsFound} rows found.
                  {importResult.failed > 0 && ` ${importResult.failed} rows failed.`}
                </>
              ) : (
                <>Import failed: {importResult.error}</>
              )}
            </div>
          )}

          <div className="mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by school name or location..."
              className="w-full rounded-xl border border-[#DDD6C3] bg-white px-4 py-3 text-sm text-[#02618F] placeholder-[#A79E8A] focus:outline-none focus:ring-2 focus:ring-[#02618F]/30"
            />
          </div>

          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[1400px] w-full text-left border-collapse text-sm">
                <thead className="bg-[#02618F] text-white text-xs uppercase">
                  <tr>
                    <th className="px-5 py-4 whitespace-nowrap">School Name</th>
                    <th className="px-5 py-4 whitespace-nowrap">Year Est.</th>
                    <th className="px-5 py-4 whitespace-nowrap">Type</th>
                    <th className="px-5 py-4 whitespace-nowrap">Curriculum</th>
                    <th className="px-5 py-4 whitespace-nowrap">Gender</th>
                    <th className="px-5 py-4 whitespace-nowrap">Grades</th>
                    <th className="px-5 py-4 whitespace-nowrap">Int'l Students</th>
                    <th className="px-5 py-4 whitespace-nowrap">Domestic Fees</th>
                    <th className="px-5 py-4 whitespace-nowrap">International Fees</th>
                    <th className="px-5 py-4 whitespace-nowrap">USP's</th>
                    <th className="px-5 py-4 whitespace-nowrap">Location</th>
                    <th className="px-5 py-4 whitespace-nowrap">Website</th>
                    <th className="px-5 py-4 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: rowsPerPage }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {Array.from({ length: 13 }).map((_, j) => (
                          <td key={j} className="px-5 py-4 bg-gray-50">
                            <div className="h-4 bg-gray-200 rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    paginatedRows.map((lead, i) => {
                      const domestic = summarizeFees(lead.domesticFees, lead.domesticOneTimeFees);
                      const international = summarizeFees(lead.internationalFees, lead.internationalOneTimeFees);

                      return (
                        <tr key={lead.id ?? i} className={`border-t border-[#EDE7D6] hover:bg-[#02618F]/5 transition-colors ${i % 2 === 1 ? "bg-[#FAF7EF]/60" : "bg-white"}`}>
                          <td className="px-5 py-4 font-semibold text-[#02618F]">{lead.schoolName}</td>
                          <td className="px-5 py-4 text-[#4A4636]">{lead.yearEstablished}</td>
                          <td className="px-5 py-4"><Badge tone="gold">{lead.type}</Badge></td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                              {(lead.curriculum || []).map((c) => <Badge key={c}>{c}</Badge>)}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[#4A4636]">{lead.gender}</td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-1.5 max-w-60">
                              {(lead.operationalGrades || []).map((g) => <Badge key={g}>{g.split(" (")[0]}</Badge>)}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {lead.acceptsInternational ? <Badge tone="green">Accepted</Badge> : "—"}
                          </td>
                          <td className="px-5 py-4 text-[#4A4636] max-w-[200px]">
                            {domestic ? (
                              <div className="flex flex-col gap-0.5">
                                {domestic.rangeLabel && <span>{domestic.rangeLabel}</span>}
                                {domestic.oneTimeCount > 0 && (
                                  <span className="text-xs text-[#A79E8A]">+₹{domestic.oneTimeTotal.toLocaleString("en-IN")} one-time</span>
                                )}
                              </div>
                            ) : "—"}
                          </td>
                          <td className="px-5 py-4 text-[#4A4636] max-w-[200px]">
                            {international ? (
                              <div className="flex flex-col gap-0.5">
                                {international.rangeLabel && <span>{international.rangeLabel}</span>}
                                {international.oneTimeCount > 0 && (
                                  <span className="text-xs text-[#A79E8A]">+₹{international.oneTimeTotal.toLocaleString("en-IN")} one-time</span>
                                )}
                              </div>
                            ) : "—"}
                          </td>
                          <td className="px-5 py-4 text-[#4A4636] max-w-60 line-clamp-2">{lead.usps}</td>
                          <td className="px-5 py-4 text-[#4A4636]">{lead.location}</td>
                          <td className="px-5 py-4">
                            {lead.websiteLink ? (
                              <a href={lead.websiteLink} target="_blank" rel="noopener noreferrer" className="text-[#02618F] hover:underline">Visit</a>
                            ) : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <button onClick={() => deleteLead(lead.id)} className="text-red-600 hover:underline text-xs font-medium">
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}

                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={13} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-400">
                          <Inbox size={48} strokeWidth={1.5} />
                          <p>No schools found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination (unchanged) */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              Rows per page:
              <select value={rowsPerPage} onChange={handleChangeRowsPerPage} className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-[#02618F]">
                {[5, 10, 25, 50].map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => handleChangePage(page - 1)} disabled={page === 0} className="px-4 py-2 rounded-md text-sm border bg-white hover:bg-gray-50 disabled:opacity-50">Prev</button>
              <span className="text-sm text-gray-600">Page {page + 1} of {Math.ceil(filtered.length / rowsPerPage) || 1}</span>
              <button onClick={() => handleChangePage(page + 1)} disabled={(page + 1) * rowsPerPage >= filtered.length} className="px-4 py-2 rounded-md text-sm border bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}