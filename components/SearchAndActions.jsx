"use client";

import React from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ImFileExcel } from "react-icons/im";

const SearchAndActions = ({ searchTerm, setSearchTerm, setAddLeadDialogOpen, exportToExcel }) => {
  return (
    <div className="space-x-4 mb-4 mt-8 md:mt-0 flex justify-between items-center">
      <div className="rounded-lg md:w-[32%] flex justify-end">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search leads by name, source, or specific disposition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-indigo-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={() => setAddLeadDialogOpen(true)}
          className="flex justify-center items-center bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-semibold text-base sm:text-lg py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Lead
        </button>
        <button
          onClick={exportToExcel}
          className="flex justify-center items-center bg-gradient-to-r from-blue-600 to-[#154c79] hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-base sm:text-lg py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
        >
          <ImFileExcel size={20} />
           Export to Excel
        </button>
      </div>
    </div>
  );
};

export default SearchAndActions;