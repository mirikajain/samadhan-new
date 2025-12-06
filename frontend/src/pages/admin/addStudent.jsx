import React, { useState } from "react";

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

    const res = await fetch("http://localhost:5000/api/admin/add-student", {
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
    <div className="w-full max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-green-100">
      <h2 className="text-3xl font-bold mb-8 text-green-700 tracking-tight">
        🌿 Add New Student
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        
        {/* Student Name */}
        <div>
          <label className="font-semibold text-green-800">Student Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 mt-1 border border-green-300 rounded-xl bg-green-50 
                       focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Centre ID */}
        <div>
          <label className="font-semibold text-green-800">Centre ID</label>
          <input
            type="text"
            name="centreId"
            value={formData.centreId}
            onChange={handleInputChange}
            className="w-full p-3 mt-1 border border-green-300 rounded-xl bg-green-50 
                       focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Level */}
        <div>
          <label className="font-semibold text-green-800">Level</label>
          <input
            type="number"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            className="w-full p-3 mt-1 border border-green-300 rounded-xl bg-green-50 
                       focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Subjects Checkbox Section */}
        <div>
          <label className="font-semibold text-green-800">Subjects</label>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
            {subjectsList.map((subject) => (
              <label
                key={subject}
                className="flex items-center gap-3 p-3 border border-green-300 rounded-xl 
                           bg-green-50 cursor-pointer hover:bg-green-100 transition-all"
              >
                <input
                  type="checkbox"
                  checked={formData.subjects.includes(subject)}
                  onChange={() => handleCheckboxChange(subject)}
                  className="w-5 h-5 accent-green-600"
                />
                <span className="text-green-900 font-medium">{subject}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-xl 
                     font-semibold text-lg hover:bg-green-700 transition-all 
                     shadow-md hover:shadow-lg active:scale-95"
        >
          Save Student
        </button>
      </form>

      {/* Message */}
      {message && (
        <p className="mt-6 text-green-700 font-bold bg-green-100 p-4 rounded-lg text-center shadow-sm">
          {message}
        </p>
      )}
    </div>
  );
}
