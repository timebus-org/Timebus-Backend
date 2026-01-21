const mongoose = require("mongoose");

const seatLockSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  lockedAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 🔥 auto delete after 5 minutes
  },
});

module.exports = mongoose.model("SeatLock", seatLockSchema);
