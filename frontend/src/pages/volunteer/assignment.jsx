import React, { useState, useEffect } from "react";
import BackButton from "../../components/backButton";

export default function Assignment({ user }) {
  user = {
    id: user?.id || "vol123",
    username: user?.username || "John Doe",
    role: user?.role || "volunteer",
    centreId: user?.centreId || "CEN-001",
    levels: user?.levels?.length > 0 ? user.levels : [1],
    subjects: user?.subjects?.length > 0 ? user.subjects : ["Math", "Science"],
  };

  const API = "https://samadhan-new-2.onrender.com";

  const [activeTab, setActiveTab] = useState("create");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [history, setHistory] = useState([]);

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
      return alert("Enter question & correct answer");

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
    if (!selectedLevel || !subject || !assignmentName || mcqs.length === 0)
      return alert("Complete assignment details");

    const payload = {
      volunteerId: user.id,
      level: selectedLevel,
      subject,
      name: assignmentName,
      mcqs,
    };

    const res = await fetch(`${API}/api/volunteer/assignment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    alert(data.message);

    setAssignmentName("");
    setSelectedLevel("");
    setSubject("");
    setMcqs([]);
    fetchHistory();
  };

  const fetchHistory = async () => {
    const res = await fetch(`${API}/api/volunteer/assignment-history/${user.id}`);
    const data = await res.json();
    if (data.success) setHistory(data.assignments);
  };

  useEffect(() => {
    fetchHistory();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 p-6">
      <div className="bg-white shadow-xl rounded-3xl p-8 max-w-6xl mx-auto">
        <BackButton/>
        <h2 className="text-4xl font-bold mb-6">Assignments ✏️</h2>

        {/* TABS */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-2 rounded-xl ${
              activeTab === "create" ? "bg-blue-600 text-white" : "bg-blue-100"
            }`}
          >
            ➕ Create
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 rounded-xl ${
              activeTab === "history" ? "bg-purple-600 text-white" : "bg-purple-100"
            }`}
          >
            📚 History
          </button>
        </div>

        {/* ================= CREATE ================= */}
        {activeTab === "create" && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Class</option>
                {user.levels.map((l) => (
                  <option key={l} value={l}>Class {l}</option>
                ))}
              </select>

              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Subject</option>
                {user.subjects.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <input
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                placeholder="Assignment Title"
                className="border p-2 rounded"
              />
            </div>

            <div className="border rounded p-6 mb-6">
              <textarea
                placeholder="Question"
                value={mcqForm.question}
                onChange={(e) =>
                  setMcqForm({ ...mcqForm, question: e.target.value })
                }
                className="w-full border p-2 rounded mb-3"
              />

              <div className="grid grid-cols-2 gap-3">
                {["A", "B", "C", "D"].map((o) => (
                  <input
                    key={o}
                    placeholder={`Option ${o}`}
                    value={mcqForm[`option${o}`]}
                    onChange={(e) =>
                      setMcqForm({ ...mcqForm, [`option${o}`]: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                ))}
              </div>

              <input
                placeholder="Correct (A/B/C/D)"
                value={mcqForm.correct}
                onChange={(e) =>
                  setMcqForm({ ...mcqForm, correct: e.target.value.toUpperCase() })
                }
                className="border p-2 rounded mt-3"
              />

              <button
                onClick={addMcq}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add MCQ
              </button>
            </div>

            {mcqs.length > 0 && (
              <button
                onClick={submitAssignment}
                className="bg-green-600 text-white px-6 py-3 rounded"
              >
                Submit Assignment
              </button>
            )}
          </>
        )}

        {/* ================= HISTORY ================= */}
        {activeTab === "history" && (
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-purple-200">
                <tr>
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Class</th>
                  <th className="border p-2">Subject</th>
                  <th className="border p-2">Submissions</th>
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
    </div>
  );
}

/* ================= ROW ================= */

function HistoryRow({ assignment }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="text-center">
        <td className="border p-2 font-semibold">{assignment.name}</td>
        <td className="border p-2">Class {assignment.level}</td>
        <td className="border p-2">{assignment.subject}</td>
        <td className="border p-2">
          {assignment.submissions?.length || 0}
        </td>
        <td className="border p-2">
          <button
            onClick={() => setOpen(!open)}
            className="bg-purple-600 text-white px-3 py-1 rounded"
          >
            {open ? "Hide" : "View"}
          </button>
        </td>
      </tr>

      {open && (
        <tr>
          <td colSpan="5" className="border p-4 bg-purple-50">
            <h4 className="font-bold mb-3">Student Marks</h4>

            {assignment.submissions?.length === 0 ? (
              <p>No submissions yet.</p>
            ) : (
              <table className="w-full border">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="border p-2">Student name</th>
                    <th className="border p-2">Score</th>
                    <th className="border p-2">Total</th>
                    <th className="border p-2">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {assignment.submissions.map((s, i) => (
                    <tr key={i} className="text-center bg-white">
                      <td className="border p-2">{s.studentName}</td>
                      <td className="border p-2 font-bold text-green-700">
                        {s.score}
                      </td>
                      <td className="border p-2">{s.total}</td>
                      <td className="border p-2">
                        {new Date(s.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
