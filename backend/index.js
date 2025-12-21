import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import authRoutes from "./routes/auth.js";
import volunteerRoutes from "./routes/volunteer.js";
import adminRoutes from "./routes/admin.js";
import donorRoutes from "./routes/donor.js"
import studentRoutes from "./routes/student.js";
import path from "path";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.use(express.static(path.join(process.cwd(), "frontend/public")));

app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/student", studentRoutes);


// Test route
app.get("/", (req, res) => {
  res.json({ message: "🌿 Samadhan API is running" });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
