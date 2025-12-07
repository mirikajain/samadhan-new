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

export default function ViewReport() {
  const [filters, setFilters] = useState({
    level: "",
    subject: "",
    startDate: "",
  });

  const [weekly, setWeekly] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [topper, setTopper] = useState(null);
  const [weakStudents, setWeakStudents] = useState([]);
  const [, setVolunteerId] = useState("");

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
      const url = `${API}/api/admin/weekly-attendance-db?level=${filters.level}&subject=${filters.subject}&startDate=${filters.startDate}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.success || data.weekly.length === 0) {
        setMessage("No report found for selected filters");
        setLoading(false);
        return;
      }

      setWeekly(data.weekly);
      setAssignments(data.assignments);
      setTopper(data.topperStudent);
      setWeakStudents(data.weakStudents);
      setVolunteerId(data.volunteerId);
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }

    setLoading(false);
  };

  const avgAttendance =
    weekly.length > 0
      ? Math.round(
          (weekly.reduce((sum, d) => sum + d.present, 0) /
            weekly.reduce((sum, d) => sum + d.present + d.absent, 0)) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div
        id="report-section"
        className="bg-white shadow-xl rounded-2xl p-8 border border-green-200 max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Weekly Attendance Report
        </h2>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            type="number"
            name="level"
            placeholder="Level"
            value={filters.level}
            onChange={handleChange}
            className="p-3 border rounded-xl bg-green-50"
          />

          <input
            name="subject"
            placeholder="Subject"
            value={filters.subject}
            onChange={handleChange}
            className="p-3 border rounded-xl bg-green-50"
          />

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="p-3 border rounded-xl bg-green-50"
          />
        </div>

        <button
          onClick={fetchReport}
          className="bg-green-600 text-white px-6 py-2 rounded-xl"
        >
          {loading ? "Loading..." : "Fetch Report"}
        </button>

        {message && <p className="mt-4 text-red-600">{message}</p>}

        {/* Stop if nothing */}
        {weekly.length === 0 ? null : (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6 mt-8">
              <div className="p-5 bg-green-100 rounded-xl shadow">
                <h3>Avg Attendance</h3>
                <p className="text-4xl">{avgAttendance}%</p>
              </div>

              <div className="p-5 bg-purple-100 rounded-xl shadow">
                <h3>Assignments</h3>
                <p className="text-4xl">{assignments.length}</p>
              </div>

              <div className="p-5 bg-blue-100 rounded-xl shadow">
                <h3>Topper</h3>
                <p className="text-xl">{topper?.name || "--"}</p>
              </div>

              <div className="p-5 bg-red-100 rounded-xl shadow">
                <h3>Weak Students</h3>
                <p className="text-4xl">{weakStudents.length}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="mt-10">
              <h3 className="text-xl font-bold">Weekly Attendance Chart</h3>

              <div className="h-64 bg-white p-4 rounded-xl shadow">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#22c55e" />
                    <Bar dataKey="absent" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Table */}
            <table className="w-full bg-white mt-10 border rounded-lg">
              <thead className="bg-green-100">
                <tr>
                  <th>Date</th>
                  <th>Present</th>
                  <th>Absent</th>
                </tr>
              </thead>

              <tbody>
                {weekly.map((d) => (
                  <tr key={d.date}>
                    <td>{d.date}</td>
                    <td>{d.present}</td>
                    <td>{d.absent}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Assignments */}
            {assignments.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-bold">Assignments</h3>

                <ul>
                  {assignments.map((a, i) => (
                    <li key={i}>
                      <strong>{a.name}</strong> — {a.date}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Topper */}
            {topper && (
              <div className="mt-10 bg-green-100 p-4 rounded-xl">
                <h3 className="font-bold">Topper Student</h3>
                <p>{topper.name} — Score: {topper.score}%</p>
              </div>
            )}

            {/* Weak Students */}
            {weakStudents.length > 0 && (
              <div className="mt-10">
                <h3 className="font-bold text-red-700">Weak Students</h3>

                {weakStudents.map((s, i) => (
                  <p key={i}>{s.name} — {s.reason}</p>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
