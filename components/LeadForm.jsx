import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

const AddLeadForm = ({ open, onClose, onSave, users, dispositionOptions }) => {
  const schoolTypeOptions = [
    "Boarding School",
    "Boys Boarding School",
    "Full Boarding School",
    "Girls Boarding School",
    "Day Boarding School",
    "Coed Boarding School",
    "ICSE Boarding School",
    "CBSE Boarding School",
  ];

  const [newLead, setNewLead] = useState({
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
    assignedBy: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber" || name === "alternateNumber") {
      // Allow only digits and limit to 10
      if (/^\d{0,10}$/.test(value)) {
        setNewLead((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setNewLead((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleSubmit = () => {
    if (!newLead.name) {
      setAlert({
        open: true,
        message: "Name is required!",
        severity: "error",
      });
      return;
    }
    if (!newLead.email || !validateEmail(newLead.email)) {
      setAlert({
        open: true,
        message: "A valid email is required!",
        severity: "error",
      });
      return;
    }
    if (newLead.phoneNumber && !validatePhoneNumber(newLead.phoneNumber)) {
      setAlert({
        open: true,
        message: "Phone number must be exactly 10 digits!",
        severity: "error",
      });
      return;
    }
    if (
      newLead.alternateNumber &&
      !validatePhoneNumber(newLead.alternateNumber)
    ) {
      setAlert({
        open: true,
        message: "Alternate number must be exactly 10 digits!",
        severity: "error",
      });
      return;
    }
    onSave(newLead);
    setAlert({
      open: true,
      message: "Lead added successfully!",
      severity: "success",
    });
    setNewLead({
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
      assignedBy: "",
    });
    onClose();
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="add-lead-dialog-title"
        maxWidth="lg"
        fullWidth
        classes={{
          paper:
            "bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl m-2 sm:m-4 md:m-6",
        }}
      >
        <DialogTitle
          id="add-lead-dialog-title"
          className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-5 md:p-6"
        >
          Add New Lead
        </DialogTitle>
        <DialogContent className="p-4 sm:p-6 md:p-8">
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-4 sm:mt-6">
            <TextField
              label="Parent Name"
              name="name"
              value={newLead.name}
              onChange={handleChange}
              fullWidth
              size="small"
              required
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              InputProps={{
                className: "text-gray-800 rounded-lg font-medium",
              }}
              InputLabelProps={{
                className: "text-gray-600 font-medium",
              }}
            />
            <TextField
              label="Email"
              name="email"
              value={newLead.email}
              onChange={handleChange}
              fullWidth
              size="small"
              type="email"
              required
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              InputProps={{
                className: "text-gray-800 rounded-lg font-medium",
              }}
              InputLabelProps={{
                className: "text-gray-600 font-medium",
              }}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={newLead.phoneNumber}
              onChange={handleChange}
              fullWidth
              size="small"
              type="tel"
              inputProps={{
                maxLength: 10,
                pattern: "[0-9]*",
              }}
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              InputProps={{
                className: "text-gray-800 rounded-lg font-medium",
              }}
              InputLabelProps={{
                className: "text-gray-600 font-medium",
              }}
              error={
                newLead.phoneNumber && !validatePhoneNumber(newLead.phoneNumber)
              }
              helperText={
                newLead.phoneNumber && !validatePhoneNumber(newLead.phoneNumber)
                  ? "Must be exactly 10 digits"
                  : ""
              }
            />
            <TextField
              label="Alternate Number"
              name="alternateNumber"
              value={newLead.alternateNumber}
              onChange={handleChange}
              fullWidth
              size="small"
              type="tel"
              inputProps={{
                maxLength: 10,
                pattern: "[0-9]*",
              }}
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              InputProps={{
                className: "text-gray-800 rounded-lg font-medium",
              }}
              InputLabelProps={{
                className: "text-gray-600 font-medium",
              }}
              error={
                newLead.alternateNumber &&
                !validatePhoneNumber(newLead.alternateNumber)
              }
              helperText={
                newLead.alternateNumber &&
                !validatePhoneNumber(newLead.alternateNumber)
                  ? "Must be exactly 10 digits"
                  : ""
              }
            />
            <TextField
              label="Student Name"
              name="parentName"
              value={newLead.parentName}
              onChange={handleChange}
              fullWidth
              size="small"
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              InputProps={{
                className: "text-gray-800 rounded-lg font-medium",
              }}
              InputLabelProps={{
                className: "text-gray-600 font-medium",
              }}
            />
            <TextField
              label="Budget"
              name="budget"
              value={newLead.budget}
              onChange={handleChange}
              fullWidth
              size="small"
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              InputProps={{
                className: "text-gray-800 rounded-lg font-medium",
              }}
              InputLabelProps={{
                className: "text-gray-600 font-medium",
              }}
            />
            <TextField
              label="URL"
              name="url"
              value={newLead.url}
              onChange={handleChange}
              fullWidth
              size="small"
              type="url"
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              InputProps={{
                className: "text-gray-800 rounded-lg font-medium",
              }}
              InputLabelProps={{
                className: "text-gray-600 font-medium",
              }}
            />

            <TextField
              label="Seeking Class"
              name="seekingClass"
              value={newLead.seekingClass}
              onChange={handleChange}
              fullWidth
              size="small"
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              InputProps={{
                className: "text-gray-800 rounded-lg font-medium",
              }}
              InputLabelProps={{
                className: "text-gray-600 font-medium",
              }}
            />
            <TextField
              label="Board"
              name="board"
              value={newLead.board}
              onChange={handleChange}
              fullWidth
              size="small"
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              InputProps={{
                className: "text-gray-800 rounded-lg font-medium",
              }}
              InputLabelProps={{
                className: "text-gray-600 font-medium",
              }}
            />
            <FormControl
              fullWidth
              size="small"
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <InputLabel className="text-gray-600 font-medium">
                School Type
              </InputLabel>
              <Select
                name="schoolType"
                value={newLead.schoolType}
                onChange={handleChange}
                label="School Type"
                className="text-gray-800 rounded-lg font-medium"
              >
                <MenuItem value="">
                  <em className="text-gray-500">Select School Type</em>
                </MenuItem>
                {schoolTypeOptions.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    className="text-gray-800"
                  >
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Session"
              name="type"
              value={newLead.type}
              onChange={handleChange}
              fullWidth
              size="small"
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              InputProps={{
                className: "text-gray-800 rounded-lg font-medium",
              }}
              InputLabelProps={{
                className: "text-gray-600 font-medium",
              }}
            />
            <TextField
              label="Source"
              name="source"
              value={newLead.source}
              onChange={handleChange}
              fullWidth
              size="small"
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              InputProps={{
                className: "text-gray-800 rounded-lg font-medium",
              }}
              InputLabelProps={{
                className: "text-gray-600 font-medium",
              }}
            />
            <TextField
              label="Location"
              name="location"
              value={newLead.location}
              onChange={handleChange}
              fullWidth
              size="small"
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              InputProps={{
                className: "text-gray-800 rounded-lg font-medium",
              }}
              InputLabelProps={{
                className: "text-gray-600 font-medium",
              }}
            />
            <TextField
              label="Suggested School"
              name="school"
              value={newLead.school}
              onChange={handleChange}
              fullWidth
              size="small"
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              InputProps={{
                className: "text-gray-800 rounded-lg font-medium",
              }}
              InputLabelProps={{
                className: "text-gray-600 font-medium",
              }}
            />
            <TextField
              label="Remark"
              name="remark"
              value={newLead.remark}
              onChange={handleChange}
              fullWidth
              size="small"
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 sm:col-span-2 lg:col-span-3"
              multiline
              rows={4}
              InputProps={{
                className: "text-gray-800 rounded-lg font-medium",
              }}
              InputLabelProps={{
                className: "text-gray-600 font-medium",
              }}
            />
            <FormControl
              fullWidth
              size="small"
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <InputLabel className="text-gray-600 font-medium">
                Disposition
              </InputLabel>
              <Select
                name="disposition"
                value={newLead.disposition}
                onChange={handleChange}
                label="Disposition"
                className="text-gray-800 rounded-lg font-medium"
              >
                {dispositionOptions.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    className="text-gray-800"
                  >
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              size="small"
              variant="outlined"
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <InputLabel className="text-gray-600 font-medium">
                Assigned To
              </InputLabel>
              <Select
                name="assignedTo"
                value={newLead.assignedTo}
                onChange={handleChange}
                label="Assigned To"
                className="text-gray-800 rounded-lg font-medium"
              >
                <MenuItem value="Unassigned" className="text-gray-800">
                  Unassigned
                </MenuItem>
                {users.map((user) => (
                  <MenuItem
                    key={user.id}
                    value={user.email}
                    className="text-gray-800"
                  >
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions className="p-4 sm:p-5 md:p-6 bg-gray-50 flex justify-end gap-3 sm:gap-4 rounded-b-2xl">
          <Button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            className="px-4 sm:px-6 py-2 disabled:cursor-not-allowed font-medium"
            disabled={
              !newLead.name || !newLead.email || !validateEmail(newLead.email)
            }
          >
            Add Lead
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        className="mt-12 sm:mt-16"
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{
            width: "100%",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontWeight: 500,
          }}
          className={
            alert.severity === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddLeadForm;
