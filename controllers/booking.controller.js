const Booking = require("../models/booking.model");
const Seat = require("../models/seat.model");

const generateTicketPDF = require("../utils/generateTicketPDF");

/**
 * CREATE BOOKING (Passenger Info Page)
 */
exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      userId: req.body.userId,
      tripId: req.body.tripId,
      seats: req.body.seats,
      amount: req.body.amount,
      status: "PENDING"
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking creation failed" });
  }
};

/**
 * LOCK SEATS FOR 5 MINUTES
 */
exports.lockSeats = async (req, res) => {
  try {
    const { tripId, seats } = req.body;
    const lockUntil = new Date(Date.now() + 5 * 60 * 1000);

    const result = await TripSeat.updateMany(
      {
        tripId,
        seatNo: { $in: seats },
        status: "AVAILABLE"
      },
      {
        $set: {
          status: "LOCKED",
          lockExpiresAt: lockUntil
        }
      }
    );

    if (result.modifiedCount !== seats.length) {
      return res.status(409).json({
        message: "Some seats already locked or booked"
      });
    }

    res.json({ lockUntil });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seat lock failed" });
  }
};

/**
 * CONFIRM BOOKING AFTER PAYMENT (FINAL STEP)
 */
exports.confirmBooking = async (req, res) => {
  try {
    const { bookingId, paymentId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update seats to BOOKED - keep your existing logic
    await TripSeat.updateMany(
      {
        tripId: booking.tripId,
        seatNo: { $in: booking.seats },
        status: "WAITING"
      },
      {
        $set: {
          status: "BOOKED",
          bookingId: booking._id,
          lockedUntil: null
        }
      }
    );

    // Update booking status and payment id
    booking.status = "PENDING"; // or "BOOKED" as you prefer
    booking.paymentId = paymentId;
    await booking.save();

    // Here generate or get the ticket PDF URL - assuming generateTicketPDF exists and returns URL
    const ticketPdfUrl = await generateTicketPDF(booking);

    // Return full booking info including ticket PDF URL
    res.json({
      success: true,
      bookingId: booking._id.toString(),
      paymentId,
      ticketPdfUrl,
      busName: booking.busName,
      source: booking.source,
      destination: booking.destination,
      journeyDate: booking.journeyDate,
      departureTime: booking.departureTime,
      selectedSeats: booking.seats,
      passengers: booking.passengers,  // array of {name, gender, age, seat}
      contact: {
        email: booking.contactEmail,   // adjust field names as per your schema
        phone: booking.contactPhone,
      },
      totalPrice: booking.amount,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking confirmation failed" });
  }
};
