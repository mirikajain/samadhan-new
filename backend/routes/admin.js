import express from "express";
import bcrypt from "bcryptjs";
import Donation from "../models/Donation.js";
import User from "../models/User.js";
import WeeklyReport from "../models/WeeklyReport.js";

// ----------------------
// PHOTO UPLOAD SETUP
// ----------------------
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ensure folder exists
const uploadDir = "uploads/donations";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `donation-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });


// ======================================================
// ADD STUDENT
// ======================================================
router.post("/add-student", async (req, res) => {
  try {
    const { name, centreId, level, subjects } = req.body;

    const generatedPassword = name.toLowerCase().replace(/\s+/g, "") + "123";
    const hashed = await bcrypt.hash(generatedPassword, 10);

    const studentUser = new User({
      username: name,
      password: hashed,
      role: "student",
      centreId,
      levels: [Number(level)],
      subjects: subjects.length > 0 ? subjects : ["General"],
    });

    await studentUser.save();

    res.json({
      message: "Student added successfully!",
      student: studentUser,
      loginDetails: {
        username: name,
        password: generatedPassword,
      },
    });
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({ message: "Failed to add student" });
  }
});


// ======================================================
// ADD VOLUNTEER
// ======================================================
router.post("/add-volunteer", async (req, res) => {
  try {
    const { name, email, centreId, phone, level, subjects } = req.body;

    const generatedPassword = name.toLowerCase().replace(/\s+/g, "") + "123";

    const volunteerUser = await User.create({
      username: name,
      password: generatedPassword,
      role: "volunteer",
      email,
      centreId,
      levels: [Number(level)],
      subjects: subjects.length > 0 ? subjects : ["General"],
    });

    res.json({
      success: true,
      message: "Volunteer added successfully!",
      volunteer: volunteerUser,
      loginDetails: {
        username: name,
        password: generatedPassword,
      },
    });
  } catch (err) {
    console.error("Error adding volunteer:", err);
    res.status(500).json({ message: "Failed to add volunteer" });
  }
});


// ======================================================
// WEEKLY ATTENDANCE REPORT
// ======================================================
router.get("/weekly-attendance-db", async (req, res) => {
  try {
    const { level, subject, startDate } = req.query;

    if (!level || !subject || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Missing level, subject or startDate",
      });
    }

    const start = startDate.trim();
    const endDateObj = new Date(start);
    endDateObj.setDate(endDateObj.getDate() + 6);

    const end = endDateObj.toISOString().split("T")[0];

    const report = await WeeklyReport.findOne({
      level: Number(level),
      subject: subject,
      weekStart: start,
      weekEnd: end,
    });

    if (!report) return res.json({ success: false, weekly: [] });

    const weeklyFormatted = report.reportData.map((d) => ({
      date: d.date,
      present: d.presentCount,
      absent: d.absentCount,
    }));

    return res.json({
      success: true,
      weekly: weeklyFormatted,
      assignments: report.assignments || [],
      topperStudent: report.topperStudent || null,
      weakStudents: report.weakStudents || [],
      volunteerId: report.volunteerId,
      fullReport: report,
    });
  } catch (err) {
    console.error("Weekly Report DB Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


// ======================================================
// FILTER DONATIONS
// ======================================================
router.post("/filter-donations", async (req, res) => {
  try {
    const { filterType, date, month, year } = req.body;
    let query = {};

    if (filterType === "date") {
      if (!date) return res.json({ success: false, message: "Date required" });

      const selected = new Date(date);
      const next = new Date(selected);
      next.setDate(selected.getDate() + 1);

      query.date = { $gte: selected, $lt: next };
    }

    else if (filterType === "month") {
      if (!month || !year)
        return res.json({ success: false, message: "Month and Year required" });

      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);

      query.date = { $gte: start, $lt: end };
    }

    else if (filterType === "year") {
      if (!year)
        return res.json({ success: false, message: "Year required" });

      const start = new Date(year, 0, 1);
      const end = new Date(year + 1, 0, 1);

      query.date = { $gte: start, $lt: end };
    }

    else {
      return res.json({ success: false, message: "Invalid filterType" });
    }

    const donations = await Donation.find(query).sort({ date: -1 }).lean();

    return res.json({
      success: donations.length > 0,
      donations,
      totalRecords: donations.length,
    });

  } catch (err) {
    console.error("Filter Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});


// ======================================================
// UPLOAD PHOTO FOR DONATION  (IMPORTANT)
// ======================================================
router.post("/donation/:id/photo", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "No file uploaded" });
    }

    const photoUrl = `${req.protocol}://${req.get("host")}/uploads/donations/${req.file.filename}`;

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { photoUrl },
      { new: true }
    ).lean();

    if (!donation) {
      return res.json({ success: false, message: "Donation not found" });
    }

    return res.json({
      success: true,
      donation,
      message: "Photo uploaded successfully",
    });

  } catch (err) {
    console.error("Upload Error:", err);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
});


export default router;
