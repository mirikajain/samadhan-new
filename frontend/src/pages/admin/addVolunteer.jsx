import React, { useState } from "react";
import BackButton from "../../components/backButton";

export default function AddVolunteer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    centreId: "",
    phone: "",
    level: "",
    subjects: [],
  });

  const [message, setMessage] = useState("");

  const subjectsList = ["Math", "Science", "English", "EVS", "Hindi"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSubject = (subject) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/admin/add-volunteer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setFormData({
        name: "",
        email: "",
        centreId: "",
        phone: "",
        level: "",
        subjects: [],
      });
    }
  };

  return (
    <div
      className="w-full max-w-5xl mx-auto bg-white
                 p-5 sm:p-8 md:p-10
                 rounded-2xl shadow-xl border border-green-200"
    >
      {/* TITLE */}
          <BackButton/>
      <h2
        className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8
                   text-green-700 tracking-tight
                   text-center sm:text-left"
      >
        👤 Add Volunteer
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Volunteer Name */}
        <div>
          <label className="font-semibold text-green-800 text-sm sm:text-base">
            Volunteer Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 mt-1
                       border border-green-300 rounded-xl bg-green-50
                       focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="font-semibold text-green-800 text-sm sm:text-base">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 mt-1
                       border border-green-300 rounded-xl bg-green-50
                       focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Centre ID */}
        <div>
          <label className="font-semibold text-green-800 text-sm sm:text-base">
            Centre ID
          </label>
          <input
            type="text"
            name="centreId"
            value={formData.centreId}
            onChange={handleChange}
            className="w-full p-3 mt-1
                       border border-green-300 rounded-xl bg-green-50
                       focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="font-semibold text-green-800 text-sm sm:text-base">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 mt-1
                       border border-green-300 rounded-xl bg-green-50
                       focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Level */}
        <div>
          <label className="font-semibold text-green-800 text-sm sm:text-base">
            Level
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full p-3 mt-1
                       border border-green-300 rounded-xl bg-green-50
                       focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select Class</option>
            {[1, 2, 3, 4, 5].map((lvl) => (
              <option key={lvl} value={lvl}>
                Level {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Subjects */}
        <div>
          <label
            className="font-semibold text-green-800 mb-2 block
                       text-sm sm:text-base"
          >
            Subjects
          </label>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
                       gap-3 sm:gap-4 mt-3"
          >
            {subjectsList.map((sub) => (
              <label
                key={sub}
                className="flex items-center gap-3 p-3
                           border border-green-300 rounded-xl
                           bg-green-50 cursor-pointer
                           hover:bg-green-100 transition-all"
              >
                <input
                  type="checkbox"
                  checked={formData.subjects.includes(sub)}
                  onChange={() => toggleSubject(sub)}
                  className="w-5 h-5 accent-green-600"
                />
                <span className="text-green-900 font-medium text-sm sm:text-base">
                  {sub}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white
                     py-3 sm:py-4 rounded-xl
                     font-semibold text-base sm:text-lg
                     hover:bg-green-700 transition-all
                     shadow-md active:scale-95"
        >
          Save Volunteer
        </button>
      </form>

      {/* MESSAGE */}
      {message && (
        <p
          className="mt-6 text-green-700 font-semibold
                     bg-green-100 p-4 rounded-lg
                     text-center"
        >
          {message}
        </p>
      )}
    </div>
  );
}
