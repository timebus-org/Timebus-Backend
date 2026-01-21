const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true
    },

    seatNumber: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "LOCKED", "BOOKED"],
      default: "AVAILABLE",
      index: true
    },

    lockedByBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null
    },

    lockExpiresAt: {
      type: Date,
      default: null,
      index: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate seats per trip
seatSchema.index({ tripId: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model("Seat", seatSchema);
