import cron from "node-cron";
import Bus from "../models/Bus.js";

export const startSeatReleaseCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const result = await Bus.updateMany(
        {},
        {
          $set: {
            "seats.$[seat].status": "available",
            "seats.$[seat].lockedUntil": null
          }
        },
        {
          arrayFilters: [
            {
              "seat.status": "waiting",
              "seat.lockedUntil": { $exists: true, $ne: null, $lte: now }
            }
          ]
        }
      );

      if (result.modifiedCount > 0) {
        console.log("⏳ Expired seat locks released");
      }
    } catch (err) {
      console.error("❌ Seat release cron error:", err);
    }
  });

  console.log("⏱️ Seat release cron job started");
};
