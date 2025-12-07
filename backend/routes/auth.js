import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ Register
router.post("/register", async (req, res) => {
  try {
    const { username, password, role, centreId } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
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
      message: "✅ User registered successfully",
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
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ success: false, message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "✅ Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        levels: user.levels, 
        subjects: user.subjects,      
        centreId: user.centreId,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
