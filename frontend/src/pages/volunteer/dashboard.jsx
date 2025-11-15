import React, { useState } from "react";
import ProfileCard from "../../components/profileCard.jsx";
import Attendance from "./attendance.jsx";
import Assignment from "./assignment.jsx";
import Material from "./material.jsx";
import Report from "./report.jsx";

export default function VolunteerDashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    id: "vol123",
    username: "John Doe",
    role: "volunteer",
    centreId: "CEN-001",
    level: 1,
    subjects: ["Math", "Science"],
  };

  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "My Profile" },
    { id: "attendance", label: "Mark Attendance" },
    { id: "assignment", label: "Upload Assignments" },
    { id: "material", label: "Upload Material" },
    { id: "report", label: "Weekly Report" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">
          Volunteer Dashboard
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border hover:bg-blue-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {activeTab === "profile" && <ProfileCard user={user} />}
        {activeTab === "attendance" && <Attendance user={user} />}
        {activeTab === "assignment" && <Assignment />}
        {activeTab === "material" && <Material />}
        {activeTab === "report" && <Report />}
      </div>
    </div>
  );
}
