"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useClaimSchoolLead } from "@/providers/ClaimSchoolLeadProvider";
import { Inbox } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

export default function ClaimSchoolTable() {
  const { user, logout } = useAuth();
  const { leads, loading, fetchLeads } = useClaimSchoolLead();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sites] = useState(["Claim Schools"]);
  const [selectedSite, setSelectedSite] = useState(sites[0]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleChangePage = (newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const paginatedRows = leads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="flex flex-col lg:flex-row mt-6 gap-6">
      <div
        className={`lg:w-1/5 w-full transition-all duration-300 ${
          isSidebarOpen ? "block" : "hidden lg:block"
        }`}
      >
        <FilterSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          sites={sites}
          selectedSite={setSelectedSite}
          user={user}
          logout={logout}
        />
      </div>

      <div className="lg:w-[76%] w-full border border-gray-200 rounded-2xl  bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-4 sm:p-6">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
            <h2 className="text-xl md:text-3xl font-bold text-[#154c79] font-serif">
              Claim School — Leads
            </h2>
            <p className="text-[18px] text-white bg-[#154c79] px-3 py-3 rounded-xl font-serif ">
              Total Leads: <span className="font-semibold">{leads.length}</span>
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className=" text-sm text-left w-full min-w-[1200px]  border-collapse">
              <thead className="bg-[#154c79] text-white text-xs sm:text-sm uppercase">
                <tr>
                  {[
                    "Name",
                    "School Name",
                    "Phone Number",
                    "Email",
                    "Designation",
                  ].map((head, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 font-semibold whitespace-nowrap"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading
                  ? Array.from({ length: rowsPerPage }).map((_, rowIdx) => (
                      <tr key={rowIdx} className="animate-pulse">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <td
                            key={i}
                            className="px-4 py-3 bg-gray-50 rounded-md"
                          >
                            <div className="h-4 bg-gray-200 rounded"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  : paginatedRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-indigo-50 transition cursor-pointer even:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {row.name}
                        </td>
                        <td className="px-4 py-3">{row.schoolName}</td>
                        <td className="px-4 py-3">{row.phoneNumber}</td>
                        <td className="px-4 py-3 text-indigo-600 font-medium">
                          {row.email}
                        </td>
                        <td className="px-4 py-3">{row.designation}</td>
                      </tr>
                    ))}

                {!loading && leads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Inbox size={36} strokeWidth={1.5} />
                        <p className="text-sm">No records found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              Rows per page:
              <select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                {[5, 10, 25, 50].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                className="px-3 py-1 rounded-md text-sm font-medium border bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {page + 1} of {Math.ceil(leads.length / rowsPerPage) || 1}
              </span>
              <button
                onClick={() => handleChangePage(page + 1)}
                disabled={(page + 1) * rowsPerPage >= leads.length}
                className="px-3 py-1 rounded-md text-sm font-medium border bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
