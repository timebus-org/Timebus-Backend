import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import busRoutes from "./routes/busRoutes.js";
import paymentRoutes from "./routes/payment.js";  // file name EXACT?

import ticketRoutes from "./routes/ticketRoutes.js";
import bookingsRoute from "./routes/bookings.js";
import couponRoutes from "./routes/coupons.js";
import cabRoutes from "./routes/cab.js";
import { startSeatReleaseCron } from "./cron/seatUnlock.Cron.js";

const app = express();

/* ✅ CORS FIX (VERY IMPORTANT) */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));




app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚌 TimeBus Backend running");
});

/* ===== ROUTES ===== */
app.use("/api/buses", busRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/bookings", bookingsRoute);
app.use("/api/coupons", couponRoutes);
app.use("/api", ticketRoutes);
app.use("/api/cab", cabRoutes);

/* ===== DB + SERVER ===== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    startSeatReleaseCron();

    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => {
    console.error("❌ Mongo error:", err);
    process.exit(1);
  });
