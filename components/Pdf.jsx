import html2pdf from "html2pdf.js";
import React, { useImperativeHandle, forwardRef } from "react";
import DynamicCircularGraph from "./Graph";

const Pdf = forwardRef(({ school, selectedClass }, ref) => {
  console.log(school);
  const downloadPDF = () => {
    const button = document.querySelector(".no-print");
    button.style.display = "none";

    const element = document.getElementById("full-page");
    const options = {
      margin: 0,
      filename: "schools-list.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .from(element)
      .set(options)
      .save()
      .then(() => {
        button.style.display = "block";
      })
      .catch((error) => {
        button.style.display = "block";
        console.error("Error generating PDF:", error);
      });
  };

  useImperativeHandle(ref, () => ({
    downloadPDF,
  }));

  return (
    <>
      <div id="full-page">
        {school.map((school, index) => (
          <div key={index} className="font-sans first-component pb-6">
            <div className="mx-auto max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Header */}
              <div className="relative bg-[#104378] text-white p-6">
                <div className="absolute left-0 top-0 w-64 h-64 bg-gray-200 rounded-full -translate-x-1/3 -translate-y-1/3"></div>
                <div className="relative z-10 flex items-center">
                  <img
                    src="/api/placeholder/200/200"
                    alt="School"
                    className="w-32 h-32 rounded-full object-cover mr-6"
                  />
                  <div>
                    <h1 className="text-3xl font-bold">{school.schoolName}</h1>
                    <p className="text-xl">Estd. {school.establishment}</p>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-700 transform translate-x-1/2 translate-y-1/2 rotate-45"></div>
              </div>

              {/* Content */}
              <div className="flex">
                {/* Sidebar */}
                <div className="w-1/3 bg-gray-100 px-2 pt-3 space-y-4">
                  <div className="bg-[#2D77AF] text-white py-4 px-4 rounded-lg mb-2">
                    <h3 className="font-semibold mb-1">{selectedClass}</h3>
                    <p className=" font-semibold">{school.schoolBudget}</p>
                  </div>
                  <div className="bg-[#104378] text-white py-4 px-4 rounded-lg">
                    <h2 className=" font-bold mb-2">School Classes</h2>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p>From</p>
                        <p className="font-bold">{school.class_from}</p>
                      </div>
                      <div className="h-[2px] bg-white w-[80px]"></div>
                      <div className="text-center">
                        <p>To</p>
                        <p className="font-bold">{school.class_to}</p>
                      </div>
                      {/* <div className="w-0.5 bg-white h-10"></div> */}
                    </div>
                  </div>

                  <div>
                    <div className="relative grid grid-cols-1 gap-2">
                      {[
                        {
                          file: "/cricket.svg",
                          name: "Cricket",
                          value: school.cricket,
                        },
                        {
                          file: "/lawn tennis.svg",
                          name: "Lawn Tennis",
                          value: school.lawn_tennis,
                        },
                        {
                          file: "/squash.svg",
                          name: "Squash",
                          value: school.squash,
                        },
                        {
                          file: "/skates.svg",
                          name: "Skating",
                          value: school.skating,
                        },
                        {
                          file: "/football.svg",
                          name: "Football",
                          value: school.football,
                        },
                        {
                          file: "/horse riding.svg",
                          name: "Horse Riding",
                          value: school.horse_riding,
                        },
                        {
                          file: "/basketball.svg",
                          name: "Basketball",
                          value: school.basketball,
                        },
                        {
                          file: "/badminton.svg",
                          name: "Badminton",
                          value: school.badminton,
                        },
                        {
                          file: "/shooting.svg",
                          name: "Shooting",
                          value: school.shooting,
                        },
                        {
                          file: "/swimming.svg",
                          name: "Swimming",
                          value: school.swimming,
                        },
                        {
                          file: "/tt.svg",
                          name: "Table Tennis",
                          value: school.table_tennis,
                        },
                      ]
                        .filter(
                          (icon) =>
                            icon.value && icon.value.toLowerCase() === "yes"
                        ) // Case-insensitive check for "yes"
                        .map((icon, index) => (
                          <div key={index} className="flex relative">
                            {/* Column 1: SVG Icon */}
                            <div className="absolute top-0 left-0 w-14 h-14 flex items-center justify-center rounded-full border-4 border-white">
                              <img
                                src={`/${icon.file}`}
                                alt={icon.name}
                                className="w-full h-full object-contain"
                              />
                            </div>

                            {/* Column 2: SVG Name */}
                            <div className="ml-8">
                              <p className="font-medium text-sm text-white h-9 mt-[10px] rounded-r-3xl px-10 bg-[#2D77AF]">
                                {icon.name}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="w-2/3 px-6 pt-4 pb-6">
                  <h2 className="text-lg font-bold text-blue-800 mb-4">
                    About School
                  </h2>
                  <div className="mb-4">
                    <p>{school.about_school}</p>
                  </div>

                  {/* Principal's Message */}
                  {school.principal && school.principal_msg && (
                    <div className="mt-4 bg-blue-50 border pb-[10px] border-blue-200 rounded-lg px-4">
                      <h3 className="text-xl font-semibold text-blue-800 mb-2">
                        Principal's Message |
                        <span className="font-normal">{school.principal}</span>
                      </h3>
                      <p className="italic mb-4">{school.principal_msg}</p>
                    </div>
                  )}

                  <div className="w-[80%] mt-4 pl-4">
                    <h2 className=" font-bold mb-4">School Statistics</h2>
                    <div className="flex space-x-6">
                      <DynamicCircularGraph
                        value={[
                          school.infrastructure,
                          school.placement,
                          school.academic_reputation,
                          school.co_curricular_activities,
                        ]}
                        labels={[
                          "Infrastructure",
                          "Placement",
                          "Academic Reputation",
                          "Co-curricular Activities",
                        ]}
                        index={index}
                      />
                    </div>
                    <div className="flex">
                      <div>
                        <h2 className=" font-bold mt-2 mb-4text-[#104378]">
                          School Information
                        </h2>
                      </div>
                      <div className="w-[55%] h-[2px] mt-[30px] ml-2 bg-[#104378]"></div>
                    </div>
                    <div className="mb-2 ">
                      <h3 className="font-semibold text-sm mb-4 text-[#878787]">
                        BOARDS
                      </h3>
                      <div className="flex space-x-6">
                        {[
                          { name: "CBSE", value: school.cbse_schools },
                          { name: "ICSE", value: school.icse_isc_schools },
                          { name: "CIE", value: school.cie_schools },
                          { name: "IB", value: school.ib_schools },
                          { name: "IGCSE", value: school.igcse_schools },
                        ]
                          .filter(
                            (board) =>
                              board.value && board.value.toLowerCase() === "yes"
                          ) // Case-insensitive check
                          .map((board) => (
                            <span
                              key={board.name}
                              className="bg-[#2D77AF] text-white w-24 h-9 text-center rounded-full text-sm"
                            >
                              {board.name}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-4 text-[#878787]">
                        School Type
                      </h3>
                      <div className="flex gap-2">
                        {[
                          {
                            name: "Day Boarding",
                            value: school.day_boarding_schools,
                          },
                          {
                            name: "Full Boarding",
                            value: school.full_boarding_schools,
                          },
                          { name: "Coed", value: school.coed_schools },
                          { name: "Day School", value: school.day_schools },
                        ]
                          .filter(
                            (schoolType) =>
                              schoolType.value &&
                              schoolType.value.toLowerCase() === "yes"
                          ) // Filter those with "yes"
                          .map((schoolType) => (
                            <span
                              key={schoolType.name}
                              className="bg-[#2D77AF] text-white w-28 h-9 text-center rounded-full text-sm"
                            >
                              {schoolType.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="flex mt-6 no-print">
          <button
            onClick={downloadPDF}
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Download PDF
          </button>
        </div>
      </div>
    </>
  );
});

export default Pdf;
