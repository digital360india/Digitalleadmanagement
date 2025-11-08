"use client";

import { LucidePencil } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const LeadRow = ({
  lead,
  index,
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
  dispositionLoadingId,
}) => {
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    if (openMenuId === lead.id) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId, lead.id, setOpenMenuId]);

  return (
    <tr
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } hover:bg-blue-100 cursor-pointer `}
      onClick={() => handleLeadClick(lead.id)}
    >
      <td className="px-6 py-4 text-[16px]" style={{ width: 160 }}>
        <select
          value={lead.assignedTo || "Unassigned"}
          onChange={(e) => handleAssignedToChange(lead.id, e.target.value)}
          className="w-full text-[16px] rounded-md border border-gray-300 p-1"
        >
          {fetchedusers.map((user) => (
            <option key={user.id} value={user.email}>
              {user.name}
            </option>
          ))}
        </select>
      </td>
      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap"
        style={{ width: 160 }}
      >
        {formatDateTime(lead?.date)}
      </td>
      <td
        className="px-6 py-4 text-[16px] whitespace-nowrap"
        style={{ width: 160 }}
      >
        <div className="relative flex items-center">
          <select
            value={lead?.disposition || "Undefined"}
            onChange={(e) => handleDispositionChange(lead.id, e.target.value)}
            className={`w-full text-[16px] rounded-md p-1 ${
              dispositionColorMap[lead?.disposition] ||
              "bg-gray-100 text-gray-700"
            }`}
            disabled={dispositionLoadingId === lead.id}
          >
            {dispositionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {dispositionLoadingId === lead.id && (
            <div className="absolute right-2">
              <svg
                className="animate-spin h-7 w-7 text-blue-800"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
          )}
        </div>
      </td>
      <td
        className="px-6 py-4 text-[16px] text-gray-600 cursor-pointer hover:bg-gray-200"
        style={{
          width: "auto",
          minWidth: "300px",
          maxWidth: "600px",
          whiteSpace: "normal",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleOpenRemarkDialog(lead);
        }}
      >
        <div
          className="flex items-center gap-2"
          style={{ maxHeight: "250px", overflowY: "auto" }}
        >
          <FaRegComment className="text-blue-600" />
          {lead?.remark || "-"}
        </div>
      </td>
      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-200"
        style={{ width: 160 }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleEditField(lead, "phoneNumber", lead?.phoneNumber);
        }}
      >
        {lead?.phoneNumber || "-"}
      </td>

      <td
        className="px-6 py-4 text-[16px] text-gray-900 whitespace-nowrap cursor-pointer hover:bg-gray-200"
        style={{ width: 160 }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleEditField(lead, "name", lead?.name);
        }}
      >
        <div className="flex gap-2 items-end">
          {newLeads.has(lead.id) && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              New
            </span>
          )}
          {lead?.name || "-"}
        </div>
      </td>

      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-200"
        style={{ width: 160 }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleEditField(lead, "alternateNumber", lead?.alternateNumber);
        }}
      >
        {lead?.alternateNumber || "-"}
      </td>
      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-200"
        style={{ width: 160 }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleEditField(lead, "parentName", lead?.parentName);
        }}
      >
        {lead?.parentName || "-"}
      </td>
      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-200"
        style={{ width: 160 }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleEditField(lead, "email", lead?.email);
        }}
      >
        {lead?.email || "-"}
      </td>
      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-200"
        style={{ width: 160 }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleEditField(lead, "seekingClass", lead?.seekingClass);
        }}
      >
        {lead?.seekingClass || "-"}
      </td>
      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-200"
        style={{ width: 160 }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleEditField(lead, "board", lead?.board);
        }}
      >
        {lead?.board || "-"}
      </td>
      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-200"
        style={{ width: 160 }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleEditField(lead, "schoolType", lead?.schoolType);
        }}
      >
        {lead?.schoolType || "-"}
      </td>
      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-200"
        style={{ width: 160 }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleEditField(lead, "budget", lead?.budget);
        }}
      >
        {lead?.budget || "-"}
      </td>
      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-200"
        style={{ width: 160 }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleEditField(lead, "location", lead?.location);
        }}
      >
        {lead?.location || "-"}
      </td>
      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-200"
        style={{ width: 160 }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleEditField(lead, "school", lead?.school);
        }}
      >
        {lead?.school || "-"}
      </td>
      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-200"
        style={{ width: 160 }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleEditField(lead, "type", lead?.type);
        }}
      >
        {lead?.type || "-"}
      </td>

      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap"
        style={{ width: 160 }}
      >
        {lead?.source || "-"}
      </td>

      {/* Action menu */}
      <td
        className="px-6 py-4 text-[16px] font-medium whitespace-nowrap relative "
        style={{ width: 80 }}
      >
        <div className="relative mt-6" ref={menuRef}>
          <button
            className="p-2 cursor-pointer text-gray-400 hover:text-gray-600 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === lead.id ? null : lead.id);
            }}
          >
            <BsThreeDotsVertical size={20} />
          </button>

          {openMenuId === lead.id && (
            <div className="absolute bottom-full right-0 mb-2 w-36 bg-white rounded-md shadow-lg border border-gray-100 z-50">
              <button
                className="w-full text-left px-4 py-2 text-[16px] text-gray-600 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  setOpenMenuId(null);
                  handleEdit(lead);
                }}
              >
                <LucidePencil size={19} className="text-blue-600" />
                Edit
              </button>
              <button
                className="w-full text-left px-4 py-2 text-[16px] text-gray-600 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  setOpenMenuId(null);
                  handleDelete(lead.id);
                }}
              >
                <MdDelete color="red" size={19} />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>

      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap"
        style={{ width: 160 }}
      >
        {lead?.assignedBy || "Unassigned"}
      </td>
      <td
        className="px-6 py-4 text-[16px] text-gray-600 whitespace-nowrap"
        style={{ width: 160 }}
      >
        {lead?.url ? (
          <a
            href={lead.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline cursor-pointer"
            title={lead.url}
          >
            {getDomainFromUrl(lead.url)}
          </a>
        ) : (
          "-"
        )}
      </td>
    </tr>
  );
};

export default LeadRow;
