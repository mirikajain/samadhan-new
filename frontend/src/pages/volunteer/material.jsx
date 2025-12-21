import React, { useState, useEffect } from "react";
import BackButton from "../../components/backButton";

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

  const API = "https://samadhan-new-2.onrender.com";

  // Tabs
  const [activeTab, setActiveTab] = useState("upload");

  // upload states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(user.level);
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  // history
  const [materials, setMaterials] = useState([]);

  // fetch uploaded material history
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API}/api/volunteer/material-history/${user.id}`);
      const data = await res.json();

      if (data.success) setMaterials(data.materials);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  });

  // upload material
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

    xhr.onload = () => {
      if (xhr.status === 200) {
        setMessage("Material uploaded successfully! 🎉");
        setProgress(100);

        // reset
        setTitle("");
        setDescription("");
        setSubject("");
        setFile(null);

        fetchHistory();
      } else {
        setMessage("Upload failed ❌");
      }
    };

    xhr.onerror = () => {
      setMessage("Network error ❗ Please try again.");
    };

    xhr.send(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-blue-200 max-w-4xl mx-auto">
          <BackButton/>

        <h2 className="text-3xl font-extrabold text-blue-700 mb-3">
          📘 Study Material
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Logged in as <strong>{user.username}</strong> ({user.role})
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-2 rounded-xl text-lg font-semibold shadow 
              ${activeTab === "upload" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"}`}
          >
            ➕ Upload Material
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 rounded-xl text-lg font-semibold shadow 
              ${activeTab === "history" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700"}`}
          >
            📚 Material History
          </button>
        </div>

        {/* ============================
            TAB 1 — UPLOAD MATERIAL
        ============================ */}
        {activeTab === "upload" && (
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

            {/* CLASS + SUBJECT */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Class */}
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-1">
                  🎓 Class *
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full border border-blue-300 bg-blue-50 rounded-lg px-3 py-2 shadow-sm"
                  required
                >
                  <option value="">Select Class</option>
                  {[1, 2, 3, 4, 5].map((cls) => (
                    <option key={cls} value={cls}>Class {cls}</option>
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
                  className="w-full border border-blue-300 bg-blue-50 rounded-lg px-3 py-2 shadow-sm"
                  required
                >
                  <option value="">Select Subject</option>
                  {user.subjects.map((sub, i) => (
                    <option key={i} value={sub}>{sub}</option>
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
        )}

        {/* ============================
            TAB 2 — MATERIAL HISTORY
        ============================ */}
        {activeTab === "history" && (
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-purple-700 mb-4">Uploaded Material</h3>

            {materials.length === 0 ? (
              <p className="text-gray-600">No study material uploaded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-purple-300 rounded-xl">
                  <thead className="bg-purple-200 text-purple-900">
                    <tr>
                      <th className="border p-2">Title</th>
                      <th className="border p-2">Class</th>
                      <th className="border p-2">Subject</th>
                      <th className="border p-2">File</th>
                      <th className="border p-2">Uploaded</th>
                      
                    </tr>
                  </thead>

                  <tbody>
                    {materials.map((m, i) => (
                      <MaterialRow key={i} material={m} />
                    ))}
                  </tbody>

                </table>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

// --------------------------------------------
// MATERIAL ROW COMPONENT
// --------------------------------------------
function MaterialRow({ material }) {
  

  return (
    <>
      <tr className="text-center hover:bg-purple-50">
        <td className="border p-2 font-semibold">{material.title}</td>
        <td className="border p-2">Class {material.level}</td>
        <td className="border p-2">{material.subject}</td>

        <td className="border p-2">
          <a
            className="text-blue-600 underline"
            href={material.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View File
          </a>
        </td>

        <td className="border p-2">
          {new Date(material.createdAt).toLocaleDateString()}
        </td>

        
      </tr>

      
    </>
  );
}
