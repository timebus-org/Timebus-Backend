const express = require("express");
const router = express.Router();

const {
  lockSeats,
  createBooking,
  confirmBooking
} = require("../controllers/booking.controller");

// Lock seats for 5 minutes
router.post("/lock", lockSeats);

// Create booking (passenger info)
router.post("/create", createBooking);

// Confirm booking after payment
router.post("/confirm", confirmBooking);

module.exports = router;
