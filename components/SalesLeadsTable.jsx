"use client";
import { useAuth } from "@/providers/AuthProvider";
import React from "react";

const SalesLeadsTable = () => {
  const { logout, user } = useAuth();
  return (
    <div>
      {user && (
        <div className="cursor-pointer bg-red-600  text-white p-3 hover:bg-red-500 rounded-md mt-5 absolute bottom-10 w-full">
          <p className="cursor-pointer text-center" onClick={logout}>
            Logout
          </p>
        </div>
      )}
      salesleads page
    </div>
  );
};

export default SalesLeadsTable;
