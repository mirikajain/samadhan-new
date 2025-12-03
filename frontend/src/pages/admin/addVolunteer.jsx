import React, { useState } from "react";

export default function AddVolunteer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    centreId: "",
    phone: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setFormData({ name: "", email: "", centreId: "", phone: "" });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Add Volunteer
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="font-semibold">Volunteer Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="font-semibold">Centre ID</label>
          <input
            type="text"
            name="centreId"
            value={formData.centreId}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="font-semibold">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Volunteer
        </button>
      </form>

      {message && <p className="mt-4 text-green-600 font-semibold">{message}</p>}
    </div>
  );
}
