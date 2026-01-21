import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ["available", "waiting", "booked"],
    default: "available"
  },
  lockedUntil: { type: Date, default: null } // ✅ ADD THIS
});

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  busName: String,
  operator: String,
  from: String,
  to: String,
  date: String,
  departureTime: String,
  arrivalTime: String,
  duration: String,
  busType: String,
  rating: Number,
  originalFare: Number,
  fare: Number,
  amenities: [String],
  seats: [seatSchema]
});

export default mongoose.model("Bus", busSchema);
