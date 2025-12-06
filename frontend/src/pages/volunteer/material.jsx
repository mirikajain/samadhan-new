import React, { useState } from "react";

export default function UploadMaterial({ user }) {
  // fallback user
  user = {
    id: user?.id || "vol123",
    username: user?.username || "John Doe",
    role: user?.role || "volunteer",
    level: user?.level || 1,
    subjects:
      user?.subjects?.length > 0
        ? user.subjects
        : ["Math", "Science", "English"],
  };

  // state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(user.level);
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const API = "http://localhost:5000";

  const uploadMaterial = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!file || !title || !level || !subject) {
      return alert("Please fill all required fields.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("level", level);
    formData.append("subject", subject);
    formData.append("volunteerId", user.id);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API}/api/volunteer/upload-material`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded * 100) / event.total);
        setProgress(percent);
      }
    };

    xhr.onload = function () {
      if (xhr.status === 200) {
        setMessage("Material uploaded successfully! 🎉");
        setProgress(100);

        // reset form
        setTitle("");
        setDescription("");
        setSubject("");
        setFile(null);
      } else {
        setMessage("Upload failed ❌");
      }
    };

    xhr.onerror = function () {
      setMessage("Network error ❗ Please try again.");
    };

    xhr.send(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-blue-200 max-w-3xl mx-auto">

        <h2 className="text-3xl font-extrabold text-blue-700 mb-2">
          📚 Upload Study Material
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Logged in as <strong>{user.username}</strong> ({user.role})
        </p>

        {/* FORM */}
        <form onSubmit={uploadMaterial} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">
              ✏️ Title *
            </label>
            <input
              type="text"
              className="w-full border border-blue-300 bg-blue-50 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Ex: Algebra Chapter 1 Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">
              📝 Description
            </label>
            <textarea
              className="w-full border border-blue-300 bg-blue-50 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Optional description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* LEVEL + SUBJECT */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Level */}
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                🎓 Level *
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full border border-blue-300 bg-blue-50 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Level</option>
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <option key={lvl} value={lvl}>Level {lvl}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">
                📘 Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-blue-300 bg-blue-50 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Subject</option>
                {user.subjects.map((sub, i) => (
                  <option key={i} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* FILE UPLOAD */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-blue-700 mb-1">
              📎 Upload File *
            </label>

            <div className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl p-6 text-center shadow-sm hover:bg-blue-100 transition cursor-pointer">
              <input
                type="file"
                className="w-full text-sm"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              <p className="mt-2 text-blue-700 text-sm">
                {file ? `Selected: ${file.name}` : "Choose PDF, PPT, DOC, or Image"}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="h-full bg-blue-500 transition-all rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg transition"
          >
            🚀 Upload Material
          </button>

          {/* Message */}
          {message && (
            <p
              className={`text-center text-md font-semibold mt-2 ${
                message.includes("success") ? "text-green-700" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

        </form>
      </div>
    </div>
  );
}
