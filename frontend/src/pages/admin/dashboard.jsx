import React, { useState } from "react";
import ProfileCard from "../../components/profileCard.jsx"; 
import AddStudent from "./addStudent.jsx";
import AddVolunteer from "./addVolunteer.jsx";
import ViewReport from "./viewReport.jsx";
import DonationHistory from "./donationHistory.jsx";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    id: "admin001",
    username: "Admin User",
    role: "admin",
  };

  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "My Profile" },
    { id: "addStudent", label: "Add Student" },
    { id: "addVolunteer", label: "Add Volunteer" },
    { id: "viewReport", label: "View Reports" },
    { id: "donationHistory", label: "Donation History" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">
          Admin Dashboard
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

      {/* Tabs */}
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

      {/* Content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {activeTab === "profile" && <ProfileCard user={user} />}
        {activeTab === "addStudent" && <AddStudent admin={user} />}
        {activeTab === "addVolunteer" && <AddVolunteer admin={user} />}
        {activeTab === "viewReport" && <ViewReport />}
        {activeTab === "donationHistory" && <DonationHistory />}
      </div>
    </div>
  );
}
