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

        // ✅ Map Excel fields to dashboard fields
        const leadFields = {
          Name: "name",
          PhoneNumber: "phoneNumber",
          Email: "email",
          Remarks: "remark",
          School: "school",
        };

        // ✅ Existing leads (avoid duplicates)
        const existingLeadKeys = new Set(
          leads.map((lead) => {
            const phone = lead.phoneNumber
              ? lead.phoneNumber.toLowerCase().trim()
              : "";
            const email = lead.email ? lead.email.toLowerCase().trim() : "";
            return `${phone}|${email}`;
          })
        );

        let importedCount = 0;
        let duplicateCount = 0;

        for (const row of jsonData) {
          // Build a new lead with default schema
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

          // Map Excel fields into lead
          Object.keys(row).forEach((key) => {
            if (leadFields[key]) {
              lead[leadFields[key]] = row[key] ? String(row[key]).trim() : "";
            }
          });

          // ✅ Require phone OR email
          if (!lead.phoneNumber && !lead.email) {
            console.warn("Skipping row (missing phone/email):", row);
            continue;
          }

          // Duplicate check
          const leadKey = `${
            lead.phoneNumber ? lead.phoneNumber.toLowerCase().trim() : ""
          }|${lead.email ? lead.email.toLowerCase().trim() : ""}`;

          if (existingLeadKeys.has(leadKey)) {
            console.warn("Duplicate skipped:", lead);
            duplicateCount++;
            continue;
          }

          try {
            await addLead(lead); // this should update dashboard state
            existingLeadKeys.add(leadKey);
            importedCount++;
          } catch (error) {
            console.error("Error adding lead:", error);
          }
        }

        // ✅ Notification
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

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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
      {/* 🔍 Search bar */}
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

      {/* 📂 Actions */}
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
