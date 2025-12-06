import React, { useState } from "react";

export default function Attendance({ user }) {
  console.log(user);

  // ▌ Ensure fallback user fields
  user = {
    id: user?.id || "vol123",
    username: user?.username,
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
  const [selectedLevel, setSelectedLevel] = useState(user.level);
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

  // ▌ Submit Attendance
  const submitAttendance = async () => {
    if (!subject || !date) return alert("Please fill all fields!");

    const payload = {
      volunteerId: user.id,
      level: selectedLevel,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      {/* Main Card */}
      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-blue-200 max-w-5xl mx-auto">
        
        <h2 className="text-3xl font-bold text-blue-700 mb-2">
          Mark Attendance
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Logged in as <strong>{user.username}</strong> ({user.role})
        </p>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-5 mb-6">
          
          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select Level</option>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl}
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
              className="w-full border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select Subject</option>
              {user.subjects.map((sub, i) => (
                <option key={i} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Fetch */}
          <div className="flex items-end">
            <button
              onClick={fetchStudents}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
            >
              {loading ? "Loading..." : "Fetch Students"}
            </button>
          </div>
        </div>

        {/* Bulk Action Buttons */}
        {students.length > 0 && (
          <div className="flex justify-end gap-3 mb-4">
            <button
              onClick={() =>
                setStudents(students.map((s) => ({ ...s, status: "Present" })))
              }
              className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium shadow-sm hover:bg-green-200"
            >
              Mark All Present
            </button>

            <button
              onClick={() =>
                setStudents(students.map((s) => ({ ...s, status: "Absent" })))
              }
              className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-medium shadow-sm hover:bg-red-200"
            >
              Mark All Absent
            </button>
          </div>
        )}

        {/* Students List */}
        {students.length > 0 ? (
          <div className="space-y-3 mt-4">
            {students.map((s) => (
              <div
                key={s._id}
                className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 flex justify-between items-center"
              >
                {/* Student Info */}
                <div>
                  <p className="font-semibold text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-500">ID: {s._id}</p>
                </div>

                {/* Status Toggle */}
                <div className="flex gap-2 items-center">

                  {/* Present */}
                  <button
                    onClick={() => handleStatusChange(s._id, "Present")}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition shadow-sm 
                      ${
                        s.status === "Present"
                          ? "bg-green-500 text-white"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }
                    `}
                  >
                    Present
                  </button>

                  {/* Absent */}
                  <button
                    onClick={() => handleStatusChange(s._id, "Absent")}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition shadow-sm
                      ${
                        s.status === "Absent"
                          ? "bg-red-500 text-white"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }
                    `}
                  >
                    Absent
                  </button>

                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-center text-gray-600 mt-6">
              No students loaded. Select filters and click <strong>Fetch</strong>.
            </p>
          )
        )}

        {/* Submit */}
        {students.length > 0 && (
          <div className="flex justify-end mt-6">
            <button
              onClick={submitAttendance}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow transition"
            >
              Submit Attendance
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
