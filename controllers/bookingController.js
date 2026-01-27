import Bus from "../models/Bus.js";

/**
 * Lock seats for 10 minutes
 */
export const lockSeat = async (req, res) => {
  const { busNumber, seats } = req.body;

  if (!busNumber || !seats?.length) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const bus = await Bus.findOne({ busNumber });
    if (!bus) return res.status(404).json({ error: "Bus not found" });

    const now = new Date();

    // Check if any seat is already booked or locked
    const alreadyLocked = seats.filter(seatNo => {
      const seat = bus.seats.find(s => s.seatNumber === seatNo);
      return !seat || seat.status === "booked" || (seat.locked && seat.lockedUntil > now);
    });

    if (alreadyLocked.length > 0) {
      return res.status(409).json({
        error: `Seats already locked or booked: ${alreadyLocked.join(", ")}`,
      });
    }

    // Lock seats for 10 minutes
    const lockUntil = new Date(Date.now() + 10 * 60 * 1000);

    bus.seats.forEach(s => {
      if (seats.includes(s.seatNumber)) {
        s.locked = true;
        s.lockedUntil = lockUntil;
      }
    });

    await bus.save();

    res.status(200).json({ message: "Seats locked successfully", expiresAt: lockUntil });
  } catch (err) {
    console.error("Lock Seat Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
