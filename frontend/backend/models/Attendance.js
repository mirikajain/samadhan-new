import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    volunteerId: {
      type: String,
      required: true,
    },

    level: {
      type: Number,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    date: {
      type: String,   // frontend sends YYYY-MM-DD
      required: true,
    },

    records: [
      {
        studentId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["Present", "Absent"],
          default: "Absent",
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
