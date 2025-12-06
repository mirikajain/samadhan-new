import React, { useState, useEffect, useRef } from "react";
import Donate from "./donate.jsx";
import DonationHistory from "./donationHistory.jsx";
import ProfileCard from "../../components/profileCard.jsx";

import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";

// IMPORT HERO IMAGE
import heroImage from "../../assets/donation-hero.jpg";

export default function DonorDashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Donor User",
    centreId: "N/A",
  };

  const [activeTab, setActiveTab] = useState("dashboard");
  const [openProfile, setOpenProfile] = useState(false);
  const menuRef = useRef(null);

  const [donations, setDonations] = useState([]);
  const [impact, setImpact] = useState(0);

  // Close profile dropdown on outside click
  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Fetch donor's donations
  useEffect(() => {
    fetch("http://localhost:5000/api/donor/get-donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ donorName: user.username }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDonations(data.donations);
          setImpact(data.donations.length * 3); // Example: each donation impacts 3 students
        }
      });
  }, []);

  // ----------------- COLORS FOR CAUSES -----------------
  const CAUSE_COLORS = {
    "Education Support": "#4B7BE5",     // Blue
    "Feeding Program": "#2ECC71",       // Green
    "Girls Empowerment": "#E74C3C",     // Red
    "Health & Hygiene": "#9B59B6",      // Purple
    "Community Development": "#F1C40F", // Yellow
  };

  // ----------------- MONTHWISE BAR CHART DATA -----------------
  const monthwiseData = {};

  donations.forEach((d) => {
    const month = new Date(d.date).toLocaleString("default", { month: "short" });

    if (!monthwiseData[month]) {
      monthwiseData[month] = { month };
    }

    monthwiseData[month][d.cause] =
      (monthwiseData[month][d.cause] || 0) + d.amount;
  });

  const groupedMonthData = Object.values(monthwiseData);

  // ----------------- PIE CHART DATA -----------------
  const totalsByCause = {};
  donations.forEach((d) => {
    totalsByCause[d.cause] = (totalsByCause[d.cause] || 0) + d.amount;
  });

  const pieData = Object.keys(totalsByCause).map((cause) => ({
    name: cause,
    value: totalsByCause[cause],
    color: CAUSE_COLORS[cause],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffecd9] to-[#ffbe88] p-6 relative">

      {/* PROFILE BUTTON */}
      <div className="absolute top-6 right-6 z-[999]" ref={menuRef}>
        <button
          onClick={() => setOpenProfile(!openProfile)}
          className="w-12 h-12 rounded-full bg-white border shadow-md flex items-center 
                     justify-center hover:scale-110 transition"
        >
          <span className="text-orange-600 font-bold text-lg uppercase">
            {user.username[0]}
          </span>
        </button>

        {openProfile && (
          <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border p-4 z-[999]">
            <ProfileCard user={user} />

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* NAV BUTTONS */}
      <div className="flex justify-center gap-6 mt-6 mb-10">
        {[
          { id: "dashboard", label: "📊 Dashboard" },
          { id: "donate", label: "💝 Donate" },
          { id: "history", label: "📜 History" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-xl font-semibold shadow-md transition 
              ${
                activeTab === tab.id
                  ? "bg-[#f58a1f] text-white scale-105"
                  : "bg-white text-orange-900 border border-orange-300 hover:bg-orange-50"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto">

        {/* ----------------- DASHBOARD TAB ----------------- */}
        {activeTab === "dashboard" && (
          <>
            {/* HERO SECTION */}
            <div className="relative z-0 flex flex-col md:flex-row bg-orange-100 rounded-3xl shadow p-10 mb-10 items-center gap-8">

              <div className="flex-1">
                <h1 className="text-4xl font-bold text-[#f58a1f] leading-tight">
                  Welcome Back, {user.username}!
                </h1>

                <p className="text-gray-700 text-lg mt-3">
                  Your generosity creates real impact. Explore your contribution ✨
                </p>

                <button
                  onClick={() => setActiveTab("donate")}
                  className="mt-5 px-7 py-3 bg-[#f58a1f] text-white rounded-xl shadow hover:bg-[#e27810] font-semibold"
                >
                  ❤️ Donate Again
                </button>
              </div>

              {/* HERO IMAGE — no overlap */}
              <div className="flex-1 flex justify-center relative z-0 pointer-events-none">
                <img
                  src={heroImage}
                  alt="Donation Impact"
                  className="w-80 drop-shadow-2xl rounded-xl"
                />
              </div>

            </div>

            {/* STATS */}
            <div className="grid md:grid-cols-3 gap-6">

              <div className="p-6 bg-white rounded-xl shadow-lg border text-center">
                <p className="text-xl text-gray-600">Total Donated</p>
                <p className="text-4xl font-bold text-[#f58a1f] mt-2">
                  ₹{donations.reduce((s, d) => s + d.amount, 0)}
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-lg border text-center">
                <p className="text-xl text-gray-600">Total Donations</p>
                <p className="text-4xl font-bold text-[#f58a1f] mt-2">
                  {donations.length}
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-lg border text-center">
                <p className="text-xl text-gray-600">Students Impacted</p>
                <p className="text-4xl font-bold text-[#f58a1f] mt-2">
                  {impact}
                </p>
              </div>

            </div>

            {/* CHARTS SECTION */}
            <div className="grid md:grid-cols-2 gap-10 mt-12">

              {/* PIE CHART */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold text-[#f58a1f] mb-4 text-center">
                  Donation Distribution by Cause
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={120}
                      label
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* MONTHWISE MULTI-BAR CHART */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold text-[#f58a1f] mb-4 text-center">
                  Monthwise Donation Comparison by Cause
                </h3>

                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={groupedMonthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />

                    {Object.keys(CAUSE_COLORS).map((cause, idx) => (
                      <Bar
                        key={idx}
                        dataKey={cause}
                        fill={CAUSE_COLORS[cause]}
                        name={cause}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </>
        )}

        {/* ----------------- DONATE TAB ----------------- */}
        {activeTab === "donate" && <Donate />}

        {/* ----------------- HISTORY TAB ----------------- */}
        {activeTab === "history" && <DonationHistory />}

      </div>
    </div>
  );
}
