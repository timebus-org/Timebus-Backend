import express from "express";

const router = express.Router();

/**
 * CREATE ORDER (SKIPPED PAYMENT)
 */
router.post("/create-order", async (req, res) => {
  const { bookingId, amount } = req.body;

  if (!bookingId || !amount) {
    return res.status(400).json({ error: "Missing booking data" });
  }

  // 🔥 Simulate successful order
  res.json({
    orderId: "order_skip_" + Date.now(),
    amount: amount * 100,
    currency: "INR",
    skipPayment: true,
  });
});

export default router;
