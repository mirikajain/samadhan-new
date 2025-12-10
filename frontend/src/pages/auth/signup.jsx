import React, { useState } from "react";
import { useLocation } from "wouter";
import signupImg from "../../assets/signup-img.jpg"; // reuse same illustration

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "admin",  // default only admin/donor allowed
    centreId: "",
  });

  const [error, setError] = useState("");
  const [, navigate] = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Signup failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // redirect based on role
      if (data.user.role === "admin") navigate("/admin/dashboard");
      if (data.user.role === "donor") navigate("/donor/dashboard");
    } catch (error) {
      setError("Server not reachable. Please try again later.");
    }
  };

  return (
    <div className="flex h-screen ">
      
      {/* LEFT SECTION */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 md:px-20">
        {/* Logo */}
        <h2 className="text-lg font-semibold text-purple-600 mb-2">Prerna</h2>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Create</h1>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Account</h1>

        <p className="text-gray-500 mb-8">
          Join us and access your dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">

          {/* Username */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                         focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                         focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Role (only Admin & Donor allowed) */}
          <div>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="admin">Admin</option>
              <option value="donor">Donor</option>
            </select>
          </div>

          {/* Centre ID */}
          <div>
            <input
              type="text"
              name="centreId"
              placeholder="Enter your Centre ID"
              value={form.centreId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                         focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Sign Up button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 
                       rounded-xl text-lg font-semibold transition"
          >
            Sign Up
          </button>

          {/* Login link */}
          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 font-medium hover:underline">
              Login here
            </a>
          </p>
        </form>
      </div>

      {/* RIGHT SECTION */}
      <div className="hidden lg:flex w-1/2 ">
        <img
          src={signupImg}
          alt="Signup illustration"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}
