import express from "express";

const router = express.Router();

// Example test route
import Attendance from "../models/Attendance.js";


router.get("/attendance/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Get all attendance entries where this student appears
    const attendance = await Attendance.find({
      "records.studentId": studentId,
    }).sort({ date: 1 });

    // Build structured response
    const result = {};

    attendance.forEach((entry) => {
      const subject = entry.subject;

      // Initialize subject block if needed
      if (!result[subject]) result[subject] = [];

      // Extract this student's record from entry
      const rec = entry.records.find((r) => r.studentId === studentId);

      if (rec) {
        result[subject].push({
          date: entry.date,
          status: rec.status,
        });
      }
    });

    res.json({
      success: true,
      attendance: result,
    });

  } catch (err) {
    console.error("❌ Error fetching attendance:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

import WeeklyReport from "../models/WeeklyReport.js";

router.get("/weekly-report/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Find any report where the student appears
    const report = await WeeklyReport.findOne({
      $or: [
        { "topperStudent.studentId": studentId },
        { "weakStudents.studentId": studentId }
      ]
    }).sort({ createdAt: -1 }); // latest week

    res.json({ success: true, report });

  } catch (err) {
    console.error("❌ Error fetching weekly report:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

import Assignment from "../models/Assignment.js";
import Material from "../models/Material.js";

router.get("/assignments/:level", async (req, res) => {
  try {
    const level = Number(req.params.level);

    const assignments = await Assignment.find({ level }).sort({
      createdAt: -1,
    });

    res.json({ success: true, assignments });
  } catch (err) {
    console.error("❌ Error fetching assignments:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/submit-assignment", async (req, res) => {
  try {
    const { assignmentId, studentId, answers } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment)
      return res.json({ success: false, message: "Assignment not found" });

    let score = 0;

    assignment.mcqs.forEach((q, idx) => {
      if (q.correct === answers[idx]) score++;
    });

    return res.json({
      success: true,
      score,
      total: assignment.mcqs.length,
      message: "Assignment submitted",
    });
  } catch (err) {
    console.error("❌ Error submitting assignment:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/material/:level", async (req, res) => {
  try {
    const level = Number(req.params.level);

    const materials = await Material.find({ level })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      materials
    });

  } catch (err) {
    console.error("❌ Material fetch error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
