const express = require("express");
const router = express.Router();
const {
  createTrip,
  getTripSeats
} = require("../controllers/trip.controller");

// Operator creates trip
router.post("/create", createTrip);

// User fetches live seat availability
router.get("/:tripId/seats", getTripSeats);

module.exports = router;
