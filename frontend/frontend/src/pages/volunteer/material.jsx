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
        setMessage("Material uploaded successfully!");
        setProgress(100);

        // reset
        setTitle("");
        setDescription("");
        setSubject("");
        setFile(null);
      } else {
        setMessage("Upload failed.");
      }
    };

    xhr.onerror = function () {
      setMessage("Network error during upload.");
    };

    xhr.send(formData);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mt-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Upload Study Material</h2>

      <p className="text-sm text-gray-600 mb-4">
        Logged in as <strong>{user.username}</strong> ({user.role})
      </p>

      <form onSubmit={uploadMaterial} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Example: Algebra Chapter 1 Notes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Optional description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Level + Subject */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Level */}
          <div>
            <label className="block text-sm font-medium mb-1">Level *</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Level</option>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-1">Subject *</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
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

        {/* File */}
        <div>
          <label className="block text-sm font-medium mb-1">Choose File *</label>
          <input
            type="file"
            className="w-full border px-3 py-2 rounded-lg"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        {/* Progress */}
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded h-3 mt-2">
            <div
              className="h-3 bg-blue-600 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-600 text-white w-full px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Upload Material
        </button>

        {/* Message */}
        {message && (
          <p className="text-center text-md font-semibold mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}
