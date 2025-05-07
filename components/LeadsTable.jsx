"use client";
import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLead } from "@/providers/LeadProvider";

const LeadTable = ({ onEdit, onDelete }) => {
  const { leads } = useLead();
  console.log(leads, "leads in table");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Leads Dashboard</h2>
        <TableContainer
          component={Paper}
          className="shadow-lg rounded-lg overflow-hidden"
        >
          <Table className="min-w-full">
            <TableHead>
              <TableRow className="bg-blue-600">
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "Budget",
                  "URL",
                  "Board",
                  "Current Class",
                  "Seeking Class",
                  "School Type",
                  "Type",
                  "Source",
                  "Disposition",
                  "Assigned To",
                  "Assigned By",
                  "Date",
                  "Location",
                  "Remark",
                  "Parent Name",
                  "School",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    className="text-white font-semibold text-sm py-3 px-4"
                    style={{ color: "white" }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {leads?.map((lead, index) => (
                <TableRow
                  key={lead.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.name}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.email}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.phoneNumber}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.budget}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">
                    <a
                      href={lead?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {lead?.url}
                    </a>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.board}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.currentClass}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.seekingClass}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.schoolType}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.type}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.source}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.disposition}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.assignedTo}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.assignedBy}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.date}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.location}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.remark}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.parentName}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">{lead?.school}</TableCell>
                  <TableCell className="py-3 px-4">
                    <IconButton
                      onClick={() => onEdit(lead)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => onDelete(lead.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default LeadTable;