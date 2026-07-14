"use client";

import React from "react";
import LeadRow from "./LeadRow";

const headers = [
  { key: "select", label: "" }, // NEW: checkbox column, header renders select-all instead of text
  { key: "assignedTo", label: "Assigned To" },
  { key: "date", label: "Date" },
  { key: "disposition", label: "Disposition" },
  { key: "remark", label: "Remark" },
  { key: "phoneNumber", label: "Phone / Alt-Number" },
  { key: "name", label: "Parent Name" },
  { key: "parentName", label: "Student Name" },
  { key: "email", label: "Email" },
  { key: "seekingClass", label: "Seeking Class" },
  { key: "board", label: "Board" },
  { key: "schoolType", label: "School Type" },
  { key: "budget", label: "Budget" },
  { key: "location", label: "Location" },
  { key: "school", label: "Suggested School" },
  { key: "Session", label: "Session" },

  { key: "", label: "Actions" },
  { key: "source", label: "Source" },
  { key: "assignedBy", label: "Assigned By" },
  { key: "url", label: "URL" },
];

const LeadsTable = ({
  currentLeads,
  newLeads,
  handleLeadClick,
  handleEditField,
  handleAssignedToChange,
  handleDispositionChange,
  handleOpenRemarkDialog,
  setOpenMenuId,
  openMenuId,
  handleEdit,
  handleDelete,
  formatDateTime,
  getDomainFromUrl,
  fetchedusers,
  dispositionOptions,
  dispositionColorMap,
  requestSort,
  getSortDirectionIndicator,
  dispositionLoadingId,
  // --- NEW: selection props ---
  selectedLeadIds,
  toggleLeadSelection,
  toggleSelectAllOnPage,
}) => {
  const allOnPageSelected =
    currentLeads.length > 0 &&
    currentLeads.every((lead) => selectedLeadIds?.has(lead.id));

  return (
    <div className="w-full rounded-lg shadow-md overflow-hidden">
      <div className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
        <table className="w-full min-w-[1200px]  border-collapse">
          <thead className="sticky top-0 z-10 bg-[#154c79] text-white">
            <tr>
              {headers.map((header, index) => {
                // --- NEW: render select-all checkbox instead of a sortable label ---
                if (header.key === "select") {
                  return (
                    <th
                      key="select"
                      className="text-[14px] font-medium px-4 py-4 whitespace-nowrap"
                      style={{ width: 48 }}
                    >
                      <input
                        type="checkbox"
                        checked={allOnPageSelected}
                        onChange={toggleSelectAllOnPage}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                  );
                }
                return (
                  <th
                    key={header.key || index}
                    onClick={() => header.key && requestSort(header.key)}
                    className="text-[14px] font-medium uppercase tracking-wider px-6 py-4 whitespace-nowrap cursor-pointer"
                    style={{
                      width:
                        index === headers.length - 1
                          ? 80
                          : header.key === "remark"
                          ? "auto"
                          : 160,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {header.label}
                      {header.key && getSortDirectionIndicator(header.key) && (
                        <span>{getSortDirectionIndicator(header.key)}</span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {currentLeads.length > 0 ? (
              currentLeads.map((lead, index) => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  index={index}
                  newLeads={newLeads}
                  handleLeadClick={handleLeadClick}
                  handleEditField={handleEditField}
                  handleAssignedToChange={handleAssignedToChange}
                  handleDispositionChange={handleDispositionChange}
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
                  dispositionLoadingId={dispositionLoadingId}
                  selectedLeadIds={selectedLeadIds}
                  toggleLeadSelection={toggleLeadSelection}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-4 text-center text-[20px]"
                >
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;