import express from "express";
import Student from "../models/Student.js";
import Volunteer from "../models/Volunteer.js";
import Donation from "../models/Donation.js";

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
    const { name, email, centreId, phone, level, subjects } = req.body;

    // Validation
    if (!name || !email || !centreId || !phone || !level || !subjects) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    // Create volunteer
    const volunteer = new Volunteer({
      name,
      email,
      centreId,
      phone,
      level,       // NEW
      subjects,    // NEW (Array of subjects)
    });

    await volunteer.save();

    res.json({
      message: "Volunteer added successfully!",
      volunteer,
    });

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

    const report = await WeeklyReport.findOne({
      level: Number(level),
      subject: { $regex: new RegExp(`^${subject}$`, "i") },
      weekStart: start,
      weekEnd: end,
    });

    if (!report) {
      return res.json({ success: false, weekly: [] });
    }

    // Convert attendance format for chart/table
    const formattedWeekly = report.reportData.map((d) => ({
      date: d.date,
      present: d.presentCount,
      absent: d.absentCount,
    }));

    return res.json({
      success: true,

      // 🔹 Attendance Table + Chart
      weekly: formattedWeekly,

      // 🔹 Assignments List
      assignments: report.assignments || [],

      // 🔹 Topper
      topperStudent: report.topperStudent || null,

      // 🔹 Weak Students
      weakStudents: report.weakStudents || [],

      // 🔹 Volunteer who submitted
      volunteerId: report.volunteerId || null,

      // (optional: return full report for debugging)
      fullReport: report,
    });

  } catch (err) {
    console.error("Weekly Report DB Error:", err);
    return res.status(500).json({ success: false });
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
