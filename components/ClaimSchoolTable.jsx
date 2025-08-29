"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useClaimSchoolLead } from "@/providers/ClaimSchoolLeadProvider";
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
  useTheme,
  Skeleton,
} from "@mui/material";
import { Inbox } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

export default function ClaimSchoolTable() {
  const { user, logout } = useAuth();
  const { leads, loading, fetchLeads } = useClaimSchoolLead();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sites] = useState(["Claim Schools"]);
  const [selectedSite, setSelectedSite] = useState(sites[0]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const paginatedRows = leads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box className="flex flex-col lg:flex-row mt-6 gap-6">
      <Box
        className={`lg:w-[18%] w-full transition-all duration-300 ${
          isSidebarOpen ? "block" : "hidden lg:block"
        }`}
      >
        <FilterSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          sites={sites}
          selectedSite={setSelectedSite}
          user={user}
          logout={logout}
        />
      </Box>

      <Box className="lg:w-[74%] w-full lg:ml-10">
        <Paper
          elevation={6}
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
            bgcolor: "background.paper",
            transition: "0.3s",
            "&:hover": {
              boxShadow: theme.shadows[10],
            },
          }}
        >
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              color="primary"
              sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }}
            >
              Claim School — Leads
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Total Leads: {leads.length}
            </Typography>
          </Box>

          <TableContainer sx={{ maxHeight: 500, borderRadius: 2 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  {[
                    "Name",
                    "School Name",
                    "Phone Number",
                    "Email",
                    "Designation",
                  ].map((head, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        color: "text.primary",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading
                  ? Array.from({ length: rowsPerPage }).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <TableCell key={i}>
                            <Skeleton variant="text" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : paginatedRows.map((row, index) => (
                      <TableRow
                        key={index}
                        hover
                        sx={{
                          "&:nth-of-type(odd)": { bgcolor: "grey.50" },
                          transition: "0.3s",
                          "&:hover": { bgcolor: "primary.light" },
                          cursor: "pointer",
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>
                          {row.name}
                        </TableCell>
                        <TableCell>{row.schoolName}</TableCell>
                        <TableCell>{row.phoneNumber}</TableCell>
                        <TableCell sx={{ color: "primary.main", fontSize: 14 }}>
                          {row.email}
                        </TableCell>
                        <TableCell>{row.designation}</TableCell>
                      </TableRow>
                    ))}

                {!loading && leads.length === 0 && (
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

          <TablePagination
            component="div"
            count={leads.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              mt: 2,
              ".MuiTablePagination-toolbar": {
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 1,
              },
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
}
