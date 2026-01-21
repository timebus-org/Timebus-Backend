const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat'); // your seat schema

// Lock a seat
router.post('/lock', async (req, res) => {
    try {
        const { busId, seatNumber, userId } = req.body;

        if (!busId || !seatNumber || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if seat is already locked/booked
        const existingSeat = await Seat.findOne({ busId, seatNumber });

        if (existingSeat && existingSeat.status !== 'available') {
            return res.status(400).json({ message: 'Seat already locked or booked' });
        }

        // Lock the seat
        const seat = await Seat.findOneAndUpdate(
            { busId, seatNumber },
            { status: 'locked', lockedBy: userId, lockedAt: new Date() },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: 'Seat locked successfully', seat });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
