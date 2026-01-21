import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import busRoutes from "./routes/busRoutes.js";
import paymentRoutes from "./routes/payment.js";
import { startSeatReleaseCron } from "./cron/releaseSeats.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import bookingsRoute from "./routes/bookings.js";
import couponRoutes from "./routes/coupons.js"; // 🔴 ADDED

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/buses", busRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/bookings", bookingsRoute);
app.use("/api/coupons", couponRoutes); // 🔴 ADDED
app.use("/api", ticketRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Start cron job AFTER DB connection
    startSeatReleaseCron();
    console.log("⏱️ Seat release cron job started");

    // Start server
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error("❌ Mongo error:", err));
