import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";
import heroImg from "../../assets/volunteer-hero.jpg";
import ProfileCard from "../../components/profileCard.jsx";
import BackButton from "../../components/backButton.jsx";

export default function VolunteerDashboard() {
  const [, navigate] = useLocation();
  const [openProfile, setOpenProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);



  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "Volunteer",
    centreId: "Scottish 57 Gurgaon",
  };

  // ---------------- SEARCH STATE ----------------
  const [searchTerm, setSearchTerm] = useState("");

  // Remove previous highlights
  const removeHighlights = () => {
    const marks = document.querySelectorAll("mark.search-highlight");
    marks.forEach((m) => {
      const parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    });
  };

  // Highlight occurrences
  const highlightText = (term) => {
    if (!term.trim()) return;

    const walker = document.createTreeWalker(
      document.querySelector("main"),
      NodeFilter.SHOW_TEXT
    );

    let first = null;

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

        if (!first) first = mark;
      }
    }

    if (first) {
      first.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSearch = () => {
    removeHighlights();
    if (!searchTerm.trim()) {
      alert("Enter text to search.");
      return;
    }
    highlightText(searchTerm);
  };

  // ---------------- DASHBOARD DATA ----------------
  const classData = [
    { name: "Class 1", value: 12 },
    { name: "Class 2", value: 18 },
    { name: "Class 3", value: 9 },
  ];
  const COLORS = ["#4F46E5", "#7C3AED", "#EC4899"];

  const attendancePercent = 82;
  const attendanceChart = [
    { name: "Attendance", value: attendancePercent, fill: "#4F46E5" },
  ];

  async function loadWeeklySchedule() {
  try {
    const res = await fetch(
      "https://samadhan-new-2.onrender.com/api/volunteer/schedule"
    );
    const data = await res.json();

    if (data.success) {
      setWeeklySchedule(data.schedules);
    }
  } catch (err) {
    console.error("Volunteer weekly schedule error:", err);
  }
}
  


  

  

  

  useEffect(() => {
  async function loadNotifications() {
    try {
      const res = await fetch(
        `https://samadhan-new-2.onrender.com/api/volunteer/notifications/${user.id}`
      );
      const data = await res.json();
      if (data.success) setNotifications(data.notifications);
    } catch (err) {
      console.error("Volunteer notifications error:", err);
    }
  }

  async function loadRecentActivity() {
  try {
    const res = await fetch(
      `https://samadhan-new-2.onrender.com/api/volunteer/recent-activity/${user.id}`
    );
    const data = await res.json();
    if (data.success) setRecentActivity(data.activities);
  } catch (err) {
    console.error("Recent activity error:", err);
  }
}

  loadRecentActivity();
  loadNotifications();
  loadWeeklySchedule();
});




  return (
    <div className="flex min-h-screen bg-[#eef2fb]">

      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-64 bg-[#1e3161] p-6 text-white flex flex-col rounded-r-3xl">
          

          <BackButton/>
        <h1 className="text-2xl font-semibold mb-10">Prerna</h1>

        <nav className="space-y-5 text-md">
          <button className="flex items-center gap-3 hover:bg-[#2b417a] rounded-xl p-3">
            📊 Dashboard
          </button>

          <button
            onClick={() => navigate("/volunteer/attendance")}
            className="flex items-center gap-3 hover:bg-[#2b417a] rounded-xl p-3"
          >
            📝 Mark Attendance
          </button>

          <button
            onClick={() => navigate("/volunteer/assignment")}
            className="flex items-center gap-3 hover:bg-[#2b417a] rounded-xl p-3"
          >
            📚 Assignments
          </button>

          <button
            onClick={() => navigate("/volunteer/material")}
            className="flex items-center gap-3 hover:bg-[#2b417a] rounded-xl p-3"
          >
            📁 Study Materials
          </button>

          <button
            onClick={() => navigate("/volunteer/report")}
            className="flex items-center gap-3 hover:bg-[#2b417a] rounded-xl p-3"
          >
            🧾 Weekly Report
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="flex items-center gap-3 mt-10 bg-white text-[#1e3161] py-2 px-4 rounded-xl shadow"
          >
            🚪 Log Out
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

          {/* Profile hover menu */}
          <div className="relative group">
            <button className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-300 flex items-center justify-center text-xl font-bold text-purple-800 shadow">
                {user.username[0]}
              </div>
            </button>

            <div className="absolute right-0 top-14 opacity-0 group-hover:opacity-100 transition bg-white shadow-xl rounded-xl p-4 w-48 z-50">
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-gray-500 mb-3">Centre id: {user.centreId}</p>
              <button
                onClick={() => setOpenProfile(true)}
                className="w-full py-2 bg-purple-600 text-white rounded-lg"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* HELLO BANNER */}
        <div className="bg-white rounded-3xl p-8 shadow flex items-center gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold">Welcome Back, {user.username}!</h2>

            <p className="text-gray-600 mt-1">
              See your insights for <b>Scottish centre, Gurugram</b>
            </p>
          </div>

          <img src={heroImg} alt="Hero" className="w-40" />
        </div>

        {/* ---------------- ANALYTICS ---------------- */}
        <div className="mt-10 grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* PIE CHART */}
          <div className="bg-white rounded-3xl p-6 shadow">
            <h3 className="font-bold mb-4">Students Connected to You</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={classData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
                  {classData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* CIRCULAR ATTENDANCE */}
          <div className="bg-white rounded-3xl p-6 shadow flex flex-col items-center">
            <h3 className="font-bold mb-4">Avg Attendance %</h3>

            <div className="relative w-full h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={attendanceChart} startAngle={90} endAngle={-270}>
                  <RadialBar minAngle={15} dataKey="value" cornerRadius={50} />
                </RadialBarChart>
              </ResponsiveContainer>

              <div className="absolute text-4xl font-bold text-purple-700">
                {attendancePercent}%
              </div>
            </div>
          </div>

          {/* WEEKLY SCHEDULE */}
          {/* WEEKLY SCHEDULE */}
<div className="bg-white rounded-3xl p-6 shadow">
  <h3 className="font-bold mb-4">Upcoming Weekly Schedule</h3>

  {weeklySchedule.length === 0 ? (
    <p className="text-gray-500 text-sm">
      No schedule published yet.
    </p>
  ) : (
    <ul className="space-y-3">
      {weeklySchedule.map((e) => (
        <li
          key={e._id}
          className="p-4 rounded-xl bg-gray-50 hover:bg-purple-50 transition shadow-sm"
        >
          <p className="font-medium">{e.subject}</p>
          <p className="text-sm text-gray-500">
            {new Date(e.date).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}{" "}
            • {e.time}
          </p>
          <p className="text-xs text-gray-400">
            Class {e.level}
          </p>
        </li>
      ))}
    </ul>
  )}
</div>


        {/* ---------------- NOTIFICATIONS + RECENT ---------------- */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notifications */}
          <div className="bg-white rounded-3xl p-6 shadow lg:col-span-2">
            <h3 className="font-bold mb-4">Notifications</h3>
            <ul className="space-y-3">
  {notifications.length === 0 ? (
    <li className="text-gray-500 text-sm">No new notifications</li>
  ) : (
    notifications.map((n, i) => (
      <li
        key={i}
        className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded"
      >
        {n}
      </li>
    ))
  )}
</ul>

          </div>
        </div>

        {/* Recent Activity */}
<div className="bg-white rounded-3xl p-6 shadow">
  <h3 className="font-bold mb-4">Recent Activity</h3>

  {recentActivity.length === 0 ? (
    <p className="text-gray-500 text-sm">
      No recent activity
    </p>
  ) : (
    <ul className="space-y-3">
      {recentActivity.map((a, i) => (
        <li
          key={i}
          className="p-3 bg-indigo-50 rounded-lg text-sm"
        >
          {a.message}
          <span className="block text-xs text-gray-400 mt-1">
            {new Date(a.createdAt).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  )}
</div>

        </div>
      </main>

      {/* PROFILE POPUP */}
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
