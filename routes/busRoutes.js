import express from "express";
import Bus from "../models/Bus.js";

const router = express.Router();

// --- Search buses by busNumber OR from/to/date ---
router.get("/search", async (req, res) => {
  const { busNumber, from, to, date } = req.query;

  let query = {};

  if (busNumber) query.busNumber = busNumber;
  if (from) query.from = new RegExp(`^${from}$`, "i"); // case-insensitive
  if (to) query.to = new RegExp(`^${to}$`, "i");       // case-insensitive
  if (date) query.date = date;

  try {
    const buses = await Bus.find(query);
    res.json(buses); // always return array
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// --- Lock seats for 5 minutes ---
router.post("/lock-seat", async (req, res) => {
  const { busNumber, seats } = req.body;

  if (!busNumber || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const bus = await Bus.findOne({ busNumber });
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Validate seats availability
    for (const seatNo of seats) {
      const seat = bus.seats.find(s => s.seatNumber === seatNo);
      if (!seat || seat.status !== "available") {
        return res
          .status(409)
          .json({ message: `Seat ${seatNo} not available` });
      }
    }

    const lockUntil = new Date(Date.now() + 5 * 60 * 1000);

    // Atomic update
    await Bus.updateOne(
      { busNumber },
      {
        $set: {
          "seats.$[seat].status": "waiting",
          "seats.$[seat].lockedUntil": lockUntil
        }
      },
      {
        arrayFilters: [
          { "seat.seatNumber": { $in: seats } }
        ]
      }
    );

    res.json({
      message: "Seats locked for 5 minutes",
      expiresAt: lockUntil
    });

  } catch (err) {
    console.error("LOCK SEAT ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- Confirm booking ---
router.post("/confirm-booking", async (req, res) => {
  const { busNumber, seats } = req.body;

  if (!busNumber || !seats?.length) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const bus = await Bus.findOne({ busNumber });
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    bus.seats = bus.seats.map(seat => {
      if (seats.includes(seat.seatNumber)) {
        seat.status = "booked";
        seat.lockedUntil = null;
      }
      return seat;
    });

    await bus.save();
    res.json({ message: "Booking confirmed" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// --- Get bus by busNumber ---
router.get("/:busNumber", async (req, res) => {
  const { busNumber } = req.params;

  try {
    const bus = await Bus.findOne({ busNumber });
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
