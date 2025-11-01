"use client";

import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";

const PaginationControls = ({
  currentPage,
  totalPages,
  firstPage,
  prevPage,
  nextPage,
  lastPage,
  paginate,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="bg-white px-4 py-3 border-t border-gray-200 overflow-x-auto min-w-0">
      <div className="flex sm:hidden justify-between">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 border border-gray-300 rounded-md text-sm ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Previous
        </button>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border border-gray-300 rounded-md text-sm ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex items-center justify-between">
        <nav
          className="inline-flex flex-nowrap rounded-md shadow-sm gap-px"
          aria-label="Pagination"
        >
          <button
            onClick={firstPage}
            disabled={currentPage === 1}
            className={`px-2 py-2 border border-gray-300 rounded-l-md bg-white ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-2 py-2 border border-gray-300 bg-white ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          {[...Array(totalPages).keys()].map((number) => {
            if (
              number + 1 === 1 ||
              number + 1 === totalPages ||
              (number + 1 >= currentPage - 1 && number + 1 <= currentPage + 1)
            ) {
              return (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`px-4 py-2 border border-gray-300 text-sm ${
                    currentPage === number + 1
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {number + 1}
                </button>
              );
            }
            if (
              (number + 1 === currentPage - 2 && currentPage > 3) ||
              (number + 1 === currentPage + 2 && currentPage < totalPages - 2)
            ) {
              return (
                <div
                  key={number + 1}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-600 text-sm flex items-center"
                >
                  ...
                </div>
              );
            }
            return null;
          })}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-2 py-2 border border-gray-300 bg-white ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            onClick={lastPage}
            disabled={currentPage === totalPages}
            className={`px-2 py-2 border border-gray-300 rounded-r-md bg-white ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronDoubleRightIcon className="h-5 w-5" />
          </button>
        </nav>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700">Go to page:</label>
          <select
            value={currentPage}
            onChange={(e) => paginate(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[...Array(totalPages).keys()].map((number) => (
              <option key={number + 1} value={number + 1}>
                {number + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
