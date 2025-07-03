"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLead } from "@/providers/LeadProvider";
import EditLeadPopup from "./EditLeadPopup";
import AddLeadForm from "./LeadForm";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  BellIcon,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Popover,
  Badge,
} from "@mui/material";
import { useAuth } from "@/providers/AuthProvider";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuPencil } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { TbFilter, TbX } from "react-icons/tb";
import * as XLSX from "xlsx";
import { ImFileExcel } from "react-icons/im";

const SalesLeadsTable = ({ onDelete }) => {
  const { logout, user } = useAuth();
  const { leads, updateLead, deleteLead, fetchedusers, addLead } = useLead();
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
  const [reminderLead, setReminderLead] = useState(null);
  const [remarkLead, setRemarkLead] = useState(null);
  const [reminderDateTime, setReminderDateTime] = useState("");
  const [newRemark, setNewRemark] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeReminders, setActiveReminders] = useState([]);
  const [addLeadDialogOpen, setAddLeadDialogOpen] = useState(false);
  const [newLeads, setNewLeads] = useState(new Set());
  const menuRef = useRef(null);

  const getDomainFromUrl = (url) => {
    if (!url) return null;
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname.replace(/^www\./, "");
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

  const exportToExcel = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Alternate Number",
      "Parent Name",
      "Budget",
      "URL",
      "Current Class",
      "Seeking Class",
      "Board",
      "School Type",
      "Type",
      "Source",
      "Date",
      "Location",
      "School",
      "Remark",
      "Disposition",
      "Specific Disposition",
      "Assigned To",
      "Assigned By",
    ];

    const data = filteredLeads.map((lead) => ({
      Name: lead?.name || "-",
      Email: lead?.email || "-",
      Phone: lead?.phoneNumber || "-",
      "Alternate Number": lead?.alternateNumber || "-",
      "Parent Name": lead?.parentName || "-",
      Budget: lead?.budget || "-",
      URL: lead?.url || "-",
      "Current Class": lead?.currentClass || "-",
      "Seeking Class": lead?.seekingClass || "-",
      Board: lead?.board || "-",
      "School Type": lead?.schoolType || "-",
      Type: lead?.type || "-",
      Source: lead?.source || "-",
      Date: formatDateTime(lead?.date),
      Location: lead?.location || "-",
      School: lead?.school || "-",
      Remark: lead?.remark || "-",
      Disposition: lead?.disposition || "Undefined",
      "Specific Disposition": lead?.specificDisposition || "-",
      "Assigned To": lead?.assignedTo || "Unassigned",
      "Assigned By": lead?.assignedBy || "Unassigned",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "sales_leads_export.xlsx");
  };

  const sites = leads
    ? [
        "all",
        ...new Set(
          leads.map((lead) => getDomainFromUrl(lead?.url)).filter(Boolean)
        ),
      ]
    : ["all"];

  const setReminder = (lead, reminderDateTime) => {
    const now = new Date().getTime();
    const reminderTime = new Date(reminderDateTime).getTime();

    if (isNaN(reminderTime) || reminderTime <= now) {
      return { message: "Invalid date. Please select a future date and time." };
    }

    const reminderMessage = `Reminder set for ${formatDateTime(
      reminderDateTime
    )} for lead ${lead.name || "Unnamed Lead"} (${
      lead.disposition || "Undefined"
    })`;

    const reminderData = {
      leadId: lead.id,
      disposition: lead.disposition || "Undefined",
      specificDisposition: lead.specificDisposition || "-",
      leadName: lead.name || "Unnamed Lead",
      leadEmail: lead.email || "No Email",
      leadNumber: lead.phoneNumber || "No Phone",
      leadAlternateNumber: lead.alternateNumber || "No Alternate Number",
      leadUrl: lead.url || "No URL",
      leadParentName: lead.parentName || "No Parent Name",
      leadBudget: lead.budget || "No Budget",
      leadCurrentClass: lead.currentClass || "No Current Class",
      leadSeekingClass: lead.seekingClass || "No Seeking Class",
      leadBoard: lead.board || "No Board",
      leadSchoolType: lead.schoolType || "No School Type",
      leadType: lead.type || "No Type",
      leadSource: lead.source || "No Source",
      leadDate: formatDateTime(lead.date),
      leadLocation: lead.location || "No Location",
      leadSchool: lead.school || "No School",
      leadRemark: lead.remark || "No Remark",
      leadAssignedTo: lead.assignedTo || "Unassigned",
      leadAssignedBy: lead.assignedBy || "Unassigned",
      reminderTime,
    };

    localStorage.setItem(`reminder_${lead.id}`, JSON.stringify(reminderData));

    setActiveReminders((prev) => {
      const updatedReminders = prev.filter((r) => r.leadId !== lead.id);
      return [...updatedReminders, reminderData];
    });

    const timeUntilReminder = reminderTime - now;
    setTimeout(() => {
      const reminderData = JSON.parse(
        localStorage.getItem(`reminder_${lead.id}`)
      );
      if (reminderData) {
        setNotification({
          open: true,
          message: `Reminder: Follow up on lead ${reminderData.leadName} (${reminderData.disposition})`,
          severity: "info",
          leadDetails: {
            name: reminderData.leadName,
            email: reminderData.leadEmail,
            phoneNumber: reminderData.leadNumber,
            alternateNumber: reminderData.leadAlternateNumber,
            url: reminderData.leadUrl,
            parentName: reminderData.leadParentName,
            budget: reminderData.leadBudget,
            currentClass: reminderData.leadCurrentClass,
            seekingClass: reminderData.leadSeekingClass,
            board: reminderData.leadBoard,
            schoolType: reminderData.leadSchoolType,
            type: reminderData.leadType,
            source: reminderData.leadSource,
            date: reminderData.leadDate,
            location: reminderData.leadLocation,
            school: reminderData.leadSchool,
            remark: reminderData.leadRemark,
            specificDisposition: reminderData.specificDisposition,
            assignedTo: reminderData.leadAssignedTo,
            assignedBy: reminderData.leadAssignedBy,
          },
        });
        localStorage.removeItem(`reminder_${lead.id}`);
        setActiveReminders((prev) => prev.filter((r) => r.leadId !== lead.id));
      }
    }, timeUntilReminder);

    return { message: reminderMessage };
  };

  const handleAddRemark = (lead, newRemark) => {
    if (!newRemark.trim()) {
      setNotification({
        open: true,
        message: "Remark cannot be empty.",
        severity: "error",
      });
      return;
    }

    const updatedLead = {
      ...lead,
      remark: lead.remark ? `${lead.remark}\n${newRemark}` : newRemark,
    };

    try {
      updateLead(updatedLead);
      setNotification({
        open: true,
        message: `Remark added for lead ${lead.name || "Unnamed Lead"}`,
        severity: "success",
        leadDetails: {
          name: updatedLead.name || "Unnamed Lead",
          email: updatedLead.email || "No Email",
          phoneNumber: updatedLead.phoneNumber || "No Phone",
          alternateNumber: updatedLead.alternateNumber || "No Alternate Number",
          url: updatedLead.url || "No URL",
          parentName: updatedLead.parentName || "No Parent Name",
          budget: updatedLead.budget || "No Budget",
          currentClass: updatedLead.currentClass || "No Current Class",
          seekingClass: updatedLead.seekingClass || "No Seeking Class",
          board: updatedLead.board || "No Board",
          schoolType: updatedLead.schoolType || "No School Type",
          type: updatedLead.type || "No Type",
          source: updatedLead.source || "No Source",
          date: formatDateTime(updatedLead.date),
          location: updatedLead.location || "No Location",
          school: updatedLead.school || "No School",
          remark: updatedLead.remark || "No Remark",
          specificDisposition: updatedLead.specificDisposition || "-",
          assignedTo: updatedLead.assignedTo || "Unassigned",
          assignedBy: updatedLead.assignedBy || "Unassigned",
        },
      });
      setRemarkLead(null);
      setNewRemark("");
      // Mark lead as viewed
      setNewLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lead.id);
        return newSet;
      });
    } catch (error) {
      console.error("Error adding remark:", error);
      setNotification({
        open: true,
        message: "Failed to add remark. Please try again.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (!leads) return;

    const now = new Date().getTime();
    const reminders = [];
    leads.forEach((lead) => {
      const reminderKey = `reminder_${lead.id}`;
      const reminderData = localStorage.getItem(reminderKey);
      if (reminderData) {
        const parsedData = JSON.parse(reminderData);
        if (
          parsedData.reminderTime > now &&
          parsedData.leadAssignedTo === user.email
        ) {
          reminders.push(parsedData);
          setTimeout(() => {
            setNotification({
              open: true,
              message: `Reminder: Follow up on lead ${parsedData.leadName} (${parsedData.disposition})`,
              severity: "info",
              leadDetails: {
                name: parsedData.leadName,
                email: parsedData.leadEmail,
                phoneNumber: parsedData.leadNumber,
                alternateNumber: parsedData.leadAlternateNumber,
                url: parsedData.leadUrl,
                parentName: parsedData.leadParentName,
                budget: parsedData.leadBudget,
                currentClass: parsedData.leadCurrentClass,
                seekingClass: parsedData.leadSeekingClass,
                board: parsedData.leadBoard,
                schoolType: parsedData.leadSchoolType,
                type: parsedData.leadType,
                source: parsedData.leadSource,
                date: parsedData.leadDate,
                location: parsedData.leadLocation,
                school: parsedData.leadSchool,
                remark: parsedData.leadRemark,
                specificDisposition: parsedData.specificDisposition,
                assignedTo: parsedData.leadAssignedTo,
                assignedBy: parsedData.leadAssignedBy,
              },
            });
            localStorage.removeItem(reminderKey);
            setActiveReminders((prev) =>
              prev.filter((r) => r.leadId !== lead.id)
            );
          }, parsedData.reminderTime - now);
        } else {
          localStorage.removeItem(reminderKey);
        }
      }
    });
    setActiveReminders(reminders);

    // Identify new leads (e.g., leads created within the last 24 hours)
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
    const newLeadIds = new Set(
      user?.email
        ? leads
            .filter(
              (lead) =>
                new Date(lead.date) > twentyFourHoursAgo &&
                lead.assignedTo === user.email
            )
            .map((lead) => lead.id)
        : []
    );

    setNewLeads(newLeadIds);
  }, [leads, user]);

  useEffect(() => {
    if (!leads || !user) {
      setFilteredLeads([]);
      setTotalUniqueLeads(0);
      return;
    }

    const uniqueLeadsMap = new Map();
    leads.forEach((lead) => {
      const key = `${lead?.email?.toLowerCase() || ""}-${
        lead?.source?.toLowerCase() || ""
      }`;
      if (!uniqueLeadsMap.has(key)) {
        uniqueLeadsMap.set(key, {
          ...lead,
          disposition: lead.disposition || "Undefined",
          specificDisposition: lead.specificDisposition || "-",
        });
      } else {
        const existingLead = uniqueLeadsMap.get(key);
        if (new Date(lead.date) > new Date(existingLead.date)) {
          uniqueLeadsMap.set(key, {
            ...lead,
            disposition: lead.disposition || "Undefined",
            specificDisposition: lead.specificDisposition || "-",
          });
        }
      }
    });

    let results = Array.from(uniqueLeadsMap.values());
    results = results.filter((lead) => lead?.assignedTo === user.email);
    setTotalUniqueLeads(results.length);

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = results.filter(
        (lead) =>
          lead?.name?.toLowerCase().includes(lowercasedTerm) ||
          lead?.source?.toLowerCase().includes(lowercasedTerm) ||
          lead?.specificDisposition?.toLowerCase().includes(lowercasedTerm)
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
  }, [leads, searchTerm, sortConfig, selectedSite, leadsPerPage, user]);

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
    setOpenMenuId(null);
    setNewLeads((prev) => {
      const newSet = new Set(prev);
      newSet.delete(lead.id);
      return newSet;
    });
  };

  const handleRemark = (lead) => {
    setRemarkLead(lead);
    setNewRemark("");
    setOpenMenuId(null);
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
        localStorage.removeItem(`reminder_${id}`);
        setActiveReminders((prev) => prev.filter((r) => r.leadId !== id));
        setNewLeads((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } catch (error) {
        console.error("Error deleting lead:", error);
        alert("Failed to delete lead. Please try again.");
      }
    }
  };

  const handleDispositionChange = async (leadId, value) => {
    const leadToUpdate = leads.find((lead) => lead.id === leadId);
    if (!leadToUpdate) {
      console.error("Lead not found:", leadId);
      return;
    }

    try {
      if (value === "Reminder") {
        setReminderLead({ ...leadToUpdate });
        setReminderDateTime("");
      } else if (value === "Remark") {
        setRemarkLead({ ...leadToUpdate });
        setNewRemark("");
      } else {
        const updatedLead = {
          ...leadToUpdate,
          disposition: value,
        };
        await updateLead(updatedLead);
      }
      setNewLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    } catch (error) {
      console.error("Error updating lead disposition:", error);
      alert("Failed to update lead disposition. Please try again.");
    }
  };

  const handleSetReminder = () => {
    if (!reminderLead || !reminderDateTime) return;

    const result = setReminder(reminderLead, reminderDateTime);
    setNotification({
      open: true,
      message: result.message,
      severity: "success",
    });
    setReminderLead(null);
    setReminderDateTime("");
    setNewLeads((prev) => {
      const newSet = new Set(prev);
      newSet.delete(reminderLead.id);
      return newSet;
    });
  };

  const handleCloseReminderDialog = () => {
    setReminderLead(null);
    setReminderDateTime("");
  };

  const handleCloseRemarkDialog = () => {
    setRemarkLead(null);
    setNewRemark("");
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  const handleAddLead = async (newLead) => {
    try {
      await addLead({
        ...newLead,
        assignedBy: user.email,
      });
      setNotification({
        open: true,
        message: "Lead added successfully!",
        severity: "success",
      });
      setAddLeadDialogOpen(false);
    } catch (error) {
      console.error("Error adding lead:", error);
      setNotification({
        open: true,
        message: "Failed to add lead. Please try again.",
        severity: "error",
      });
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

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === leadId ? { ...lead, assignedTo: newAssignedTo } : lead
        )
      );

      setNotification({
        open: true,
        message: "Assigned To updated successfully!",
        severity: "success",
      });
      setNewLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    } catch (error) {
      console.error("Error updating Assigned To:", error);
      setNotification({
        open: true,
        message: "Failed to update Assigned To. Please try again.",
        severity: "error",
      });
    }
  };

  const handleReminderClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleReminderClose = () => {
    setAnchorEl(null);
  };

  const handleReminderSelect = (reminder) => {
    setNotification({
      open: true,
      message: `Reminder: Follow up on lead ${reminder.leadName} (${reminder.disposition})`,
      severity: "info",
      leadDetails: {
        name: reminder.leadName,
        email: reminder.leadEmail,
        phoneNumber: reminder.leadNumber,
        alternateNumber: reminder.leadAlternateNumber,
        url: reminder.leadUrl,
        parentName: reminder.leadParentName,
        budget: reminder.leadBudget,
        currentClass: reminder.leadCurrentClass,
        seekingClass: reminder.leadSeekingClass,
        board: reminder.leadBoard,
        schoolType: reminder.leadSchoolType,
        type: reminder.leadType,
        source: reminder.leadSource,
        date: reminder.leadDate,
        location: reminder.leadLocation,
        school: reminder.leadSchool,
        remark: reminder.leadRemark,
        specificDisposition: reminder.specificDisposition,
        assignedTo: reminder.leadAssignedTo,
        assignedBy: reminder.leadAssignedBy,
      },
    });
    handleReminderClose();
    setNewLeads((prev) => {
      const newSet = new Set(prev);
      newSet.delete(reminder.leadId);
      return newSet;
    });
  };

  const handleLeadClick = (leadId) => {
    setNewLeads((prev) => {
      const newSet = new Set(prev);
      newSet.delete(leadId);
      return newSet;
    });
  };

  const headers = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone" },
    { key: "alternateNumber", label: "Alternate Number" },
    { key: "disposition", label: "Disposition" },
    { key: "specificDisposition", label: "Specific Disposition" },
    { key: "remark", label: "Remark" },
    { key: "assignedTo", label: "Assigned To" },
    { key: "assignedBy", label: "Assigned By" },
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
    { key: "", label: "Actions" },
  ];

  const dispositionOptions = [
    "Hot",
    "Cold",
    "Warm",
    "DNP",
    "Undefined",
    "Reminder",
    "Remark",
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispositionColorMap = {
    Hot: "bg-red-100 text-red-700",
    Cold: "bg-blue-100 text-blue-700",
    Warm: "bg-yellow-100 text-yellow-700",
    DNP: "bg-orange-100 text-orange-700",
    NTR: "bg-orange-100 text-orange-700",
    CIR: "bg-orange-100 text-orange-700",
    "Registration Done": "bg-green-100 text-green-700",
    "Admission Fee Paid": "bg-emerald-100 text-emerald-700",
    "Admission Done": "bg-lime-100 text-lime-700",
    "Asked to call back": "bg-indigo-100 text-indigo-700",
    "Post pone for Next year": "bg-pink-100 text-pink-700",
    Undefined: "bg-gray-100 text-gray-700",
    Reminder: "bg-purple-100 text-purple-700",
    Remark: "bg-green-100 text-green-700",
  };

  return (
    <div className="flex p-2 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen overflow-hidden">
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
              Filter by Site
            </h2>
            <div className="flex flex-col gap-2 overflow-y-auto">
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
                  {site === "all" ? "All Sites" : site}
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
            className="lg:hidden fixed inset-0 bg-opacity-50 z-0"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}
      </div>

      <div className="flex-1 border border-gray-200 bg-white rounded-lg shadow-lg p-6 min-w-0 overflow-visible lg:ml-80">
        <div className="md:flex md:flex-col mb-2">
          <div className="md:flex md:justify-between md:items-center space-y-6 md:space-y-0">
            <h1 className="md:text-3xl text-2xl md:font-bold px-8 md:px-0 text-[#154c79] font-serif">
              {user?.name} Leads Dashboard
            </h1>
            <div className="bg-white px-3 py-2 border border-gray-300 rounded-lg shadow-md flex gap-2 items-center">
              <div className="relative">
                <Button onClick={handleReminderClick}>
                  <BellIcon className="h-6 w-6 text-[#154c79]" />
                  {activeReminders.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {activeReminders.length}
                    </span>
                  )}
                </Button>
                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleReminderClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      maxWidth: 400,
                      maxHeight: 300,
                      overflowY: "auto",
                    }}
                  >
                    {activeReminders.length > 0 ? (
                      activeReminders.map((reminder) => (
                        <Box
                          key={reminder.leadId}
                          sx={{
                            p: 1,
                            mb: 1,
                            borderBottom: "1px solid #eee",
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#f5f5f5" },
                          }}
                          onClick={() => handleReminderSelect(reminder)}
                        >
                          <Typography variant="body2">
                            <strong>{reminder.leadName}</strong> (
                            {reminder.disposition})
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Due: {formatDateTime(reminder.reminderTime)}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ p: 1 }}>
                        No active reminders
                      </Typography>
                    )}
                  </Box>
                </Popover>
              </div>
              <p className="text-[20px] text-green-600 mb-1 font-serif">
                Total Leads
              </p>
              <p className="text-2xl font-bold text-green-600">
                {totalUniqueLeads}
              </p>
            </div>
          </div>

          <Snackbar
            open={notification.open}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{
              mt: 2,
              mr: 2,
              "& .MuiSnackbarContent-root": {
                width: "400px",
                minHeight: "200px",
              },
            }}
          >
            <Alert
              onClose={handleCloseNotification}
              severity={notification.severity}
              sx={{ width: "400px", minHeight: "200px" }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {notification.message}
              </Typography>
              {notification.leadDetails && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Name:</strong> {notification.leadDetails.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {notification.leadDetails.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong>{" "}
                    {notification.leadDetails.phoneNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Alternate Number:</strong>{" "}
                    {notification.leadDetails.alternateNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Assigned To:</strong>{" "}
                    {notification.leadDetails.assignedTo}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Assigned By:</strong>{" "}
                    {notification.leadDetails.assignedBy}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Parent Name:</strong>{" "}
                    {notification.leadDetails.parentName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Budget:</strong> {notification.leadDetails.budget}
                  </Typography>
                  <Typography variant="body2">
                    <strong>URL:</strong>{" "}
                    {notification.leadDetails?.url ? (
                      <Tooltip title={notification.leadDetails.url} arrow>
                        <span className="text-blue-600 cursor-pointer">
                          {getDomainFromUrl(notification.leadDetails.url)}
                        </span>
                      </Tooltip>
                    ) : (
                      "-"
                    )}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Current Class:</strong>{" "}
                    {notification.leadDetails.currentClass}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Seeking Class:</strong>{" "}
                    {notification.leadDetails.seekingClass}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Board:</strong> {notification.leadDetails.board}
                  </Typography>
                  <Typography variant="body2">
                    <strong>School Type:</strong>{" "}
                    {notification.leadDetails.schoolType}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Type:</strong> {notification.leadDetails.type}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Source:</strong> {notification.leadDetails.source}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong> {notification.leadDetails.date}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Location:</strong>{" "}
                    {notification.leadDetails.location}
                  </Typography>
                  <Typography variant="body2">
                    <strong>School:</strong> {notification.leadDetails.school}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Remark:</strong>{" "}
                    {notification.leadDetails.remark || "-"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Specific Disposition:</strong>{" "}
                    {notification.leadDetails.specificDisposition || "-"}
                  </Typography>
                </Box>
              )}
            </Alert>
          </Snackbar>
        </div>

        <div className="space-x-4 mb-4 mt-8 md:mt-0 flex justify-between items-center">
          <div className="rounded-lg md:w-[32%] flex justify-end">
            <TextField
              fullWidth
              placeholder="Search leads by name, source, or specific disposition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlassIcon className="h-5 w-5 text-indigo-600" />
                  </InputAdornment>
                ),
              }}
              className="w-full !border-blue-600 !rounded-lg focus:!ring-2 focus:!ring-blue-500"
            />
          </div>
          <div className="mb-6 flex justify-end gap-4 mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setAddLeadDialogOpen(true)}
              className="flex justify-center items-center bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-semibold text-base sm:text-lg py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Lead
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={exportToExcel}
              className="flex justify-center items-center bg-gradient-to-r from-blue-600 to-[#154c79] hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-base sm:text-lg py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              <ImFileExcel size={20} />
               Export to Excel
            </Button>
          </div>
        </div>

        <div className="mb-4 font-serif">
          <p className="text-[18px] text-[#154c79] whitespace-nowrap">
            Showing <strong>{indexOfFirstLead + 1}</strong> to{" "}
            <strong>{Math.min(indexOfLastLead, filteredLeads.length)}</strong>{" "}
            of <strong>{filteredLeads.length}</strong> results
          </p>
        </div>

        <TableContainer
          className="rounded-lg shadow-md overflow-x-auto w-full"
          style={{ maxHeight: "70vh" }}
        >
          <div className="min-w-[1200px] min-h-[250px]">
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableCell
                      key={header.key}
                      className={`text-xs font-medium uppercase tracking-wider px-6 py-4 whitespace-nowrap`}
                      style={{
                        width:
                          index === headers.length - 1
                            ? 80
                            : header.key === "remark"
                            ? "auto"
                            : 160,
                        background: "#154c79",
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
                      } hover:bg-blue-100 cursor-pointer`}
                      onClick={() => handleLeadClick(lead.id)}
                    >
                      <TableCell
                        className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        <div className="flex gap-2 items-end">
                          {newLeads.has(lead.id) && (
                            <Badge
                              badgeContent="New"
                              color="error"
                              sx={{
                                "& .MuiBadge-badge": {
                                  right: -20,
                                  top: 10,
                                  padding: "0 4px",
                                },
                              }}
                            />
                          )}
                          {lead?.name || "-"}
                        </div>
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
                        {lead?.alternateNumber || "-"}
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
                            dispositionColorMap[lead?.disposition] ||
                            "bg-gray-100 text-gray-700"
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
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.specificDisposition || "-"}
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
                            const selectedUser = fetchedusers.find(
                              (user) => user.email === selected
                            );
                            return selectedUser
                              ? selectedUser.name
                              : "Unassigned";
                          }}
                        >
                          {fetchedusers.map((user) => (
                            <MenuItem key={user.id} value={user.email}>
                              {user.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell
                        className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                        style={{ width: 160 }}
                      >
                        {lead?.assignedBy || "Unassigned"}
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
                                 Edit
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
                                 Delete
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

        {reminderLead && (
          <Dialog
            open={!!reminderLead}
            onClose={handleCloseReminderDialog}
            aria-labelledby="reminder-dialog-title"
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              id="reminder-dialog-title"
              sx={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                color: "primary.main",
                borderBottom: "1px solid #e0e0e0",
                pb: 2,
              }}
            >
              📅 Set Reminder
            </DialogTitle>

            <DialogContent sx={{ mt: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Set a reminder for:
              </Typography>

              <Typography variant="h6" color="text.primary">
                {reminderLead.name || "Unnamed Lead"}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Disposition: {reminderLead.disposition || "Undefined"}
              </Typography>

              <TextField
                label="Reminder Date & Time"
                type="datetime-local"
                value={reminderDateTime}
                onChange={(e) => setReminderDateTime(e.target.value)}
                fullWidth
                size="medium"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
              <Button
                onClick={handleCloseReminderDialog}
                variant="outlined"
                color="error"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSetReminder}
                variant="contained"
                color="primary"
                disabled={!reminderDateTime}
              >
                Set Reminder
              </Button>
            </DialogActions>
          </Dialog>
        )}

       
               {remarkLead && (
                 <Dialog
                   open={!!remarkLead}
                   onClose={handleCloseRemarkDialog}
                   aria-labelledby="remark-dialog-title"
                   maxWidth="sm"
                   fullWidth
                   PaperProps={{
                     sx: {
                       borderRadius: 4,
                       p: 2,
                       backgroundColor: "#f9f9f9",
                     },
                   }}
                 >
                   <DialogTitle
                     id="remark-dialog-title"
                     sx={{ fontWeight: "bold", fontSize: "1.5rem", color: "#333" }}
                   >
                     Add Remark
                   </DialogTitle>
       
                   <DialogContent>
                     <Typography variant="body1" sx={{ mb: 2, color: "#555" }}>
                       Add a remark for{" "}
                       <strong>{remarkLead.name || "Unnamed Lead"}</strong> (
                       {remarkLead.disposition || "Undefined"})
                     </Typography>
       
                     {/* Previous Remark */}
                     <Box sx={{ mt: 2 }}>
                       <TextField
                         label="Previous Remark"
                         value={remarkLead.remark || "-"}
                         size="small"
                         fullWidth
                         multiline
                         rows={3}
                         variant="outlined"
                         InputProps={{
                           readOnly: true,
                           sx: {
                             borderRadius: 2,
                             backgroundColor: "#f0f0f0",
                           },
                         }}
                         InputLabelProps={{
                           shrink: true,
                         }}
                       />
                     </Box>
       
                     {/* New Remark */}
                     <Box sx={{ mt: 3 }}>
                       <TextField
                         label="New Remark"
                         value={newRemark}
                         onChange={(e) => setNewRemark(e.target.value)}
                         size="small"
                         fullWidth
                         multiline
                         rows={3}
                         variant="outlined"
                         InputProps={{
                           sx: {
                             borderRadius: 2,
                             backgroundColor: "#fff",
                           },
                         }}
                         InputLabelProps={{
                           shrink: true,
                         }}
                       />
                     </Box>
                   </DialogContent>
       
                   <DialogActions sx={{ px: 3, pb: 2 }}>
                     <Button
                       onClick={handleCloseRemarkDialog}
                       variant="outlined"
                       color="secondary"
                       sx={{ borderRadius: 2 }}
                     >
                       Cancel
                     </Button>
                     <Button
                       onClick={() => handleAddRemark(remarkLead, newRemark)}
                       variant="contained"
                       color="primary"
                       disabled={!newRemark.trim()}
                       sx={{ borderRadius: 2, boxShadow: 2 }}
                     >
                       Add Remark
                     </Button>
                   </DialogActions>
                 </Dialog>
               )}
       

        {addLeadDialogOpen && (
          <AddLeadForm
            open={addLeadDialogOpen}
            onClose={() => setAddLeadDialogOpen(false)}
            onSave={handleAddLead}
            users={fetchedusers}
            dispositionOptions={dispositionOptions}
          />
        )}
      </div>
    </div>
  );
};

export default SalesLeadsTable;
