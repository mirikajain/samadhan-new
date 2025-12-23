import React, { useEffect, useState } from "react";
import BackButton from "../../components/backButton";

export default function Schedule() {
  const API = "https://samadhan-new-2.onrender.com/api/admin";

  const [form, setForm] = useState({
    date: "",
    level: "",
    subject: "",
    time: ""
  });

  const [schedules, setSchedules] = useState([]);

  // ---------------- FETCH SCHEDULES ----------------
  const loadSchedules = async () => {
    const res = await fetch(`${API}/schedule`);
    const data = await res.json();
    if (data.success) setSchedules(data.schedules);
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  // ---------------- SUBMIT ----------------
  const submit = async () => {
    const res = await fetch(`${API}/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    

    if (data.success) {
      setForm({ date: "", level: "", subject: "", time: "" });
      loadSchedules();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <BackButton/>
      <h1 className="text-3xl font-bold mb-6">📅 Weekly Schedule</h1>

      {/* -------- ADD FORM -------- */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 grid md:grid-cols-4 gap-4">
        <input
          type="date"
          className="border p-2 rounded"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          type="number"
          placeholder="Class"
          className="border p-2 rounded"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
        />

        <input
          type="text"
          placeholder="Subject"
          className="border p-2 rounded"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />

        <input
          type="text"
          placeholder="Time (10:00 - 11:00)"
          className="border p-2 rounded"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />

        <button
          onClick={submit}
          className="md:col-span-4 bg-green-600 text-white py-2 rounded-lg"
        >
          ➕ Add Schedule
        </button>
      </div>

      {/* -------- TABLE -------- */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-green-100">
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Class</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No schedules added
                </td>
              </tr>
            ) : (
              schedules.map((s) => (
                <tr key={s._id} className="text-center hover:bg-green-50">
                  <td className="border p-2">{s.date}</td>
                  <td className="border p-2">Class {s.level}</td>
                  <td className="border p-2">{s.subject}</td>
                  <td className="border p-2">{s.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

