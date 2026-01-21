import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// Save booking
router.post("/save", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
