"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLead } from "@/providers/LeadProvider";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

const LeadTable = ({ onEdit, onDelete }) => {
  const { leads } = useLead();
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedSite, setSelectedSite] = useState("all");
  const menuRef = useRef(null);

  // Function to extract domain from URL
  const getDomainFromUrl = (url) => {
    if (!url) return null;
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch {
      return null;
    }
  };

  // Get unique site names (domains) for the sidebar
  const sites = [
    "all",
    ...new Set(
      leads?.map((lead) => getDomainFromUrl(lead?.url)).filter(Boolean)
    ),
  ];

  // Filter and sort leads
  useEffect(() => {
    if (!leads) return;

    let results = [...leads];
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = results.filter(
        (lead) =>
          lead?.name?.toLowerCase().includes(lowercasedTerm) ||
          lead?.source?.toLowerCase().includes(lowercasedTerm)
      );
    }

    if (selectedSite !== "all") {
      results = results.filter((lead) => {
        const domain = getDomainFromUrl(lead?.url);
        return domain === selectedSite;
      });
    }

    results.sort((a, b) => {
      if (!a[sortConfig.key]) return 1;
      if (!b[sortConfig.key]) return -1;

      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }

      return sortConfig.direction === "asc"
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    });

    setFilteredLeads(results);
    setCurrentPage(1);
  }, [leads, searchTerm, sortConfig, selectedSite]);

  // Pagination
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const firstPage = () => setCurrentPage(1);
  const lastPage = () => setCurrentPage(totalPages);

  // Sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortDirectionIndicator = (columnName) => {
    if (sortConfig.key !== columnName) return null;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Table headers
  const headers = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone" },
    { key: "budget", label: "Budget" },
    { key: "url", label: "URL" },
    { key: "board", label: "Board" },
    { key: "currentClass", label: "Current Class" },
    { key: "seekingClass", label: "Seeking Class" },
    { key: "schoolType", label: "School Type" },
    { key: "type", label: "Type" },
    { key: "source", label: "Source" },
    { key: "disposition", label: "Disposition" },
    { key: "assignedTo", label: "Assigned To" },
    { key: "assignedBy", label: "Assigned By" },
    { key: "date", label: "Date" },
    { key: "location", label: "Location" },
    { key: "remark", label: "Remark" },
    { key: "parentName", label: "Parent Name" },
    { key: "school", label: "School" },
    { key: "", label: "Actions" },
  ];

  return (
    <div className="flex p-6 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 bg-white rounded-lg shadow-lg mr-6 p-6  sticky top-0">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">
          Filter by Site
        </h2>
        <div className="flex flex-col gap-2">
          {sites.map((site) => (
            <button
              key={site}
              onClick={() => setSelectedSite(site)}
              className={`text-left text-[16px] rounded-md px-4 py-2 ${
                selectedSite === site
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {site === "all" ? "All Sites" : site}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 border border-gray-200 bg-white rounded-lg shadow-lg p-6 min-w-0 overflow-visible">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Leads Dashboard</h1>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-[16px] text-blue-600 mb-1">Total Leads</p>
            <p className="text-2xl font-bold text-blue-600">
              {leads?.length || 0}
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <TextField
            fullWidth
            placeholder="Search leads by name or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </InputAdornment>
              ),
            }}
            className="w-full !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-blue-500"
          />
        </div>

        {/* Table */}
        <TableContainer
          className="rounded-lg shadow-md overflow-x-auto w-full "
          style={{ maxHeight: "70vh" }}
        >
          <div className="min-w-[1200px]">
            {/* Ensures table is wide enough to scroll */}
            <Table stickyHeader>
              <TableHead>
                <TableRow className="">
                  {headers.map((header, index) => (
                    <TableCell
                      key={header.key}
                      className={`bg-blue-600 text-white text-xs font-medium uppercase tracking-wider px-6 py-4 ${
                        header.key ? "cursor-pointer hover:bg-blue-700" : ""
                      } whitespace-nowrap`}
                      style={{
                        width: index === headers.length - 1 ? 80 : 160,
                        background: "blue",
                        color: "white",
                      }}
                      onClick={() => header.key && requestSort(header.key)}
                    >
                      <div className="flex items-center gap-2">
                        {header.label}
                        {header.key &&
                          getSortDirectionIndicator(header.key) && (
                            <span>{getSortDirectionIndicator(header.key)}</span>
                          )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {currentLeads.length > 0 ? (
                  currentLeads.map((lead, index) => (
                    <TableRow
                      key={lead.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-100`}
                    >
                      <TableCell
                        className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.name}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.email}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.phoneNumber}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.budget}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.url && (
                          <a
                            href={lead.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {lead.url.length > 20
                              ? lead.url.substring(0, 20) + "..."
                              : lead.url}
                          </a>
                        )}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.board}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.currentClass}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.seekingClass}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.schoolType}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.type}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.source}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        <Chip
                          label={lead?.disposition}
                          size="small"
                          className={`font-medium ${
                            lead?.disposition === "Active"
                              ? "bg-green-100 text-green-800"
                              : lead?.disposition === "Inactive"
                              ? "bg-red-100 text-red-800"
                              : lead?.disposition === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        />
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.assignedTo}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.assignedBy}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.date}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.location}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.remark}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.parentName}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.school}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm font-medium whitespace-nowrap"
                        style={{ width: 80 }}
                      >
                        <div ref={menuRef} className="relative">
                          <Button
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(
                                openMenuId === lead.id ? null : lead.id
                              );
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </Button>
                          {openMenuId === lead.id && (
                            <div className="absolute top-8 right-0 w-36 bg-white rounded-md shadow-lg border border-gray-100 z-10">
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onEdit(lead);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-2 text-blue-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onDelete(lead.id);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-2 text-red-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow >
                    <TableCell
                      colSpan={headers.length}
                      className="px-6 py-4 text-center text-[20px]"
                    >
                      No leads found 
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TableContainer>

        {/* Pagination */}
        {filteredLeads.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 overflow-x-auto min-w-0">
            <div className="flex sm:hidden justify-between">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 border border-gray-300 rounded-md text-sm ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                Previous
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border border-gray-300 rounded-md text-sm ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex items-center justify-between">
              <p className="text-sm text-gray-600 whitespace-nowrap">
                Showing <strong>{indexOfFirstLead + 1}</strong> to{" "}
                <strong>
                  {Math.min(indexOfLastLead, filteredLeads.length)}
                </strong>{" "}
                of <strong>{filteredLeads.length}</strong> results
              </p>
              <nav
                className="inline-flex flex-nowrap rounded-md shadow-sm gap-px"
                aria-label="Pagination"
              >
                <button
                  onClick={firstPage}
                  disabled={currentPage === 1}
                  className={`px-2 py-2 border border-gray-300 rounded-l-md bg-white ${
                    currentPage === 1
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <ChevronDoubleLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-2 py-2 border border-gray-300 bg-white ${
                    currentPage === 1
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                {[...Array(totalPages).keys()].map((number) => {
                  if (
                    number + 1 === 1 ||
                    number + 1 === totalPages ||
                    (number + 1 >= currentPage - 1 &&
                      number + 1 <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`px-4 py-2 border border-gray-300 text-sm ${
                          currentPage === number + 1
                            ? "bg-blue-100 text-blue-600 font-semibold"
                            : "bg-white text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {number + 1}
                      </button>
                    );
                  }
                  if (
                    (number + 1 === currentPage - 2 && currentPage > 3) ||
                    (number + 1 === currentPage + 2 &&
                      currentPage < totalPages - 2)
                  ) {
                    return (
                      <div
                        key={number + 1}
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-500 text-sm flex items-center"
                      >
                        ...
                      </div>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-2 border border-gray-300 bg-white ${
                    currentPage === totalPages
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={lastPage}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-2 border border-gray-300 rounded-r-md bg-white ${
                    currentPage === totalPages
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <ChevronDoubleRightIcon className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadTable;
