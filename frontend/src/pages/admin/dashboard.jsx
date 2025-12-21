import React, { useState, useEffect } from "react";
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
import BackButton from "../../components/backButton.jsx";

export default function AdminDashboard() {
  const [, navigate] = useLocation();

  const user = JSON.parse(localStorage.getItem("user")) || {
    id: "admin001",
    username: "Admin User",
    role: "admin",
  };

  const [openProfile, setOpenProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ------------------ SEARCH ------------------ */
  const removeHighlights = () => {
    document.querySelectorAll("mark.search-highlight").forEach((m) => {
      const p = m.parentNode;
      p.replaceChild(document.createTextNode(m.textContent), m);
      p.normalize();
    });
  };

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
      const idx = text.toLowerCase().indexOf(term.toLowerCase());

      if (idx !== -1) {
        const mark = document.createElement("mark");
        mark.className = "search-highlight bg-yellow-300 px-1 rounded";

        const before = document.createTextNode(text.slice(0, idx));
        const match = document.createTextNode(text.slice(idx, idx + term.length));
        const after = document.createTextNode(text.slice(idx + term.length));

        mark.appendChild(match);

        const parent = node.parentNode;
        parent.replaceChild(after, node);
        parent.insertBefore(mark, after);
        parent.insertBefore(before, mark);

        if (!firstMatch) firstMatch = mark;
      }
    }

    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSearch = () => {
    removeHighlights();
    if (!searchTerm.trim()) return alert("Enter something to search");
    highlightText(searchTerm);
  };

  /* ------------------ DATA ------------------ */
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

  /* ------------------ FETCH ------------------ */
  useEffect(() => {
    fetch("https://samadhan-new-2.onrender.com/api/admin/notifications")
      .then((r) => r.json())
      .then((d) => d.success && setNotifications(d.notifications))
      .catch(console.error);

    fetch("https://samadhan-new-2.onrender.com/api/admin/recent-activity")
      .then((r) => r.json())
      .then((d) => d.success && setRecentActivity(d.activities))
      .catch(console.error);
  }, []);

  /* ------------------ UI ------------------ */
  return (
    <div className="flex min-h-screen bg-[#eef2fb]">
      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50 h-screen w-64
          bg-[#013808] p-6 text-white flex flex-col rounded-r-3xl
          transform transition-transform duration-300
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <button
          className="md:hidden text-xl mb-4 self-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          ✕
        </button>

        <BackButton />

        <h1 className="text-2xl font-semibold mb-8">Prerna</h1>

        <nav className="space-y-4">
          <button onClick={() => navigate("/admin/dashboard")}>📊 Dashboard</button>
          <button onClick={() => navigate("/admin/add-student")}>➕ Add Student</button>
          <button onClick={() => navigate("/admin/add-volunteer")}>🙋 Add Volunteer</button>
          <button onClick={() => navigate("/admin/view-report")}>🧾 Reports</button>
          <button onClick={() => navigate("/admin/schedule")}>📅 Weekly Schedule</button>
          <button onClick={() => navigate("/admin/donations")}>💰 Donations</button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="mt-8 bg-white text-black py-2 px-4 rounded-xl"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-10 md:ml-64">
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8">
          <button
            className="md:hidden text-2xl"
            onClick={() => setMobileMenuOpen(true)}
          >
            ☰
          </button>

          <div className="w-80 relative">
            <input
              className="w-full px-4 py-2 rounded-xl border"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div className="relative group">
            <div className="w-12 h-12 rounded-full bg-green-300 flex items-center justify-center font-bold">
              {user.username[0]}
            </div>

            <div className="absolute right-0 top-14 bg-white shadow-xl rounded-xl p-4 w-48 opacity-0 group-hover:opacity-100">
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-gray-500 mb-2">{stats.centre}</p>
              <button
                onClick={() => setOpenProfile(true)}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* HERO */}
        <div className="bg-white rounded-3xl p-8 shadow flex items-center gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold">Welcome Back, {user.username}!</h2>
            <p className="text-gray-600">See insights for {stats.centre}</p>
          </div>
          <img src={heroImg} className="w-40" />
        </div>

        {/* STATS */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Stat title="Total Children" value={stats.activeStudents} />
          <Stat title="Active Volunteers" value={stats.activeVolunteers} />
          <Stat title="Monthly Donation" value={`₹${stats.monthlyDonations}`} />
        </div>

        {/* GRAPH */}
        <div className="mt-10 bg-white p-6 rounded-3xl shadow">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={memberGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="students" stroke="#16a34a" strokeWidth={3} />
              <Line dataKey="volunteers" stroke="#0d9488" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>

      {/* PROFILE PANEL */}
      {openProfile && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl p-6 z-50">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold">My Profile</h3>
            <button onClick={() => setOpenProfile(false)}>✕</button>
          </div>
          <ProfileCard user={user} />
        </div>
      )}
    </div>
  );
}

/* ------------------ STAT CARD ------------------ */
function Stat({ title, value }) {
  return (
    <div className="p-5 bg-green-100 rounded-xl shadow">
      <p className="text-sm text-green-700">{title}</p>
      <p className="text-3xl font-bold text-green-900">{value}</p>
    </div>
  );
}
