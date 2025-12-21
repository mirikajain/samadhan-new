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
// WEEKLY ATTENDANCE REPORT (WITH VOLUNTEER NAME ✅)
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
      subject,
      weekStart: start,
      weekEnd: end,
    });

    if (!report) return res.json({ success: false, weekly: [] });

    const weeklyFormatted = report.reportData.map((d) => ({
      date: d.date,
      present: d.presentCount,
      absent: d.absentCount,
    }));

    // 🔥 FETCH VOLUNTEER NAME
    let volunteerName = "";
    if (report.volunteerId) {
      const volunteer = await User.findById(report.volunteerId).select("username");
      volunteerName = volunteer?.username || "";
    }

    return res.json({
      success: true,
      weekly: weeklyFormatted,
      assignments: report.assignments || [],
      topperStudent: report.topperStudent || null,
      weakStudents: report.weakStudents || [],
      volunteerId: report.volunteerId,
      volunteerName, // ✅ SENT TO FRONTEND
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
      const selected = new Date(date);
      const next = new Date(selected);
      next.setDate(selected.getDate() + 1);
      query.date = { $gte: selected, $lt: next };
    } 
    else if (filterType === "month") {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      query.date = { $gte: start, $lt: end };
    } 
    else if (filterType === "year") {
      const start = new Date(year, 0, 1);
      const end = new Date(year + 1, 0, 1);
      query.date = { $gte: start, $lt: end };
    }

    const donations = await Donation.find(query).sort({ date: -1 }).lean();

    res.json({
      success: donations.length > 0,
      donations,
      totalRecords: donations.length,
    });

  } catch (err) {
    console.error("Filter Error:", err);
    res.status(500).json({ success: false });
  }
});


// ======================================================
// UPLOAD DONATION PHOTO
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

    res.json({
      success: true,
      donation,
      message: "Photo uploaded successfully",
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false });
  }
});


// ======================================================
// RECENT ACTIVITY
// ======================================================
router.get("/recent-activity", async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activities = [];

    const students = await User.find({
      role: "student",
      createdAt: { $gte: sevenDaysAgo },
    });

    students.forEach((s) =>
      activities.push({
        message: `👧 Student added: ${s.username}`,
        createdAt: s.createdAt,
      })
    );

    const volunteers = await User.find({
      role: "volunteer",
      createdAt: { $gte: sevenDaysAgo },
    });

    volunteers.forEach((v) =>
      activities.push({
        message: `🙋 Volunteer added: ${v.username}`,
        createdAt: v.createdAt,
      })
    );

    const reports = await WeeklyReport.find({
      createdAt: { $gte: sevenDaysAgo },
    });

    reports.forEach((r) =>
      activities.push({
        message: `🧾 Weekly report submitted (Class ${r.level} – ${r.subject})`,
        createdAt: r.createdAt,
      })
    );

    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      activities: activities.slice(0, 10),
    });

  } catch (err) {
    console.error("Recent activity error:", err);
    res.status(500).json({ success: false });
  }
});


// ======================================================
// WEEKLY SCHEDULE
// ======================================================
import WeeklySchedule from "../models/WeeklySchedule.js";

router.post("/schedule", async (req, res) => {
  try {
    const { date, level, subject, time } = req.body;

    const saved = await WeeklySchedule.create({
      date,
      level: Number(level),
      subject,
      time,
    });

    res.json({ success: true, schedule: saved });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.get("/schedule", async (req, res) => {
  try {
    const schedules = await WeeklySchedule.find().sort({ date: 1, time: 1 });
    res.json({ success: true, schedules });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ======================================================
// 🔔 REAL NOTIFICATIONS (FROM DB)
// ======================================================
router.get("/notifications", async (req, res) => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const notifications = [];

    // 1️⃣ WEEKLY REPORTS SUBMITTED
    const reports = await WeeklyReport.find({
      createdAt: { $gte: twoDaysAgo },
    })
      .populate("volunteerId", "username")
      .sort({ createdAt: -1 });

    reports.forEach((r) => {
      notifications.push({
        message: `🧾 ${r.volunteerId?.username || "Volunteer"} submitted weekly report (Class ${r.level} – ${r.subject})`,
        createdAt: r.createdAt,
        type: "report",
      });
    });

    // 2️⃣ NEW DONATIONS
    const donations = await Donation.find({
      createdAt: { $gte: twoDaysAgo },
    }).sort({ createdAt: -1 });

    donations.forEach((d) => {
      notifications.push({
        message: `💰 New donation received: ₹${d.amount}`,
        createdAt: d.createdAt,
        type: "donation",
      });
    });

    // 3️⃣ NEW USERS ADDED
    const users = await User.find({
      createdAt: { $gte: twoDaysAgo },
      role: { $in: ["student", "volunteer"] },
    }).sort({ createdAt: -1 });

    users.forEach((u) => {
      notifications.push({
        message: `👤 New ${u.role} added: ${u.username}`,
        createdAt: u.createdAt,
        type: "user",
      });
    });

    // 🔥 SORT ALL TOGETHER (LATEST FIRST)
    notifications.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      success: true,
      notifications: notifications.slice(0, 10),
    });
  } catch (err) {
    console.error("Notifications error:", err);
    res.status(500).json({ success: false });
  }
});


export default router;
