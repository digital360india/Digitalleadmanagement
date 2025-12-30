"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TbFilter, TbX, TbLogout2 } from "react-icons/tb";
import Link from "next/link";
import { MdLeaderboard } from "react-icons/md";
import { IoIosSchool } from "react-icons/io";
import { LuBaggageClaim } from "react-icons/lu";
import { FaFilter } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { GiTrophy } from "react-icons/gi";
import { IoMdAnalytics } from "react-icons/io";
const FINAL_DISPOSITIONS = [
  "Cold",
  "Registration Done",
  "Admission Fee Paid",
  "Admission Done",
];

const FilterSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  sites,
  selectedSite,
  setSelectedSite,
  user,
  logout,
  fetchedusers,
  selectedUser,
  setSelectedUser,
  selectedDisposition,
  setSelectedDisposition = () => {},
  dispositionOptions,
  leads,
}) => {
  const pathname = usePathname();
  const isAnalytics = pathname === "/dashboard/LeadAnalytics";

  const totalLeadsCount = leads?.length || 0;
  const convertedCount =
    isAnalytics
      ? totalLeadsCount
      : leads?.filter((lead) => FINAL_DISPOSITIONS.includes(lead.disposition))
          .length || 0;

  const isConvertedPool = selectedSite === "converted-pool";

  const allDispositionCounts = {};
  (dispositionOptions || []).forEach((disp) => {
    allDispositionCounts[disp] =
      leads?.filter((l) => l.disposition === disp).length || 0;
  });

  const dispositionCounts = {};
  FINAL_DISPOSITIONS.forEach((disp) => {
    dispositionCounts[disp] =
      leads?.filter((l) => l.disposition === disp).length || 0;
  });

  const safeSetDisposition = (value) => {
    if (typeof setSelectedDisposition === "function") {
      setSelectedDisposition(value);
    }
  };

  const isAdmin = user?.status?.toLowerCase() === "admin";

  return (
    <div className="lg:w-80 lg:bg-white lg:rounded-lg lg:shadow-lg lg:p-6 lg:fixed lg:top-0 lg:left-0 lg:z-10">
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-gradient-to-r from-blue-600 to-[#154c79] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <TbX size={18} /> : <TbFilter size={18} />}
      </button>

      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-11/12 sm:w-64 max-w-xs bg-white rounded-r-lg shadow-lg p-4 sm:p-6 fixed top-0 left-0 h-full z-10 transition-transform duration-300 ease-in-out lg:w-80`}
      >
        <div className="relative h-full flex flex-col">
          <h2 className="text-[20px] font-semibold text-[#154c79] mb-4 font-serif text-center md:text-left flex items-center gap-2">
            <MdDashboard size={24} /> Dashboard Navigation
          </h2>

          <div className="flex-1 overflow-y-auto pr-1 mb-6 space-y-4">
            <Link
              href="/dashboard/leaddashboard"
              onClick={() => {
                setSelectedSite("all");
                safeSetDisposition("all");
                setSelectedUser(null);
                setIsSidebarOpen(false);
              }}
              className={`block text-left text-base rounded-md px-4 py-3 md:flex items-center gap-3 font-medium transition-all ${
                pathname === "/dashboard/leaddashboard" && !isConvertedPool
                  ? "bg-[#154c79] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MdLeaderboard size={22} />
              Leads Dashboard
            </Link>

            <Link
              href="/dashboard/school-matcher"
              onClick={() => setIsSidebarOpen(false)}
              className="block text-left text-base rounded-md px-4 py-3 md:flex items-center gap-3 text-gray-700 hover:bg-gray-100"
            >
              <IoIosSchool size={22} /> Find Your Schools
            </Link>

            <Link
              href="/dashboard/claim-school"
              onClick={() => setIsSidebarOpen(false)}
              className="block text-left text-base rounded-md px-4 py-3 md:flex items-center gap-3 text-gray-700 hover:bg-gray-100"
            >
              <LuBaggageClaim size={22} /> Claim Schools Leads
            </Link>
            <Link
              href="/dashboard/LeadAnalytics"
              onClick={() => setIsSidebarOpen(false)}
              className={`block text-left text-base rounded-md px-4 py-2 ${
                pathname === "/dashboard/LeadAnalytics"
                  ? "bg-[#154c79] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex gap-4">
                <IoMdAnalytics className="text-2xl text-black " />
                Analytics Dashboard
              </div>
            </Link>

            <hr className="my-5 border-gray-300" />

            <div className="space-y-3">
              <h3 className="text-[18px] font-serif font-semibold text-[#154c79] flex items-center gap-2">
                <GiTrophy size={20} className="text-[#154c79]" />
                Lead Pool
              </h3>

              <select
                value={selectedSite}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedSite(value);
                  safeSetDisposition("all");
                  setSelectedUser(null);
                  setIsSidebarOpen(false);
                }}
                className="w-full text-base rounded-md px-4 py-3 text-gray-700 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#154c79]"
              >
                <option value="all">
                  {isAnalytics ? "All Leads" : "All Leads (Active)"}
                </option>
                <option value="converted-pool">
                  {isAnalytics ? "All Dispositions" : "Disposition Pool"} (
                  {convertedCount})
                </option>
              </select>

              {isConvertedPool && (
                <div className="ml-4 mt-2 space-y-2">
                  <label className="text-sm text-[#154c79]">
                    {isAnalytics
                      ? "Filter by Disposition"
                      : "Filter by Conversion Status"}
                  </label>
                  <select
                    value={selectedDisposition}
                    onChange={(e) => {
                      safeSetDisposition(e.target.value);
                      setIsSidebarOpen(false);
                    }}
                    className="w-full text-sm rounded-md px-3 py-2 border border-[#4079a9] text-[#154c79] focus:ring-2 focus:ring-[#154c79]"
                  >
                    <option value="all">
                      {isAnalytics ? "All Dispositions" : "All Converted"} (
                      {isAnalytics ? totalLeadsCount : convertedCount})
                    </option>
                    {isAnalytics
                      ? dispositionOptions?.map((disp) => (
                          <option key={disp} value={disp}>
                            {disp} ({allDispositionCounts[disp]})
                          </option>
                        ))
                      : FINAL_DISPOSITIONS.map((disp) => (
                          <option key={disp} value={disp}>
                            {disp} ({dispositionCounts[disp]})
                          </option>
                        ))}
                  </select>
                </div>
              )}
            </div>

            <hr className="my-5 border-gray-300" />

            {isAdmin && (
              <>
                <h3 className="text-[18px] font-serif font-semibold text-[#154c79] flex items-center gap-2">
                  <FaFilter size={18} /> Filter by User
                </h3>
                <select
                  value={selectedUser || "all"}
                  onChange={(e) => {
                    setSelectedUser(
                      e.target.value === "all" ? null : e.target.value
                    );
                    setIsSidebarOpen(false);
                  }}
                  className="w-full text-base rounded-md px-4 py-2 text-gray-600 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#154c79]"
                >
                  <option value="all">All Users</option>
                  {fetchedusers
                    ?.filter((u) => u.email !== user.email)
                    .map((u) => (
                      <option key={u.email} value={u.email}>
                        {u.name || u.email}
                      </option>
                    ))}
                </select>
              </>
            )}

            {!isConvertedPool && (
              <>
                <h3 className="text-[18px] font-serif font-semibold text-[#154c79] flex items-center gap-2">
                  <FaFilter size={18} /> Filter by Site
                </h3>
                <select
                  value={selectedSite}
                  onChange={(e) => {
                    setSelectedSite(e.target.value);
                    if (e.target.value === "all") setSelectedUser(null);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full text-base rounded-md px-4 py-2 text-gray-600 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#154c79]"
                >
                  {sites.map((site) => (
                    <option key={site} value={site}>
                      {site === "all"
                        ? "All Sites"
                        : site === "others"
                        ? "Others"
                        : site}
                    </option>
                  ))}
                </select>

                <h3 className="text-[18px] font-serif font-semibold text-[#154c79] mt-6 mb-2">
                  Filter by Disposition
                </h3>
                <select
                  value={selectedDisposition}
                  onChange={(e) => {
                    safeSetDisposition(e.target.value);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full text-base rounded-md px-4 py-2 text-gray-600 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#154c79]"
                >
                  <option value="all">All Dispositions</option>
                  {dispositionOptions?.map((disp) => (
                    <option key={disp} value={disp}>
                      {disp}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          {user && (
            <div
              onClick={() => {
                logout();
                setIsSidebarOpen(false);
              }}
              className="cursor-pointer bg-red-600 text-white p-3 rounded-md mt-4 hover:bg-red-500 text-center flex justify-center items-center gap-2 font-medium"
            >
              <TbLogout2 size={20} /> Logout
            </div>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default FilterSidebar;