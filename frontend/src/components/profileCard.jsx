import React from "react";

export default function ProfileCard({ user }) {
  if (!user) return null;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Volunteer Profile
      </h2>

      <div className="space-y-2 text-gray-700">
        <p>
          <span className="font-semibold">Name:</span> {user.username}
        </p>

        <p>
          <span className="font-semibold">Role:</span>{" "}
          <span className="capitalize">{user.role}</span>
        </p>

        <p>
          <span className="font-semibold">Centre ID:</span> {user.centreId}
        </p>

        <p>
          <span className="font-semibold">Level:</span>{" "}
          {user.level !== undefined ? user.level : "Not assigned"}
        </p>

        <p>
          <span className="font-semibold">Subjects:</span>{" "}
          {user.subjects && user.subjects.length > 0
            ? user.subjects.join(", ")
            : "No subjects allotted"}
        </p>
      </div>
    </div>
  );
}
