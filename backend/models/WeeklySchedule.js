import mongoose from "mongoose";

const WeeklyScheduleSchema = new mongoose.Schema({
  date: String,          // YYYY-MM-DD
  level: Number,         // class
  subject: String,
  time: String,          // e.g. 10:00 - 11:00
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("WeeklySchedule", WeeklyScheduleSchema);
