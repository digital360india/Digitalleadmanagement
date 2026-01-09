"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useLead } from "@/providers/LeadProvider";
import { useAuth } from "@/providers/AuthProvider";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaHeartbeat,
  FaChartBar,
  FaSource,
  FaTag,
  FaSourcetree,
} from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";
import FilterSidebar from "@/components/FilterSidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const FINAL_DISPOSITIONS = [
  "Cold",
  "Registration Done",
  "Admission Fee Paid",
  "Admission Done",
];

const getDomainFromUrls = (url) => {
  if (!url) return null;
  try {
    const normalizedUrl = url.match(/^(https?:\/\/|www\.)/)
      ? url
      : `https://${url}`;
    const parsedUrl = new URL(normalizedUrl);
    let hostname = parsedUrl.hostname;
    if (hostname.startsWith("www.")) {
      hostname = hostname.slice(4);
    }
    return hostname;
  } catch {
    console.warn(`Invalid URL: ${url}`);
    return null;
  }
};

const getSiteFromLead = (lead) => {
  const domain = getDomainFromUrls(lead?.url);
  if (domain && domain.includes(".")) {
    return domain;
  }
  const source = lead?.source?.trim();
  if (source) {
    if (source.startsWith("Boarding Admissions")) {
      return "boardingadmissions.com";
    }
    if (source.startsWith("Edu123")) {
      return "edu123.in";
    }
    if (source.startsWith("Eduminatti")) {
      return "eduminatti.com";
    }
    return source;
  }
  return null;
};

const AnalyticsPage = () => {
  const { leads, loading, fetchedusers, fetchLeads } = useLead();
  const { user, logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter states (shared with sidebar)
  const [selectedSite, setSelectedSite] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDisposition, setSelectedDisposition] = useState("all");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartType, setChartType] = useState("heartbeat");

  // Disposition options (from dashboard)
  const dispositionOptions = [
    "Hot",
    "Cold",
    "Warm",
    "DNP",
    "NTR",
    "CIR",
    "Registration Done",
    "Admission Fee Paid",
    "Admission Done",
    "Asked to call back",
    "Post pone for Next year",
    "Undefined",
    "Reminder",
  ];

  // User map for names
  const userMap = useMemo(() => {
    const map = new Map();
    fetchedusers?.forEach((u) => {
      if (u.email && u.name) {
        map.set(u.email.toLowerCase().trim(), u.name);
      }
    });
    return map;
  }, [fetchedusers]);

  // Base filtered leads (date range, dedup, user filter, converted pool filter, disposition filter)
  const baseFilteredLeads = useMemo(() => {
    if (!leads || !user || loading) return [];

    let results = leads.filter((lead) => {
      const leadDate = new Date(lead.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const inRange =
        (!start || leadDate >= start) && (!end || leadDate <= end);
      return inRange;
    });

    // Deduplication
    const uniqueLeadsMap = new Map();
    results.forEach((lead) => {
      if (!lead?.email || !lead?.source) {
        uniqueLeadsMap.set(lead.id, lead);
        return;
      }
      const key = `${lead.email.toLowerCase()}-${lead.source.toLowerCase()}`;
      if (
        !uniqueLeadsMap.has(key) ||
        new Date(lead.date) > new Date(uniqueLeadsMap.get(key).date)
      ) {
        uniqueLeadsMap.set(key, lead);
      }
    });

    results = Array.from(uniqueLeadsMap.values());

    const isAdmin = user.status && user.status.toLowerCase() === "admin";
    if (!isAdmin) {
      results = results.filter((lead) => lead?.assignedTo === user.email);
    } else if (selectedUser) {
      results = results.filter((lead) => lead.assignedTo === selectedUser);
    }

    // REMOVED: Disposition pool filter (isConvertedPool) to always include all dispositions

    if (selectedDisposition !== "all") {
      results = results.filter(
        (lead) => lead.disposition === selectedDisposition
      );
    }

    return results;
  }, [
    leads,
    user,
    startDate,
    endDate,
    selectedSite,
    selectedUser,
    selectedDisposition,
    loading,
  ]);

  // Filtered leads (add site filter on top of base)
  const filteredLeads = useMemo(() => {
    let results = [...baseFilteredLeads];
    const isConvertedPool = selectedSite === "converted-pool";
    if (!isConvertedPool && selectedSite !== "all") {
      if (selectedSite === "others") {
        results = results.filter((lead) => !getSiteFromLead(lead));
      } else {
        results = results.filter(
          (lead) => getSiteFromLead(lead) === selectedSite
        );
      }
    }
    return results;
  }, [baseFilteredLeads, selectedSite]);

  // User analytics data (leads by assigned user, applying date/site/disposition filters but ignoring selectedUser for distribution view)
  const userData = useMemo(() => {
    if (!leads || !user || loading) return [];

    let results = leads.filter((lead) => {
      const leadDate = new Date(lead.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const inRange = (!start || leadDate >= start) && (!end || leadDate <= end);
      return inRange;
    });

    // Deduplication
    const uniqueLeadsMap = new Map();
    results.forEach((lead) => {
      if (!lead?.email || !lead?.source) {
        uniqueLeadsMap.set(lead.id, lead);
        return;
      }
      const key = `${lead.email.toLowerCase()}-${lead.source.toLowerCase()}`;
      if (
        !uniqueLeadsMap.has(key) ||
        new Date(lead.date) > new Date(uniqueLeadsMap.get(key).date)
      ) {
        uniqueLeadsMap.set(key, lead);
      }
    });

    results = Array.from(uniqueLeadsMap.values());

    // Apply site filter
    const isConvertedPool = selectedSite === "converted-pool";
    if (!isConvertedPool && selectedSite !== "all") {
      if (selectedSite === "others") {
        results = results.filter((lead) => !getSiteFromLead(lead));
      } else {
        results = results.filter(
          (lead) => getSiteFromLead(lead) === selectedSite
        );
      }
    }

    // Apply disposition filter
    if (selectedDisposition !== "all") {
      results = results.filter((lead) => lead.disposition === selectedDisposition);
    }

    const isAdmin = user.status && user.status.toLowerCase() === "admin";
    if (!isAdmin) {
      const currentUserName = userMap.get((user.email || '').toLowerCase().trim()) || user.name || user.email || 'Current User';
      return [{ label: currentUserName, value: results.length }];
    } else {
      // For admin, group by assignedTo
      const counts = {};
      results.forEach((lead) => {
        const assignedEmail = lead.assignedTo?.trim();
        let assigned = 'Unassigned';
        if (assignedEmail) {
          assigned = userMap.get(assignedEmail.toLowerCase()) || assignedEmail;
        }
        counts[assigned] = (counts[assigned] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10); // Top 10 users
    }
  }, [leads, user, startDate, endDate, selectedSite, selectedDisposition, loading, userMap]);

  // Sites computation (for sidebar) - always compute from all dispositions
  const sites = useMemo(() => {
    const siteSet = new Set(["all"]);
    const hasOthers = baseFilteredLeads.some((lead) => !getSiteFromLead(lead));
    baseFilteredLeads.forEach((lead) => {
      const site = getSiteFromLead(lead);
      if (site) {
        siteSet.add(site);
      }
    });
    let computedSites = Array.from(siteSet).sort();
    if (hasOthers) {
      computedSites = [...computedSites, "others"];
    }
    return ["converted-pool", ...computedSites];
  }, [baseFilteredLeads]);

  // Daily leads data
  const dailyLeads = useMemo(() => {
    if (!filteredLeads.length) return [];

    const dateCounts = new Map();
    filteredLeads.forEach((lead) => {
      if (!lead?.date) return;
      try {
        const date = new Date(lead.date);
        if (isNaN(date.getTime())) return;
        const dateKey = date.toISOString().split("T")[0];
        dateCounts.set(dateKey, (dateCounts.get(dateKey) || 0) + 1);
      } catch (error) {
        console.warn("Invalid date in lead:", lead.date);
      }
    });

    const sortedEntries = Array.from(dateCounts.entries()).sort(
      (a, b) => new Date(a[0]) - new Date(b[0])
    );
    const totalLeads = filteredLeads.length;
    return sortedEntries.map(([dateKey, count]) => ({
      date: new Date(dateKey).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      rawDate: dateKey,
      count,
      percentage: totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(1) : 0,
    }));
  }, [filteredLeads]);

  // Analytics data
  const totalLeads = filteredLeads.length;
  const avgDailyLeads =
    totalLeads > 0 && dailyLeads.length > 0
      ? (totalLeads / dailyLeads.length).toFixed(1)
      : 0;
  const rangeText =
    startDate && endDate ? `${startDate} to ${endDate}` : "All Time";

  // Leads by disposition
  const dispositionData = useMemo(() => {
    const counts = {};
    filteredLeads.forEach((lead) => {
      const disp = lead.disposition || "Undefined";
      counts[disp] = (counts[disp] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [filteredLeads]);

  const dispositionPieData = useMemo(
    () => ({
      labels: dispositionData.map((d) => d.label),
      datasets: [
        {
          data: dispositionData.map((d) => d.value),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#FF6384",
            "#C9CBCF",
            "#4BC0C0",
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#E7E9ED",
          ],
          borderWidth: 1,
        },
      ],
    }),
    [dispositionData]
  );

  const dispositionPieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right", labels: { font: { family: "serif" } } },
      title: {
        display: true,
        text: "Leads by Disposition",
        font: { family: "serif", size: 16 },
      },
    },
  };

  // Leads by site (top sites from base filtered leads, before site filter)
  const siteData = useMemo(() => {
    const counts = {};
    baseFilteredLeads.forEach((lead) => {
      const site = getSiteFromLead(lead) || "Unknown";
      counts[site] = (counts[site] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10
  }, [baseFilteredLeads]);

  const siteBarData = useMemo(
    () => ({
      labels: siteData.map((d) => d.label),
      datasets: [
        {
          label: "Leads",
          data: siteData.map((d) => d.value),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    }),
    [siteData]
  );

  const siteBarOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Top Sites by Leads",
        font: { family: "serif", size: 16 },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  // Leads by assigned user pie
  const userPieData = useMemo(() => ({
    labels: userData.map(d => d.label),
    datasets: [{
      data: userData.map(d => d.value),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
      ],
      borderWidth: 1,
    }],
  }), [userData]);

  const userPieOptions = {
    responsive: true,
    plugins: {
      legend: { 
        position: 'right', 
        labels: { 
          font: { family: 'serif' },
          usePointStyle: true,
          padding: 20,
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percentage = ((value / data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                return {
                  text: `${label}: ${value} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor ? data.datasets[0].borderColor[i] : data.datasets[0].backgroundColor[i],
                  lineWidth: data.datasets[0].borderWidth,
                  pointStyle: 'circle',
                  index: i
                };
              });
            }
            return [];
          }
        } 
      },
      title: { display: true, text: 'Leads by Assigned User', font: { family: 'serif', size: 16 } },
    },
  };

  // Heartbeat and Candle charts (as before, but simplified)
  const heartbeatData = useMemo(
    () => ({
      labels: dailyLeads.map((d) => d.date),
      datasets: [
        {
          label: "Leads Pulse",
          data: dailyLeads.map((d) => d.count),
          borderColor: "#dc2626",
          backgroundColor: "rgba(220, 38, 38, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#dc2626",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
        },
      ],
    }),
    [dailyLeads]
  );

  const candleData = useMemo(
    () => ({
      labels: dailyLeads.map((d) => d.date),
      datasets: [
        {
          label: "Daily Leads",
          data: dailyLeads.map((d) => d.count),
          backgroundColor: "rgba(34, 197, 94, 0.8)",
          borderColor: "#22c55e",
          borderWidth: 1,
          borderRadius: 2,
          barThickness: 20,
        },
      ],
    }),
    [dailyLeads]
  );

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Leads Trend (${rangeText})`,
        font: { family: "serif", size: 16 },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <FilterSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          sites={sites}
          selectedSite={selectedSite}
          setSelectedSite={setSelectedSite}
          user={user}
          logout={logout}
          fetchedusers={fetchedusers}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          selectedDisposition={selectedDisposition}
          setSelectedDisposition={setSelectedDisposition}
          dispositionOptions={dispositionOptions}
          leads={leads}
        />
        <main className="flex-1 p-6 min-w-0 lg:ml-80 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg" />
            <div className="h-64 bg-gray-200 rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      <FilterSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        sites={sites}
        selectedSite={selectedSite}
        setSelectedSite={setSelectedSite}
        user={user}
        logout={logout}
        fetchedusers={fetchedusers}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        selectedDisposition={selectedDisposition}
        setSelectedDisposition={setSelectedDisposition}
        dispositionOptions={dispositionOptions}
        leads={leads}
      />
      <main className="flex-1 p-6 min-w-0 overflow-y-auto lg:ml-80">
        {/* Date Range Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <IoMdAnalytics className="text-3xl text-[#154c79] animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-bold text-[#154c79] font-serif">
                Leads Analytics
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  From:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#154c79] bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#154c79] bg-white"
                />
              </div>
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-4 py-2 bg-[#154c79] text-white rounded-md hover:bg-opacity-90 transition-colors font-medium"
              >
                Clear
              </button>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#154c79] bg-white"
              >
                <option value="heartbeat">Trend Line</option>
                <option value="candles">Volume Bars</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Range:{" "}
            <span className="font-semibold text-[#154c79]">{rangeText}</span> |
            Total:{" "}
            <span className="font-bold text-[#154c79]">{totalLeads}</span>
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#154c79] flex items-center gap-4 hover:shadow-lg transition-shadow">
            <FaUsers className="text-3xl text-[#154c79] bg-[#154c79]/10 p-2 rounded-full" />
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Leads</p>
              <p className="text-3xl font-bold text-[#154c79]">
                {totalLeads.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <FaChartLine className="text-3xl text-green-600 bg-green-100 p-2 rounded-full" />
            <div>
              <p className="text-sm text-gray-600 font-medium">Avg Daily</p>
              <p className="text-3xl font-bold text-green-600">
                {avgDailyLeads}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <FaCalendarAlt className="text-3xl text-purple-600 bg-purple-100 p-2 rounded-full" />
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Days</p>
              <p className="text-3xl font-bold text-purple-600">
                {dailyLeads.length}
              </p>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#154c79] font-serif mb-4 flex items-center gap-2">
            <FaChartLine className="text-[#154c79]" /> Leads Trend
          </h3>
          <div className="h-80 bg-gray-50 rounded-lg">
            {chartType === "heartbeat" ? (
              <Line data={heartbeatData} options={commonChartOptions} />
            ) : (
              <Bar data={candleData} options={commonChartOptions} />
            )}
          </div>
        </div>

        {/* Disposition and User Pies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Disposition Pie */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#154c79] font-serif mb-4 flex items-center gap-2">
              <FaTag className="text-[#154c79]" /> By Disposition
            </h3>
            <div className="h-80 bg-gray-50 rounded-lg">
              <Pie data={dispositionPieData} options={dispositionPieOptions} />
            </div>
          </div>

          {/* User Pie */}
          {userData.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#154c79] font-serif mb-4 flex items-center gap-2">
                <FaUsers className="text-[#154c79]" /> Leads by Assigned User
              </h3>
              <div className="h-80 bg-gray-50 rounded-lg">
                <Pie data={userPieData} options={userPieOptions} />
              </div>
            </div>
          )}
        </div>

        {/* Site Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-[#154c79] font-serif mb-4 flex items-center gap-2">
            <FaSourcetree className="text-[#154c79]" /> Top Sites
          </h3>
          <div className="h-full bg-gray-50 rounded-lg">
            <Bar data={siteBarData} options={siteBarOptions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;