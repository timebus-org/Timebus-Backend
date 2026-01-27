import cron from "node-cron";
import Bus from "../models/Bus.js";

/**
 * Unlock seats whose lockedUntil has expired
 */
export const startSeatReleaseCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("🔁 Seat unlock cron running...");

      const now = new Date();

      const buses = await Bus.find({ "seats.locked": true });

      for (const bus of buses) {
        let modified = false;
        bus.seats.forEach(seat => {
          if (seat.locked && seat.lockedUntil <= now) {
            seat.locked = false;
            seat.lockedUntil = null;
            seat.bookingId = null;
            seat.status = "available";
            modified = true;
          }
        });
        if (modified) await bus.save();
      }

    } catch (err) {
      console.error("❌ Seat unlock cron error:", err);
    }
  });
};
