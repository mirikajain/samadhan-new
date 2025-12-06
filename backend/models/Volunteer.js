import mongoose from "mongoose";

const VolunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  centreId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },

  // NEW FIELDS
  level: { type: Number, required: true },
  subjects: { type: [String], required: true },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Volunteer ||
  mongoose.model("Volunteer", VolunteerSchema);

