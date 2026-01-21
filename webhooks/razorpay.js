import express from "express";
import crypto from "crypto";

const router = express.Router();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const signature = req.headers["x-razorpay-signature"];

    const expected = crypto
      .createHmac("sha256", process.env.WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex");

    if (signature !== expected) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === "payment.captured") {
      console.log("✅ Payment captured:", event.payload.payment.entity.id);
    }

    res.json({ status: "ok" });
  }
);

export default router;
