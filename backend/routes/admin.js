import express from "express";
import Student from "../models/Student.js";
import Volunteer from "../models/Volunteer.js";

const router = express.Router();

router.post("/add-student", async (req, res) => {
  try {
    const { name, centreId, level, subjects } = req.body;

    const student = new Student({
      name,
      centreId,
      level,
      subjects,
    });

    await student.save();

    res.json({ message: "Student added successfully!", student });
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({ message: "Failed to add student" });
  }
});



// ADD VOLUNTEER
router.post("/add-volunteer", async (req, res) => {
  try {
    const { name, email, centreId, phone } = req.body;

    const volunteer = new Volunteer({
      name,
      email,
      centreId,
      phone,
    });

    await volunteer.save();

    res.json({ message: "Volunteer added successfully!", volunteer });
  } catch (err) {
    console.error("Error adding volunteer:", err);
    res.status(500).json({ message: "Failed to add volunteer" });
  }
});

import WeeklyReport from "../models/WeeklyReport.js";

// GET WEEKLY REPORTS BY LEVEL + SUBJECT

router.get("/weekly-attendance-db", async (req, res) => {
  try {
    const { level, subject, startDate } = req.query;

    if (!level || !subject || !startDate) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const start = startDate.trim();
    const endDateObj = new Date(start);
    endDateObj.setDate(endDateObj.getDate() + 6);
    const end = endDateObj.toISOString().split("T")[0];

    console.log("Searching DB report:", { level, subject, start, end });

    const report = await WeeklyReport.findOne({
      level: Number(level),
      subject: { $regex: new RegExp(`^${subject}$`, "i") },
      weekStart: start,
      weekEnd: end,
    });

    console.log("DB Result:", report);

    if (!report) {
      return res.json({ success: false, weekly: [] });
    }

    // ⭐ FIXED: Use correct DB fields
    const formatted = report.reportData.map((d) => ({
      date: d.date,
      present: d.presentCount,
      absent: d.absentCount,
    }));
    console.log("DB Result:", report);


    return res.json({ success: true, weekly: formatted });

  } catch (err) {
    console.error("Weekly Report DB Error:", err);
    return res.status(500).json({ success: false });
  }
});

export default router;
