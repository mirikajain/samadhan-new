import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  centreId: { type: String, required: true },
  level: { type: Number, required: true },
  subjects: { type: [String], required: true },
});

export default mongoose.model("Student", studentSchema);
