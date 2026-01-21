import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/cancel-ticket", async (req, res) => {
  const { ticketId, reason } = req.body;

  const ticket = await db("tickets").where({ id: ticketId }).first();

  if (!ticket)
    return res.status(404).json({ message: "Ticket not found" });

  if (ticket.status !== "CONFIRMED")
    return res.status(400).json({ message: "Ticket not cancellable" });

  const now = new Date();
  const departure = new Date(`${ticket.journey_date} ${ticket.departure_time}`);

  if (now >= departure)
    return res.status(400).json({ message: "Bus already departed" });

  const hoursDiff = (departure - now) / (1000 * 60 * 60);

  let refundPercent = 0;
  if (hoursDiff > 24) refundPercent = 90;
  else if (hoursDiff > 12) refundPercent = 70;
  else if (hoursDiff > 6) refundPercent = 50;

  const refundAmount = (ticket.amount_paid * refundPercent) / 100;

  await db("tickets").where({ id: ticketId }).update({
    status: "CANCELLED",
  });

  await db("cancellations").insert({
    ticket_id: ticketId,
    refund_amount: refundAmount,
    refund_status: "PENDING",
    reason,
  });

  res.json({
    message: "Ticket cancelled",
    refundAmount,
  });
});

export default router;
