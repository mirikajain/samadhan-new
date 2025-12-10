import React, { useState } from "react";

export default function Attendance({ user }) {
  console.log("Incoming user:", user);

  // ------------------------------
  // LOAD USER FROM LOCAL STORAGE
  // ------------------------------
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  user = {
    id: user?.id || storedUser.id || "vol123",
    username: user?.username || storedUser.username,
    role: user?.role || storedUser.role || "volunteer",
    centreId: user?.centreId || storedUser.centreId || "CEN-001",

    // 🟢 Assigned classes dynamically
    levels: user?.levels || storedUser.levels || [1],

    // Assigned subjects
    subjects:
      user?.subjects || storedUser.subjects || ["Math", "Science", "English"],
  };

  // ------------------------------
  // STATES
  // ------------------------------
  const [subject, setSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(user.levels[0] || "");
  const [date, setDate] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000";

  // ------------------------------
  // Fetch Students
  // ------------------------------
  const fetchStudents = async () => {
    if (!subject) return alert("Please select a subject!");
    if (!selectedLevel) return alert("Please select a class!");

    setLoading(true);

    try {
      const url = `${API}/api/volunteer/students?level=${selectedLevel}&subject=${subject}`;
      console.log("Fetching:", url);

      const res = await fetch(url);
      const data = await res.json();

      if (Array.isArray(data.students) && data.students.length > 0) {
        setStudents(
          data.students.map((s) => ({
            ...s,
            name: s.username,
            status: "Absent",
          }))
        );
      } else {
        alert("No students found.");
        setStudents([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Backend not reachable.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // Submit Attendance
  // ------------------------------
  const submitAttendance = async () => {
    if (!subject || !date) {
      return alert("Please fill all fields!");
    }

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

    console.log("Submitting:", payload);

    try {
      const res = await fetch(`${API}/api/volunteer/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);

      setStudents([]);
      setSubject("");
      setDate("");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Submission failed.");
    }
  };

  // ------------------------------
  // Status Update Handler (FIXED)
  // ------------------------------
  const handleStatusChange = (id, status) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, status } : s))
    );
  };

  // ------------------------------
  // RETURN UI
  // ------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">

      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-blue-200 max-w-5xl mx-auto">

        <h2 className="text-3xl font-bold text-blue-700 mb-2">
          Mark Attendance
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Logged in as <strong>{user.username}</strong> ({user.role})
        </p>

        {/* FILTERS */}
        <div className="grid md:grid-cols-4 gap-5 mb-6">

          {/* CLASS DROPDOWN */}
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Class
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full border border-blue-200 bg-blue-50 rounded-lg px-3 py-2"
            >
              <option value="">Select Class</option>

              {user.levels.map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>

          {/* SUBJECT */}
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-blue-200 bg-blue-50 rounded-lg px-3 py-2"
            >
              <option value="">Select Subject</option>

              {user.subjects.map((sub, i) => (
                <option key={i} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-blue-200 bg-blue-50 rounded-lg px-3 py-2"
            />
          </div>

          {/* FETCH BUTTON */}
          <div className="flex items-end">
            <button
              onClick={fetchStudents}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
            >
              {loading ? "Loading..." : "Fetch Students"}
            </button>
          </div>
        </div>

        {/* BULK ACTIONS */}
        {students.length > 0 && (
          <div className="flex justify-end gap-3 mb-4">

            <button
              onClick={() =>
                setStudents(students.map((s) => ({ ...s, status: "Present" })))
              }
              className="px-4 py-2 rounded-full bg-green-100 text-green-700 shadow-sm hover:bg-green-200"
            >
              Mark All Present
            </button>

            <button
              onClick={() =>
                setStudents(students.map((s) => ({ ...s, status: "Absent" })))
              }
              className="px-4 py-2 rounded-full bg-red-100 text-red-700 shadow-sm hover:bg-red-200"
            >
              Mark All Absent
            </button>
          </div>
        )}

        {/* STUDENTS LIST */}
        {students.length > 0 ? (
          <div className="space-y-3 mt-4">
            {students.map((s) => (
              <StudentRow
                key={s._id}
                s={s}
                handleStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-center text-gray-600 mt-6">
              No students loaded. Select filters and click <strong>Fetch</strong>.
            </p>
          )
        )}

        {/* SUBMIT BUTTON */}
        {students.length > 0 && (
          <div className="flex justify-end mt-6">
            <button
              onClick={submitAttendance}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow"
            >
              Submit Attendance
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ------------------------------------------
// STUDENT ROW COMPONENT
// ------------------------------------------
function StudentRow({ s, handleStatusChange }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 flex justify-between items-center">

      <div>
        <p className="font-semibold text-gray-800">{s.name}</p>
        <p className="text-xs text-gray-500">ID: {s._id}</p>
      </div>

      <div className="flex gap-2 items-center">

        <button
          onClick={() => handleStatusChange(s._id, "Present")}
          className={`px-4 py-1 rounded-full text-sm font-medium shadow-sm ${
            s.status === "Present"
              ? "bg-green-500 text-white"
              : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
        >
          Present
        </button>

        <button
          onClick={() => handleStatusChange(s._id, "Absent")}
          className={`px-4 py-1 rounded-full text-sm font-medium shadow-sm ${
            s.status === "Absent"
              ? "bg-red-500 text-white"
              : "bg-red-100 text-red-600 hover:bg-red-200"
          }`}
        >
          Absent
        </button>

      </div>

    </div>
  );
}
