import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import heroImg from "../../assets/volunteer-hero.jpg";
import ProfileCard from "../../components/profileCard.jsx";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || {
    id: "admin001",
    username: "Admin User",
    role: "admin",
  };

  const [openProfile, setOpenProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // REMOVE OLD HIGHLIGHTS
  const removeHighlights = () => {
    const marks = document.querySelectorAll("mark.search-highlight");
    marks.forEach((m) => {
      const parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    });
  };

  // HIGHLIGHT NEW TEXT
  const highlightText = (term) => {
    if (!term) return;

    const walker = document.createTreeWalker(
      document.body,
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
        const span = document.createElement("mark");
        span.className = "search-highlight bg-yellow-300 text-black rounded px-1";

        const before = text.slice(0, index);
        const match = text.slice(index, index + term.length);
        const after = text.slice(index + term.length);

        const beforeNode = document.createTextNode(before);
        const matchNode = document.createTextNode(match);
        const afterNode = document.createTextNode(after);

        span.appendChild(matchNode);

        const parent = node.parentNode;
        parent.replaceChild(afterNode, node);
        parent.insertBefore(span, afterNode);
        parent.insertBefore(beforeNode, span);

        if (!firstMatch) firstMatch = span;
      }
    }

    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // SEARCH LOGIC
  const handleSearch = () => {
    removeHighlights();

    if (!searchTerm.trim()) {
      alert("Please enter something to search.");
      return;
    }

    highlightText(searchTerm);
  };

  // ------------------ DASHBOARD CONTENT ------------------

  const stats = {
    activeStudents: 88,
    activeVolunteers: 5,
    monthlyDonations: 5000,
    centre: "Scottish Centre Gurugram",
  };

  const memberGrowthData = [
    { month: "Jun", students: 40, volunteers: 3 },
    { month: "Jul", students: 55, volunteers: 8 },
    { month: "Aug", students: 55, volunteers: 5 },
    { month: "Sep", students: 70, volunteers: 4 },
    { month: "Oct", students: 78, volunteers: 5 },
    { month: "Nov", students: 88, volunteers: 5 },
  ];

  const notifications = [
    "Monthly report due on 20th.",
    "New volunteer joined: Rahul Kumar.",
    "Stationery request from centre.",
  ];

  const recentActivity = [
    "Added 5 students to Class 3",
    "Updated donation record",
    "Exported attendance CSV",
    "Published Weekly Schedule",
  ];

  const classWise = [
    { classNum: 1, students: 18, volunteers: 3, emoji: "👧" },
    { classNum: 2, students: 22, volunteers: 1, emoji: "👦" },
    { classNum: 3, students: 16, volunteers: 1, emoji: "🧒" },
    { classNum: 4, students: 20, volunteers: 0, emoji: "👧" },
    { classNum: 5, students: 12, volunteers: 0, emoji: "👦" },
  ];

  return (
    <div className="flex min-h-screen bg-[#eef2fb]">
      {/* ---------------- LEFT SIDEBAR ---------------- */}
      <aside className="w-64 bg-[#013808] p-6 text-white flex flex-col rounded-r-3xl">
        <h1 className="text-2xl font-semibold mb-8">Prerna</h1>

        <nav className="space-y-4 text-md">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-[#12263d]/60 transition"
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/add-student")}
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-[#12263d]/60 transition"
          >
            ➕ Add Student
          </button>

          <button
            onClick={() => navigate("/admin/add-volunteer")}
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-[#12263d]/60 transition"
          >
            🙋 Add Volunteer
          </button>

          <button
            onClick={() => navigate("/admin/view-report")}
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-[#12263d]/60 transition"
          >
            🧾 Reports
          </button>

          <button
            onClick={() => navigate("/admin/donations")}
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-[#12263d]/60 transition"
          >
            💰 Donations
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="mt-8 bg-white text-[#0f1724] py-2 px-4 rounded-xl shadow"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
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

          {/* PROFILE HOVER */}
          <div className="relative group">
            <button>
              <div className="w-12 h-12 rounded-full bg-green-300 flex items-center justify-center text-xl font-bold text-green-800 shadow">
                {user.username[0]}
              </div>
            </button>

            <div className="absolute right-0 top-14 bg-white shadow-xl rounded-xl p-4 w-48 opacity-0 group-hover:opacity-100 transition">
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-gray-500 mb-3">Centre: {stats.centre}</p>
              <button
                onClick={() => setOpenProfile(true)}
                className="w-full py-2 bg-green-600 text-white rounded-lg"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- HERO ---------------- */}
        <div className="bg-white rounded-3xl p-8 shadow flex items-center gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold">Welcome Back, {user.username}!</h2>
            <p className="text-gray-600 mt-1">
              See your insights for <b>{stats.centre}</b>
            </p>
          </div>
          <img src={heroImg} className="w-40" />
        </div>

        {/* ---------------- STATS CARDS ---------------- */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="p-5 rounded-xl bg-green-100 border border-green-200 shadow hover:scale-[1.02] transition">
            <p className="text-sm text-green-700">Total Children</p>
            <p className="text-3xl font-bold text-green-900">{stats.activeStudents}</p>
          </div>

          <div className="p-5 rounded-xl bg-emerald-100 border border-emerald-200 shadow hover:scale-[1.02] transition">
            <p className="text-sm text-emerald-700">Active Volunteers</p>
            <p className="text-3xl font-bold text-emerald-900">{stats.activeVolunteers}</p>
          </div>

          <div className="p-5 rounded-xl bg-lime-100 border border-lime-200 shadow hover:scale-[1.02] transition">
            <p className="text-sm text-lime-700">Monthly Donation</p>
            <p className="text-3xl font-bold text-lime-900">₹{stats.monthlyDonations}</p>
          </div>
        </div>

        {/* ---------------- LINE GRAPH ---------------- */}
        <div className="mt-10 bg-white rounded-3xl p-6 shadow border border-green-200">
          <h3 className="text-xl font-bold text-green-700 mb-4">📈 Members Growth (Jun → Nov)</h3>

          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={memberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#16a34a" strokeWidth={3} />
                <Line type="monotone" dataKey="volunteers" stroke="#0d9488" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---------------- NOTIFICATIONS + RECENT ---------------- */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="bg-white rounded-3xl p-6 shadow">
            <h3 className="font-bold mb-4">Notifications</h3>
            <ul className="space-y-3">
              {notifications.map((n, i) => (
                <li key={i} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  {n}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow">
            <h3 className="font-bold mb-4">Recent Activity</h3>
            <ul className="space-y-3">
              {recentActivity.map((a, i) => (
                <li key={i} className="p-3 bg-indigo-50 rounded">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------------- CLASS-WISE BLOCKS ---------------- */}
        <div className="mt-10 bg-white rounded-3xl p-6 shadow border border-green-200">
          <h3 className="text-xl font-bold text-green-700 mb-4">🎒 Class-wise Students & Volunteers</h3>

          <div className="space-y-4">
            {classWise.map((cls, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-200 shadow-sm hover:bg-green-100"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{cls.emoji}</div>
                  <p className="text-lg font-semibold text-green-800">Class {cls.classNum}</p>
                </div>

                <div className="flex gap-4">
                  <span className="px-3 py-1 bg-white border rounded-lg shadow text-green-700">
                    👥 {cls.students} Students
                  </span>
                  <span className="px-3 py-1 bg-white border rounded-lg shadow text-green-700">
                    🙋 {cls.volunteers} Volunteers
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ---------------- PROFILE PANEL ---------------- */}
      {openProfile && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl p-6 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">My Profile</h3>
            <button onClick={() => setOpenProfile(false)}>✕</button>
          </div>

          <ProfileCard user={user} />

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="mt-6 w-full bg-red-500 text-white py-2 rounded-xl"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
