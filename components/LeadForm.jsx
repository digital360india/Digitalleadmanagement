
"use client";
import React, { useState, useContext } from "react";
import { TextField, Button, Grid } from "@mui/material";
import { useLead } from "@/providers/LeadProvider";

const initialForm = {
  name: "",
  email: "",
  phoneNumber: "",
  budget: "",
  url: "",
  board: "",
  currentClass: "",
  seekingClass: "",
  schoolType: "",
  type: "",
  source: "",
//   disposition: "",
//   assignedTo: "",
//   assignedBy: "",
  date: "",
  location: "",
//   remark: "",
  parentName: "",
  school: "",
};

const LeadForm = () => {
  const [form, setForm] = useState(initialForm);

  const { addLead } = useLead();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addLead(form);
    alert("Lead added successfully!");
    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {Object.keys(initialForm).map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <TextField
              label={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Add Lead
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default LeadForm;
