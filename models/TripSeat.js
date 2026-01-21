import mongoose from "mongoose";

const tripSeatSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
    index: true
  },

  seatNumber: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["AVAILABLE", "WAITING", "BOOKED"],
    default: "AVAILABLE"
  },

  lockedUntil: Date
}, { timestamps: true });

tripSeatSchema.index({ busId: 1, seatNumber: 1 }, { unique: true });

export default mongoose.model("TripSeat", tripSeatSchema);
