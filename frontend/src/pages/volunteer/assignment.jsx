import React, { useState, useEffect } from "react";

export default function Assignment({ user }) {
  // ▌ Ensure fallback user fields
  user = {
    id: user?.id || "vol123",
    username: user?.username || "John Doe",
    role: user?.role || "volunteer",
    centreId: user?.centreId || "CEN-001",
    levels: user?.levels?.length > 0 ? user.levels : [1],
    subjects:
      user?.subjects?.length > 0
        ? user.subjects
        : ["Math", "Science", "English"],
  };

  const API = "http://localhost:5000";

  // -----------------------------
  // TAB HANDLING
  // -----------------------------
  const [activeTab, setActiveTab] = useState("create"); // create | history

  // -----------------------------
  // CREATE ASSIGNMENT STATES
  // -----------------------------
  const [selectedLevel, setSelectedLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [mcqs, setMcqs] = useState([]);

  const [mcqForm, setMcqForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correct: "",
  });

  const addMcq = () => {
    if (!mcqForm.question || !mcqForm.correct)
      return alert("Please enter question & correct answer!");

    setMcqs([...mcqs, mcqForm]);

    setMcqForm({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correct: "",
    });
  };

  const submitAssignment = async () => {
    if (!selectedLevel || !subject || !assignmentName)
      return alert("Please complete all assignment details!");

    if (mcqs.length === 0) return alert("Add at least ONE MCQ!");

    const payload = {
      volunteerId: user.id,
      level: selectedLevel,
      subject,
      name: assignmentName,
      mcqs,
    };

    try {
      const res = await fetch(`${API}/api/volunteer/assignment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message || "Assignment created!");

      // Reset
      setAssignmentName("");
      setMcqs([]);
      setSelectedLevel("");
      setSubject("");

      // Refresh history tab
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to create assignment.");
    }
  };

  // -----------------------------
  // ASSIGNMENT HISTORY
  // -----------------------------
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API}/api/volunteer/assignment-history/${user.id}`);
      const data = await res.json();

      if (data.success) setHistory(data.assignments);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">

      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-blue-200 max-w-6xl mx-auto">

        {/* TITLE */}
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent mb-3">
          Assignments ✏️
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Logged in as <strong>{user.username}</strong> ({user.role})
        </p>

        {/* ------------------ TABS ------------------ */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-2 rounded-xl text-lg font-semibold shadow 
              ${activeTab === "create" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"}`}
          >
            ➕ Create Assignment
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 rounded-xl text-lg font-semibold shadow 
              ${activeTab === "history" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700"}`}
          >
            📚 Assignment History
          </button>
        </div>

        {/* ===========================================
            TAB 1: CREATE ASSIGNMENT
        ============================================ */}
        {activeTab === "create" && (
          <>
            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-blue-700">Class</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 shadow-sm"
                >
                  <option value="">Select Class</option>
                  {user.levels.map((lvl) => (
                    <option key={lvl} value={lvl}>Class {lvl}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 shadow-sm"
                >
                  <option value="">Select Subject</option>
                  {user.subjects.map((sub, i) => (
                    <option key={i} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700">Assignment Title</label>
                <input
                  type="text"
                  value={assignmentName}
                  onChange={(e) => setAssignmentName(e.target.value)}
                  className="w-full border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 shadow-sm"
                  placeholder="Ex: Fractions Quiz - Chapter 3"
                />
              </div>
            </div>

            {/* MCQ Entry Box */}
            <div className="bg-white shadow-lg rounded-2xl border p-6">

              <h3 className="text-2xl font-bold text-blue-700 mb-4">Add MCQ Question</h3>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Question</label>
                <textarea
                  value={mcqForm.question}
                  onChange={(e) => setMcqForm({ ...mcqForm, question: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2"
                  placeholder="Type the question here..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {["A", "B", "C", "D"].map((opt) => (
                  <div key={opt}>
                    <label className="block text-sm font-semibold mb-1">Option {opt}</label>
                    <input
                      type="text"
                      value={mcqForm[`option${opt}`]}
                      onChange={(e) =>
                        setMcqForm({ ...mcqForm, [`option${opt}`]: e.target.value })
                      }
                      className="w-full border bg-gray-50 px-3 py-2 rounded-xl shadow-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-green-700">
                  Correct Answer (A/B/C/D)
                </label>
                <input
                  type="text"
                  value={mcqForm.correct}
                  onChange={(e) =>
                    setMcqForm({ ...mcqForm, correct: e.target.value.toUpperCase() })
                  }
                  className="w-full border border-green-300 bg-green-50 px-3 py-2 rounded-xl"
                />
              </div>

              <div className="flex justify-end mt-5">
                <button
                  onClick={addMcq}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl shadow"
                >
                  ➕ Add Question
                </button>
              </div>
            </div>

            {/* Preview */}
            {mcqs.length > 0 && (
              <div className="mt-10">
                <h3 className="text-2xl font-semibold mb-4">Preview Questions</h3>

                <div className="space-y-5">
                  {mcqs.map((q, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-5 rounded-2xl shadow-md"
                    >
                      <p className="font-bold text-blue-900 text-lg">Q{i + 1}: {q.question}</p>

                      <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                        {["A", "B", "C", "D"].map((opt) => (
                          <span
                            key={opt}
                            className={`px-3 py-2 rounded-xl border shadow-sm ${
                              q.correct === opt
                                ? "bg-green-200 border-green-400"
                                : "bg-white"
                            }`}
                          >
                            {opt}: {q[`option${opt}`]}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mcqs.length > 0 && (
              <div className="flex justify-end mt-10">
                <button
                  onClick={submitAssignment}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-3 rounded-xl shadow-lg"
                >
                  📤 Submit Assignment
                </button>
              </div>
            )}
          </>
        )}

        {/* ===========================================
            TAB 2: ASSIGNMENT HISTORY
        ============================================ */}
        {activeTab === "history" && (
          <div className="mt-6">

            <h3 className="text-2xl font-bold text-purple-700 mb-4">Your Assignment History</h3>

            {history.length === 0 ? (
              <p className="text-gray-600">No assignments created yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-purple-300 rounded-xl">
                  <thead className="bg-purple-200 text-purple-900">
                    <tr>
                      <th className="border p-2">Title</th>
                      <th className="border p-2">Class</th>
                      <th className="border p-2">Subject</th>
                      <th className="border p-2">MCQs</th>
                      <th className="border p-2">Created</th>
                      <th className="border p-2">Details</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((a, i) => (
                      <HistoryRow key={i} assignment={a} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}


// --------------------------------------------
// ROW COMPONENT FOR HISTORY TABLE
// --------------------------------------------
function HistoryRow({ assignment }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="text-center hover:bg-purple-50">
        <td className="border p-2 font-semibold">{assignment.name}</td>
        <td className="border p-2">Class {assignment.level}</td>
        <td className="border p-2">{assignment.subject}</td>
        <td className="border p-2">{assignment.mcqs.length}</td>
        <td className="border p-2">{new Date(assignment.createdAt).toLocaleDateString()}</td>

        <td className="border p-2">
          <button
            className="px-3 py-1 bg-purple-600 text-white rounded-lg"
            onClick={() => setOpen(!open)}
          >
            {open ? "Hide" : "View"}
          </button>
        </td>
      </tr>

      {open && (
        <tr className="bg-purple-50">
          <td colSpan="6" className="p-4 text-left border">
            <h4 className="font-bold mb-2 text-purple-700">MCQ Details</h4>

            {assignment.mcqs.map((mcq, index) => (
              <div key={index} className="mb-3">
                <p className="font-semibold">Q{index + 1}: {mcq.question}</p>
                <ul className="ml-5 list-disc text-sm">
                  <li>A: {mcq.optionA}</li>
                  <li>B: {mcq.optionB}</li>
                  <li>C: {mcq.optionC}</li>
                  <li>D: {mcq.optionD}</li>
                  <li className="font-bold text-green-700">Correct: {mcq.correct}</li>
                </ul>
              </div>
            ))}
          </td>
        </tr>
      )}
    </>
  );
}
