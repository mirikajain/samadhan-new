import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema({
  volunteerId: { type: String, required: true },

  title: { type: String, required: true },
  description: { type: String },

  level: { type: Number, required: true },
  subject: { type: String, required: true },

  fileUrl: { type: String, required: true },
  filename: { type: String, required: true },
  mimeType: { type: String },
  size: { type: Number },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Material || mongoose.model("Material", MaterialSchema);
