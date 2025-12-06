// src/pages/volunteer/dashboard.jsx
import React, { useState } from "react";
import { useLocation } from "wouter";
import ProfileCard from "../../components/profileCard.jsx";

export default function VolunteerDashboard() {
  const [, setLocation] = useLocation();
  const [openProfile, setOpenProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {
    id: "vol123",
    username: "Volunteer",
    role: "volunteer",
    centreId: "CEN-001",
    level: 1,
    subjects: ["Math", "Science"],
  };

  // replace with actual backend values later
  const stats = {
    volunteersConnected: 24,
    studentsReached: 138,
    studentsConnectedToVolunteer: 18,
  };

  const features = [
    { id: "attendance", title: "Mark Attendance", emoji: "📝", color: "bg-blue-200", path: "/volunteer/attendance" },
    { id: "report", title: "Weekly Report", emoji: "📊", color: "bg-pink-200", path: "/volunteer/report" },
    { id: "assignment", title: "Assignments", emoji: "📚", color: "bg-yellow-200", path: "/volunteer/assignment" },
    { id: "material", title: "Upload Material", emoji: "📁", color: "bg-purple-200", path: "/volunteer/material" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Volunteer Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {user.username}</p>
        </div>

        <button
          onClick={() => setOpenProfile(!openProfile)}
          className="w-12 h-12 rounded-full bg-white border shadow-md flex items-center justify-center hover:scale-110 transition"
        >
          <span className="text-blue-700 font-bold text-lg uppercase">
            {user.username?.[0] ?? "U"}
          </span>
        </button>
      </div>

      {/* QUICK ACTIONS */}
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item) => (
          <div
            key={item.id}
            onClick={() => setLocation(item.path)}
            className={`p-6 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition transform ${item.color}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-700 mt-1">Open {item.title.toLowerCase()}</p>
              </div>
              <div className="text-4xl">{item.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {[
          { label: "Students Connected to You", value: stats.studentsConnectedToVolunteer, color: "text-blue-600" },
          { label: "Total Students Reached", value: stats.studentsReached, color: "text-indigo-600" },
          { label: "Volunteers Connected", value: stats.volunteersConnected, color: "text-purple-600" },
        ].map((stat, i) => (
          <div key={i} className="p-5 bg-white shadow-md rounded-xl border hover:shadow-lg transition">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* NOTIFICATIONS + WEEKLY PLAN SIDE BY SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

        {/* Notifications */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border">
          <h3 className="text-xl font-bold text-purple-700 mb-4">Notifications</h3>

          <ul className="space-y-3">
            <li className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              New assignment submission received.
            </li>
            <li className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              Your weekly report is pending.
            </li>
            <li className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
              Attendance is 90% complete this week!
            </li>
          </ul>
        </div>

        {/* Weekly Teaching Plan */}
        <div className="bg-white p-6 rounded-3xl shadow-xl">
          <h3 className="text-xl font-bold text-purple-700 mb-4">Weekly Teaching Plan</h3>

          <div className="space-y-4">

            <div className="p-4 rounded-xl bg-purple-100 shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">Monday</p>
                <p className="text-sm text-gray-600">Math Class · 10:00 AM</p>
              </div>
              <span className="text-xl">📘</span>
            </div>

            <div className="p-4 rounded-xl bg-yellow-100 shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">Wednesday</p>
                <p className="text-sm text-gray-600">Science Workshop · 01:00 PM</p>
              </div>
              <span className="text-xl">🔬</span>
            </div>

            <div className="p-4 rounded-xl bg-pink-100 shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">Friday</p>
                <p className="text-sm text-gray-600">Community Session · 11:00 AM</p>
              </div>
              <span className="text-xl">🤝</span>
            </div>

          </div>
        </div>

      </div>


      {/* TARGET AUDIENCE + RECENT ASSIGNMENTS SIDE BY SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

        {/* TARGET OVERVIEW */}
        <div className="bg-white p-6 rounded-3xl shadow-xl">
          <h3 className="text-xl font-bold text-blue-700 mb-4">Target Audience Overview</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div className="p-5 rounded-2xl bg-blue-100 shadow flex flex-col">
              <span className="text-sm text-gray-700">Students Connected to You</span>
              <span className="text-3xl font-bold text-blue-700">
                {stats.studentsConnectedToVolunteer}
              </span>
              <span className="text-xs text-gray-600 mt-1">Assigned to your sessions</span>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-100 shadow flex flex-col">
              <span className="text-sm text-gray-700">Total Students Reached</span>
              <span className="text-3xl font-bold text-indigo-700">
                {stats.studentsReached}
              </span>
              <span className="text-xs text-gray-600 mt-1">Across entire center</span>
            </div>

            <div className="p-5 rounded-2xl bg-purple-100 shadow flex flex-col col-span-full">
              <span className="text-sm text-gray-700">Volunteers Connected</span>
              <span className="text-3xl font-bold text-purple-700">
                {stats.volunteersConnected}
              </span>
              <span className="text-xs text-gray-600 mt-1">Active volunteers</span>
            </div>

          </div>
        </div>

        {/* RECENT ASSIGNMENTS */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border">
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Recent Assignments</h3>

          {["Fractions Quiz - Level 2", "Reading Test - Level 3", "Nouns Worksheet - Level 1"].map(
            (a, i) => (
              <div key={i} className="p-4 bg-indigo-50 mb-3 rounded-xl">
                {a}
              </div>
            )
          )}
        </div>

      </div>

      {/* PROFILE PANEL */}
      {openProfile && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-6 z-50">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-700">My Profile</h2>
            <button onClick={() => setOpenProfile(false)} className="text-gray-500 hover:text-gray-700 text-xl">
              ✕
            </button>
          </div>

          <ProfileCard user={user} />

          <button
            onClick={() => {
              localStorage.clear();
              setLocation("/login");
            }}
            className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
