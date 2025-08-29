"use client";
import { useAuth } from "@/providers/AuthProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TablePagination,
} from "@mui/material";
import FilterSidebar from "./FilterSidebar";
import { useState } from "react";
import { Inbox } from "lucide-react"; 

export default function ClaimSchoolTable({ rows = [] }) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sites] = useState(["Claim Schools"]);
  const [selectedSite, setSelectedSite] = useState(sites[0]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="flex flex-col lg:flex-row mt-8 gap-6">
      {/* Sidebar */}
      <div className="lg:w-[18%] w-full">
        <FilterSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          sites={sites}
          selectedSite={selectedSite}
          setSelectedSite={setSelectedSite}
          user={user}
          logout={logout}
        />
      </div>

      {/* Table Section */}
      <div className="lg:w-[82%] w-full pl-0 lg:pl-6">
        <Paper
          elevation={4}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            p: { xs: 2, sm: 3 },
            bgcolor: "background.paper",
          }}
        >
          {/* Title */}
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              fontWeight={700}
              color="primary"
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              Claim School — Leads
            </Typography>
          </Box>

          {/* Responsive Table */}
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  {["Name", "School Name", "Phone Number", "Email", "Designation"].map(
                    (head, i) => (
                      <TableCell
                        key={i}
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        {head}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{
                      "&:nth-of-type(odd)": { bgcolor: "grey.50" },
                      transition: "0.2s",
                      "&:hover": { bgcolor: "grey.100" },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{row.Name}</TableCell>
                    <TableCell>{row.SchoolName}</TableCell>
                    <TableCell>{row.PhoneNumber}</TableCell>
                    <TableCell sx={{ color: "primary.main", fontSize: 14 }}>
                      {row.email}
                    </TableCell>
                    <TableCell>{row.Designation}</TableCell>
                  </TableRow>
                ))}

                {/* Empty State */}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={1}
                      >
                        <Inbox size={36} strokeWidth={1.5} color="grey" />
                        <Typography variant="body2" color="text.secondary">
                          No records found
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              ".MuiTablePagination-toolbar": {
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 1,
              },
            }}
          />
        </Paper>
      </div>
    </div>
  );
}
