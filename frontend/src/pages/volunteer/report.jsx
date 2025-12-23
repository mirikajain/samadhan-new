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
import BackButton from "../../components/backButton";

export default function WeeklyReport({ user }) {
  // fallback user
  user = {
    id: user?.id || "vol123",
    username: user?.username || "John Doe",
    role: user?.role || "volunteer",
    level: user?.level || 1,
    subjects:
      user?.subjects?.length > 0 ? user.subjects : ["Math", "Science", "English"],
  };

  const API = "https://samadhan-new-2.onrender.com/api";

  // form states
  const [level, setLevel] = useState(user.level);
  const [subject, setSubject] = useState("");
  const [startDate, setStartDate] = useState("");

  // results from backend
  const [weeklyData, setWeeklyData] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [topperStudent, setTopperStudent] = useState(null);
  const [weakStudents, setWeakStudents] = useState([]);

  const [loading, setLoading] = useState(false);

  // Generate week dates
  const getWeekDates = (start) => {
    const base = new Date(start);
    const list = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      list.push(d.toISOString().split("T")[0]);
    }
    return list;
  };

  // FETCH WEEKLY REPORT
  const fetchWeekly = async () => {
    if (!level || !subject || !startDate)
      return alert("Please fill all fields!");

    setLoading(true);
    const dates = getWeekDates(startDate);

    try {
      const aRes = await fetch(`${API}/volunteer/weekly-attendance?volunteerId=${user.id}&level=${level}&subject=${subject}&weekStart=${startDate}&weekEnd=${getWeekDates(startDate)[6]}`
      );
      const attendanceData = await aRes.json();

      const asRes = await fetch(
        `${API}/volunteer/weekly-assignments?volunteerId=${user.id}&level=${level}&subject=${subject}&weekStart=${startDate}&weekEnd=${getWeekDates(startDate)[6]}`
      );
      const assignmentData = await asRes.json();

      setWeeklyData(attendanceData.weekly || []);
      setAssignments(assignmentData.assignments || []);

      // New fields returned from backend
      setTopperStudent(attendanceData.topper || null);
      setWeakStudents(attendanceData.weakStudents || []);

    } catch (err) {
      console.error(err);
      alert("Backend error!");
    }

    setLoading(false);
  };

  // SUBMIT WEEKLY REPORT TO DB
  const handleSubmitReport = async () => {
    if (weeklyData.length === 0)
      return alert("Generate report first!");

    const payload = {
      volunteerId: user.id,
      level,
      subject,
      weekStart: startDate,
      weekEnd: getWeekDates(startDate)[6],

      reportData: weeklyData.map((d) => ({
        date: d.date,
        presentCount: d.present ?? 0,
        absentCount: d.absent ?? 0,
      })),

      assignments,
      topperStudent,
      weakStudents,
    };

    try {
      const res = await fetch(`${API}/volunteer/weekly-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);

      // Reset UI
      setWeeklyData([]);
      setAssignments([]);
      setWeakStudents([]);
      setTopperStudent(null);
      setSubject("");
      setStartDate("");

    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Submission failed");
    }
  };

  // Calculate attendance %
  const averageAttendance =
    weeklyData.length > 0
      ? Math.round(
          (weeklyData.reduce((a, b) => a + b.present, 0) /
            weeklyData.reduce((a, b) => a + (b.present + b.absent), 0)) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-blue-200 max-w-6xl mx-auto">
          <BackButton/>
        <h2 className="text-3xl font-bold text-blue-700 mb-4">
          Weekly Report Dashboard
        </h2>

        {/* ---------------- FILTERS ---------------- */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          
          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Class
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full border bg-blue-50 border-blue-200 rounded-lg px-3 py-2"
            >
              <option value="">Select Class</option>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <option value={lvl} key={lvl}>
                  Class {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border bg-blue-50 border-blue-200 rounded-lg px-3 py-2"
            >
              <option value="">Select Subject</option>
              {user.subjects.map((sub, i) => (
                <option key={i} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Week Start */}
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Week Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border bg-blue-50 border-blue-200 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end">
          <button
            onClick={fetchWeekly}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow"
          >
            {loading ? "Loading..." : "Generate Weekly Report"}
          </button>
        </div>

        {/* ---------------- SUMMARY CARDS ---------------- */}
        {weeklyData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">

            <div className="p-5 bg-green-100 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-green-700">
                Avg Attendance %
              </h3>
              <p className="text-4xl font-bold text-green-700 mt-2">
                {averageAttendance}%
              </p>
            </div>

            <div className="p-5 bg-purple-100 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-purple-700">
                Assignments Uploaded
              </h3>
              <p className="text-4xl font-bold text-purple-700 mt-2">
                {assignments.length}
              </p>
            </div>

            <div className="p-5 bg-blue-100 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-blue-700">
                Topper Score
              </h3>
              <p className="text-4xl font-bold text-blue-700 mt-2">
                {topperStudent?.score ?? "--"}%
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
        )}

        {/* ---------------- CHART ---------------- */}
        {weeklyData.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold text-blue-700 mb-3">
              📊 Weekly Attendance Overview
            </h3>

            <div className="w-full h-64 bg-white p-4 rounded-xl shadow border">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
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
        )}

        {/* ---------------- TABLE ---------------- */}
        {weeklyData.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-2">Daily Attendance Summary</h3>

            <table className="w-full border text-sm bg-white shadow rounded-lg overflow-hidden">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Present</th>
                  <th className="border p-2">Absent</th>
                </tr>
              </thead>
              <tbody>
                {weeklyData.map((d) => (
                  <tr key={d.date} className="hover:bg-blue-50">
                    <td className="border p-2">{d.date}</td>
                    <td className="border p-2 text-green-700 font-bold">{d.present}</td>
                    <td className="border p-2 text-red-600 font-bold">{d.absent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
        {topperStudent && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-green-700 mb-3">
              🏆 Student of the Week
            </h3>

            <div className="p-5 rounded-2xl bg-green-100 shadow border border-green-300 max-w-md">
              <p className="text-lg font-semibold text-green-900">
                {topperStudent.name}
              </p>
              
              <p className="text-sm text-green-800 mt-1">
                Score: <strong>{topperStudent.score}%</strong>
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
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ---------------- EXPORT + SHARE ---------------- */}
        {weeklyData.length > 0 && (
          <div className="flex justify-end gap-4 mt-10">

            <button
              onClick={() => window.print()}
              className="px-6 py-2 rounded-lg bg-blue-200 text-blue-800 font-medium shadow hover:bg-blue-300"
            >
              ⬇️ Export as PDF
            </button>

            <button
              onClick={handleSubmitReport}
              className="px-6 py-2 rounded-lg bg-green-500 text-white font-medium shadow hover:bg-green-600"
            >
              📤 Share to Admin
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
