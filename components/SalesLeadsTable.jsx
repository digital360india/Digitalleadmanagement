"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLead } from "@/providers/LeadProvider";
import EditLeadPopup from "./EditLeadPopup";
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
  Button,
  InputAdornment,
  TextField,
  Typography,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useAuth } from "@/providers/AuthProvider";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuPencil } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";

const SalesLeadsTable = ({ onDelete }) => {
  const { logout, user } = useAuth();
  const { leads, updateLead, deleteLead, fetchedusers } = useLead();
  const [userleads, setLeads] = useState([]);

  const [filteredLeads, setFilteredLeads] = useState([]);
  const [totalUniqueLeads, setTotalUniqueLeads] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedSite, setSelectedSite] = useState("all");
  const [editingLead, setEditingLead] = useState(null);
  const menuRef = useRef(null);

  const getDomainFromUrl = (url) => {
    if (!url) return null;
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch {
      return null;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "-";
    }
  };

  const truncateUrl = (url, maxLength) => {
    if (!url) return "-";
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  const sites = leads
    ? [
        "all",
        ...new Set(
          leads.map((lead) => getDomainFromUrl(lead?.url)).filter(Boolean)
        ),
      ]
    : ["all"];

  useEffect(() => {
    if (!leads || !user) {
      setFilteredLeads([]);
      setTotalUniqueLeads(0);
      return;
    }

    // Deduplicate leads based on email and source
    const uniqueLeadsMap = new Map();
    leads.forEach((lead) => {
      const key = `${lead?.email?.toLowerCase() || ""}-${
        lead?.source?.toLowerCase() || ""
      }`;
      if (!uniqueLeadsMap.has(key)) {
        uniqueLeadsMap.set(key, lead);
      } else {
        const existingLead = uniqueLeadsMap.get(key);
        if (new Date(lead.date) > new Date(existingLead.date)) {
          uniqueLeadsMap.set(key, lead);
        }
      }
    });

    
    let results = Array.from(uniqueLeadsMap.values());
  
    results = results.filter((lead) => lead?.assignedTo === user.name);
    setTotalUniqueLeads(results.length);


    // Apply search filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = results.filter(
        (lead) =>
          lead?.name?.toLowerCase().includes(lowercasedTerm) ||
          lead?.source?.toLowerCase().includes(lowercasedTerm)
      );
    }

    // Apply site filter
    if (selectedSite !== "all") {
      results = results.filter((lead) => {
        const domain = getDomainFromUrl(lead?.url);
        return domain === selectedSite;
      });
    }

    // Sort results
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
  }, [leads, searchTerm, sortConfig, selectedSite, leadsPerPage]);

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = leads ? Math.ceil(filteredLeads.length / leadsPerPage) : 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const firstPage = () => setCurrentPage(1);
  const lastPage = () => setCurrentPage(totalPages);

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

  const handleEdit = (lead) => {
    setEditingLead(lead);
  };

  const handleSaveEdit = (updatedLead) => {
    try {
      if (typeof updateLead !== "function") {
        throw new Error(
          "updateLead is not a function. Please ensure LeadProvider is set up correctly."
        );
      }

      updateLead(updatedLead);
      setEditingLead(null);
    } catch (error) {
      console.error("Error updating lead:", error);
      alert("Error updating lead. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteLead(id);
        if (onDelete) {
          onDelete(id);
        }
        setOpenMenuId(null);
      } catch (error) {
        console.error("Error deleting lead:", error);
        alert("Failed to delete lead. Please try again.");
      }
    }
  };

  const headers = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone" },
    { key: "parentName", label: "Parent Name" },
    { key: "budget", label: "Budget" },
    { key: "url", label: "URL" },
    { key: "currentClass", label: "Current Class" },
    { key: "seekingClass", label: "Seeking Class" },
    { key: "board", label: "Board" },
    { key: "schoolType", label: "School Type" },
    { key: "type", label: "Type" },
    { key: "source", label: "Source" },

    { key: "date", label: "Date" },
    { key: "location", label: "Location" },
    { key: "school", label: "School" },
    { key: "remark", label: "Remark" },
    { key: "disposition", label: "Disposition" },
    { key: "assignedTo", label: "Assigned To" },
    { key: "assignedBy", label: "Assigned By" },
    { key: "", label: "Actions" },
  ];

  const dispositionOptions = ["Hot", "Cold", "Warm", "Undefined"];
  const handleDispositionChange = async (leadId, newDisposition) => {
    try {
      const leadToUpdate = leads.find((lead) => lead.id === leadId);
      if (!leadToUpdate) {
        // console.error("Lead not found:", leadId);
        return;
      }
      const updatedLead = {
        ...leadToUpdate,
        disposition: newDisposition,
      };

      await updateLead(updatedLead);
    } catch (error) {
      console.error("Error updating lead disposition:", error);
      alert("Failed to update lead disposition. Please try again.");
    }
  };

  const handleAssignedToChange = async (leadId, newAssignedTo) => {
    try {
      const updatedLead = {
        id: leadId,
        assignedTo: newAssignedTo,
        assignedBy: user.email,
      };
      await updateLead(updatedLead);

      // Update local state so UI reflects the new assignment
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === leadId ? { ...lead, assignedTo: newAssignedTo } : lead
        )
      );

      alert("Assigned To updated successfully!");
    } catch (error) {
      console.error("Error updating Assigned To:", error);
      alert("Failed to update Assigned To. Please try again.");
    }
  };

  return (
    <div className="flex p-6 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen overflow-hidden">
      <div className="hidden lg:block w-80 bg-white rounded-lg shadow-lg p-6 fixed top-0 left-0 h-screen z-10">
        <div className="relative h-screen">
          <h2 className="text-lg font-semibold text-blue-700 mb-4 font-serif">
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
          {user && (
            <div className="cursor-pointer bg-red-600  text-white p-3 hover:bg-red-500 rounded-md mt-5 absolute bottom-10 w-full">
              <p
                className="cursor-pointer text-center flex justify-center items-center"
                onClick={logout}
              >
                <TbLogout2
                  size={20}
                  className="
                mt-[3px]"
                />
                &nbsp;Logout
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 border border-gray-200 bg-white rounded-lg shadow-lg p-6 min-w-0 overflow-visible lg:ml-80">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700 font-serif">
            {user?.name} Leads Dashboard
          </h1>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-[20px] text-green-600 mb-1 font-serif">
              Total Leads
            </p>
            <p className="text-2xl font-bold text-green-600">
              {totalUniqueLeads}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <TextField
            fullWidth
            placeholder="Search leads by name or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon className="h-5 w-5 text-indigo-600" />
                </InputAdornment>
              ),
            }}
            className="w-full !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-blue-500"
          />
        </div>

        <TableContainer
          className="rounded-lg shadow-md overflow-x-auto w-full"
          style={{ maxHeight: "70vh" }}
        >
          <div className="min-w-[1200px] min-h-[200px]">
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableCell
                      key={header.key}
                      className={` text-xs font-medium uppercase tracking-wider px-6 py-4 whitespace-nowrap `}
                      style={{
                        width:
                          index === headers.length - 1
                            ? 80
                            : header.key === "remark"
                            ? "auto"
                            : 160,
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
                        {lead?.name || "-"}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.email || "-"}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.phoneNumber || "-"}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.parentName || "-"}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.budget || "-"}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.url ? (
                          <Tooltip title={lead.url} arrow>
                            <a
                              href={lead.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline cursor-pointer"
                            >
                              {truncateUrl(lead.url, 60)}
                            </a>
                          </Tooltip>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.currentClass || "-"}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.seekingClass || "-"}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.board || "-"}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.schoolType || "-"}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.type || "-"}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.source || "-"}
                      </TableCell>

                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {formatDateTime(lead?.date)}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.location || "-"}
                      </TableCell>

                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.school || "-"}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600"
                        style={{
                          width: "auto",
                          minWidth: "200px",
                          maxWidth: "400px",
                          whiteSpace: "normal",
                          overflowWrap: "break-word",
                          wordWrap: "break-word",
                          height: "auto",
                        }}
                      >
                        <div
                          className="remark-content"
                          style={{
                            maxHeight: "150px",
                            overflowY: "auto",
                            overflowX: "hidden",
                          }}
                        >
                          {lead?.remark || "-"}
                        </div>
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        <Select
                          value={lead?.disposition || "Undefined"}
                          onChange={(e) =>
                            handleDispositionChange(lead.id, e.target.value)
                          }
                          size="small"
                          className={`w-full text-sm rounded-md ${
                            lead?.disposition === "Hot"
                              ? "bg-red-100 text-red-700"
                              : lead?.disposition === "Cold"
                              ? "bg-blue-100 text-blue-700"
                              : lead?.disposition === "Warm"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {dispositionOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm"
                        style={{ width: 160 }}
                      >
                        <Select
                          value={lead.assignedTo || "Unassigned"}
                          onChange={(e) =>
                            handleAssignedToChange(lead.id, e.target.value)
                          }
                          size="small"
                          className="w-full text-sm rounded-md"
                          renderValue={(selected) => {
                            return selected ? selected : <em>Assigned To</em>;
                          }}
                        >
                          {fetchedusers.map((user) => (
                            <MenuItem key={user.id} value={user.name}>
                              {user.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.assignedBy || "Unassigned"}{" "}
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm font-medium whitespace-nowrap"
                        style={{ width: 80 }}
                      >
                        <div className="relative">
                          <Button
                            className="p-2 cursor-pointer text-gray-400 hover:text-gray-600 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(
                                openMenuId === lead.id ? null : lead.id
                              );
                            }}
                          >
                            <BsThreeDotsVertical size={20} />
                          </Button>
                          {openMenuId === lead.id && (
                            <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border border-gray-100 z-10">
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleEdit(lead);
                                }}
                              >
                                <LuPencil size={19} className="text-blue-600" />
                                &nbsp; Edit{" "}
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex items-center"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleDelete(lead.id);
                                }}
                              >
                                <MdOutlineDelete
                                  size={24}
                                  className="text-red-600"
                                />
                                &nbsp; Delete{" "}
                              </button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
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

        {editingLead && (
          <EditLeadPopup
            lead={editingLead}
            onSave={handleSaveEdit}
            onClose={() => setEditingLead(null)}
          />
        )}
      </div>
    </div>
  );
};

export default SalesLeadsTable;
