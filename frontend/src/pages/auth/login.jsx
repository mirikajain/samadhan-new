import React, { useState } from "react";
import { useLocation } from "wouter";
import loginImg from "../../assets/login-img.jpg";   // ✅ Correct import
import BackButton from "../../components/backButton";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [, navigate] = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      switch (data.user.role) {
        case "admin": navigate("/admin/dashboard"); break;
        case "volunteer": navigate("/volunteer/dashboard"); break;
        case "donor": navigate("/donor/dashboard"); break;
        case "student": navigate("/student/dashboard"); break;
        default: navigate("/");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.log(err);
    }
  };

  return (
    <div className="flex h-screen">
      
      
      {/* LEFT SECTION */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 md:px-20">
        <BackButton/>
        <h2 className="text-lg font-semibold text-purple-600 mb-2">Prerna</h2>

        <h1 className="text-5xl font-bold mb-3">Holla,</h1>
        <h1 className="text-5xl font-bold mb-6">Welcome Back</h1>

        <p className="text-gray-500 mb-8">
          Hey, welcome back to your special place
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                         focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
                         focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 accent-purple-600" />
              Remember me
            </label>
            <a href="#" className="text-purple-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 
                       rounded-xl text-lg font-semibold transition"
          >
            Sign In
          </button>

          <p className="text-sm text-gray-600 text-center mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-purple-600 font-medium hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>

      {/* RIGHT SECTION (Illustration) */}
      <div className="hidden lg:flex w-1/2 bg-purple-200 items-center justify-center p-10">
        <img
          src={loginImg}         // ✅ Correct usage
          alt="Login illustration"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}
