"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const SchoolLeadContext = createContext(undefined);

export function SchoolLeadProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/register-schools");
      setLeads(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addLead = async (leadData) => {
    try {
      const res = await axios.post("/api/register-schools", leadData);
      await fetchLeads();
      return res.data;
    } catch (err) {
      console.error("Error adding lead:", err);
      throw err;
    }
  };

  const updateLead = async (updatedLead) => {
    try {
      const res = await axios.put("/api/register-schools", updatedLead);
      await fetchLeads();
      return res.data;
    } catch (err) {
      console.error("Error updating lead:", err);
      throw err;
    }
  };

  const deleteLead = async (id) => {
    try {
      await axios.delete("/api/register-schools", {
        data: { id },
        headers: { "Content-Type": "application/json" },
      });
      await fetchLeads();
    } catch (err) {
      console.error("Error deleting lead:", err);
      throw err;
    }
  };

  // Uploads an .xlsx/.xls file straight to the backend, which parses every
  // sheet, maps only the matching fields, and bulk-creates the records.
  const importFromExcel = async (file) => {
    try {
      setImporting(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/register-schools/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchLeads();
      return res.data; // { totalRowsFound, created, failed, failures }
    } catch (err) {
      console.error("Error importing Excel file:", err);
      throw err;
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <SchoolLeadContext.Provider
      value={{
        leads,
        loading,
        error,
        importing,
        fetchLeads,
        addLead,
        updateLead,
        deleteLead,
        importFromExcel,
      }}
    >
      {children}
    </SchoolLeadContext.Provider>
  );
}

export const useschoolLead = () => useContext(SchoolLeadContext);