import express from "express";
import Bus from "../models/Bus.js";

const router = express.Router();

/* ================= BOOK SEATS ================= */
router.post("/book-seats", async (req, res) => {
  try {
    const { busId, selectedSeats, passengers, contact, totalPrice } = req.body;

    if (!busId || !selectedSeats?.length || !passengers?.length || !contact || !totalPrice) {
      return res.status(400).json({ error: "All booking details are required" });
    }

    // 1️⃣ Fetch bus to check seat availability
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ error: "Bus not found" });

    const unavailableSeats = bus.seats
      .filter((s) => selectedSeats.includes(s.seatNumber) && s.locked)
      .map((s) => s.seatNumber);

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        error: "Some seats are already booked",
        seats: unavailableSeats,
      });
    }

    // 2️⃣ Lock the seats
    await Bus.updateOne(
      { _id: busId },
      {
        $set: {
          "seats.$[s].locked": true,
          "seats.$[s].lockedAt": new Date(),
          "seats.$[s].passenger": passengers,
        },
      },
      { arrayFilters: [{ "s.seatNumber": { $in: selectedSeats } }] }
    );

    res.json({
      busId,
      selectedSeats,
      passengers,
      contact,
      totalPrice,
      busName: bus.name,
      busType: bus.type,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      duration: bus.duration,
      source: bus.source,
      destination: bus.destination,
    });
  } catch (err) {
    console.error("Seat booking error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= RELEASE SEATS ================= */
router.post("/release-seats", async (req, res) => {
  try {
    const { busId, selectedSeats } = req.body;
    if (!busId || !selectedSeats?.length) {
      return res.status(400).json({ error: "Bus ID and seat numbers required" });
    }

    await Bus.updateOne(
      { _id: busId },
      {
        $set: {
          "seats.$[s].locked": false,
          "seats.$[s].lockedAt": null,
          "seats.$[s].passenger": null,
        },
      },
      { arrayFilters: [{ "s.seatNumber": { $in: selectedSeats } }] }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Release seats error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
