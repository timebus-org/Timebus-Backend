const Bus = require("../models/Bus");

exports.getSeats = async (req, res) => {
  const bus = await Bus.findById(req.params.busId);
  res.json(bus.seats);
};

exports.lockSeat = async (req, res) => {
  const { busId, seatId } = req.body;

  const lockTime = new Date(Date.now() + 5 * 60 * 1000);

  await Bus.updateOne(
    { _id: busId, "seats._id": seatId, "seats.status": "available" },
    { $set: { "seats.$.status": "locked", "seats.$.lockedTill": lockTime } }
  );

  res.json({ success: true });
};
