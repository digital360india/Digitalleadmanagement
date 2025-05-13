"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [fetchedusers, setUsers] = useState([]);
  const addLead = async (leadData) => {
    try {
      const res = await axios.post("/api/add-lead", leadData);
      fetchLeads();
      console.log("Lead added:", res.data);
    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await axios.get("/api/show-lead");
      console.log(res, "response");
      console.log(res.data.records, "leads in provider");
      setLeads(res.data.records);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  const editLead = async (updatedLead) => {
    try {
      const res = await axios.put("/api/edit-lead", updatedLead);
      return res.data;
    } catch (error) {
      console.error("Error updating lead:", error);
      throw error;
    }
  };

  const updateLead = async (updatedLead) => {
    try {
      await editLead(updatedLead);
      await fetchLeads(); // Optional: refresh lead list
    } catch (error) {
      console.error("Error in updateLead:", error);
    }
  };

  const deleteLead = async (id) => {
    try {
      const res = await axios.delete("/api/delete-lead", {
        data: { id },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Lead deleted:", res.data);
      await fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  // fetch user for assigned lead
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/fetch-users-lead");
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);
  return (
    <LeadContext.Provider
      value={{
        leads,
        addLead,
        fetchLeads,
        updateLead,
        deleteLead,
        fetchedusers,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLead = () => useContext(LeadContext);
