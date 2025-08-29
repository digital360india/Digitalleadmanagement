"use client";

import React from "react";
import { TbFilter, TbX, TbLogout2 } from "react-icons/tb";
import Link from "next/link";

const FilterSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  sites,
  selectedSite,
  setSelectedSite,
  user,
  logout,
}) => {
  return (
    <div className="lg:w-80 lg:bg-white lg:rounded-lg lg:shadow-lg lg:p-6 lg:fixed lg:top-0 lg:left-0 lg:z-10">
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-gradient-to-r from-blue-600 to-[#154c79] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close filter menu" : "Open filter menu"}
      >
        {isSidebarOpen ? <TbX size={18} /> : <TbFilter size={18} />}
      </button>

      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-11/12 sm:w-64 max-w-xs bg-white rounded-r-lg shadow-lg p-4 sm:p-6 fixed top-0 left-0 h-full z-10 transition-transform duration-300 ease-in-out lg:w-80`}
      >
        <div className="relative h-screen flex flex-col">
          <h2 className="text-lg font-semibold text-[#154c79] mb-4 font-serif text-center md:text-left">
            Dashboard Navigation
          </h2>
          <div className="flex flex-col gap-2 overflow-y-auto">
            <Link
              href="/dashboard/leaddashboard"
              onClick={() => setIsSidebarOpen(false)}
              className={`text-left text-base rounded-md px-4 py-2 ${
                selectedSite === "dashboard"
                  ? "bg-[#154c79] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Leads Dashboard
            </Link>
            <Link
              href="/dashboard/school-matcher"
              onClick={() => setIsSidebarOpen(false)}
              className={`text-left text-base rounded-md px-4 py-2 ${
                selectedSite === "school-matcher"
                  ? "bg-[#154c79] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Find Your Schools
            </Link>
            <Link
              href="/dashboard/claim-school"
              onClick={() => setIsSidebarOpen(false)}
              className={`text-left text-base rounded-md px-4 py-2 ${
                selectedSite === "claim-school"
                  ? "bg-[#154c79] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Claim Schools leads
            </Link>
            <h3 className="text-base font-semibold text-[#154c79] mt-4">
              Filter by Site
            </h3>
            {sites.map((site) => (
              <button
                key={site}
                onClick={() => {
                  setSelectedSite(site);
                  setIsSidebarOpen(false);
                }}
                className={`text-left text-base rounded-md px-4 py-2 ${
                  selectedSite === site
                    ? "bg-[#154c79] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {site === "all"
                  ? "All Sites"
                  : site === "others "
                  ? "Others"
                  : site}
              </button>
            ))}
          </div>
          {user && (
            <div
              onClick={() => {
                logout();
                setIsSidebarOpen(false);
              }}
              className="cursor-pointer bg-red-600 text-white p-3 absolute bottom-10 hover:bg-red-500 rounded-md mt-5 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)]"
            >
              <p className="cursor-pointer text-center flex justify-center items-center gap-2">
                <TbLogout2 size={20} /> Logout
              </p>
            </div>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default FilterSidebar;
