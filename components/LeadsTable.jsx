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
    <div className="overflow-x-auto">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {leads?.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead?.name}</TableCell>
                <TableCell>{lead?.email}</TableCell>
                <TableCell>{lead?.phoneNumber}</TableCell>
                <TableCell>{lead?.budget}</TableCell>
                <TableCell>{lead?.url}</TableCell>
                <TableCell>{lead?.board}</TableCell>
                <TableCell>{lead?.currentClass}</TableCell>
                <TableCell>{lead?.seekingClass}</TableCell>
                <TableCell>{lead?.schoolType}</TableCell>
                <TableCell>{lead?.type}</TableCell>
                <TableCell>{lead?.source}</TableCell>
                <TableCell>{lead?.disposition}</TableCell>
                <TableCell>{lead?.assignedTo}</TableCell>
                <TableCell>{lead?.assignedBy}</TableCell>
                <TableCell>{lead?.date}</TableCell>
                <TableCell>{lead?.location}</TableCell>
                <TableCell>{lead?.remark}</TableCell>
                <TableCell>{lead?.parentName}</TableCell>
                <TableCell>{lead?.school}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(lead)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(lead.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LeadTable;
