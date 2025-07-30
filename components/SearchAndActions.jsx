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
  leads, // Add leads prop for duplicate checking
}) => {
  const fileInputRef = useRef(null);

  const handleImportExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
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

        // Map Excel headers to lead fields (matching exportToExcel in UnifiedLeadsDashboard)
        const leadFields = {
          "Assigned To": "assignedTo",
          Date: "date",
          Source: "source",
          "Student Name": "parentName",
          Phone: "phoneNumber",
          "Alternate Number": "alternateNumber",
          "Parent Name": "name",
          Email: "email",
          "Seeking Class": "seekingClass",
          Board: "board",
          "School Type": "schoolType",
          Budget: "budget",
          Location: "location",
          "Suggested School": "school",
          Session: "Session",
          Disposition: "disposition",
          Remark: "remark",
          "Assigned By": "assignedBy",
          URL: "url",
        };

        // Create a set of existing lead keys for duplicate checking
        const existingLeadKeys = new Set(
          leads.map(
            (lead) =>
              `${lead.email?.toLowerCase()}-${lead.source?.toLowerCase()}`
          )
        );

        let importedCount = 0;
        let duplicateCount = 0;

        for (const row of jsonData) {
          const lead = {};
          Object.keys(row).forEach((key) => {
            if (leadFields[key]) {
              lead[leadFields[key]] = row[key] || null;
            }
          });

          // Validate required fields
          if (!lead.email || !lead.source) {
            console.warn("Skipping lead with missing email or source:", row);
            continue;
          }

          // Check for duplicates
          const leadKey = `${lead.email.toLowerCase()}-${lead.source.toLowerCase()}`;
          if (existingLeadKeys.has(leadKey)) {
            console.warn("Skipping duplicate lead:", lead);
            duplicateCount++;
            continue;
          }

          // Set assignedBy and date
          lead.assignedBy = user.email;
          lead.date = lead.date
            ? new Date(lead.date).toISOString()
            : new Date().toISOString();

          try {
            await addLead(lead);
            existingLeadKeys.add(leadKey); // Update set to prevent duplicates within the same import
            importedCount++;
          } catch (error) {
            console.error("Error adding lead:", error);
          }
        }

        setNotification({
          open: true,
          message: `Successfully imported ${importedCount} lead(s). ${
            duplicateCount > 0 ? `${duplicateCount} duplicate(s) skipped.` : ""
          }`,
          severity: importedCount > 0 ? "success" : "warning",
        });

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error importing Excel file:", error);
      setNotification({
        open: true,
        message: "Failed to import Excel file. Please ensure it is valid.",
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
        <button
          onClick={exportToExcel}
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
          onChange={handleImportExcel}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default SearchAndActions;
