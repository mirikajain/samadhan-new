import express from "express";
import bcrypt from "bcryptjs";
import Donation from "../models/Donation.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/add-student", async (req, res) => {
  try {
    const { name, centreId, level, subjects } = req.body;

    // Auto-generate password for the student
    const generatedPassword = name.toLowerCase().replace(/\s+/g, "") + "123";
    const hashed = await bcrypt.hash(generatedPassword, 10);

    const studentUser = new User({
      username: name,
      password: hashed,
      role: "student",
      centreId,
      levels: [Number(level)],     // convert level -> levels[]
      subjects: subjects.length > 0 ? subjects : ["General"]
    });

    await studentUser.save();

    res.json({
      message: "Student added successfully!",
      student: studentUser,
      loginDetails: {
        username: name,
        password: generatedPassword,
      }
    });

  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({ message: "Failed to add student" });
  }
});



// ADD VOLUNTEER
router.post("/add-volunteer", async (req, res) => {
  try {
    const { name, email, centreId, phone, level, subjects } = req.body;

    // Auto-generate a password for the volunteer
    const generatedPassword = name.toLowerCase().replace(/\s+/g, "") + "123";

    // Create volunteer in User model
    const volunteerUser = await User.create({
      username: name,
      password: generatedPassword,
      role: "volunteer",
      email,
      centreId,
      levels: [Number(level)],
      subjects: subjects.length > 0 ? subjects : ["General"],
      // phone: phone  ← only if phone is added in your User schema
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

import WeeklyReport from "../models/WeeklyReport.js";

router.get("/weekly-attendance-db", async (req, res) => {
  try {
    const { level, subject, startDate } = req.query;

    if (!level || !subject || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Missing level, subject or startDate",
      });
    }

    // Week start & end calculation
    const start = startDate.trim();
    const endDateObj = new Date(start);
    endDateObj.setDate(endDateObj.getDate() + 6);

    const end = endDateObj.toISOString().split("T")[0];

    // Fetch weekly report from DB
    const report = await WeeklyReport.findOne({
      level: Number(level),
      subject: subject,
      weekStart: start,
      weekEnd: end,
    });

    if (!report) {
      return res.json({ success: false, weekly: [] });
    }

    // Format attendance for chart
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

      fullReport: report, // optional
    });
  } catch (err) {
    console.error("Weekly Report DB Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});



router.post("/filter-donations", async (req, res) => {
  try {
    const { filterType, date, month, year } = req.body;

    let query = {};

    // ------------------------
    // FILTER: BY DATE
    // ------------------------
    if (filterType === "date") {
      if (!date) {
        return res.json({ success: false, message: "Date required" });
      }

      const selectedDate = new Date(date);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + 1);

      query.date = { $gte: selectedDate, $lt: nextDate };
    }

    // ------------------------
    // FILTER: BY MONTH
    // ------------------------
    else if (filterType === "month") {
      if (!month || !year) {
        return res.json({ success: false, message: "Month and Year required" });
      }

      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1); // next month

      query.date = { $gte: start, $lt: end };
    }

    // ------------------------
    // FILTER: BY YEAR
    // ------------------------
    else if (filterType === "year") {
      if (!year) {
        return res.json({ success: false, message: "Year required" });
      }

      const start = new Date(year, 0, 1);
      const end = new Date(year + 1, 0, 1);

      query.date = { $gte: start, $lt: end };
    }

    else {
      return res.json({ success: false, message: "Invalid filterType" });
    }

    // Fetch donations
    const donations = await Donation.find(query).sort({ date: -1 });

    if (donations.length === 0) {
      return res.json({ success: false, donations: [] });
    }

    return res.json({ success: true, donations });

  } catch (error) {
    console.error("Filter Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
export default router;
