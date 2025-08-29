"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const ClaimSchoolLeadContext = createContext();

export const ClaimSchoolLeadProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);

  const addLead = async (leadData) => {
    try {
      const res = await axios.post("/api/claim-school", leadData);
      console.log("Claim School lead added:", res.data);
      await fetchLeads();
      return res.data;
    } catch (error) {
      console.error("Error adding claim school lead:", error);
      throw error;
    }
  };

  const fetchLeads = async (retries = 3) => {
    try {
      const res = await axios.get("/api/claim-school");
      setLeads(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching claim school leads:", error);
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        setTimeout(() => fetchLeads(retries - 1), 1000);
      } else {
        setLoading(false);
      }
    }
  };

  const updateLead = async (updatedLead) => {
    try {
      const res = await axios.put("/api/claim-school", updatedLead);
      console.log("Claim School lead updated:", res.data);
      await fetchLeads();
      return res.data;
    } catch (error) {
      console.error("Error updating claim school lead:", error);
      throw error;
    }
  };

  const deleteLead = async (id) => {
    try {
      const res = await axios.delete("/api/claim-school", {
        data: { id },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Claim School lead deleted:", res.data);
      await fetchLeads();
      return res.data;
    } catch (error) {
      console.error("Error deleting claim school lead:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <ClaimSchoolLeadContext.Provider
      value={{
        leads,
        addLead,
        fetchLeads,
        updateLead,
        deleteLead,
        loading,
      }}
    >
      {children}
    </ClaimSchoolLeadContext.Provider>
  );
};

export const useClaimSchoolLead = () => useContext(ClaimSchoolLeadContext);
