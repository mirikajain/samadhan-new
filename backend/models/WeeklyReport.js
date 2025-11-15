import mongoose from "mongoose";

const WeeklyReportSchema = new mongoose.Schema({
  volunteerId: String,
  level: Number,
  subject: String,
  weekStart: String,   // YYYY-MM-DD
  weekEnd: String,

  reportData: Array,   // [{date, present, absent}]
  assignments: Array,  // [{name, date}]

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.WeeklyReport ||
  mongoose.model("WeeklyReport", WeeklyReportSchema);
