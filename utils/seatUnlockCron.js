const cron = require("node-cron");
const Bus = require("../models/Bus");

cron.schedule("* * * * *", async () => {
  try {
    await Bus.updateMany(
      {
        "seats.status": "locked",
        "seats.lockedTill": { $lt: new Date() }
      },
      {
        $set: {
          "seats.$[].status": "available",
          "seats.$[].lockedTill": null
        }
      }
    );
  } catch (err) {
    console.error("Seat unlock cron error:", err.message);
  }
});
