import express from "express";
import Bus from "../models/Bus.js";

const router = express.Router();

/* ================= SEARCH BUSES ================= */
router.get("/search", async (req, res) => {
  try {
    const buses = await Bus.find(req.query);
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ================= LOCK SEATS ================= */
router.post("/lock-seat", async (req, res) => {
  const { busNumber, seats } = req.body;

  if (!busNumber || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const now = new Date();
  const LOCK_DURATION = 10 * 60 * 1000;
  const lockUntil = new Date(now.getTime() + LOCK_DURATION);

  try {
    const result = await Bus.findOneAndUpdate(
      {
        busNumber,
        "seats.seatNumber": { $all: seats },
        "seats.status": "available"
      },
      {
        $set: {
          "seats.$[s].status": "waiting",
          "seats.$[s].lockedUntil": lockUntil
        }
      },
      {
        arrayFilters: [{ "s.seatNumber": { $in: seats }, "s.status": "available" }],
        new: true
      }
    );

    if (!result) {
      return res.status(409).json({ message: "One or more seats already locked" });
    }

    res.json({
      message: "Seats locked successfully",
      expiresAt: lockUntil
    });
  } catch (err) {
    console.error("LOCK SEAT ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
/* ================= CONFIRM BOOKING ================= */
router.post("/confirm-booking", async (req, res) => {
  const { busNumber, seats } = req.body;

  if (!busNumber || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const bus = await Bus.findOne({ busNumber });
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    bus.seats = bus.seats.map((seat) => {
      if (seats.includes(seat.seatNumber)) {
        seat.status = "booked";
        seat.lockedUntil = null;
      }
      return seat;
    });

    await bus.save();
    res.json({ message: "Booking confirmed" });
  } catch (err) {
    console.error("CONFIRM BOOKING ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ================= RELEASE SEATS (PAYMENT FAIL) ================= */
router.post("/release-seat", async (req, res) => {
  const { busNumber, seats } = req.body;

  if (!busNumber || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const bus = await Bus.findOne({ busNumber });
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    bus.seats = bus.seats.map((seat) => {
      if (seats.includes(seat.seatNumber)) {
        seat.status = "available";
        seat.lockedUntil = null;
      }
      return seat;
    });

    await bus.save();
    res.json({ message: "Seats released" });
  } catch (err) {
    console.error("RELEASE SEAT ERROR:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

export default router;
