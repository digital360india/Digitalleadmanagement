"use client";

import React from "react";
import EditLeadPopup from "./EditLeadPopup";
import AddLeadForm from "./LeadForm";

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
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-[40vw]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
             Add Remark
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              Add a remark for{" "}
              <strong className="text-gray-800">
                {remarkLead.name || "Unnamed Lead"}
              </strong>{" "}
              ({remarkLead.disposition || "Undefined"})
            </p>
            <div className="mt-3">
              <label className="block text-sm text-gray-600 mb-1">
                Previous Remark
              </label>
              <textarea
                value={remarkLead.remark || "-"}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                rows={3}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-1">
                New Remark
              </label>
              <textarea
                value={newRemark}
                onChange={(e) => setNewRemark(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 transition"
                rows={3}
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
