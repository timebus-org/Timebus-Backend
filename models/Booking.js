import mongoose from "mongoose";

const pointSchema = new mongoose.Schema({
  location: String,
  time: String
});

const BookingSchema = new mongoose.Schema({
  // ✅ IMPORTANT: Custom Booking ID (used in payment)
  bookingId: {
  type: String
},


  from: String,
  to: String,
  date: String,

  departureTime: String,
  arrivalTime: String,
  arrivalDate: String,

  operator: String,
  busType: String,

  // ✅ Boarding & Dropping
  boardingPoint: pointSchema,
  droppingPoint: pointSchema,

  seats: [String],

  passengers: [
    {
      seatNumber: String,
      name: String,
      age: Number,
      gender: String
    }
  ],

  contact: {
    mobile: String,
    email: String
  },

  totalFare: Number,

  // ✅ PAYMENT STATUS (CRITICAL)
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING"
  },

  // ✅ Prevent duplicate email/SMS
  notificationSent: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("Booking", BookingSchema);
