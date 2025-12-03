import React from "react";

export default function ProfileCard({ user }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">My Profile</h2>

      <div className="space-y-3 text-gray-700 text-lg">

        <p>
          <span className="font-semibold">ID:</span> {user.id}
        </p>

        <p>
          <span className="font-semibold">Name:</span> {user.username}
        </p>

        <p>
          <span className="font-semibold">Role:</span> {user.role}
        </p>

        {user.centreId && (
          <p>
            <span className="font-semibold">Centre ID:</span> {user.centreId}
          </p>
        )}

        {/* ONLY show level & subjects if NOT admin */}
        {user.role !== "admin" && (
          <>
            {user.level && (
              <p>
                <span className="font-semibold">Level:</span> {user.level}
              </p>
            )}

            {user.subjects && (
              <p>
                <span className="font-semibold">Subjects:</span>{" "}
                {user.subjects.join(", ")}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
