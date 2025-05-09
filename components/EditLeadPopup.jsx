import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
} from "@mui/material";

const initialForm = {
  name: "",
  email: "",
  phoneNumber: "",
  parentName: "",
  budget: "",
  url: "",
  board: "",
  currentClass: "",
  seekingClass: "",
  schoolType: "",
  type: "",
  source: "",
  disposition: "Undefined",
  assignedTo: "",
  assignedBy: "",
  date: "",
  location: "",
  remark: "",
  school: "",
};

const EditLeadPopup = ({ lead, onSave, onClose }) => {
  const [form, setForm] = useState({ ...initialForm, ...lead });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "email",
      "phoneNumber",
      "budget",
      "currentClass",
      "seekingClass",
      "school",
      "schoolType",
    ];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!form[field] || form[field].trim() === "") {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} is required`;
      }
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      form.phoneNumber &&
      !/^\d{10,15}$/.test(form.phoneNumber.replace(/\D/g, ""))
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        onSave({ ...lead, ...form });
        onClose();
      } catch (error) {
        console.error("Error updating lead:", error);
        alert("Error updating lead. Please try again.");
      }
    }
  };

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

  const dispositionOptions = ["Hot", "Cold", "Warm", "Undefined"];

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-blue-600 text-white font-bold">
        Edit Lead
      </DialogTitle>
      <DialogContent className="px-4 sm:px-6 py-4">
        <form onSubmit={handleSubmit}>
          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Personal Info */}
            <TextField
              label="Name *"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Email *"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Phone Number *"
              name="phoneNumber"
              type="tel"
              value={form.phoneNumber}
              onChange={handleChange}
              fullWidth
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />
            <TextField
              label="Parent Name"
              name="parentName"
              value={form.parentName}
              onChange={handleChange}
              fullWidth
            />

            {/* Academic Info */}
            <TextField
              label="Budget *"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              fullWidth
              error={!!errors.budget}
              helperText={errors.budget}
            />
            <TextField
              label="URL"
              name="url"
              value={form.url}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Board"
              name="board"
              value={form.board}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Current Class *"
              name="currentClass"
              value={form.currentClass}
              onChange={handleChange}
              fullWidth
              error={!!errors.currentClass}
              helperText={errors.currentClass}
            />
            <TextField
              label="Seeking Class *"
              name="seekingClass"
              value={form.seekingClass}
              onChange={handleChange}
              fullWidth
              error={!!errors.seekingClass}
              helperText={errors.seekingClass}
            />

            {/* Selects */}
            <FormControl fullWidth error={!!errors.schoolType}>
              <InputLabel>School Type *</InputLabel>
              <Select
                name="schoolType"
                value={form.schoolType}
                onChange={handleChange}
                label="School Type *"
              >
                <MenuItem value="">Select School Type</MenuItem>
                {schoolTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {errors.schoolType && (
                <Typography className="text-red-600 text-xs mt-1">
                  {errors.schoolType}
                </Typography>
              )}
            </FormControl>

            <TextField
              label="Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Source"
              name="source"
              value={form.source}
              onChange={handleChange}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Disposition</InputLabel>
              <Select
                name="disposition"
                value={form.disposition}
                onChange={handleChange}
                label="Disposition"
              >
                {dispositionOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Assignments */}
            <TextField
              label="Assigned To"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Assigned By"
              name="assignedBy"
              value={form.assignedBy}
              onChange={handleChange}
              fullWidth
            />

            {/* Additional Info */}
            <TextField
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Remark"
              name="remark"
              value={form.remark}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="School *"
              name="school"
              value={form.school}
              onChange={handleChange}
              fullWidth
              error={!!errors.school}
              helperText={errors.school}
            />
          </Box>

          <DialogActions className="mt-6 flex justify-end gap-4">
            <Button
              onClick={onClose}
              variant="outlined"
              className="border-blue-600 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadPopup;
