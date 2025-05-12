"use client";
import { useAuth } from "@/providers/AuthProvider";
import { ChartNoAxesCombined } from "lucide-react";
import React from "react";

const TopNavbar = () => {
  const { logout, user } = useAuth();

  return (
    <div className="flex items-center justify-between p-4 bg-gray-200 ml-80 z-10">
      <div className="flex items-center gap-2">
        <ChartNoAxesCombined />
        <span>Leads</span>
      </div>
      <div>
        <h1>Top Navbar</h1>
      </div>
      {user && (
        <button className="cursor-pointer" onClick={logout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default TopNavbar;
