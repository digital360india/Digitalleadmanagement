"use client";
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLead } from "@/providers/LeadProvider";

const initialForm = {
  name: "",
  email: "",
  phoneNumber: "",
  budget: "",
  board: "",
  currentClass: "",
  seekingClass: "",
  type: "",
  date: "",
  location: "",
  parentName: "",
  school: "",
  schoolType: "",
};

const LeadForm = () => {
  const [form, setForm] = useState(initialForm);
  const [activeGroup, setActiveGroup] = useState("Personal Info");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addLead } = useLead();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (fieldsToValidate = null) => {
    const requiredFields = {
      "Personal Info": ["name", "email", "phoneNumber"],
      "Academic Details": [
        "currentClass",
        "seekingClass",
        "school",
        "schoolType",
      ],
      "Lead Details": ["budget"],
    };

    const fields = fieldsToValidate || Object.values(requiredFields).flat();
    const newErrors = {};

    fields.forEach((field) => {
      if (!form[field] || form[field].trim() === "") {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} is required`;
      }
    });

    if (fields.includes("email") && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      fields.includes("phoneNumber") && 
      form.phoneNumber &&
      !/^\d{10,15}$/.test(form.phoneNumber.replace(/\D/g, ""))
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await addLead(form);
        alert("Lead added successfully!");
        setForm(initialForm);
        setActiveGroup("Personal Info");
      } catch (error) {
        console.error("Error adding lead:", error);
        alert("Error adding lead. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      for (const [groupName, fields] of Object.entries(fieldGroups)) {
        if (fields.some((field) => errors[field])) {
          setActiveGroup(groupName);
          break;
        }
      }
    }
  };

  const fieldGroups = {
    "Personal Info": ["name", "email", "phoneNumber", "parentName"],
    "Academic Details": [
      "currentClass",
      "seekingClass",
      "school",
      "schoolType",
      "board",
    ],
    "Lead Details": ["budget", "type", "date", "location"],
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

  const renderTextField = (field) => {
    const labelText = field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    const baseInputClasses =
      "w-full px-4 py-3 border bg-white text-gray-800 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

    if (field === "date") {
      return (
        <div className="mb-5">
          <label
            htmlFor={field}
            className="block text-gray-700 font-medium mb-2 text-sm"
          >
            {labelText}
          </label>
          <input
            type="date"
            id={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            className={`${baseInputClasses} ${
              errors[field] ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors[field] && (
            <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
          )}
        </div>
      );
    }

    if (field === "schoolType") {
      return (
        <div className="mb-5">
          <label
            htmlFor={field}
            className="block text-gray-700 font-medium mb-2 text-sm"
          >
            {labelText}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              id={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className={`${baseInputClasses} ${
                errors[field] ? "border-red-300 bg-red-50" : "border-gray-200"
              } appearance-none pr-10`}
            >
              <option value="">Select School Type</option>
              {schoolTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
            {errors[field] && (
              <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="mb-5">
        <label
          htmlFor={field}
          className="block text-gray-700 font-medium mb-2 text-sm"
        >
          {labelText}
          {(field === "name" ||
            field === "email" ||
            field === "phoneNumber" ||
            field === "currentClass" ||
            field === "seekingClass" ||
            field === "school" ||
            field === "schoolType" ||
            field === "budget") && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={
            field === "email"
              ? "email"
              : field === "phoneNumber"
              ? "tel"
              : "text"
          }
          id={field}
          name={field}
          placeholder={`Enter ${labelText.toLowerCase()}`}
          value={form[field]}
          onChange={handleChange}
          className={`${baseInputClasses} ${
            errors[field] ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
        />
        {errors[field] && (
          <p className="mt-1 text-sm text-red-500">{errors[field]}</p>
        )}
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Navigation logic
  const groups = Object.keys(fieldGroups);
  const currentIndex = groups.indexOf(activeGroup);

  const handleNext = useCallback(() => {
    // Validate current group's required fields
    const currentGroupFields = fieldGroups[activeGroup].filter(field => 
      ["name", "email", "phoneNumber", "currentClass", "seekingClass", "school", "schoolType", "budget"].includes(field)
    );
    
    if (validateForm(currentGroupFields) && currentIndex < groups.length - 1) {
      setActiveGroup(groups[currentIndex + 1]);
      setErrors({}); // Clear errors when moving to next tab
    }
  }, [activeGroup, currentIndex, groups, form]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setActiveGroup(groups[currentIndex - 1]);
      setErrors({}); // Clear errors when moving to previous tab
    }
  }, [currentIndex, groups]);

  return (
    <div className="py-10 md:py-16 px-4 max-w-6xl mx-auto bg-gradient-to-br from-indigo-50 to-blue-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mx-auto max-w-4xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-8 px-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Add New Lead
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto bg-white border-b border-gray-200 px-4">
            {groups.map((groupName) => (
              <button
                key={groupName}
                type="button"
                onClick={() => {
                  // Only allow tab switching if previous groups are valid
                  const currentGroupIndex = groups.indexOf(groupName);
                  if (currentGroupIndex <= currentIndex || 
                      validateForm(fieldGroups[groups[currentIndex]].filter(field => 
                        ["name", "email", "phoneNumber", "currentClass", "seekingClass", "school", "schoolType", "budget"].includes(field)
                      ))) {
                    setActiveGroup(groupName);
                    setErrors({});
                  }
                }}
                className={`py-4 px-6 font-medium text-[16px] focus:outline-none whitespace-nowrap ${
                  activeGroup === groupName
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {groupName}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="p-6 md:p-10">
            <form onSubmit={handleSubmit}>
              {Object.entries(fieldGroups).map(([groupName, fields]) => (
                <motion.div
                  key={groupName}
                  className={`${
                    activeGroup === groupName ? "block" : "hidden"
                  }`}
                  variants={containerVariants}
                  initial="hidden"
                  animate={activeGroup === groupName ? "visible" : "hidden"}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {fields.map((field) => (
                      <motion.div key={field} variants={itemVariants}>
                        {renderTextField(field)}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}

              <div className="flex justify-between mt-10">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className={`px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium transition duration-300 ${
                    currentIndex === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>

                {currentIndex < groups.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition duration-300"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium shadow-md transform transition duration-300 flex items-center ${
                      isSubmitting
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:from-indigo-700 hover:to-blue-600 hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <span>Submit</span>
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeadForm;