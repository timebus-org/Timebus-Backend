import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/reschedule-ticket", async (req, res) => {
  const { ticketId, newTripId } = req.body;

  const oldTicket = await db("tickets").where({ id: ticketId }).first();
  if (!oldTicket || oldTicket.status !== "CONFIRMED")
    return res.status(400).json({ message: "Invalid ticket" });

  const newTrip = await db("trips").where({ id: newTripId }).first();
  if (!newTrip || newTrip.available_seats <= 0)
    return res.status(400).json({ message: "No seats available" });

  const rescheduleFee = 50; // flat
  const fareDifference = Math.max(
    newTrip.fare - oldTicket.amount_paid,
    0
  );

  // mark old ticket
  await db("tickets").where({ id: ticketId }).update({
    status: "RESCHEDULED",
  });

  // create new ticket
  const [newTicketId] = await db("tickets").insert({
    user_id: oldTicket.user_id,
    trip_id: newTripId,
    journey_date: newTrip.date,
    departure_time: newTrip.departure_time,
    seat_numbers: oldTicket.seat_numbers,
    amount_paid: newTrip.fare,
    status: "CONFIRMED",
  });

  await db("reschedules").insert({
    old_ticket_id: ticketId,
    new_ticket_id: newTicketId,
    reschedule_fee: rescheduleFee,
    fare_difference: fareDifference,
  });

  res.json({
    message: "Ticket rescheduled",
    extraAmountToPay: rescheduleFee + fareDifference,
  });
});

export default router;
