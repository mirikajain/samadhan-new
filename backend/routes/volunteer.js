import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";

import Attendance from "../models/Attendance.js";
import Assignment from "../models/Assignment.js";
import Material from "../models/Material.js";
import WeeklyReport from "../models/WeeklyReport.js";

const router = express.Router();

/* ------------------------------------------------------
   🟦 DUMMY DATA
------------------------------------------------------ */
const dummyStudents = [
  { _id: "stu001", name: "Aarav Mehta", level: 1, subjects: ["Math", "Science"] },
  { _id: "stu002", name: "Diya Sharma", level: 1, subjects: ["Math"] },
  { _id: "stu003", name: "Karan Patel", level: 1, subjects: ["Science"] },
  { _id: "stu004", name: "Priya Kapoor", level: 1, subjects: ["Math", "Science"] },
];

/* ------------------------------------------------------
   🟦 GET STUDENTS
------------------------------------------------------ */
router.get("/students", async (req, res) => {
  const { level, subject } = req.query;

  if (!level || !subject)
    return res.status(400).json({ message: "Level and subject required" });

  try {
    console.log("📘 Fetching students:", { level, subject });

    const fromDummy = dummyStudents.filter(
      (s) => s.level == level && s.subjects.includes(subject)
    );

    let attendanceRecords = [];
    try {
      attendanceRecords = await Attendance.find({ level, subject });
    } catch (err) {
      console.error("⚠ Error reading Attendance DB:", err);
    }

    const fromAttendance = [];

    attendanceRecords.forEach((entry) => {
      if (!entry.records) return;

      entry.records.forEach((r) => {
        if (!fromAttendance.some((x) => x._id === r.studentId)) {
          fromAttendance.push({
            _id: r.studentId,
            name: r.name,
            level: level,
            subjects: [subject],
          });
        }
      });
    });

    const merged = [...fromDummy];

    fromAttendance.forEach((stu) => {
      if (!merged.some((x) => x._id === stu._id)) merged.push(stu);
    });

    console.log("✔ Final students:", merged);

    res.json({ students: merged });

  } catch (err) {
    console.error("❌ Students Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------------------------------------------
   🟧 SAVE ATTENDANCE
------------------------------------------------------ */
router.post("/attendance", async (req, res) => {
  try {
    const { volunteerId, level, subject, date, records } = req.body;

    console.log("📥 Attendance received:", req.body);

    if (!volunteerId || !level || !subject || !date || !records)
      return res.status(400).json({ message: "Missing required fields" });

    if (!Array.isArray(records) || records.length === 0)
      return res.status(400).json({ message: "Attendance empty" });

    const newAttendance = await Attendance.create({
      volunteerId,
      level,
      subject,
      date,
      records,
    });

    console.log("✅ Attendance saved:", newAttendance._id);
    res.json({
      success: true,
      message: "Attendance saved successfully!",
      attendanceId: newAttendance._id,
    });

  } catch (err) {
    console.error("❌ Error saving attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ------------------------------------------------------
   🟪 SAVE ASSIGNMENT
------------------------------------------------------ */
router.post("/assignment", async (req, res) => {
  try {
    console.log("📥 Received body:", req.body);

    const { volunteerId, level, subject, name, mcqs } = req.body;

    if (!volunteerId || !level || !subject || !name || !mcqs)
      return res.status(400).json({ message: "Missing required fields!" });

    const newAssignment = new Assignment({
      volunteerId,
      level: Number(level),
      subject,
      name,
      mcqs,
      createdAt: new Date(),
    });

    const saved = await newAssignment.save();

    console.log("✔ Assignment saved successfully!");
    res.json({
      success: true,
      message: "Assignment saved successfully!",
      assignment: saved,
    });

  } catch (err) {
    console.log("❌ ERROR WHILE SAVING ASSIGNMENT:");
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to save assignment" });
  }
});

/* ------------------------------------------------------
   🟩 VOLUNTEER — UPLOAD STUDY MATERIAL 
------------------------------------------------------ */

// make folder
const uploadDir = path.join(process.cwd(), "uploads", "materials");
fs.mkdirSync(uploadDir, { recursive: true });

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = file.originalname.replace(ext, "").replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});

const upload = multer({ storage });

router.post("/upload-material", upload.single("file"), async (req, res) => {
  try {
    console.log("📥 Material upload body:", req.body);
    console.log("📄 File:", req.file);

    if (!req.file)
      return res.status(400).json({ message: "File is required" });

    const { volunteerId, title, description, level, subject } = req.body;

    if (!volunteerId || !title || !level || !subject)
      return res.status(400).json({ message: "Missing required fields" });

    const fileUrl = `/uploads/materials/${req.file.filename}`;

    const savedMaterial = await Material.create({
      volunteerId,
      title,
      description,
      level: Number(level),
      subject,
      fileUrl,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    console.log("💾 Material saved:", savedMaterial._id);

    res.json({
      success: true,
      message: "Material uploaded successfully!",
      material: savedMaterial,
    });

  } catch (err) {
    console.log("❌ Error uploading material:", err);
    res.status(500).json({ message: "Server error while uploading material" });
  }
});

// 🟩 WEEKLY ATTENDANCE SUMMARY
router.get("/weekly-attendance", async (req, res) => {
  try {
    const { level, subject, dates } = req.query;

    if (!level || !subject || !dates)
      return res.status(400).json({ message: "Missing fields" });

    const weekDates = JSON.parse(dates); // array of 7 dates YYYY-MM-DD

    const weekly = [];

    for (let date of weekDates) {
      const dayRecords = await Attendance.find({ level, subject, date });

      let present = 0;
      let absent = 0;

      dayRecords.forEach((att) => {
        att.records.forEach((r) => {
          if (r.status === "Present") present++;
          else absent++;
        });
      });

      weekly.push({ date, present, absent });
    }

    res.json({ success: true, weekly });

  } catch (err) {
    console.log("❌ Weekly Attendance Error:", err);
    res.status(500).json({ success: false });
  }
});

// 🟦 WEEKLY ASSIGNMENTS SUMMARY
router.get("/weekly-assignments", async (req, res) => {
  try {
    const { level, subject, dates } = req.query;

    if (!level || !subject || !dates)
      return res.status(400).json({ message: "Missing fields" });

    const weekDates = JSON.parse(dates);

    const assignments = await Assignment.find({
      level,
      subject,
      createdAt: {
        $gte: new Date(weekDates[0]),
        $lte: new Date(weekDates[6])
      }
    });

    const formatted = assignments.map((a) => ({
      name: a.name,
      date: a.createdAt.toISOString().split("T")[0],
    }));

    res.json({ success: true, assignments: formatted });

  } catch (err) {
    console.log("❌ Weekly Assignments Error:", err);
    res.status(500).json({ success: false });
  }
});

router.post("/weekly-report", async (req, res) => {
  try {
    const saved = await WeeklyReport.create(req.body);
    res.json({ success: true, message: "Weekly report submitted!", saved });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error saving report" });
  }
});


export default router;
