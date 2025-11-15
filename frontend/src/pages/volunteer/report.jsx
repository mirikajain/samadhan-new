import React, { useState } from "react";

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

  const API = "http://localhost:5000";

  // form states
  const [level, setLevel] = useState(user.level);
  const [subject, setSubject] = useState("");
  const [startDate, setStartDate] = useState("");

  // results
  const [weeklyData, setWeeklyData] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(false);

  // generate week array
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
      // attendance
      const aRes = await fetch(
        `${API}/api/volunteer/weekly-attendance?level=${level}&subject=${subject}&dates=${JSON.stringify(
          dates
        )}`
      );
      const attendanceData = await aRes.json();

      // assignments
      const asRes = await fetch(
        `${API}/api/volunteer/weekly-assignments?level=${level}&subject=${subject}&dates=${JSON.stringify(
          dates
        )}`
      );
      const assignmentData = await asRes.json();

      setWeeklyData(attendanceData.weekly);
      setAssignments(assignmentData.assignments);

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
      reportData: weeklyData,
      assignments,
    };

    console.log("📤 Submitting:", payload);

    try {
      const res = await fetch(`${API}/api/volunteer/weekly-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);

      setWeeklyData([]);
      setAssignments([]);
      setStartDate("");
      setSubject("");

    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Submission failed");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mt-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Weekly Report Dashboard
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Logged in as <strong>{user.username}</strong>
      </p>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Level</option>
            {[1, 2, 3, 4, 5].map((lvl) => (
              <option value={lvl} key={lvl}>
                Level {lvl}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Subject</option>
            {user.subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Week Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchWeekly}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Loading..." : "Generate Weekly Report"}
        </button>
      </div>

      {/* Weekly Attendance */}
      {weeklyData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Attendance Summary</h3>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Present</th>
                <th className="border p-2">Absent</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((d) => (
                <tr key={d.date}>
                  <td className="border p-2">{d.date}</td>
                  <td className="border p-2 text-green-700 font-bold">{d.present}</td>
                  <td className="border p-2 text-red-600 font-bold">{d.absent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assignments */}
      {assignments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Assignments Given</h3>
          <ul className="list-disc ml-6 text-sm">
            {assignments.map((a, i) => (
              <li key={i}>
                <strong>{a.name}</strong> — {a.date}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      {weeklyData.length > 0 && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmitReport}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Submit Weekly Report
          </button>
        </div>
      )}
    </div>
  );
}
