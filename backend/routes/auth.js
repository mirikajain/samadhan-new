import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ Register
// ✅ Register (Only admin and donor can register)
router.post("/register", async (req, res) => {
  try {
    const { username, password, role, centreId } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // ❌ Block volunteer & student from registering
    if (role === "volunteer" || role === "student") {
      return res.status(403).json({
        success: false,
        message: "Only Admin and Donor can create accounts. Volunteer/Student accounts must be created by Admin.",
      });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashed, role, centreId });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        centreId: newUser.centreId,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ✅ Login
// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // ❌ Extra Safety: Volunteer/Student must already exist (admin-created)
    if (["volunteer", "student"].includes(user.role) && !user._id) {
      return res.status(403).json({
        success: false,
        message: "Your account is not registered. Please contact the admin.",
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        centreId: user.centreId,
        levels: user.levels,
        subjects: user.subjects,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
