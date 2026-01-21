import express from "express";
import {
  cancelTicket,
  rescheduleTicket,
  getMyTickets,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/cancel-ticket", cancelTicket);
router.post("/reschedule-ticket", rescheduleTicket);
router.get("/my-tickets", getMyTickets);

export default router;
