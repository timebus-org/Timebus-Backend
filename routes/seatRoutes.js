import express from "express";
import { lockSeats, bookSeats } from "../controllers/seatController.js";

const router = express.Router();

// Lock seats route
router.post("/lock", lockSeats);

// Book seats after passenger info
router.post("/book", bookSeats);

export default router;
