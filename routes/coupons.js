import express from "express";
const router = express.Router();

router.post("/apply", (req, res) => {
  const { code, amount } = req.body;

  if (code === "SAVE200") {
    return res.json({ discount: 200 });
  }

  res.status(400).json({ message: "Invalid coupon" });
});

export default router;
