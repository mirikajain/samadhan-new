import React from "react";

export default function ProfileCard({ user }) {
  // Convert centreId → readable name
  const centreNames = {
    "57": "Scottish 57, Gurugram",
    "1": "Scottish 57, Gurugram",
    "2": "Sikanderpur",
    "3": "Sohna Road",
  };

  const readableCentre =
    centreNames[user.centreId] || `Centre ${user.centreId}`;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 w-full text-center border border-gray-200">

      {/* GENERIC USER ICON */}
      <div className="flex justify-center">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
          {/* SVG USER ICON */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-gray-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2a5 5 0 015 5c0 2.76-2.24 5-5 5s-5-2.24-5-5a5 5 0 015-5zm0 12c4.41 0 8 2.24 8 5v1H4v-1c0-2.76 3.59-5 8-5z" />
          </svg>
        </div>
      </div>

      {/* NAME */}
      <h2 className="text-2xl font-bold text-gray-900 mt-4">{user.username}</h2>

      {/* ROLE */}
      <p className="text-red-600 font-semibold text-sm uppercase tracking-wide mt-1">
        {user.role}
      </p>

      {/* CENTRE */}
      <p className="text-gray-600 mt-3">
        <span className="font-semibold">Centre:</span> {readableCentre}
      </p>

      {/* CLASS */}
      {user.levels?.length > 0 && (
        <p className="text-gray-700 mt-3">
          <span className="font-semibold">Class:</span> {user.levels[0]}
        </p>
      )}

      {/* SUBJECTS */}
      {user.subjects && (
        <p className="text-gray-700 mt-3">
          <span className="font-semibold">Subjects:</span>{" "}
          {user.subjects.join(", ")}
        </p>
      )}
    </div>
  );
}
