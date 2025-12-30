"use client";

import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { TbSearch, TbDownload, TbUpload } from "react-icons/tb";

const SearchAndActions = ({
  searchTerm,
  setSearchTerm,
  setAddLeadDialogOpen,
  exportToExcel,
  addLead,
  user,
  setNotification,
  leads,
}) => {
  const fileInputRef = useRef(null);

  // ✅ Export to Excel (handles duplicates + remark columns)
  const handleExportToExcel = () => {
    if (!leads || leads.length === 0) {
      setNotification({
        open: true,
        message: "No leads available to export.",
        severity: "warning",
      });
      return;
    }

    const uniqueMap = new Map();
    leads.forEach((lead) => {
      const key = `${(lead.email || "").trim().toLowerCase()}|${(
        lead.phoneNumber || ""
      )
        .trim()
        .toLowerCase()}|${(lead.school || "").trim().toLowerCase()}`;
      if (!uniqueMap.has(key)) uniqueMap.set(key, lead);
    });

    const uniqueLeads = Array.from(uniqueMap.values());

    const processedLeads = uniqueLeads.map((lead) => {
      let remarks = [];

      if (Array.isArray(lead.remark)) {
        remarks = lead.remark.filter(Boolean).map((r) => r.trim());
      } else if (typeof lead.remark === "string") {
        remarks = lead.remark
          .split(/\n+/)
          .map((r) => r.trim())
          .filter(Boolean);
      }

      const base = {
        Name: lead.name || "",
        PhoneNumber: lead.phoneNumber || "",
        Email: lead.email || "",
        School: lead.school || "",
        Source: lead.source || "",
        Type: lead.type || "",
        Location: lead.location || "",
        AssignedTo: lead.assignedTo || "",
        Disposition: lead.disposition || "",
        Date: lead.date ? new Date(lead.date).toLocaleDateString("en-IN") : "",
      };

      remarks.forEach((remark, i) => {
        base[`Remark ${i + 1}`] = remark;
      });

      return base;
    });

    const worksheet = XLSX.utils.json_to_sheet(processedLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, `Leads_${new Date().toISOString()}.xlsx`);

    setNotification({
      open: true,
      message: `Exported ${uniqueLeads.length} unique lead(s) successfully.`,
      severity: "success",
    });
  };

  const handleImportExcel = async (
    event,
    user,
    leads,
    setNotification,
    addLead,
    fileInputRef
  ) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setNotification({
            open: true,
            message: "No data found in the Excel file.",
            severity: "error",
          });
          return;
        }

        const leadFields = {
          Name: "name",
          PhoneNumber: "phoneNumber",
          Email: "email",
          Remarks: "remark",
          School: "school",
        };

        const existingLeadKeys = new Set(
          leads.map((lead) => {
            const phone = lead.phoneNumber
              ? lead.phoneNumber.toLowerCase().trim()
              : "";
            const email = lead.email ? lead.email.toLowerCase().trim() : "";
            const school = lead.school ? lead.school.toLowerCase().trim() : "";
            return `${email}|${phone}|${school}`;
          })
        );

        let importedCount = 0;
        let duplicateCount = 0;

        for (const row of jsonData) {
          const lead = {
            name: "",
            email: "",
            phoneNumber: "",
            alternateNumber: "",
            parentName: "",
            budget: "",
            url: "",
            seekingClass: "",
            board: "",
            schoolType: "",
            type: "",
            source: "",
            date: new Date().toISOString(),
            location: "",
            school: "",
            remark: "",
            disposition: "Undefined",
            assignedTo: "Unassigned",
            assignedBy: user.email,
          };

          Object.keys(row).forEach((key) => {
            if (leadFields[key]) {
              lead[leadFields[key]] = row[key] ? String(row[key]).trim() : "";
            }
          });

          if (!lead.phoneNumber && !lead.email) {
            console.warn("Skipping row (missing phone/email):", row);
            continue;
          }

          const leadKey = `${
            lead.email ? lead.email.toLowerCase().trim() : ""
          }|${lead.phoneNumber ? lead.phoneNumber.toLowerCase().trim() : ""}|${
            lead.school ? lead.school.toLowerCase().trim() : ""
          }`;

          if (existingLeadKeys.has(leadKey)) {
            console.warn("Duplicate skipped:", lead);
            duplicateCount++;
            continue;
          }

          try {
            await addLead(lead);
            existingLeadKeys.add(leadKey);
            importedCount++;
          } catch (error) {
            console.error("Error adding lead:", error);
          }
        }

        const message = [
          `Imported ${importedCount} lead(s).`,
          duplicateCount > 0 ? `${duplicateCount} duplicate(s) skipped.` : "",
        ]
          .filter(Boolean)
          .join(" ");

        setNotification({
          open: true,
          message,
          severity: importedCount > 0 ? "success" : "warning",
        });

        if (fileInputRef.current) fileInputRef.current.value = "";
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error importing Excel file:", error);
      setNotification({
        open: true,
        message: "Failed to import Excel file. Please check format.",
        severity: "error",
      });
    }
  };

  return (
    <div className="flex items-center justify-between mb-4 space-x-4">
      <div className="relative flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, source, or disposition..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#154c79] text-[14px]"
        />
        <TbSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setAddLeadDialogOpen(true)}
          className="px-4 py-2 bg-[#154c79] text-white rounded-lg hover:bg-[#123e5f] transition text-[14px] flex items-center"
        >
          <TbDownload className="mr-2" size={18} />
          Add Lead
        </button>

        {user?.status === "admin" && (
          <>
            <button
              onClick={handleExportToExcel}
              className="px-4 py-2 bg-[#154c79] text-white rounded-lg hover:bg-[#123e5f] transition text-[14px] flex items-center"
            >
              <TbDownload className="mr-2" size={18} />
              Export to Excel
            </button>

            <button
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 bg-[#154c79] text-white rounded-lg hover:bg-[#123e5f] transition text-[14px] flex items-center"
            >
              <TbUpload className="mr-2" size={18} />
              Import from Excel
            </button>

            <input
              type="file"
              accept=".xlsx, .xls"
              ref={fileInputRef}
              onChange={(e) =>
                handleImportExcel(
                  e,
                  user,
                  leads,
                  setNotification,
                  addLead,
                  fileInputRef
                )
              }
              className="hidden"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchAndActions;
