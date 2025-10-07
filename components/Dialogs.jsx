"use client";

import React from "react";
import EditLeadPopup from "./EditLeadPopup";
import AddLeadForm from "./LeadForm";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";



const Dialogs = ({
  editingLead,
  setEditingLead,
  handleSaveEdit,
  reminderLead,
  reminderDateTime,
  setReminderDateTime,
  handleSetReminder,
  handleCloseReminderDialog,
  remarkLead,
  newRemark,
  setNewRemark,
  handleAddRemark,
  handleCloseRemarkDialog,
  editRemarkIndex,
  setEditRemarkIndex,
  editRemarkText,
  setEditRemarkText,
  handleEditRemark,
  handleDeleteRemark,
  editFieldLead,
  editFieldName,
  editFieldValue,
  setEditFieldValue,
  handleSaveFieldEdit,
  handleCloseEditFieldDialog,
  addLeadDialogOpen,
  setAddLeadDialogOpen,
  handleAddLead,
  fetchedusers,
  dispositionOptions,
}) => {
  const parseRemarks = (remarkString) => {
    if (!remarkString) return [];
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

  const formatTimestamp = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {editingLead && (
        <EditLeadPopup
          lead={editingLead}
          onSave={handleSaveEdit}
          onClose={() => setEditingLead(null)}
        />
      )}

      {reminderLead && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-60 flex items-center justify-center z-50 transition">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8  w-[40vw]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Set Reminder
            </h2>
            <p className="text-sm text-gray-500 mb-1">Set a reminder for:</p>
            <p className="text-lg font-semibold text-gray-700">
              {reminderLead.name || "Unnamed Lead"}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Disposition: {reminderLead.disposition || "Undefined"}
            </p>
            <input
              type="datetime-local"
              value={reminderDateTime}
              onChange={(e) => setReminderDateTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseReminderDialog}
                className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSetReminder}
                disabled={!reminderDateTime}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
              >
                Set Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {remarkLead && (
        <div className="fixed inset-0 bg-opacity-60 bg-black/70 flex items-center justify-center z-50 transition">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-[40vw] max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Manage Remarks
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              Manage remarks for{" "}
              <strong className="text-gray-800">
                {remarkLead.name || "Unnamed Lead"}
              </strong>{" "}
              ({remarkLead.disposition || "Undefined"})
            </p>
            <div className="mt-3">
              <label className="block text-sm text-gray-600 mb-1 font-semibold">
                Existing Remarks
              </label>
              <div className="space-y-2 mb-4">
                {parseRemarks(remarkLead.remark || "-").length > 0 ? (
                  parseRemarks(remarkLead.remark).map((rem, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">
                            {rem.timestamp}
                          </p>
                          {editRemarkIndex === index ? (
                            <textarea
                              value={editRemarkText}
                              onChange={(e) =>
                                setEditRemarkText(e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 transition"
                              rows={2}
                            />
                          ) : (
                            <p className="text-sm text-gray-800">{rem.text}</p>
                          )}
                        </div>
                        <div className="ml-2 flex space-x-1">
                          {editRemarkIndex === index ? (
                            <>
                              <button
                                onClick={() =>
                                  handleEditRemark(index, editRemarkText)
                                }
                                disabled={!editRemarkText.trim()}
                                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 transition"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditRemarkIndex(null)}
                                className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditRemarkIndex(index);
                                  setEditRemarkText(rem.text);
                                }}
                                className="px-2 py-1 text-xs  text-blue-700 rounded  transition"
                                title="Edit"
                              >
                                <CiEdit size={20}/>

                              </button>
                              <button
                                onClick={() => handleDeleteRemark(index)}
                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition"
                                title="Delete"
                              >
                                <MdDelete size={20} />

                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No remarks yet.
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <label className="block text-sm text-gray-600 mb-1">
                Add New Remark
              </label>
              <textarea
                value={newRemark}
                onChange={(e) => setNewRemark(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 transition"
                rows={3}
                placeholder="Enter new remark..."
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseRemarkDialog}
                className="px-4 py-2 text-sm border border-gray-500 text-gray-600 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddRemark(remarkLead, newRemark)}
                disabled={!newRemark.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
              >
                Add Remark
              </button>
            </div>
          </div>
        </div>
      )}

      {editFieldLead && (
        <div className="fixed inset-0 bg-black/70  bg-opacity-60 flex items-center justify-center z-50 transition">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-[40vw]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Edit{" "}
              {editFieldName.charAt(0).toUpperCase() + editFieldName.slice(1)}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              Editing {editFieldName} for{" "}
              <strong className="text-gray-800">
                {editFieldLead.name || "Unnamed Lead"}
              </strong>
            </p>
            <div className="mt-2">
              <label className="block text-sm text-gray-600 mb-1">
                New{" "}
                {editFieldName.charAt(0).toUpperCase() + editFieldName.slice(1)}
              </label>
              <input
                type={
                  editFieldName === "email"
                    ? "email"
                    : editFieldName.includes("Number")
                    ? "tel"
                    : "text"
                }
                value={editFieldValue}
                onChange={(e) => setEditFieldValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseEditFieldDialog}
                className="px-4 py-2 text-sm border border-gray-500 text-gray-600 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFieldEdit}
                disabled={
                  !editFieldValue.trim() &&
                  editFieldName !== "email" &&
                  !editFieldName.includes("Number")
                }
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
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
    </>
  );
};

export default Dialogs;
