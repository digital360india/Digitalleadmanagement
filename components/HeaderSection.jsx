"use client";

import React from "react";
import { BellIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/providers/AuthProvider";

const HeaderSection = ({
  totalUniqueLeads,
  activeReminders,
  handleReminderClick,
  anchorEl,
  handleReminderClose,
  handleReminderSelect,
  formatDateTime,
}) => {
  const { user } = useAuth();

  const isAdmin = user?.email === "admin@digital360india.com";

  // Set the dashboard title based on admin status
  const dashboardTitle = isAdmin
    ? "Admin Leads Dashboard"
    : `${user?.name || "User"} Leads Dashboard`;

  return (
    <div className="md:flex md:flex-col mb-2">
      <div className="md:flex md:justify-between md:items-center space-y-4">
        <h1 className="md:text-3xl text-2xl md:font-bold text-[#154c79] font-serif text-center md:text-left">
          {dashboardTitle}
        </h1>
        <div className="bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-md flex gap-2 items-center">
          <div className="relative">
            <button onClick={handleReminderClick} className="p-2">
              <BellIcon className="h-6 w-6 text-[#154c79]" />
              {activeReminders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {activeReminders.length}
                </span>
              )}
            </button>
            {anchorEl && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-100 z-10">
                <div className="p-2 max-h-80 overflow-y-auto">
                  {activeReminders.length > 0 ? (
                    activeReminders.map((reminder) => (
                      <div
                        key={reminder.leadId}
                        className="p-2 mb-1 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleReminderSelect(reminder)}
                      >
                        <p className="text-sm font-semibold">
                          {reminder.leadName} ({reminder.disposition})
                        </p>
                        <p className="text-xs text-gray-500">
                          Due: {formatDateTime(reminder.reminderTime)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="p-2 text-sm text-gray-600">
                      No active reminders
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <p className="text-[20px] text-green-600 font-serif">Total Leads</p>
          <p className="text-2xl font-bold text-green-600">
            {totalUniqueLeads}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
