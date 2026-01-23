const Bus = require("../models/Bus");

exports.searchBuses = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    const buses = await Bus.find({
      from: { $regex: new RegExp(`^${from}$`, "i") },
      to: { $regex: new RegExp(`^${to}$`, "i") },
      date: date // date must match exactly, keep as is
    });

    console.log("Query:", req.query);
    console.log("Buses found:", buses.length);

    res.json(buses);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json([]);
  }
};
