"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SchoolPDF from "@/components/SchoolPDF";
import FilterSidebar from "@/components/FilterSidebar";
import { useAuth } from "@/providers/AuthProvider";

// Dynamically import Pdf component with SSR disabled
const Pdf = dynamic(() => import("@/components/Pdf"), { ssr: false });

const SchoolMatcher = () => {
  const { logout, user } = useAuth();

  const [userBudget, setUserBudget] = useState("");
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [schoolFilters, setSchoolFilters] = useState({
    daySchools: false,
    dayBoardingSchools: false,
    fullBoardingSchools: false,
    girlsSchools: false,
    boysSchools: false,
    coedSchools: false,
  });
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [schoolsData, setSchoolsData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState("school-matcher");
  const [sites] = useState(["schools"]);

  useEffect(() => {
    axios
      .get("https://cr-mbackend-eosin.vercel.app/schools/")
      .then((response) => {
        setSchoolsData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching schools:", error);
      });
  }, []);

  const boardsOptions = ["CBSE", "ICSE", "CIE", "IB", "IGCSE"];
  const classOptions = [
    "Class1",
    "Class2",
    "Class3",
    "Class4",
    "Class5",
    "Class6",
    "Class7",
    "Class8",
    "Class9",
    "Class10",
    "Class11",
    "Class12",
  ];

  const handleBoardChange = (board) => {
    setSelectedBoards((prev) =>
      prev.includes(board)
        ? prev.filter((item) => item !== board)
        : [...prev, board]
    );
  };

  const handleClassChange = (className) => {
    setSelectedClass(className);
  };

  const handleFilterChange = (filter) => {
    setSchoolFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedBudget = parseInt(userBudget);
    if (!parsedBudget || selectedBoards.length === 0 || !selectedClass) {
      alert(
        "Please enter a valid budget, select at least one board, and choose a class."
      );
      return;
    }

    const matchingSchools = schoolsData.filter((school) => {
      return (
        (selectedBoards.includes("CBSE") && school.cbse_schools === "Yes") ||
        (selectedBoards.includes("ICSE") && school.icse_isc_schools === "Yes") ||
        (selectedBoards.includes("CIE") && school.cie_schools === "Yes") ||
        (selectedBoards.includes("IB") && school.ib_schools === "Yes") ||
        (selectedBoards.includes("IGCSE") && school.igcse_schools === "Yes")
      );
    });

    const topSchools = getTopMatchingSchools(
      parsedBudget,
      matchingSchools,
      selectedClass
    );
    setFilteredSchools(topSchools);
  };

  function getMatchingSchools(userBudget, schoolsData, className) {
    const minThreshold = userBudget - userBudget * 0.25;
    const matchPercentages = [
      { range: 0.25, percentage: 100 },
      { range: 0.5, percentage: 80 },
      { range: 0.75, percentage: 60 },
      { range: 1.0, percentage: 40 },
      { range: 1.25, percentage: 20 },
    ];

    let matchedSchools = [];
    for (const school of schoolsData) {
      const feeFrom = parseInt(school[`class_${className.slice(-1)}`]);
      const feeTo = feeFrom;
      const schoolBudget = (feeFrom + feeTo) / 2;

      if (schoolBudget < minThreshold) {
        continue;
      }

      for (const { range, percentage } of matchPercentages) {
        const minBudget = userBudget - userBudget * range;
        const maxBudget = userBudget + userBudget * range;

        if (schoolBudget >= minBudget && schoolBudget <= maxBudget) {
          matchedSchools.push({
            schoolName: school.name,
            schoolBudget: schoolBudget,
            matchPercentage: percentage,
            schoolRanking: parseInt(school.school_rankings),
            location: school.location,
            contact: school.contact,
            website: school.website,
            phone: school.phone,
            infrastructure: school.infrastructure,
            academic_reputation: school.academic_reputation,
            placement: school.placement,
            co_curricular_activities: school.co_curricular_activities,
            cricket: school.cricket,
            badminton: school.badminton,
            horse_riding: school.horse_riding,
            basketball: school.basketball,
            lawn_tennis: school.lawn_tennis,
            table_tennis: school.table_tennis,
            squash: school.squash,
            skating: school.skating,
            football: school.football,
            shooting: school.shooting,
            swimming: school.swimming,
            principal_msg: school.principal_msg,
            principal: school.principal,
            class_from: school.class_from,
            class_to: school.class_to,
            about_school: school.about_school,
            icse_isc_schools: school.icse_isc_schools,
            cbse_schools: school.cbse_schools,
            cie_schools: school.cie_schools,
            ib_schools: school.ib_schools,
            igcse_schools: school.igcse_schools,
            coed_schools: school.coed_schools,
            full_boarding_schools: school.full_boarding_schools,
            day_boarding_schools: school.day_boarding_schools,
            day_schools: school.day_schools,
            establishment: school.establishment,
          });
          break;
        }
      }
    }

    matchedSchools.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return a.schoolRanking - b.schoolRanking;
    });

    return matchedSchools;
  }

  function getTopMatchingSchools(userBudget, schoolsData, selectedClass) {
    const matches = getMatchingSchools(userBudget, schoolsData, selectedClass);
    return matches.length >= 3 ? matches.slice(0, 3) : matches.slice(0, 1);
  }

  return (
    <div className="flex justify-evenly gap-20 font-serif p-4">
      <div className="w-[10%]">
        <FilterSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          sites={sites}
          selectedSite={selectedSite}
          setSelectedSite={setSelectedSite}
          user={user}
          logout={logout}
        />
      </div>
      <div className="w-[70%] flex justify-between">
        <div className="min-h-screen">
          <form
            className="bg-white p-6 rounded-2xl shadow-lg space-y-6 border border-gray-200"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl text-[#154c79] text-center">
              Find Your Perfect School
            </h2>

            {/* Budget */}
            <div>
              <label className="block mb-1 font-semibold text-[#154c79]">
                Budget (INR)
              </label>
              <input
                type="number"
                value={userBudget}
                onChange={(e) => setUserBudget(e.target.value)}
                className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#154c79] outline-none transition"
              />
            </div>

            {/* Class */}
            <div>
              <label className="block mb-1 text-[#154c79]">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full border border-gray-500 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#154c79] outline-none transition"
              >
                <option value="">Select a class</option>
                {classOptions.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>

            {/* Boards */}
            <div>
              <label className="block mb-2 text-[#154c79]">
                Preferred Boards
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {boardsOptions.map((board) => (
                  <label
                    key={board}
                    className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBoards.includes(board)}
                      onChange={() => handleBoardChange(board)}
                      className="w-5 h-5 accent-[#154c79]"
                    />
                    <span className="text-sm">{board}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* School Types */}
            <div>
              <label className="block mb-2 text-[#154c79]">School Types</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.keys(schoolFilters).map((filter) => (
                  <label
                    key={filter}
                    className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={schoolFilters[filter]}
                      onChange={() => handleFilterChange(filter)}
                      className="w-5 h-5 accent-[#154c79]"
                    />
                    <span className="text-sm">
                      {filter.replace(/([A-Z])/g, " $1")}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#154c79] to-[#0f3a5a] text-white py-3 rounded-lg shadow-md hover:opacity-90 transition"
            >
              Find Schools
            </button>
          </form>
        </div>
        <div className="bg-white w-[35%] min-h-screen p-6 rounded-2xl shadow-lg border border-gray-200">
          {filteredSchools.length > 0 ? (
            <>
              <h2 className="text-2xl text-[#154c79] mb-6 text-center">
                Matching Schools
              </h2>
              <ul className="space-y-4">
                {filteredSchools.map((school, index) => (
                  <li
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="text-theme-primary space-y-1">
                      <h3 className="font-semibold text-lg">
                        {school.schoolName}
                      </h3>
                      <p> Estimated Budget: ₹{school.schoolBudget}</p>
                      <p> Match Percentage: {school.matchPercentage}%</p>
                      <p> Ranking: {school.schoolRanking}</p>
                      <p> Location: {school.location}</p>
                      <p> Contact: {school.contact}</p>
                      <p>
                        Website:{" "}
                        <a
                          href={school.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {school.website}
                        </a>
                      </p>
                      <p> Phone: {school.phone}</p>
                      <p>Infrastructure: {school.infrastructure}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                {(() => {
                  const transformedSchools = filteredSchools.map((school) => {
                    const boards = [];
                    if (
                      school.cbse_schools &&
                      school.cbse_schools.toLowerCase() === "yes"
                    )
                      boards.push("CBSE");
                    if (
                      school.icse_isc_schools &&
                      school.icse_isc_schools.toLowerCase() === "yes"
                    )
                      boards.push("ICSE");
                    if (
                      school.cie_schools &&
                      school.cie_schools.toLowerCase() === "yes"
                    )
                      boards.push("CIE");
                    if (
                      school.ib_schools &&
                      school.ib_schools.toLowerCase() === "yes"
                    )
                      boards.push("IB");
                    if (
                      school.igcse_schools &&
                      school.igcse_schools.toLowerCase() === "yes"
                    )
                      boards.push("IGCSE");

                    const sports = [];
                    if (
                      school.cricket &&
                      school.cricket.toLowerCase() === "yes"
                    )
                      sports.push("Cricket");
                    if (
                      school.badminton &&
                      school.badminton.toLowerCase() === "yes"
                    )
                      sports.push("Badminton");
                    if (
                      school.basketball &&
                      school.basketball.toLowerCase() === "yes"
                    )
                      sports.push("Basketball");
                    if (
                      school.football &&
                      school.football.toLowerCase() === "yes"
                    )
                      sports.push("Football");
                    if (
                      school.horse_riding &&
                      school.horse_riding.toLowerCase() === "yes"
                    )
                      sports.push("Horse Riding");
                    if (
                      school.lawn_tennis &&
                      school.lawn_tennis.toLowerCase() === "yes"
                    )
                      sports.push("Lawn Tennis");
                    if (
                      school.shooting &&
                      school.shooting.toLowerCase() === "yes"
                    )
                      sports.push("Shooting");
                    if (
                      school.skating &&
                      school.skating.toLowerCase() === "yes"
                    )
                      sports.push("Skating");
                    if (school.squash && school.squash.toLowerCase() === "yes")
                      sports.push("Squash");
                    if (
                      school.swimming &&
                      school.swimming.toLowerCase() === "yes"
                    )
                      sports.push("Swimming");
                    if (
                      school.table_tennis &&
                      school.table_tennis.toLowerCase() === "yes"
                    )
                      sports.push("Table Tennis");

                    const schoolTypes = [];
                    if (
                      school.day_schools &&
                      school.day_schools.toLowerCase() === "yes"
                    )
                      schoolTypes.push("Day School");
                    if (
                      school.day_boarding_schools &&
                      school.day_boarding_schools.toLowerCase() === "yes"
                    )
                      schoolTypes.push("Day Boarding");
                    if (
                      school.full_boarding_schools &&
                      school.full_boarding_schools.toLowerCase() === "yes"
                    )
                      schoolTypes.push("Full Boarding");

                    let gender = "—";
                    if (
                      school.coed_schools &&
                      school.coed_schools.toLowerCase() === "yes"
                    )
                      gender = "Coed";

                    return {
                      ...school,
                      className: selectedClass,
                      establishedYear: school.establishment,
                      classFrom: school.class_from,
                      classTo: school.class_to,
                      about: school.about_school,
                      principalMessage: school.principal_msg,
                      academicReputation: school.academic_reputation,
                      coCurricular: school.co_curricular_activities,
                      boards,
                      sports,
                      schoolType: schoolTypes.join(", "),
                      gender,
                    };
                  });

                  return (
                    <>
                      <PDFDownloadLink
                        document={<SchoolPDF schools={transformedSchools} />}
                        fileName="matching_schools.pdf"
                      >
                        {({ loading }) => (
                          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto">
                            {loading ? "Loading PDF..." : "Export PDF"}
                          </button>
                        )}
                      </PDFDownloadLink>
                      <Pdf school={filteredSchools} selectedClass={selectedClass} />
                    </>
                  );
                })()}
              </div>
            </>
          ) : (
            <p className="text-[#154c79] text-center text-lg">
              No match found...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolMatcher;