import React, { useEffect, useState } from "react";
import BackButton from "../../components/backButton";

export default function StudentMaterial() {
  const user = JSON.parse(localStorage.getItem("user"));
  const level = user.levels?.[0]; 
  console.log(level); // correct way to access student level
  const API = "https://samadhan-new-2.onrender.com/api";

  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const res = await fetch(`${API}/student/material/${level}`);
        const data = await res.json();

        if (data.success) {
          setMaterials(data.materials);
        } else {
          console.error("❌ Material fetch error:", data.message);
        }
      } catch (err) {
        console.error("❌ Error loading material:", err);
      }
    }
    
    fetchMaterials();
  }, [level]);

  return (
    <div className="min-h-screen bg-pink-100 p-6">
      <BackButton/>

      <h1 className="text-3xl font-bold text-pink-700 mb-6">
        📚 Study Material — Class {level}
      </h1>

      {materials.length === 0 ? (
        <p className="text-gray-700 text-lg">No study materials uploaded yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {materials.map((m) => (
            <div
              key={m._id}
              className="bg-white p-5 shadow rounded-xl border hover:bg-pink-50 transition"
            >
              <h2 className="text-xl font-semibold mb-1">{m.title}</h2>

              {m.description && (
                <p className="text-sm text-gray-700 mb-2">{m.description}</p>
              )}

              <p className="text-sm text-gray-500 mb-2">
                {m.subject} • {new Date(m.createdAt).toLocaleDateString()}
              </p>

              {/* File preview / download */}
              <a
                href={m.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="block p-3 bg-pink-300 text-pink-900 font-semibold rounded-lg text-center hover:bg-pink-400 transition"
              >
                📄 View / Download Material
              </a>

              {/* File details */}
              <p className="text-xs text-gray-500 mt-2">
                {m.filename} ({Math.round(m.size / 1024)} KB)
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
