"use client";

import React, { useState, useEffect } from "react";
import { useLead } from "@/providers/LeadProvider";
import { useAuth } from "@/providers/AuthProvider";
import * as XLSX from "xlsx";
import FilterSidebar from "./FilterSidebar";
import HeaderSection from "./HeaderSection";
import SearchAndActions from "./SearchAndActions";
import LeadsTable from "./LeadsTable";
import PaginationControls from "./PaginationControls";
import Dialogs from "./Dialogs";
import { TbX } from "react-icons/tb";
import NotificationTable from "./NotificationTable";

const FullScreenLoader = () => (
  <div className="flex p-4 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen animate-pulse">
    <aside className="hidden lg:block w-80 mr-6 space-y-6">
      <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />
      <div className="h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />
      <div className="h-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />
      <div className="h-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />
      <div className="h-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />
      <div className="h-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />
    </aside>

    <main className="flex-1 border border-gray-200 bg-white rounded-lg shadow-lg p-6 space-y-8">
      <div className="space-y-4">
        <div className="h-8 w-1/2 bg-gray-200 rounded" />
        <div className="h-6 w-1/3 bg-gray-200 rounded" />
      </div>

      <div className="flex items-center justify-between space-x-4">
        <div className="h-10 w-1/2 bg-gray-200 rounded" />
        <div className="h-10 w-28 bg-gray-200 rounded" />
      </div>

      <section className="space-y-4">
        {Array(10)
          .fill()
          .map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between border border-gray-100 rounded-lg shadow-sm p-4"
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
              <div className="flex-1 mx-4 grid grid-cols-4 gap-4">
                <div className="h-5 bg-gray-200 rounded col-span-1" />
                <div className="h-5 bg-gray-200 rounded col-span-1" />
                <div className="h-5 bg-gray-200 rounded col-span-1" />
                <div className="h-5 bg-gray-200 rounded col-span-1" />
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-gray-300 rounded-full" />
                <div className="h-8 w-8 bg-gray-300 rounded-full" />
              </div>
            </div>
          ))}
      </section>
    </main>
  </div>
);

const UnifiedLeadsDashboard = ({ onDelete }) => {
  const { logout, user } = useAuth();
  const { leads, updateLead, deleteLead, loading, fetchedusers, addLead } =
    useLead();
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [reminderLead, setReminderLead] = useState(null);
  const [remarkLead, setRemarkLead] = useState(null);
  const [newRemark, setNewRemark] = useState("");
  const [editRemarkIndex, setEditRemarkIndex] = useState(null);
  const [editRemarkText, setEditRemarkText] = useState("");
  const [editFieldLead, setEditFieldLead] = useState(null);
  const [editFieldName, setEditFieldName] = useState("");
  const [editFieldValue, setEditFieldValue] = useState("");
  const [reminderDateTime, setReminderDateTime] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeReminders, setActiveReminders] = useState([]);
  const [addLeadDialogOpen, setAddLeadDialogOpen] = useState(false);
  const [newLeads, setNewLeads] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dispositionLoadingId, setDispositionLoadingId] = useState(null);

  const dispositionOptions = [
    "Hot",
    "Cold",
    "Warm",
    "DNP",
    "NTR",
    "CIR",
    "Registration Done",
    "Admission Fee Paid",
    "Admission Done",
    "Asked to call back",
    "Post pone for Next year",
    "Undefined",
    "Reminder",
  ];
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
  };

  const getDomainFromUrl = (url) => {
    if (!url) return null;
    try {
      const normalizedUrl = url.match(/^(https?:\/\/|www\.)/)
        ? url
        : `https://${url}`;
      const parsedUrl = new URL(normalizedUrl);

      const cleanUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`;

      const utmSource = parsedUrl.searchParams.get("utm_source");
      if (utmSource) {
        if (utmSource.toLowerCase() === "google") {
          return `${cleanUrl} (Google Ads)`;
        }
        return `${cleanUrl} (${utmSource})`;
      }

      return cleanUrl;
    } catch {
      console.warn(`Invalid URL: ${url}`);
      return null;
    }
  };

  const getDomainFromUrls = (url) => {
    if (!url) return null;
    try {
      const normalizedUrl = url.match(/^(https?:\/\/|www\.)/)
        ? url
        : `https://${url}`;
      const parsedUrl = new URL(normalizedUrl);

      return parsedUrl.hostname; // only "www.eduminatti.com"
    } catch {
      console.warn(`Invalid URL: ${url}`);
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

  const parseRemarks = (remarkString) => {
    if (!remarkString || remarkString === "-") return [];
    return remarkString
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const match = line.match(
          /^(\d{2}\/\d{2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M): (.*)$/
        );
        if (match) {
          return { timestamp: match[1], text: match[2], fullLine: line };
        }
        return { timestamp: "", text: line, fullLine: line };
      });
  };

  const exportToExcel = () => {
    const headers = [
      "Assigned To",
      "Date",
      "Source",
      "Student Name",
      "PhoneNumber",
      "Alternate Number",
      "Parent Name",
      "Email",
      "Seeking Class",
      "Board",
      "School Type",
      "Budget",
      "Location",
      "Suggested School",
      "Session",
      "Disposition",
      "Remark",
      "Assigned By",
      "URL",
    ];

    const data = filteredLeads.map((lead) => ({
      "Assigned To": lead?.assignedTo || "Unassigned",
      Date: formatDateTime(lead?.date),
      Source: lead?.source || "-",
      "Student Name": lead?.parentName || "-",
      Phone: lead?.phoneNumber || "-",
      "Alternate Number": lead?.alternateNumber || "-",
      "Parent Name": lead?.name || "-",
      Email: lead?.email || "-",
      "Seeking Class": lead?.seekingClass || "-",
      Board: lead?.board || "-",
      "School Type": lead?.schoolType || "-",
      Budget: lead?.budget || "-",
      Location: lead?.location || "-",
      "Suggested School": lead?.school || "-",
      Session: lead?.Session || "-",
      Disposition: lead?.disposition || "Undefined",
      Remark: lead?.remark || "-",
      "Assigned By": lead?.assignedBy || "Unassigned",
      URL: lead?.url || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "leads_export.xlsx");
  };

  let sites = ["all"];
  if (leads) {
    const domainSet = new Set();
    let hasNoDomain = false;

    leads.forEach((lead) => {
      const baseUrl = getDomainFromUrls(lead?.url);
      if (baseUrl) {
        domainSet.add(baseUrl);
      } else {
        hasNoDomain = true;
      }
    });

    sites = ["all", ...Array.from(domainSet).sort()];
    if (hasNoDomain) {
      sites.push("others");
    }
  }

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
      remark: lead.remark
        ? `${lead.remark}\n${formatDateTime(new Date())}: ${newRemark}`
        : `${formatDateTime(new Date())}: ${newRemark}`,
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
      const viewedLeads = JSON.parse(
        localStorage.getItem("viewedLeads") || "[]"
      );
      if (!viewedLeads.includes(lead.id)) {
        viewedLeads.push(lead.id);
        localStorage.setItem("viewedLeads", JSON.stringify(viewedLeads));
      }
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

  const handleEditRemark = (index, updatedText) => {
    if (!remarkLead || editRemarkIndex !== index || !updatedText.trim()) return;

    const remarks = parseRemarks(remarkLead.remark);
    if (index >= remarks.length) return;

    const updatedRemarks = [...remarks];
    updatedRemarks[index] = {
      ...updatedRemarks[index],
      text: updatedText.trim(),
      fullLine: `${updatedRemarks[index].timestamp}: ${updatedText.trim()}`,
    };

    const updatedRemarkString = updatedRemarks
      .map((r) => r.fullLine)
      .join("\n");

    const updatedLead = {
      ...remarkLead,
      remark: updatedRemarkString,
    };

    try {
      updateLead(updatedLead);
      setNotification({
        open: true,
        message: `Remark updated for lead ${remarkLead.name || "Unnamed Lead"}`,
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
      setEditRemarkIndex(null);
      setEditRemarkText("");
    } catch (error) {
      console.error("Error editing remark:", error);
      setNotification({
        open: true,
        message: "Failed to edit remark. Please try again.",
        severity: "error",
      });
    }
  };

  const handleDeleteRemark = (index) => {
    if (!remarkLead || index < 0) return;

    if (!window.confirm("Are you sure you want to delete this remark?")) {
      return;
    }

    const remarks = parseRemarks(remarkLead.remark);
    if (index >= remarks.length) return;

    const updatedRemarks = remarks.filter((_, i) => i !== index);

    const updatedRemarkString =
      updatedRemarks.length > 0
        ? updatedRemarks.map((r) => r.fullLine).join("\n")
        : null;

    const updatedLead = {
      ...remarkLead,
      remark: updatedRemarkString,
    };

    try {
      updateLead(updatedLead);
      setNotification({
        open: true,
        message: `Remark deleted for lead ${remarkLead.name || "Unnamed Lead"}`,
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
    } catch (error) {
      console.error("Error deleting remark:", error);
      setNotification({
        open: true,
        message: "Failed to delete remark. Please try again.",
        severity: "error",
      });
    }
  };

  const handleEditField = (lead, fieldName, fieldValue) => {
    setEditFieldLead(lead);
    setEditFieldName(fieldName);
    setEditFieldValue(fieldValue || "");
  };

  const handleSaveFieldEdit = () => {
    if (!editFieldLead || !editFieldName) return;

    const updatedLead = {
      ...editFieldLead,
      [editFieldName]: editFieldValue.trim() || null,
    };

    try {
      updateLead(updatedLead);
      setNotification({
        open: true,
        message: `${
          editFieldName.charAt(0).toUpperCase() + editFieldName.slice(1)
        } updated for lead ${updatedLead.name || "Unnamed Lead"}`,
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
      setEditFieldLead(null);
      setEditFieldName("");
      setEditFieldValue("");
      const viewedLeads = JSON.parse(
        localStorage.getItem("viewedLeads") || "[]"
      );
      if (!viewedLeads.includes(updatedLead.id)) {
        viewedLeads.push(updatedLead.id);
        localStorage.setItem("viewedLeads", JSON.stringify(viewedLeads));
      }
      setNewLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(updatedLead.id);
        return newSet;
      });
    } catch (error) {
      console.error(`Error updating ${editFieldName}:`, error);
      setNotification({
        open: true,
        message: `Failed to update ${editFieldName}. Please try again.`,
        severity: "error",
      });
    }
  };

  const handleCloseEditFieldDialog = () => {
    setEditFieldLead(null);
    setEditFieldName("");
    setEditFieldValue("");
  };

  useEffect(() => {
    if (!leads || !user) {
      console.log("No leads or user data:", { leads, user });
      setFilteredLeads([]);
      setTotalUniqueLeads(0);
      return;
    }

    console.log("User status:", user.status, "User email:", user.email);

    const uniqueLeadsMap = new Map();
    leads.forEach((lead) => {
      if (!lead?.email || !lead?.source) {
        console.warn("Lead missing email or source:", lead);
        uniqueLeadsMap.set(lead.id, {
          ...lead,
          disposition: lead.disposition || "Undefined",
          specificDisposition: lead.specificDisposition || "-",
        });
        return;
      }
      const key = `${lead.email.toLowerCase()}-${lead.source.toLowerCase()}`;
      if (
        !uniqueLeadsMap.has(key) ||
        new Date(lead.date) > new Date(uniqueLeadsMap.get(key).date)
      ) {
        uniqueLeadsMap.set(key, {
          ...lead,
          disposition: lead.disposition || "Undefined",
          specificDisposition: lead.specificDisposition || "-",
        });
      }
    });

    let results = Array.from(uniqueLeadsMap.values());
    console.log("Total unique leads after deduplication:", results.length);

    const isAdmin = user.status && user.status.toLowerCase() === "admin";
    if (!isAdmin) {
      results = results.filter((lead) => {
        const matches = lead?.assignedTo === user.email;
        if (!matches) {
          console.log("Filtered out lead for non-admin:", lead);
        }
        return matches;
      });
      console.log("Leads after non-admin filter:", results.length);
    } else if (selectedUser) {
      results = results.filter((lead) => lead.assignedTo === selectedUser);
      console.log("Leads after admin user filter:", results.length);
    }

    setTotalUniqueLeads(results.length);

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = results.filter(
        (lead) =>
          lead?.name?.toLowerCase().includes(lowercasedTerm) ||
          lead?.source?.toLowerCase().includes(lowercasedTerm) ||
          lead?.specificDisposition?.toLowerCase().includes(lowercasedTerm)
      );
      console.log("Leads after search filter:", results.length);
    }

    if (selectedSite !== "all") {
      results = results.filter((lead) => {
        const domain = getDomainFromUrls(lead?.url);
        if (selectedSite === "others") {
          return !domain;
        }
        return domain === selectedSite;
      });
      console.log("Leads after site filter:", results.length);
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
    console.log("Final filtered leads:", results.length);
  }, [leads, searchTerm, sortConfig, selectedSite, selectedUser, user]);

  useEffect(() => {
    if (!leads) return;

    const now = new Date().getTime();
    const reminders = [];
    leads.forEach((lead) => {
      const reminderKey = `reminder_${lead.id}`;
      const reminderData = localStorage.getItem(reminderKey);
      if (reminderData) {
        const parsedData = JSON.parse(reminderData);
        if (parsedData.reminderTime > now) {
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

    const viewedLeads = JSON.parse(localStorage.getItem("viewedLeads") || "[]");
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
    const newLeadIds = new Set(
      leads
        .filter(
          (lead) =>
            new Date(lead.date) > twentyFourHoursAgo &&
            !viewedLeads.includes(lead.id)
        )
        .map((lead) => lead.id)
    );
    setNewLeads(newLeadIds);
  }, [leads]);

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
    const viewedLeads = JSON.parse(localStorage.getItem("viewedLeads") || "[]");
    if (!viewedLeads.includes(lead.id)) {
      viewedLeads.push(lead.id);
      localStorage.setItem("viewedLeads", JSON.stringify(viewedLeads));
    }
    setNewLeads((prev) => {
      const newSet = new Set(prev);
      newSet.delete(lead.id);
      return newSet;
    });
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
        const viewedLeads = JSON.parse(
          localStorage.getItem("viewedLeads") || "[]"
        );
        const updatedViewedLeads = viewedLeads.filter(
          (leadId) => leadId !== id
        );
        localStorage.setItem("viewedLeads", JSON.stringify(updatedViewedLeads));
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

    setDispositionLoadingId(leadId);

    try {
      if (value === "Reminder") {
        setReminderLead({ ...leadToUpdate });
        setReminderDateTime("");
      } else {
        const updatedLead = { ...leadToUpdate, disposition: value };
        await updateLead(updatedLead);
      }

      const viewedLeads = JSON.parse(
        localStorage.getItem("viewedLeads") || "[]"
      );
      if (!viewedLeads.includes(leadId)) {
        viewedLeads.push(leadId);
        localStorage.setItem("viewedLeads", JSON.stringify(viewedLeads));
      }

      setNewLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    } catch (error) {
      console.error("Error updating lead disposition:", error);
      alert("Failed to update lead disposition. Please try again.");
    } finally {
      setDispositionLoadingId(null);
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
    const viewedLeads = JSON.parse(localStorage.getItem("viewedLeads") || "[]");
    if (!viewedLeads.includes(reminderLead.id)) {
      viewedLeads.push(reminderLead.id);
      localStorage.setItem("viewedLeads", JSON.stringify(viewedLeads));
    }
    setNewLeads((prev) => {
      const newSet = new Set(prev);
      newSet.delete(reminderLead.id);
      return newSet;
    });
  };

  const handleCloseRemarkDialog = () => {
    setRemarkLead(null);
    setNewRemark("");
    setEditRemarkIndex(null);
    setEditRemarkText("");
  };

  const handleOpenRemarkDialog = (lead) => {
    setRemarkLead(lead);
    setNewRemark("");
    setEditRemarkIndex(null);
    setEditRemarkText("");
    const viewedLeads = JSON.parse(localStorage.getItem("viewedLeads") || "[]");
    if (!viewedLeads.includes(lead.id)) {
      viewedLeads.push(lead.id);
      localStorage.setItem("viewedLeads", JSON.stringify(viewedLeads));
    }
    setNewLeads((prev) => {
      const newSet = new Set(prev);
      newSet.delete(lead.id);
      return newSet;
    });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification({ ...notification, open: false });
  };

  const handleAddLead = async (newLead) => {
    try {
      await addLead({ ...newLead, assignedBy: user.email });
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
      const viewedLeads = JSON.parse(
        localStorage.getItem("viewedLeads") || "[]"
      );
      if (!viewedLeads.includes(leadId)) {
        viewedLeads.push(leadId);
        localStorage.setItem("viewedLeads", JSON.stringify(viewedLeads));
      }
      setNewLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    } catch (error) {
      console.error("Error updating Assigned To:", error);
      alert("Failed to update Assigned To. Please try again.");
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
    const viewedLeads = JSON.parse(localStorage.getItem("viewedLeads") || "[]");
    if (!viewedLeads.includes(reminder.leadId)) {
      viewedLeads.push(reminder.leadId);
      localStorage.setItem("viewedLeads", JSON.stringify(viewedLeads));
    }
    setNewLeads((prev) => {
      const newSet = new Set(prev);
      newSet.delete(reminder.leadId);
      return newSet;
    });
  };

  const handleLeadClick = (leadId) => {
    const viewedLeads = JSON.parse(localStorage.getItem("viewedLeads") || "[]");
    if (!viewedLeads.includes(leadId)) {
      viewedLeads.push(leadId);
      localStorage.setItem("viewedLeads", JSON.stringify(viewedLeads));
    }
    setNewLeads((prev) => {
      const newSet = new Set(prev);
      newSet.delete(leadId);
      return newSet;
    });
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="flex p-2 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen overflow-hidden">
      <FilterSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        sites={sites}
        selectedSite={selectedSite}
        setSelectedSite={setSelectedSite}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        fetchedusers={fetchedusers}
        user={user}
        logout={logout}
      />
      <div className="flex-1 border border-gray-200 bg-white rounded-lg shadow-lg p-4 min-w-0 overflow-visible lg:ml-80">
        {notification.open && (
          <div className="fixed top-4 right-4 w-2xl bg-gray-100 rounded-lg shadow-lg border border-gray-500 p-4 z-50">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-[#154c79] font-serif">
                {notification.message}
              </p>
              <button
                onClick={handleCloseNotification}
                className="text-gray-500 hover:text-gray-700"
              >
                <TbX size={18} />
              </button>
            </div>
            {notification.leadDetails && (
              <NotificationTable
                getDomainFromUrl={getDomainFromUrl}
                notification={notification}
              />
            )}
          </div>
        )}
        <HeaderSection
          totalUniqueLeads={totalUniqueLeads}
          activeReminders={activeReminders}
          handleReminderClick={handleReminderClick}
          anchorEl={anchorEl}
          handleReminderClose={handleReminderClose}
          handleReminderSelect={handleReminderSelect}
          formatDateTime={formatDateTime}
        />
        <SearchAndActions
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setAddLeadDialogOpen={setAddLeadDialogOpen}
          exportToExcel={() => exportToExcel(leads)}
          addLead={addLead}
          user={user}
          setNotification={setNotification}
          leads={leads}
          getDomainFromUrl={getDomainFromUrl}
        />
        <div className="mb-4 font-serif">
          <p className="text-[18px] text-[#154c79] whitespace-nowrap">
            Showing <strong>{indexOfFirstLead + 1}</strong> to{" "}
            <strong>{Math.min(indexOfLastLead, filteredLeads.length)}</strong>{" "}
            of <strong>{filteredLeads.length}</strong> results
          </p>
        </div>
        <LeadsTable
          currentLeads={currentLeads}
          newLeads={newLeads}
          handleLeadClick={handleLeadClick}
          handleEditField={handleEditField}
          handleAssignedToChange={handleAssignedToChange}
          handleDispositionChange={handleDispositionChange}
          dispositionLoadingId={dispositionLoadingId}
          handleOpenRemarkDialog={handleOpenRemarkDialog}
          setOpenMenuId={setOpenMenuId}
          openMenuId={openMenuId}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          formatDateTime={formatDateTime}
          getDomainFromUrl={getDomainFromUrl}
          fetchedusers={fetchedusers}
          dispositionOptions={dispositionOptions}
          dispositionColorMap={dispositionColorMap}
          requestSort={requestSort}
          getSortDirectionIndicator={getSortDirectionIndicator}
        />
        {filteredLeads.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            firstPage={firstPage}
            prevPage={prevPage}
            nextPage={nextPage}
            lastPage={lastPage}
            paginate={paginate}
          />
        )}
        <Dialogs
          editingLead={editingLead}
          setEditingLead={setEditingLead}
          handleSaveEdit={handleSaveEdit}
          reminderLead={reminderLead}
          reminderDateTime={reminderDateTime}
          setReminderDateTime={setReminderDateTime}
          handleSetReminder={handleSetReminder}
          handleCloseReminderDialog={() => setReminderLead(null)}
          remarkLead={remarkLead}
          newRemark={newRemark}
          setNewRemark={setNewRemark}
          handleAddRemark={handleAddRemark}
          handleCloseRemarkDialog={handleCloseRemarkDialog}
          editRemarkIndex={editRemarkIndex}
          setEditRemarkIndex={setEditRemarkIndex}
          editRemarkText={editRemarkText}
          setEditRemarkText={setEditRemarkText}
          handleEditRemark={handleEditRemark}
          handleDeleteRemark={handleDeleteRemark}
          editFieldLead={editFieldLead}
          editFieldName={editFieldName}
          editFieldValue={editFieldValue}
          setEditFieldValue={setEditFieldValue}
          handleSaveFieldEdit={handleSaveFieldEdit}
          handleCloseEditFieldDialog={handleCloseEditFieldDialog}
          addLeadDialogOpen={addLeadDialogOpen}
          setAddLeadDialogOpen={setAddLeadDialogOpen}
          handleAddLead={handleAddLead}
          fetchedusers={fetchedusers}
          dispositionOptions={dispositionOptions}
        />
      </div>
    </div>
  );
};

export default UnifiedLeadsDashboard;
