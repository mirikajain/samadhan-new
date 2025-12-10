import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import ProfileCard from "../../components/profileCard.jsx";

import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";

import heroImage from "../../assets/donation-hero.jpg";

export default function DonorDashboard() {
  const [, navigate] = useLocation();

  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Donor User",
    centreId: "N/A",
  };

  const [openProfile, setOpenProfile] = useState(false);
  const menuRef = useRef(null);

  const [donations, setDonations] = useState([]);
  const [impact, setImpact] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  // ------------------ CLOSE PROFILE DROPDOWN ------------------
  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // ------------------ FETCH DONATIONS ------------------
  useEffect(() => {
    fetch("http://localhost:5000/api/donor/get-donations", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ donorName: user.username }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDonations(data.donations);
          setImpact(data.donations.length * 3);
        }
      });
  }, []);

  // ------------------ SEARCH HIGHLIGHT FUNCTIONS ------------------

  // Remove previous highlights
  const removeHighlights = () => {
    const marks = document.querySelectorAll("mark.search-highlight");
    marks.forEach((mark) => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  };

  // Highlight search text
  const highlightText = (term) => {
    if (!term) return;

    const walker = document.createTreeWalker(
      document.querySelector("main"), // search inside dashboard only
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let firstMatch = null;

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.nodeValue;

      const index = text.toLowerCase().indexOf(term.toLowerCase());
      if (index !== -1) {
        const before = text.slice(0, index);
        const match = text.slice(index, index + term.length);
        const after = text.slice(index + term.length);

        const mark = document.createElement("mark");
        mark.className = "search-highlight bg-yellow-300 text-black px-1 rounded";
        mark.appendChild(document.createTextNode(match));

        const beforeNode = document.createTextNode(before);
        const afterNode = document.createTextNode(after);

        const parent = node.parentNode;
        parent.replaceChild(afterNode, node);
        parent.insertBefore(mark, afterNode);
        parent.insertBefore(beforeNode, mark);

        if (!firstMatch) firstMatch = mark;
      }
    }

    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSearch = () => {
    removeHighlights();
    if (!searchTerm.trim()) {
      alert("Please enter something to search.");
      return;
    }
    highlightText(searchTerm.trim());
  };

  // ------------------ COLORS FOR CHARTS ------------------
  const CAUSE_COLORS = {
    "Education Support": "#4B7BE5",
    "Feeding Program": "#2ECC71",
    "Girls Empowerment": "#E74C3C",
    "Health & Hygiene": "#9B59B6",
    "Community Development": "#F1C40F",
  };

  // Data group for charts
  const monthwiseData = {};
  donations.forEach((d) => {
    const m = new Date(d.date).toLocaleString("default", { month: "short" });
    if (!monthwiseData[m]) monthwiseData[m] = { month: m };
    monthwiseData[m][d.cause] = (monthwiseData[m][d.cause] || 0) + d.amount;
  });
  const groupedMonthData = Object.values(monthwiseData);

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
    <div className="flex min-h-screen bg-[#fff7ef]">

      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-64 bg-[#d55b1f] text-white p-6 flex flex-col rounded-r-3xl">

        <h1 className="text-2xl font-semibold mb-8">Prerna</h1>

        <nav className="space-y-4 text-md">
          <button
            onClick={() => navigate("/donor/dashboard")}
            className="rounded-xl p-3 w-full text-left hover:bg-[#c24f19] transition"
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => navigate("/donor/donate")}
            className="rounded-xl p-3 w-full text-left hover:bg-[#c24f19] transition"
          >
            💝 Donate
          </button>

          <button
            onClick={() => navigate("/donor/history")}
            className="rounded-xl p-3 w-full text-left hover:bg-[#c24f19] transition"
          >
            📜 History
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="mt-8 bg-white text-[#d55b1f] py-2 px-4 rounded-xl shadow"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ---------------- CONTENT ---------------- */}
      <main className="flex-1 p-10">

        {/* ---------------- TOP BAR ---------------- */}
        <div className="flex justify-between items-center mb-10">

          {/* SEARCH BAR */}
          <div className="w-96 relative">
            <input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-2 rounded-xl border shadow-sm"
            />

            <span
              className="absolute right-3 top-2.5 cursor-pointer"
              onClick={handleSearch}
            >
              🔍
            </span>
          </div>

          {/* PROFILE DROPDOWN */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-xl font-bold text-orange-700 shadow"
            >
              {user.username[0]}
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-4 w-72 bg-white rounded-xl shadow-xl border p-4">
                <ProfileCard user={user} />
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ---------------- HERO SECTION ---------------- */}
        <div className="bg-white rounded-3xl p-8 shadow flex items-center gap-8">

          <div className="flex-1">
            <h1 className="text-4xl font-bold text-[#d55b1f] leading-tight">
              Welcome Back, {user.username}!
            </h1>
            <p className="text-gray-600 mt-3 text-lg">
              Your kindness is creating real impact every day ❤️
            </p>

            <button
              onClick={() => navigate("/donor/donate")}
              className="mt-5 px-7 py-3 bg-[#d55b1f] text-white rounded-xl shadow hover:bg-[#b34816] font-semibold"
            >
              ❤️ Donate Again
            </button>
          </div>

          <div className="flex-1 flex justify-center">
            <img src={heroImage} className="w-80 rounded-xl shadow-xl" />
          </div>
        </div>

        {/* ---------------- STATS ---------------- */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">

          <div className="p-6 bg-white rounded-xl shadow border text-center">
            <p className="text-gray-500 text-lg">Total Donated</p>
            <p className="text-4xl font-bold text-[#d55b1f] mt-2">
              ₹{donations.reduce((s, d) => s + d.amount, 0)}
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow border text-center">
            <p className="text-gray-500 text-lg">Total Donations</p>
            <p className="text-4xl font-bold text-[#d55b1f] mt-2">{donations.length}</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow border text-center">
            <p className="text-gray-500 text-lg">Students Impacted</p>
            <p className="text-4xl font-bold text-[#d55b1f] mt-2">{impact}</p>
          </div>
        </div>

        {/* ---------------- CHARTS ---------------- */}
        <div className="grid md:grid-cols-2 gap-10 mt-12">

          {/* PIE CHART */}
          <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="text-xl font-bold text-[#d55b1f] mb-4 text-center">
              Donation Distribution by Cause
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={120} label>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* BAR CHART */}
          <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="text-xl font-bold text-[#d55b1f] mb-4 text-center">
              Monthwise Donation Comparison
            </h3>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={groupedMonthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                {Object.keys(CAUSE_COLORS).map((cause, idx) => (
                  <Bar key={idx} dataKey={cause} fill={CAUSE_COLORS[cause]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>
    </div>
  );
}
