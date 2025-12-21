import React, { useState } from "react";
import BackButton from "../../components/backButton";

export default function AddStudent() {
  const [formData, setFormData] = useState({
    name: "",
    centreId: "",
    level: "",
    subjects: [],
  });

  const [message, setMessage] = useState("");

  const subjectsList = ["Math", "English", "EVS", "Science", "Hindi"];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (subject) => {
    setFormData((prev) => {
      if (prev.subjects.includes(subject)) {
        return { ...prev, subjects: prev.subjects.filter((s) => s !== subject) };
      } else {
        return { ...prev, subjects: [...prev.subjects, subject] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://samadhan-new-2.onrender.com/api/admin/add-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setFormData({ name: "", centreId: "", level: "", subjects: [] });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white 
                    p-5 sm:p-8 md:p-10 
                    rounded-2xl shadow-xl border border-green-100">
          <BackButton/>

      {/* TITLE */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 
                     text-green-700 tracking-tight text-center sm:text-left">
        🌿 Add New Student
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">

        {/* Student Name */}
        <div>
          <label className="font-semibold text-green-800 text-sm sm:text-base">
            Student Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 mt-1 border border-green-300 rounded-xl bg-green-50 
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
            onChange={handleInputChange}
            className="w-full p-3 mt-1 border border-green-300 rounded-xl bg-green-50 
                       focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Level */}
        <div>
          <label className="font-semibold text-green-800 text-sm sm:text-base">
            Level
          </label>
          <input
            type="number"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            className="w-full p-3 mt-1 border border-green-300 rounded-xl bg-green-50 
                       focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Subjects */}
        <div>
          <label className="font-semibold text-green-800 text-sm sm:text-base">
            Subjects
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
                          gap-3 sm:gap-4 mt-3">
            {subjectsList.map((subject) => (
              <label
                key={subject}
                className="flex items-center gap-3 p-3 
                           border border-green-300 rounded-xl bg-green-50 
                           cursor-pointer hover:bg-green-100"
              >
                <input
                  type="checkbox"
                  checked={formData.subjects.includes(subject)}
                  onChange={() => handleCheckboxChange(subject)}
                  className="w-5 h-5 accent-green-600"
                />
                <span className="text-green-900 font-medium text-sm sm:text-base">
                  {subject}
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
          Save Student
        </button>
      </form>

      {/* MESSAGE */}
      {message && (
        <p className="mt-6 text-green-700 font-semibold 
                      bg-green-100 p-4 rounded-lg text-center">
          {message}
        </p>
      )}
    </div>
  );
}
