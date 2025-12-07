import React, { useEffect, useState } from "react";
import { useRoute } from "wouter";

export default function StudentAssignment() {
  
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("User from storage:", user);
  console.log("Level being used:", user.levels?.[0]);
  
  const API = "http://localhost:5000";

  // READ LEVEL FROM URL (example: /student/assignment/2)
  const [, params] = useRoute("/student/assignments/:level");
  const level = params?.level || user.levels?.[0];

  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  // Fetch assignments on load
  useEffect(() => {
    async function load() {
      try {
        const url = `${API}/api/student/assignments/${level}`;
        console.log("📌 Fetching assignments from:", url);

        const res = await fetch(url);
        const data = await res.json();

        if (data.success) setAssignments(data.assignments);
        else console.error("❌ Assignment fetch error:", data.message);
      } catch (err) {
        console.error("❌ Cannot load assignments:", err);
      }
    }
    load();
  }, [level]);

  // Submit assignment
  const submitAssignment = async () => {
    try {
      const res = await fetch(`${API}/api/student/submit-assignment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selected._id,
          studentId: user.id,
          answers,
        }),
      });

      const data = await res.json();
      if (data.success) setResult(data);
    } catch (err) {
      console.error("❌ Error submitting assignment:", err);
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 p-6">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">
        Assignments for Level {level}
      </h1>

      {/* ASSIGNMENT LIST */}
      {!selected && (
        <div className="grid md:grid-cols-2 gap-6">
          {assignments.length === 0 && (
            <p className="text-gray-600 text-lg">No assignments available.</p>
          )}

          {assignments.map((a) => (
            <div
              key={a._id}
              className="p-6 bg-white shadow rounded-xl hover:bg-pink-50 transition cursor-pointer"
              onClick={() => {
                setSelected(a);
                setAnswers(Array(a.mcqs.length).fill(""));
              }}
            >
              <h2 className="text-xl font-semibold text-gray-800">{a.name}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {a.subject} • {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MCQ TEST VIEW */}
      {selected && !result && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">{selected.name}</h2>

          {selected.mcqs.map((q, i) => (
            <div key={i} className="mb-6">
              <p className="font-semibold">{i + 1}. {q.question}</p>

              <div className="grid grid-cols-2 gap-3 mt-2">
                {["A", "B", "C", "D"].map((opt) => (
                  <label
                    key={opt}
                    className={`p-3 rounded-lg border cursor-pointer ${
                      answers[i] === opt
                        ? "bg-pink-200 border-pink-600"
                        : "bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={opt}
                      className="hidden"
                      onChange={() =>
                        setAnswers((prev) => {
                          const updated = [...prev];
                          updated[i] = opt;
                          return updated;
                        })
                      }
                    />
                    {opt}: {q[`option${opt}`]}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={submitAssignment}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-700 transition"
          >
            Submit
          </button>
        </div>
      )}

      {/* RESULT VIEW */}
      {result && (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-3xl font-bold text-pink-700 mb-4">🎉 Result</h2>

          <p className="text-xl font-semibold">
            Score: {result.score}/{result.total}
          </p>

          {result.score === result.total && (
            <p className="text-green-600 mt-2 font-medium">
              Excellent! Full marks! 🌟
            </p>
          )}

          {result.score >= result.total / 2 && result.score < result.total && (
            <p className="text-blue-600 mt-2 font-medium">
              Good job! Keep improving!
            </p>
          )}

          {result.score < result.total / 2 && (
            <p className="text-red-600 mt-2 font-medium">
              Needs improvement — try again!
            </p>
          )}

          <button
            className="mt-6 bg-pink-500 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-600"
            onClick={() => {
              setSelected(null);
              setResult(null);
            }}
          >
            Back to Assignments
          </button>
        </div>
      )}
    </div>
  );
}
