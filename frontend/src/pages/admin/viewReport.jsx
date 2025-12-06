import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdminWeeklyReport() {
  const [filters, setFilters] = useState({
    level: "",
    subject: "",
    startDate: "",
  });

  const [weekly, setWeekly] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [topper, setTopper] = useState(null);
  const [weakStudents, setWeakStudents] = useState([]);
  const [volunteerId, setVolunteerId] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000";

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchReport = async () => {
    if (!filters.level || !filters.subject || !filters.startDate)
      return setMessage("Please fill all fields!");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${API}/api/admin/weekly-attendance-db?level=${filters.level}&subject=${filters.subject}&startDate=${filters.startDate}`
      );

      const data = await res.json();

      if (!data.success || data.weekly.length === 0) {
        setMessage("No report found");
        setLoading(false);
        return;
      }

      setWeekly(data.weekly);
      setAssignments(data.assignments);
      setTopper(data.topperStudent);
      setWeakStudents(data.weakStudents);
      setVolunteerId(data.volunteerId);
    } catch (error) {
      console.error("Error fetching report:", error);
      setMessage("Server error");
    }

    setLoading(false);
  };

  // Calculate average attendance
  const avgAttendance =
    weekly.length > 0
      ? Math.round(
          (weekly.reduce((a, b) => a + b.present, 0) /
            weekly.reduce((a, b) => a + b.present + b.absent, 0)) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-green-50 p-6">

      {/* PRINT STYLES */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #report-section, #report-section * {
              visibility: visible;
            }
            #report-section {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>

      <div
        id="report-section"
        className="bg-white shadow-xl rounded-2xl p-8 border border-green-200 max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Weekly Attendance Report (Admin View)
        </h2>

        {/* ---------------- FILTERS ---------------- */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-semibold text-green-800">Level</label>
            <input
              type="number"
              name="level"
              placeholder="Enter Level"
              value={filters.level}
              onChange={handleChange}
              className="w-full p-3 border border-green-300 rounded-xl bg-green-50"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-green-800">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Enter Subject"
              value={filters.subject}
              onChange={handleChange}
              className="w-full p-3 border border-green-300 rounded-xl bg-green-50"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-green-800">
              Week Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
              className="w-full p-3 border border-green-300 rounded-xl bg-green-50"
            />
          </div>
        </div>

        <button
          onClick={fetchReport}
          className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 shadow-md"
        >
          {loading ? "Loading..." : "Fetch Report"}
        </button>

        {message && (
          <p className="mt-4 text-red-600 font-semibold">{message}</p>
        )}

        {/* STOP IF NO DATA */}
        {weekly.length === 0 ? null : (
          <>

            {/* ---------------- SUMMARY CARDS ---------------- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="p-5 bg-green-100 rounded-xl shadow">
                <h3 className="text-lg font-semibold text-green-700">
                  Avg Attendance
                </h3>
                <p className="text-4xl font-bold text-green-700 mt-2">
                  {avgAttendance}%
                </p>
              </div>

              <div className="p-5 bg-purple-100 rounded-xl shadow">
                <h3 className="text-lg font-semibold text-purple-700">
                  Assignments
                </h3>
                <p className="text-4xl font-bold text-purple-700 mt-2">
                  {assignments.length}
                </p>
              </div>

              <div className="p-5 bg-blue-100 rounded-xl shadow">
                <h3 className="text-lg font-semibold text-blue-700">
                  Topper
                </h3>
                <p className="text-xl font-bold text-blue-700 mt-2">
                  {topper?.name || "--"}
                </p>
              </div>

              <div className="p-5 bg-red-100 rounded-xl shadow">
                <h3 className="text-lg font-semibold text-red-700">
                  Weak Students
                </h3>
                <p className="text-4xl font-bold text-red-700 mt-2">
                  {weakStudents.length}
                </p>
              </div>
            </div>

            {/* ---------------- CHART ---------------- */}
            <div className="mt-10">
              <h3 className="text-2xl font-bold text-green-700 mb-3">
                📊 Weekly Attendance Chart
              </h3>

              <div className="w-full h-64 bg-white p-4 rounded-xl shadow border">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#4ade80" />
                    <Bar dataKey="absent" fill="#f87171" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ---------------- DAILY ATTENDANCE TABLE ---------------- */}
            <div className="mt-10">
              <h3 className="text-xl font-bold text-green-700 mb-3">
                Daily Attendance Summary
              </h3>

              <table className="w-full border text-sm bg-white shadow rounded-lg overflow-hidden">
                <thead className="bg-green-100 text-green-900">
                  <tr>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Present</th>
                    <th className="border p-2">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {weekly.map((d) => (
                    <tr key={d.date} className="hover:bg-green-50">
                      <td className="border p-2">{d.date}</td>
                      <td className="border p-2 text-green-700 font-bold">{d.present}</td>
                      <td className="border p-2 text-red-600 font-bold">{d.absent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ---------------- ASSIGNMENTS ---------------- */}
            {assignments.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-purple-700 mb-3">
                  Assignments Uploaded
                </h3>

                <ul className="space-y-3">
                  {assignments.map((a, i) => (
                    <li
                      key={i}
                      className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded shadow"
                    >
                      <strong>{a.name}</strong> — {a.date}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ---------------- TOPPER STUDENT ---------------- */}
            {topper && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-green-700 mb-3">
                  🏆 Topper of the Week
                </h3>

                <div className="p-5 rounded-2xl bg-green-100 shadow border border-green-300 max-w-md">
                  <p className="text-lg font-semibold text-green-900">
                    {topper.name}
                  </p>
                  <p className="text-sm text-green-800 mt-1">
                    ID: {topper.studentId}
                  </p>
                  <p className="text-sm text-green-800 mt-1">
                    Score: {topper.score}%
                  </p>
                </div>
              </div>
            )}

            {/* ---------------- WEAK STUDENTS ---------------- */}
            {weakStudents.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-red-700 mb-3">
                  ⚠️ Weak Students
                </h3>

                <ul className="space-y-2">
                  {weakStudents.map((s, i) => (
                    <li
                      key={i}
                      className="p-3 bg-red-50 border border-red-200 rounded-xl shadow text-red-800 font-semibold"
                    >
                      {s.name} — {s.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ---------------- FOOTER ---------------- */}
            <div className="mt-12 p-4 bg-green-100 rounded-xl shadow border border-green-300">
              <p className="text-green-700 font-semibold">
                Report Submitted By Volunteer:{" "}
                <span className="font-bold">{volunteerId}</span>
              </p>
            </div>

            {/* ---------------- EXPORT PDF BUTTON ---------------- */}
            <div className="flex justify-end mt-10">
              <button
                onClick={() => window.print()}
                className="px-6 py-2 rounded-lg bg-green-500 text-white font-medium shadow hover:bg-green-600"
              >
                ⬇️ Export as PDF
              </button>
            </div>

          </>
        )}
      </div>
    </div>
  );
}
