import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  from: String,
  to: String,
  date: String,
  departureTime: String,
  arrivalTime: String,
  arrivalDate: String,
  operator: String,
  busType: String,
  seats: [String],
  contact: {
    mobile: String,
    email: String,
  },
  passengers: [
    {
      seatNumber: String,
      name: String,
      age: Number,
      gender: String,
    },
  ],
  totalFare: Number,
});

export default mongoose.model("Booking", BookingSchema);
