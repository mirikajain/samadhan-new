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

  // Add MCQ to list
  const addMcq = () => {
    if (!mcqForm.question || !mcqForm.correct)
      return alert("Please fill the question and correct answer.");

    setMcqs([...mcqs, mcqForm]);

    // Reset MCQ form
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

    console.log("📤 Submitting assignment:", payload);

    try {
      const res = await fetch(`${API}/api/volunteer/assignment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message || "Assignment created!");

      // Reset Assignment
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
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mt-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Create Assignment
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Logged in as <strong>{user.username}</strong> ({user.role})
      </p>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">

        {/* Level Selector */}
        <div>
          <label className="block text-sm font-medium mb-1">Level</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Level</option>
            {user.levels.map((lvl) => (
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

        {/* Assignment Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Assignment Name
          </label>
          <input
            type="text"
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Ex: Chapter 3 - Fractions Quiz"
          />
        </div>
      </div>

      {/* MCQ Form */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Question</label>
          <textarea
            value={mcqForm.question}
            onChange={(e) =>
              setMcqForm({ ...mcqForm, question: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter question..."
          />
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-4">
          {["A", "B", "C", "D"].map((opt) => (
            <div key={opt}>
              <label className="block text-sm font-medium mb-1">
                Option {opt}
              </label>
              <input
                type="text"
                value={mcqForm[`option${opt}`]}
                onChange={(e) =>
                  setMcqForm({ ...mcqForm, [`option${opt}`]: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          ))}
        </div>

        {/* Correct Answer */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Correct Answer (A/B/C/D)
          </label>
          <input
            type="text"
            value={mcqForm.correct}
            onChange={(e) =>
              setMcqForm({ ...mcqForm, correct: e.target.value.toUpperCase() })
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Add MCQ Button */}
        <div className="flex justify-end">
          <button
            onClick={addMcq}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add MCQ
          </button>
        </div>
      </div>

      {/* MCQ Table */}
      {mcqs.length > 0 ? (
        <table className="w-full border text-sm mt-4">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">Question</th>
              <th className="p-2 border text-center">Correct</th>
            </tr>
          </thead>
          <tbody>
            {mcqs.map((q, i) => (
              <tr key={i} className="border-b">
                <td className="p-2 border">{q.question}</td>
                <td className="p-2 border text-center font-semibold">
                  {q.correct}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600 mt-4">
          No MCQs added yet. Add questions above.
        </p>
      )}

      {/* Submit Assignment */}
      {mcqs.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={submitAssignment}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Submit Assignment
          </button>
        </div>
      )}
    </div>
  );
}
