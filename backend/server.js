import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminAuthRoute from "./routes/adminAuthRoute.js";
import adminDashboard from "./routes/adminDashboard.js";
import swapRequestRoute from "./routes/swapRequestRoute.js"
import authMiddleware from "./middlewear/auth.js";
import verifyToken from "./middlewear/verifyToken.js";


dotenv.config();

const app = express();
app.use(express.json()); // Middleware for parsing JSON
app.use(cors()); // Allows requests from frontend

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI) 
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

app.use("/api/auth", authRoutes); // Authentication Routes
app.use("/api/users", userRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminAuthRoute);
app.use("/api/admin/admin-dashboard", adminDashboard) 
app.use("/api/swap", verifyToken, swapRequestRoute)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));