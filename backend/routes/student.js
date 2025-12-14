import express from "express";
const router = express.Router();

import Attendance from "../models/Attendance.js";
import WeeklyReport from "../models/WeeklyReport.js";
import Assignment from "../models/Assignment.js";
import Material from "../models/Material.js";
import User from "../models/User.js";

/* ===================== ATTENDANCE ===================== */
router.get("/attendance/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const attendance = await Attendance.find({
      "records.studentId": studentId,
    }).sort({ date: 1 });

    const result = {};

    attendance.forEach((entry) => {
      const subject = entry.subject;
      if (!result[subject]) result[subject] = [];

      const rec = entry.records.find((r) => r.studentId === studentId);
      if (rec) {
        result[subject].push({
          date: entry.date,
          status: rec.status,
        });
      }
    });

    res.json({ success: true, attendance: result });
  } catch (err) {
    console.error("❌ Error fetching attendance:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===================== WEEKLY REPORT ===================== */
router.get("/weekly-report/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const report = await WeeklyReport.findOne({
      $or: [
        { "topperStudent.studentId": studentId },
        { "weakStudents.studentId": studentId },
      ],
    }).sort({ createdAt: -1 });

    res.json({ success: true, report });
  } catch (err) {
    console.error("❌ Error fetching weekly report:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===================== ASSIGNMENTS ===================== */
router.get("/assignments/:level", async (req, res) => {
  try {
    const level = Number(req.params.level);
    const studentId = req.query.studentId;

    const assignments = await Assignment.find({ level }).sort({
      createdAt: -1,
    });

    const result = assignments.map((a) => ({
      ...a.toObject(),
      attempted: (a.submissions || []).some(
        (s) => s.studentId === studentId
      ),
    }));

    res.json({ success: true, assignments: result });
  } catch (err) {
    console.error("❌ Error fetching assignments:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===================== SUBMIT ASSIGNMENT ===================== */
router.post("/submit-assignment", async (req, res) => {
  try {
    const { assignmentId, studentId, answers } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.json({ success: false, message: "Assignment not found" });
    }

    // 🚫 ATTEMPT ONCE (HARD BLOCK)
    const alreadySubmitted = (assignment.submissions || []).some(
      (s) => s.studentId === studentId
    );

    if (alreadySubmitted) {
      return res.json({
        success: false,
        attempted: true,
        message: "You have already attempted this assignment",
      });
    }

    // ✅ Calculate score
    let score = 0;
    assignment.mcqs.forEach((q, idx) => {
      if (q.correct === answers[idx]) score++;
    });

    // ✅ Fetch student name
    const student = await User.findById(studentId).select("username");

    // ✅ Store submission + score
    assignment.submissions.push({
      studentId,
      studentName: student?.username || "Unknown",
      score,
      total: assignment.mcqs.length,
      submittedAt: new Date(),
    });

    await assignment.save();

    res.json({
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

/* ===================== MATERIAL ===================== */
router.get("/material/:level", async (req, res) => {
  try {
    const level = Number(req.params.level);

    const materials = await Material.find({ level }).sort({
      createdAt: -1,
    });

    res.json({ success: true, materials });
  } catch (err) {
    console.error("❌ Material fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===================== NOTIFICATIONS ===================== */
router.get("/notifications/:studentId", async (req, res) => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const assignments = await Assignment.find({
      createdAt: { $gte: twoDaysAgo },
    }).select("name subject level createdAt");

    const materials = await Material.find({
      createdAt: { $gte: twoDaysAgo },
    }).select("title subject level createdAt");

    const notifications = [
      ...assignments.map((a) => ({
        _id: a._id,
        type: "assignment",
        title: `New Assignment: ${a.name}`,
        subject: a.subject || "General",
        level: a.level,
        createdAt: a.createdAt,
      })),
      ...materials.map((m) => ({
        _id: m._id,
        type: "material",
        title: `New Study Material: ${m.title}`,
        subject: m.subject || "General",
        level: m.level,
        createdAt: m.createdAt,
      })),
    ];

    res.json({ success: true, notifications });
  } catch (err) {
    console.error("❌ Notifications error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

import WeeklySchedule from "../models/WeeklySchedule.js";

/* ===================== STUDENT WEEKLY SCHEDULE ===================== */
router.get("/schedule/:level", async (req, res) => {
  try {
    const level = Number(req.params.level);

    const schedules = await WeeklySchedule.find({ level })
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      schedules
    });
  } catch (err) {
    console.error("❌ Student schedule fetch error:", err);
    res.status(500).json({ success: false });
  }
});


export default router;
