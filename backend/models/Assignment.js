import mongoose from "mongoose";

const mcqSchema = new mongoose.Schema({
  question: String,
  optionA: String,
  optionB: String,
  optionC: String,
  optionD: String,
  correct: String,
});

const submissionSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  score: Number,
  total: Number,
  submittedAt: { type: Date, default: Date.now },
});

const assignmentSchema = new mongoose.Schema({
  volunteerId: String,
  level: Number,
  subject: String,
  name: String,
  mcqs: [mcqSchema],
  submissions: [submissionSchema], // ✅ IMPORTANT
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Assignment", assignmentSchema);
