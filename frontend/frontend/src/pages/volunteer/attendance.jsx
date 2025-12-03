import React, { useState } from "react";

export default function Attendance({ user }) {
  // ▌ Ensure fallback user fields
  user = {
    id: user?.id || "vol123",
    username: user?.username || "John Doe",
    role: user?.role || "volunteer",
    centreId: user?.centreId || "CEN-001",
    level: user?.level || 1,
    subjects:
      user?.subjects?.length > 0
        ? user.subjects
        : ["Math", "Science", "English"],
  };

  // ▌ States
  const [subject, setSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(user.level); // 🔥 NEW LEVEL
  const [date, setDate] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000";

  // ▌ Fetch Students
  const fetchStudents = async () => {
    if (!subject) return alert("Please select a subject!");
    if (!selectedLevel) return alert("Please select a level!");

    setLoading(true);

    try {
      const url = `${API}/api/volunteer/students?level=${selectedLevel}&subject=${subject}`;
      console.log("🌐 Fetching:", url);

      const res = await fetch(url);
      const data = await res.json();

      console.log("📦 Data:", data);

      if (Array.isArray(data.students) && data.students.length > 0) {
        setStudents(
          data.students.map((s) => ({
            ...s,
            status: "Absent",
          }))
        );
      } else {
        alert("No students found.");
        setStudents([]);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Backend not reachable.");
    } finally {
      setLoading(false);
    }
  };

  // ▌ Submit attendance
  const submitAttendance = async () => {
    if (!subject || !date) return alert("Please fill all fields!");

    const payload = {
      volunteerId: user.id,
      level: selectedLevel, // 🔥 Use selected level
      subject,
      date,
      records: students.map((s) => ({
        studentId: s._id,
        name: s.name,
        status: s.status,
      })),
    };

    console.log("📤 Submitting:", payload);

    try {
      const res = await fetch(`${API}/api/volunteer/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);

      // Reset
      setStudents([]);
      setDate("");
      setSubject("");
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Submission failed.");
    }
  };

  // ▌ Status Update
  const handleStatusChange = (id, status) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, status } : s))
    );
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mt-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Mark Attendance</h2>

      <p className="text-sm text-gray-600 mb-4">
        Logged in as <strong>{user.username}</strong> ({user.role})
      </p>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-4 mb-4">

        {/* 🔥 Level Selector */}
        <div>
          <label className="block text-sm font-medium mb-1">Level</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Level</option>
            {[1, 2, 3, 4, 5].map((lvl) => (
              <option key={lvl} value={lvl}>
                Level {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Selector */}
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Subject</option>
            {user.subjects.map((sub, i) => (
              <option key={i} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selector */}
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Fetch Button */}
        <div className="flex items-end">
          <button
            onClick={fetchStudents}
            className="bg-blue-600 text-white w-full px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Loading..." : "Fetch Students"}
          </button>
        </div>
      </div>

      {/* Student Table */}
      {students.length > 0 ? (
        <table className="w-full border text-sm mt-4">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-b">
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border text-center">
                  <select
                    value={s.status}
                    onChange={(e) =>
                      handleStatusChange(s._id, e.target.value)
                    }
                    className="border rounded-lg px-2 py-1"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && (
          <p className="text-center text-gray-600 mt-4">
            No students loaded. Select filters and click Fetch.
          </p>
        )
      )}

      {/* Submit Button */}
      {students.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={submitAttendance}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Submit Attendance
          </button>
        </div>
      )}
    </div>
  );
}
