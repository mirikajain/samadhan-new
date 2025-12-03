import React, { useState } from "react";

export default function AdminWeeklyReport() {
  const [filters, setFilters] = useState({ level: "", subject: "", startDate: "" });
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");

  const API = "http://localhost:5000";

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const generateWeekDates = (start) => {
    const base = new Date(start);
    const list = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      list.push(d.toISOString().split("T")[0]);
    }
    return list;
  };

  const fetchReport = async () => {
    if (!filters.level || !filters.subject || !filters.startDate) {
      return setMessage("Please fill all fields");
    }

    setMessage("");
    const dates = generateWeekDates(filters.startDate);

    try {
      const res = await fetch(
  `${API}/api/admin/weekly-attendance-db?level=${filters.level}&subject=${filters.subject}&startDate=${filters.startDate}`
);


      const data = await res.json();
      if (data.weekly) setReports(data.weekly);
      else setMessage("No report found");
    } catch (err) {
      console.error(err);
      setMessage("Server error fetching report");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Weekly Attendance Report</h2>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="number"
          name="level"
          placeholder="Level"
          value={filters.level}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={filters.subject}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={fetchReport}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-6"
      >
        Fetch Report
      </button>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      {reports.length > 0 && (
        <table className="w-full border text-sm mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Present Count</th>
              <th className="border p-2">Absent Count</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((d) => (
              <tr key={d.date}>
                <td className="border p-2">{d.date}</td>
                <td className="border p-2 text-green-700 font-bold">{d.present}</td>
                <td className="border p-2 text-red-600 font-bold">{d.absent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}