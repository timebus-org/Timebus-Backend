import mongoose from "mongoose";

/* 🪑 SEAT SCHEMA */
const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },

  locked: {
    type: Boolean,
    default: false
  },

  lockedAt: {
    type: Date,
    default: null
  },

  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    default: null
  },

  status: {
  type: String,
  enum: ["available", "waiting", "booked"],
  default: "available"
},
lockedUntil: {
  type: Date,
  default: null
}

});

/* 📍 BOARDING / DROPPING POINT */
const pointSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  time: String,
  address: String
});

/* 🚌 BUS SCHEMA */
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

  seats: {
    type: [seatSchema],
    default: []   // ⭐ THIS FIXES THE “ONE BUS” BUG
  },

  boardingPoints: [pointSchema],
  droppingPoints: [pointSchema]
});

export default mongoose.model("Bus", busSchema);
