import React, { useState } from "react";

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

  // ▌ State for assignment
  const [selectedLevel, setSelectedLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [mcqs, setMcqs] = useState([]);

  // ▌ MCQ Form
  const [mcqForm, setMcqForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correct: "",
  });

  // Add MCQ
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

  // Submit Assignment
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

      setAssignmentName("");
      setMcqs([]);
      setSelectedLevel("");
      setSubject("");
    } catch (err) {
      console.error(err);
      alert("Failed to create assignment.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">

      {/* MAIN CONTAINER */}
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-blue-200 max-w-5xl mx-auto transition-all">

        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent mb-3">
          Create Assignment ✏️
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Logged in as <strong>{user.username}</strong> ({user.role})
        </p>

        {/* ================= Filters ================= */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          
          {/* Level */}
          <div>
            <label className="block text-sm font-semibold text-blue-700">Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select Level</option>
              {user.levels.map((lvl) => (
                <option key={lvl} value={lvl}>Level {lvl}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-blue-700">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select Subject</option>
              {user.subjects.map((sub, i) => (
                <option key={i} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Assignment Name */}
          <div>
            <label className="block text-sm font-semibold text-blue-700">Assignment Title</label>
            <input
              type="text"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              className="w-full border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-300"
              placeholder="Ex: Fractions Quiz - Chapter 3"
            />
          </div>
        </div>


        {/* ================= MCQ ENTRY BOX ================= */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 transition hover:shadow-xl">

          <h3 className="text-2xl font-bold text-blue-700 mb-4">Add MCQ Question</h3>

          {/* Question */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-gray-600">Question</label>
            <textarea
              value={mcqForm.question}
              onChange={(e) => setMcqForm({ ...mcqForm, question: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-300"
              placeholder="Type the question here..."
            />
          </div>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-4">
            {["A", "B", "C", "D"].map((opt) => (
              <div key={opt}>
                <label className="block text-sm font-semibold mb-1">
                  Option {opt}
                </label>
                <input
                  type="text"
                  value={mcqForm[`option${opt}`]}
                  onChange={(e) =>
                    setMcqForm({ ...mcqForm, [`option${opt}`]: e.target.value })
                  }
                  className="w-full border border-gray-300 bg-gray-50 px-3 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-300"
                />
              </div>
            ))}
          </div>

          {/* Correct Answer */}
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1 text-green-700">
              Correct Answer (A/B/C/D)
            </label>
            <input
              type="text"
              value={mcqForm.correct}
              onChange={(e) => setMcqForm({ ...mcqForm, correct: e.target.value.toUpperCase() })}
              className="w-full border border-green-300 bg-green-50 px-3 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* Add MCQ Button */}
          <div className="flex justify-end mt-5">
            <button
              onClick={addMcq}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl shadow hover:scale-105 hover:shadow-lg transition"
            >
              ➕ Add Question
            </button>
          </div>
        </div>


        {/* ================= PREVIEW MCQs ================= */}
        {mcqs.length > 0 && (
          <div className="mt-10">
            
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Preview Questions</h3>

            <div className="space-y-5">
              {mcqs.map((q, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 p-5 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <p className="font-bold text-blue-900 text-lg">
                    Q{i + 1}: {q.question}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                    {["A", "B", "C", "D"].map((opt) => (
                      <span
                        key={opt}
                        className={`px-3 py-2 rounded-xl border shadow-sm ${
                          q.correct === opt
                            ? "bg-green-200 text-green-800 border-green-400"
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


        {/* ================= SUBMIT BUTTON ================= */}
        {mcqs.length > 0 && (
          <div className="flex justify-end mt-10">
            <button
              onClick={submitAssignment}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition"
            >
              📤 Submit Assignment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
