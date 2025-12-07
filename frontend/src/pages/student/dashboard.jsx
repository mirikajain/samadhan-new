// src/pages/student/dashboard.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Trophy, AlertCircle } from "lucide-react";
import ProfileCard from "../../components/profileCard.jsx";

export default function StudentDashboard() {
  const [, setLocation] = useLocation();
  const [openProfile, setOpenProfile] = useState(false);

  // Fetch user from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {
    id: "stu001",
    username: "Student User",
    role: "student",
    centreId: "CEN-001",
    level: 2,
    subjects: ["Math", "English"],
  };

  // Attendance State
  const [attendance, setAttendance] = useState({});
  const [overall, setOverall] = useState({ present: 0, total: 0 });

  // Weekly Performance
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [performanceStatus, setPerformanceStatus] = useState("");

  // FETCH ATTENDANCE + WEEKLY REPORT
  useEffect(() => {
    loadAttendance();
    loadWeeklyReport();
  }, []);

  // ===== Fetch Attendance =====
  async function loadAttendance() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/student/attendance/${user.id}`
      );
      const data = await res.json();

      if (data.success) {
        setAttendance(data.attendance);
        calculateOverall(data.attendance);
      }
    } catch (err) {
      console.error("Error loading attendance:", err);
    }
  }

  // ===== Fetch Weekly Report =====
  async function loadWeeklyReport() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/student/weekly-report/${user.id}`
      );
      const data = await res.json();

      if (data.success && data.report) {
        setWeeklyReport(data.report);

        // Check if topper
        if (data.report.topperStudent?.studentId === user.id) {
          setPerformanceStatus("topper");
        }

        // Check if weak
        else if (
          data.report.weakStudents?.some((ws) => ws.studentId === user.id)
        ) {
          setPerformanceStatus("weak");
        }
      }
    } catch (err) {
      console.error("Weekly report fetch error:", err);
    }
  }

  // ===== Overall Attendance Calculator =====
  const calculateOverall = (attendanceData) => {
    let present = 0;
    let total = 0;

    Object.values(attendanceData).forEach((subjectEntries) => {
      subjectEntries.forEach((entry) => {
        total++;
        if (entry.status === "Present") present++;
      });
    });

    setOverall({ present, total });
  };

  return (
    <div className="min-h-screen bg-pink-200 p-6">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-sm text-gray-700 mt-1">
            Welcome back, {user.username}
          </p>
        </div>

        {/* Profile Button */}
        <button
          onClick={() => setOpenProfile(true)}
          className="w-12 h-12 rounded-full bg-white border shadow-md flex items-center justify-center hover:scale-110 transition"
        >
          <span className="text-pink-700 font-bold text-lg uppercase">
            {user.username?.[0] ?? "U"}
          </span>
        </button>
      </div>

      {/* QUICK LINKS */}
      <div className="flex gap-6 mb-10">
        <button
          onClick={() => setLocation(`/student/assignment/${user.level}`)}
          className="px-6 py-2 bg-white shadow rounded-full hover:bg-pink-100 transition font-semibold text-gray-800"
        >
          📘 Assignments
        </button>

        <button
          onClick={() => setLocation(`/student/material/${user.level}`)}
          className="px-6 py-2 bg-white shadow rounded-full hover:bg-pink-100 transition font-semibold text-gray-800"
        >
          📚 Study Material
        </button>

        <button
          onClick={() => setLocation("/student/report-card")}
          className="px-6 py-2 bg-white shadow rounded-full hover:bg-pink-100 transition font-semibold text-gray-800"
        >
          🎓 Report Card
        </button>
      </div>

      

      {/* OVERALL ATTENDANCE */}
      <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-pink-700 mb-2">Overall Attendance</h2>

        <div className="w-full bg-pink-100 rounded-full h-4">
          <div
            className="bg-pink-400 h-4 rounded-full"
            style={{
              width: `${overall.total ? (overall.present / overall.total) * 100 : 0}%`,
            }}
          ></div>
        </div>

        <p className="text-sm text-gray-600 mt-2">
          {overall.present}/{overall.total} days present
        </p>
      </div>

      {/* SUBJECT-WISE ATTENDANCE (NO DATES COLUMN, WITH REVIEW) */}
      <div className="bg-white border rounded-xl p-6 shadow-sm mb-10">
        <h2 className="text-xl font-bold text-pink-700 mb-4">
          Subject-wise Attendance
        </h2>

        {Object.keys(attendance).length === 0 ? (
          <p className="text-gray-600">No attendance records found.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-pink-100 text-pink-700">
              <tr>
                <th className="p-3">Subject</th>
                <th className="p-3">Present</th>
                <th className="p-3">Total</th>
                <th className="p-3">%</th>
                <th className="p-3">Review</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(attendance).map(([subject, entries]) => {
                const present = entries.filter((e) => e.status === "Present").length;
                const total = entries.length;
                const percent = Math.round((present / total) * 100);

                let review = "";
                let reviewClass = "";

                if (percent >= 80) {
                  review = "Good";
                  reviewClass = "bg-green-200 text-green-800";
                } else if (percent >= 60) {
                  review = "Average";
                  reviewClass = "bg-yellow-200 text-yellow-800";
                } else {
                  review = "Poor";
                  reviewClass = "bg-red-200 text-red-800";
                }

                return (
                  <tr key={subject} className="border-b">
                    <td className="p-3">{subject}</td>
                    <td className="p-3">{present}</td>
                    <td className="p-3">{total}</td>
                    <td className="p-3">{percent}%</td>

                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${reviewClass}`}>
                        {review}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* PERFORMANCE REVIEW */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        {/* TOPPER MESSAGE */}
        {performanceStatus === "topper" && (
          <div className="bg-gradient-to-br from-green-100 to-green-300 border border-green-400 rounded-xl p-6 shadow">
            <h2 className="text-xl font-bold text-green-800 flex items-center gap-3">
              🏆 Great Performance!
            </h2>
            <p className="text-green-700 mt-2">
              You are the <strong>Top Performer of the Week!</strong>  
              Keep shining and inspiring others!
            </p>
          </div>
        )}

        {/* WEAK STUDENT MESSAGE */}
        {performanceStatus === "weak" && (
          <div className="bg-yellow-100 border border-red-300 rounded-xl p-6 shadow">
            <h2 className="text-xl font-bold text-red-600 flex items-center gap-3">
              ⚠️ Performance Alert
            </h2>
            <p className="text-red-700 mt-2">
              You are in the <strong>Improvement List</strong> this week.  
              Stay motivated — you can absolutely bounce back! 💪
            </p>
          </div>
        )}

        {/* DEFAULT CARD */}
        {!performanceStatus && (
          <div className="bg-pink-100 border border-pink-300 rounded-xl p-6 shadow">
            <h2 className="text-xl font-bold text-pink-700 flex items-center gap-3">
              🌟 Keep Going!
            </h2>
            <p className="text-pink-700 mt-2">
              Maintain consistency and keep working hard!
            </p>
          </div>
        )}
      </div>

      {/* PROFILE SLIDE PANEL */}
      {openProfile && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-6 z-50">

          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-pink-700">My Profile</h2>

            <button
              onClick={() => setOpenProfile(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
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
