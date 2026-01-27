router.post("/lock-seat", async (req, res) => {
  const { busId, seatNumbers, userId } = req.body;

  const LOCK_TIME = 5 * 60 * 1000; // 5 minutes

  try {
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const now = new Date();

    // 🔥 STEP 1: AUTO-UNLOCK EXPIRED SEATS
    bus.seats.forEach(seat => {
      if (
        seat.isLocked &&
        seat.lockedAt &&
        now - seat.lockedAt > LOCK_TIME
      ) {
        seat.isLocked = false;
        seat.lockedBy = null;
        seat.lockedAt = null;
      }
    });

    // 🔥 STEP 2: CHECK AVAILABILITY
    for (let seat of bus.seats) {
      if (
        seatNumbers.includes(seat.seatNumber) &&
        (seat.isBooked || seat.isLocked)
      ) {
        return res.status(409).json({
          message: "Seat already locked or booked"
        });
      }
    }

    // 🔥 STEP 3: LOCK SEATS
    bus.seats.forEach(seat => {
      if (seatNumbers.includes(seat.seatNumber)) {
        seat.isLocked = true;
        seat.lockedBy = userId;
        seat.lockedAt = now;
      }
    });

    await bus.save();

    res.json({ message: "Seats locked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seat lock failed" });
  }
});
