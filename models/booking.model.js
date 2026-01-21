const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true
    },

    seatIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
        required: true
      }
    ],

    status: {
      type: String,
      enum: [
        "PENDING",          // seats locked, payment not done
        "CONFIRMED",        // payment verified, seats booked
        "PAYMENT_FAILED",   // payment attempt failed
        "EXPIRED",          // lock expired
        "CANCELLED"         // manual/system cancel
      ],
      default: "PENDING",
      index: true
    },

    amount: {
      type: Number,
      required: true
    },

    payment: {
      provider: {
        type: String, // razorpay / stripe
      },
      orderId: {
        type: String
      },
      paymentId: {
        type: String
      },
      signature: {
        type: String
      },
      verified: {
        type: Boolean,
        default: false
      }
    },

    lockExpiresAt: {
      type: Date,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
