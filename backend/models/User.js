import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "donor", "volunteer", "student"], // ✅ includes student
    default: "volunteer",
  },
  centreId: { type: String },
  levels: { type: [Number], default: [0] },
  subjects: { type: [String], default: ["General"] }
});

export default mongoose.model("User", userSchema);
