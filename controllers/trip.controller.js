const Trip = require("../models/trip.model");
const SeatLayout = require("../models/seatLayout.model");
const TripSeat = require("../models/tripSeat.model");

/**
 * CREATE TRIP (Operator)
 * Also initializes seats for the trip
 */
exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);

    // Initialize seats for this trip
    const layout = await SeatLayout.findById(req.body.seatLayoutId);
    if (!layout) {
      return res.status(404).json({ message: "Seat layout not found" });
    }

    const seats = layout.seats.map(seat => ({
      tripId: trip._id,
      seatNo: seat.seatNo,
      status: "AVAILABLE"
    }));

    await TripSeat.insertMany(seats);

    res.status(201).json({
      message: "Trip created successfully",
      trip
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Trip creation failed" });
  }
};

/**
 * GET LIVE SEATS FOR A TRIP
 */
exports.getTripSeats = async (req, res) => {
  try {
    const seats = await TripSeat.find({
      tripId: req.params.tripId
    }).select("seatNo status");

    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch seats" });
  }
};
