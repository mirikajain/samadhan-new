import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";

import Attendance from "../models/Attendance.js";
import Assignment from "../models/Assignment.js";
import Material from "../models/Material.js";
import WeeklyReport from "../models/WeeklyReport.js";
import User from "../models/User.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";


const router = express.Router();

/* ------------------------------------------------------
   🟦 GET STUDENTS
------------------------------------------------------ */
router.get("/students", async (req, res) => {
  try {
    const { level, subject } = req.query;

    if (!level || !subject) {
      return res.status(400).json({ message: "Level and subject required" });
    }

    const students = await User.find({
      role: "student",
      levels: { $in: [Number(level)] },
      subjects: { $in: [subject] },
    }).select("_id username levels subjects centreId");

    res.json({ success: true, students });
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------------------------------------------
   🟧 SAVE ATTENDANCE
------------------------------------------------------ */
router.post("/attendance", async (req, res) => {
  try {
    const { volunteerId, level, subject, date, records } = req.body;

    if (!volunteerId || !level || !subject || !date || !records) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const saved = await Attendance.create({
      volunteerId,
      level,
      subject,
      date,
      records,
    });

    res.json({
      success: true,
      message: "Attendance saved successfully!",
      attendanceId: saved._id,
    });
  } catch (err) {
    console.error("❌ Attendance save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});







/* ------------------------------------------------------
   🟪 SAVE ASSIGNMENT
------------------------------------------------------ */
router.post("/assignment", async (req, res) => {
  try {
    const { volunteerId, level, subject, name, mcqs } = req.body;

    if (!volunteerId || !level || !subject || !name || !mcqs?.length) {
      return res.status(400).json({ message: "Invalid assignment data" });
    }

    const saved = await Assignment.create({
      volunteerId,
      level: Number(level),
      subject,
      name,
      mcqs,
      submissions: [], // ✅ important
      createdAt: new Date(),
    });

    res.json({
      success: true,
      message: "Assignment saved successfully!",
      assignment: saved,
    });
  } catch (err) {
    console.error("❌ Assignment save error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------------------------------------------
   🟪 ASSIGNMENT HISTORY (VOLUNTEER)
------------------------------------------------------ */
router.get("/assignment-history/:id", async (req, res) => {
  try {
    const assignments = await Assignment.find({
      volunteerId: req.params.id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, assignments });
  } catch (err) {
    console.error("❌ Assignment history error:", err);
    res.status(500).json({ success: false });
  }
});

/* ------------------------------------------------------
   🟩 MATERIAL UPLOAD
------------------------------------------------------ */
const uploadDir = path.join(process.cwd(), "uploads", "materials");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`);
  },
});

const upload = multer({ storage });

router.post("/upload-material", upload.single("file"), async (req, res) => {
  try {
    const { volunteerId, title, description, level, subject } = req.body;

    if (!req.file || !volunteerId || !title || !level || !subject) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const material = await Material.create({
      volunteerId,
      title,
      description,
      level: Number(level),
      subject,
      fileUrl: `${BASE_URL}/uploads/materials/${req.file.filename}`,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    res.json({
      success: true,
      message: "Material uploaded successfully!",
      material,
    });
  } catch (err) {
    console.error("❌ Material upload error:", err);
    res.status(500).json({ message: "Upload error" });
  }
});

router.get("/material-history/:volunteerId", async (req, res) => {
  try {
    const materials = await Material.find({
      volunteerId: req.params.volunteerId,
    });

    res.json({ success: true, materials });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ------------------------------------------------------
   🟦 VOLUNTEER NOTIFICATIONS
------------------------------------------------------ */
router.get("/notifications/:volunteerId", async (req, res) => {
  try {
    const notifications = [];

    // ✅ Weekly report reminder (Friday)
    if (new Date().getDay() === 5) {
      notifications.push("📅 Please submit your weekly report today.");
    }

    // ✅ Students submitted assignments in last 2 days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const assignments = await Assignment.find({
      volunteerId: req.params.volunteerId,
      "submissions.0": { $exists: true },
      createdAt: { $gte: twoDaysAgo },
    });

    const studentSet = new Set();
    assignments.forEach((a) =>
      (a.submissions || []).forEach((s) => studentSet.add(s.studentId))
    );

    if (studentSet.size > 0) {
      notifications.push(
        `📊 ${studentSet.size} students submitted assignments in the last 2 days.`
      );
    }

    res.json({ success: true, notifications });
  } catch (err) {
    console.error("❌ Volunteer notifications error:", err);
    res.status(500).json({ success: false });
  }
});

import WeeklySchedule from "../models/WeeklySchedule.js";

/* ===================== VOLUNTEER WEEKLY SCHEDULE ===================== */
router.get("/schedule", async (req, res) => {
  try {
    const schedules = await WeeklySchedule.find()
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      schedules
    });
  } catch (err) {
    console.error("Volunteer schedule error:", err);
    res.status(500).json({ success: false });
  }
});



// 🟦 VOLUNTEER RECENT ACTIVITY (LAST 2 DAYS ONLY)
// ------------------------------------------------------
router.get("/recent-activity/:volunteerId", async (req, res) => {
  try {
    const { volunteerId } = req.params;

    // ⏱️ last 2 days filter
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const assignments = await Assignment.find({
      volunteerId,
      createdAt: { $gte: twoDaysAgo },
    })
      .sort({ createdAt: -1 })
      .select("name createdAt");

    const materials = await Material.find({
      volunteerId,
      createdAt: { $gte: twoDaysAgo },
    })
      .sort({ createdAt: -1 })
      .select("title createdAt");

    let activities = [];

    assignments.forEach((a) => {
      activities.push({
        type: "assignment",
        message: `📘 Published new assignment: ${a.name}`,
        createdAt: a.createdAt,
      });
    });

    materials.forEach((m) => {
      activities.push({
        type: "material",
        message: `📁 Uploaded new material: ${m.title}`,
        createdAt: m.createdAt,
      });
    });

    // 🔀 sort by latest first
    activities.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      success: true,
      activities,
    });
  } catch (err) {
    console.error("❌ Recent activity error:", err);
    res.status(500).json({ success: false });
  }
});


router.get("/weekly-attendance", async (req, res) => {
  try {
    const { volunteerId, level, subject, weekStart, weekEnd } = req.query;

    if (!volunteerId || !level || !subject || !weekStart || !weekEnd) {
      return res.status(400).json({ message: "Missing query params" });
    }

    const getWeekDates = (start, end) => {
      const dates = [];
      let curr = new Date(start);
      const last = new Date(end);
      while (curr <= last) {
        dates.push(curr.toISOString().split("T")[0]);
        curr.setDate(curr.getDate() + 1);
      }
      return dates;
    };

    const dateList = getWeekDates(weekStart, weekEnd);

    const records = await Attendance.find({
      volunteerId,
      level: Number(level),
      subject,
      date: { $in: dateList },
    });

    // ---- SAME LOGIC AS BEFORE (aggregation) ----
    const dailyMap = {};
    const studentStats = {};

    records.forEach((day) => {
      if (!dailyMap[day.date]) {
        dailyMap[day.date] = { present: 0, absent: 0 };
      }

      (day.records || []).forEach((r) => {
        r.status === "Present"
          ? dailyMap[day.date].present++
          : dailyMap[day.date].absent++;

        if (!studentStats[r.studentId]) {
          studentStats[r.studentId] = {
            name: r.name,
            present: 0,
            total: 0,
          };
        }

        studentStats[r.studentId].total++;
        if (r.status === "Present") studentStats[r.studentId].present++;
      });
    });

    const weekly = dateList.map((d) => ({
      date: d,
      present: dailyMap[d]?.present || 0,
      absent: dailyMap[d]?.absent || 0,
    }));

    let topper = null;
    const weakStudents = [];

    Object.entries(studentStats).forEach(([id, s]) => {
      const score = Math.round((s.present / s.total) * 100);

      if (!topper || score > topper.score) {
        topper = { studentId: id, name: s.name, score };
      }

      if (score < 50) {
        weakStudents.push({
          studentId: id,
          name: s.name,
          reason: "Low attendance",
        });
      }
    });

    res.json({ weekly, topper, weakStudents });
  } catch (err) {
    console.error("❌ Weekly attendance error:", err);
    res.status(500).json({ message: err.message });
  }
});


router.get("/weekly-assignments", async (req, res) => {
  try {
    const { volunteerId, level, subject, weekStart, weekEnd } = req.query;

    if (!volunteerId || !level || !subject || !weekStart || !weekEnd) {
      return res.status(400).json({ message: "Missing query params" });
    }

    const assignments = await Assignment.find({
      volunteerId,
      level: Number(level),
      subject,
      createdAt: {
        $gte: new Date(weekStart),
        $lte: new Date(weekEnd),
      },
    });

    res.json({
      assignments: assignments.map((a) => ({
        name: a.name,
        date: a.createdAt.toISOString().split("T")[0],
      })),
    });
  } catch (err) {
    console.error("❌ Weekly assignment error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/weekly-report", async (req, res) => {
  try {
    // ---------------- SAFETY CHECK ----------------
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const {
      volunteerId,
      level,
      subject,
      weekStart,
      weekEnd,
      reportData,
      assignments,
      topperStudent,
      weakStudents,
    } = req.body;

    // ---------------- VALIDATION ----------------
    if (
      !volunteerId ||
      !level ||
      !subject ||
      !weekStart ||
      !weekEnd ||
      !Array.isArray(reportData)
    ) {
      return res.status(400).json({
        message: "Missing or invalid fields in weekly report",
      });
    }

    // ---------------- PREVENT DUPLICATE REPORTS ----------------
    const existing = await WeeklyReport.findOne({
      volunteerId,
      level,
      subject,
      weekStart,
      weekEnd,
    });

    if (existing) {
      return res.status(409).json({
        message: "Weekly report already submitted for this period",
      });
    }

    // ---------------- SAVE REPORT ----------------
    const report = await WeeklyReport.create({
      volunteerId,
      level,
      subject,
      weekStart,
      weekEnd,

      reportData: reportData.map((d) => ({
        date: d.date,
        presentCount: d.presentCount ?? 0,
        absentCount: d.absentCount ?? 0,
      })),

      assignments: assignments || [],
      topperStudent: topperStudent || null,
      weakStudents: weakStudents || [],
    });

    res.status(201).json({
      success: true,
      message: "Weekly report submitted successfully!",
      reportId: report._id,
    });
  } catch (err) {
    console.error("❌ Weekly report error:", err);
    res.status(500).json({
      message: "Failed to submit weekly report",
      error: err.message,
    });
  }
});

export default router;
