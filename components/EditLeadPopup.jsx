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
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import { CheckCircle, Lock, LockOutlined } from "@mui/icons-material";

const initialForm = {
  name: "",
  email: "",
  phoneNumber: "",
  alternateNumber: "",
  parentName: "",
  budget: "",
  url: "",
  board: "",
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
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    if (name === "disposition" && !["Hot", "Cold", "Warm"].includes(value)) {
      updatedForm.specificDisposition = "";
    }

    setForm(updatedForm);
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

    if (
      form.alternateNumber &&
      form.alternateNumber.trim() !== "" &&
      !/^\d{10,15}$/.test(form.alternateNumber.replace(/\D/g, ""))
    ) {
      newErrors.alternateNumber = "Please enter a valid alternate phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", form);
    if (validateForm()) {
      const confirmSave = window.confirm(
        "Are you sure you want to save changes to this lead?"
      );
      if (confirmSave) {
        setIsSaving(true);
        try {
          await onSave({ ...lead, ...form });
          alert("Lead updated successfully!");
          onClose();
        } catch (error) {
          console.error("Error updating lead:", error);
          alert("Error updating lead. Please try again.");
        } finally {
          setIsSaving(false);
        }
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

  const dispositionOptions = ["Hot", "Cold", "Warm", "Undefined", "DNP",
    "NTR",
    "CIR",
    "Registration Done",
    "Admission Fee Paid",
    "Admission Done",
    "Asked to call back",
    "Post pone for Next year",];


  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      classes={{
        paper: "rounded-2xl shadow-2xl bg-gradient-to-br from-white to-gray-50",
      }}
    >
      <DialogTitle className="bg-gradient-to-r from-indigo-900 to-blue-600 text-white text-2xl font-bold text-center py-4">
        Edit Lead
      </DialogTitle>
      <DialogContent className="p-6 sm:p-8 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Typography
              variant="h6"
              className="text-gray-700 font-semibold flex items-center mb-8 pt-9"
            >
              <svg
                className="w-6 h-6 mr-2 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Personal Information
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <TextField
                label="Parent Name *"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
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
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />
              <TextField
                label="Phone *"
                name="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={handleChange}
                fullWidth
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />
              <TextField
                label="Alternate Number"
                name="alternateNumber"
                type="tel"
                value={form.alternateNumber}
                onChange={handleChange}
                fullWidth
                error={!!errors.alternateNumber}
                helperText={errors.alternateNumber}
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />
              <TextField
                label="Student Name"
                name="parentName"
                value={form.parentName}
                onChange={handleChange}
                fullWidth
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />
            </div>
          </div>

          <hr className="my-6 border-gray-400" />

          <div className="mb-6">
            <Typography
              variant="h6"
              className="text-gray-700 font-semibold flex items-center mb-4"
            >
              <svg
                className="w-6 h-6 mr-2 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
              Academic Information
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <TextField
                label="Budget *"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                fullWidth
                error={!!errors.budget}
                helperText={errors.budget}
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />
              <TextField
                label="URL"
                name="url"
                value={form.url}
                onChange={handleChange}
                fullWidth
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />
              <TextField
                label="Board"
                name="board"
                value={form.board}
                onChange={handleChange}
                fullWidth
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />

              <TextField
                label="Seeking Class *"
                name="seekingClass"
                value={form.seekingClass}
                onChange={handleChange}
                fullWidth
                error={!!errors.seekingClass}
                helperText={errors.seekingClass}
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />
              <FormControl fullWidth error={!!errors.schoolType}>
                <InputLabel className="text-gray-600 font-medium">
                  School Type *
                </InputLabel>
                <Select
                  name="schoolType"
                  value={form.schoolType}
                  onChange={handleChange}
                  label="School Type *"
                  className="bg-gray-50 rounded-lg text-gray-700"
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
                label="Suggested School *"
                name="school"
                value={form.school}
                onChange={handleChange}
                fullWidth
                error={!!errors.school}
                helperText={errors.school}
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />
            </div>
          </div>

          <hr className="my-6 border-gray-400" />

          <div className="mb-6">
            <Typography
              variant="h6"
              className="text-gray-700 font-semibold flex items-center mb-4"
            >
              <svg
                className="w-6 h-6 mr-2 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              Lead Details
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
             <TextField
                label="Session"
                name="type"
                value={form.type}
                onChange={handleChange}
                fullWidth
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />
              <TextField
                label="Source"
                name="source"
                value={form.source}
                onChange={handleChange}
                fullWidth
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />
              <FormControl fullWidth className="pt-5">
                <InputLabel className="text-gray-600 font-medium">
                  Disposition
                </InputLabel>
                <Select
                  name="disposition"
                  value={form.disposition}
                  onChange={handleChange}
                  label="Disposition"
                  className="bg-gray-50 rounded-lg text-gray-700"
                >
                  {dispositionOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Assigned To"
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                fullWidth
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />
              <TextField
                label="Assigned By"
                name="assignedBy"
                value={form.assignedBy}
                onChange={handleChange}
                fullWidth
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />
              <TextField
                label="Date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  className: "text-gray-600 font-medium",
                }}
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
              />
              <TextField
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                fullWidth
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />
              <TextField
                label="Remark"
                name="remark"
                value={form.remark}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                className="bg-gray-50 rounded-lg"
                InputProps={{
                  className: "text-gray-700",
                }}
                InputLabelProps={{
                  className: "text-gray-600 font-medium",
                }}
              />
            </div>
          </div>

          <DialogActions className="px-6 pb-6">
            <Button
              onClick={onClose}
              variant="outlined"
              color="error"
              className="rounded-md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSaving}
              className="rounded-md bg-blue-600 hover:bg-blue-900"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadPopup;
