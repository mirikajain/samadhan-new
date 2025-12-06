import mongoose from "mongoose";

const WeeklyReportSchema = new mongoose.Schema({
  volunteerId: String,
  level: Number,
  subject: String,

  weekStart: String,
  weekEnd: String,

  // Attendance records
  reportData: [
    {
      date: String,
      presentCount: Number,
      absentCount: Number
    }
  ],

  // Assignments
  assignments: [
    {
      name: String,
      date: String
    }
  ],

  // ⭐ NEW: Topper student (only 1)
  topperStudent: {
    name: String,
    score: Number,       // or percentage
    studentId: String
  },

  // ⭐ NEW: Weak students list
  weakStudents: [
    {
      name: String,
      reason: String,    // e.g., “Low attendance”, “No assignment”, etc.
      studentId: String
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.WeeklyReport ||
  mongoose.model("WeeklyReport", WeeklyReportSchema);
