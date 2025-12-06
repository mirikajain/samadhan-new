import React, { useState } from "react";
import ProfileCard from "../../components/profileCard.jsx";
import AddStudent from "./addStudent.jsx";
import AddVolunteer from "./addVolunteer.jsx";
import ViewReport from "./viewReport.jsx";
import DonationHistory from "./donationHistory.jsx";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    id: "admin001",
    username: "Admin User",
    role: "admin",
  };

  const [openProfile, setOpenProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // DUMMY DATA (No backend calls yet)
  const stats = {
    activeStudents: 128,
    activeVolunteers: 22,
    yearlyDonations: 84000,
    levels: [1, 2, 3, 4, 5],
    subjects: ["Math", "Science", "English", "EVS", "Hindi"],
  };

  // Graph: new members joining each month
  const memberGrowthData = [
    { month: "Jan", students: 12, volunteers: 2 },
    { month: "Feb", students: 18, volunteers: 3 },
    { month: "Mar", students: 15, volunteers: 1 },
    { month: "Apr", students: 20, volunteers: 4 },
    { month: "May", students: 14, volunteers: 2 },
    { month: "Jun", students: 22, volunteers: 3 },
  ];

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "addStudent", label: "Add Student" },
    { id: "addVolunteer", label: "Add Volunteer" },
    { id: "viewReport", label: "View Reports" },
    { id: "donationHistory", label: "Donation History" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-green-800">Admin Dashboard</h1>

        {/* Profile Button */}
        <button
          onClick={() => setOpenProfile(true)}
          className="w-12 h-12 rounded-full bg-white border shadow-md flex items-center justify-center hover:scale-110 transition"
        >
          <span className="text-green-700 font-bold text-lg uppercase">
            {user.username?.[0] ?? "A"}
          </span>
        </button>
      </div>

      <div className="flex gap-6">
        
        {/* SIDE MENU */}
        <div className="w-60 bg-white shadow-xl border border-green-200 rounded-xl p-5 space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? "bg-green-600 text-white"
                  : "bg-green-50 text-green-800 hover:bg-green-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 bg-white rounded-xl shadow-xl p-6 border border-green-200">

          {/* ========= DASHBOARD ========= */}
          {activeTab === "dashboard" && (
            <>
              {/* TOP STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="p-6 rounded-2xl bg-green-100 border border-green-200 shadow hover:shadow-lg transition">
                  <p className="text-sm text-green-700">Active Students</p>
                  <p className="text-4xl font-bold text-green-800 mt-2">
                    {stats.activeStudents}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-emerald-100 border border-emerald-200 shadow hover:shadow-lg transition">
                  <p className="text-sm text-emerald-700">Active Volunteers</p>
                  <p className="text-4xl font-bold text-emerald-800 mt-2">
                    {stats.activeVolunteers}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-lime-100 border border-lime-200 shadow hover:shadow-lg transition">
                  <p className="text-sm text-lime-700">Yearly Donations</p>
                  <p className="text-4xl font-bold text-lime-800 mt-2">
                    ₹{stats.yearlyDonations}
                  </p>
                </div>
              </div>

              {/* GRAPH: Member Growth */}
              <div className="mt-10">
                <h3 className="text-xl font-bold text-green-700 mb-4">
                  📈 Member Growth (New Students & Volunteers)
                </h3>

                <div className="w-full h-80 bg-green-50 p-4 rounded-xl shadow-md border border-green-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={memberGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="students" stroke="#15803d" strokeWidth={3} />
                      <Line type="monotone" dataKey="volunteers" stroke="#065f46" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* LEVELS & SUBJECTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div className="p-6 bg-green-50 rounded-xl shadow border border-green-200">
                  <h3 className="text-lg font-bold text-green-700 mb-3">📘 Levels Available</h3>
                  <div className="flex gap-3 flex-wrap">
                    {stats.levels.map((lvl) => (
                      <span
                        key={lvl}
                        className="px-4 py-2 rounded-lg bg-white border shadow text-green-800"
                      >
                        Level {lvl}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-green-50 rounded-xl shadow border border-green-200">
                  <h3 className="text-lg font-bold text-green-700 mb-3">📚 Subjects Available</h3>
                  <div className="flex gap-3 flex-wrap">
                    {stats.subjects.map((sub) => (
                      <span
                        key={sub}
                        className="px-4 py-2 rounded-lg bg-white border shadow text-green-800"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* OTHER TABS */}
          {activeTab === "addStudent" && <AddStudent admin={user} />}
          {activeTab === "addVolunteer" && <AddVolunteer admin={user} />}
          {activeTab === "viewReport" && <ViewReport />}
          {activeTab === "donationHistory" && <DonationHistory />}
        </div>
      </div>

      {/* PROFILE SIDE PANEL */}
      {openProfile && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-6 z-50 border-l border-green-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-green-800">My Profile</h3>
            <button
              onClick={() => setOpenProfile(false)}
              className="text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
          </div>

          <ProfileCard user={user} />

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
