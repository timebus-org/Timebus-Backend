import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  const { bookingId, totalPrice } = req.body;

  if (!bookingId || !totalPrice)
    return res.status(400).json({ error: "Booking ID and totalPrice required" });

  const order = await razorpay.orders.create({
    amount: totalPrice * 100,
    currency: "INR",
    receipt: bookingId,
  });

  res.json({ order, key: process.env.RAZORPAY_KEY_ID });
});

router.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (sign !== razorpay_signature)
    return res.status(400).json({ error: "Invalid signature" });

  res.json({ success: true });
});

export default router;
