import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";

/* ================= CREATE ORDER ================= */
export const createOrder = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({ message: "Amount & bookingId required" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // ✅ MUST be paise
      currency: "INR",
      receipt: `booking_${bookingId}`,
    });

    return res.json({
      orderId: order.id,
      razorpayKey: process.env.RAZORPAY_KEY_ID, // ✅ VERY IMPORTANT
    });
  } catch (err) {
    console.error("❌ Razorpay order error:", err);
    return res.status(500).json({ message: "Order creation failed" });
  }
};
