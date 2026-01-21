const cron = require("node-cron");
const TripSeat = require("../models/tripSeat.model");

cron.schedule("* * * * *", async () => {
  try {
    await TripSeat.updateMany(
      {
        status: "WAITING",
        lockedUntil: { $lt: new Date() }
      },
      {
        $set: {
          status: "AVAILABLE",
          lockedUntil: null,
          bookingId: null
        }
      }
    );
  } catch (err) {
    console.error("Seat unlock cron failed", err);
  }
});
