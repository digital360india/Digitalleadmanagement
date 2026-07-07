"use client";

import { createContext, useContext, useEffect, useState } from "react";

const RegisterSchoolContext = createContext();

export function RegisterSchoolProvider({ children }) {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ======================
  // GET ALL SCHOOLS
  // ======================
  const fetchSchools = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/register-schools", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch schools");

      const data = await res.json();

      setSchools(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // CREATE SCHOOL
  // ======================
  const createSchool = async (school) => {
    try {
      setLoading(true);

      const res = await fetch("/api/register-schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(school),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setSchools((prev) => [...prev, data]);

      return data;
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // UPDATE SCHOOL
  // ======================
  const updateSchool = async (school) => {
    try {
      setLoading(true);

      const res = await fetch("/api/register-schools", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(school),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setSchools((prev) =>
        prev.map((item) =>
          item.id === school.id ? { ...item, ...school } : item
        )
      );

      return data;
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // DELETE SCHOOL
  // ======================
  const deleteSchool = async (id) => {
    try {
      setLoading(true);

      const res = await fetch("/api/register-schools", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Delete failed");

      setSchools((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <RegisterSchoolContext.Provider
      value={{
        schools,
        loading,
        error,

        fetchSchools,
        createSchool,
        updateSchool,
        deleteSchool,
      }}
    >
      {children}
    </RegisterSchoolContext.Provider>
  );
}

export const useRegisterSchools = () =>
  useContext(RegisterSchoolContext);